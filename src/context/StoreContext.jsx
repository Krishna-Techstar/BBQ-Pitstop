import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { INITIAL_MENU_ITEMS, PICKUP_POINTS, DEPARTMENTS } from '../data/menuData';
import { generateSeedOrders, INITIAL_FEEDBACK } from '../data/seedOrders';
import { playOrderChime } from '../utils/soundAlert';

const StoreContext = createContext();

const STORAGE_KEYS = {
  MENU: 'bbq_menu_items_v2',
  ORDERS: 'bbq_orders_live_production',
  CART: 'bbq_cart_v2',
  ACTIVE_ORDER: 'bbq_active_order_id_v2',
  SETTINGS: 'bbq_settings_v2',
  COUPONS: 'bbq_coupons_v2',
  FEEDBACK: 'bbq_feedback_live_production',
  ANALYTICS: 'bbq_analytics_v2',
};

const DEFAULT_SETTINGS = {
  isStallOpen: true,
  eventName: 'Interdepartmental Cup 2.0 – Bharati Vidyapeeth',
  eventLocation: 'Bharati Vidyapeeth Deemed to be University, Sector 3, Belpada, Kharghar, Navi Mumbai',
  upiId: '8291794227@okbizaxis',
  payeeName: 'BBQ Pit Stop',
  contactPhone: '+918291794227',
  instagram: 'barbequepitstop',
  estimatedPrepMins: 15,
  pickupPoints: PICKUP_POINTS,
};

const DEFAULT_COUPONS = [
  { code: 'CUP50', type: 'flat', value: 50, minOrder: 250, desc: '₹50 OFF on orders above ₹250', active: true },
  { code: 'STUDENT10', type: 'percentage', value: 10, minOrder: 150, desc: '10% OFF for students', active: true },
  { code: 'SMOKY20', type: 'flat', value: 20, minOrder: 180, desc: '₹20 OFF special pit discount', active: true },
];

export const StoreProvider = ({ children }) => {
  // 1. Menu Items (Kept intact exactly as specified)
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // 2. Orders (Clean live site without demo data)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Active Order ID for customer tracker
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER) || null;
  });

  // 5. Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // 6. Coupons
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  // 7. Feedback
  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  // 8. Applied coupon in cart
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 9. Toast notification state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Broadcast channel for multi-tab realtime sync
  const channelRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channelRef.current = new BroadcastChannel('bbq_pitstop_sync');
        channelRef.current.onmessage = (event) => {
          const { type, payload } = event.data;
          if (type === 'NEW_ORDER') {
            setOrders((prev) => [payload, ...prev.filter(o => o.id !== payload.id)]);
            playOrderChime();
            showToast(`🔥 New Order Received: ${payload.id} (${payload.customer.name})`, 'success');
          } else if (type === 'UPDATE_ORDER') {
            setOrders((prev) => prev.map((o) => (o.id === payload.id ? payload : o)));
          } else if (type === 'UPDATE_MENU') {
            setMenuItems(payload);
          } else if (type === 'UPDATE_SETTINGS') {
            setSettings(payload);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER, activeOrderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER);
    }
  }, [activeOrderId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
  }, [feedbackList]);

  // Analytics helper (e.g. captures source tag ?src=)
  const trackEvent = (eventType, metadata = {}) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
      const event = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: eventType,
        metadata,
        timestamp: new Date().toISOString(),
      };
      existing.push(event);
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(existing.slice(-200)));
    } catch (e) {
      console.warn('Error tracking event', e);
    }
  };

  // CART OPERATIONS
  const addToCart = (item, options = {}) => {
    const { portion = null, flavour = item.flavour, addons = [], instructions = '', qty = 1 } = options;
    const basePrice = portion ? portion.price : item.price;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + addonsTotal;

    const cartItemId = `${item.id}-${portion?.name || 'std'}-${flavour}-${addons.map(a => a.name).sort().join('_')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        updated[existingIndex].total = updated[existingIndex].qty * unitPrice;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            itemId: item.id,
            name: item.name,
            image: item.image,
            category: item.category,
            portion,
            flavour,
            addons,
            instructions,
            unitPrice,
            qty,
            total: unitPrice * qty,
          },
        ];
      }
    });

    trackEvent('ADD_TO_CART', { itemName: item.name, price: unitPrice });
    showToast(`Added ${qty}x ${item.name} to cart!`, 'success');
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty, total: newQty * item.unitPrice } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // COUPON OPERATIONS
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    if (found.minOrder && subtotal < found.minOrder) {
      return { success: false, message: `Minimum order of ₹${found.minOrder} required for ${found.code}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, cartSubtotal);
    }
    if (appliedCoupon.type === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.value) / 100);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ORDER OPERATIONS
  const placeOrder = (orderData) => {
    const orderNumber = 1000 + orders.length + 1;
    const orderId = `#BPS-${orderNumber}`;
    const newOrder = {
      id: orderId,
      items: [...cart],
      customer: {
        name: orderData.name,
        phone: orderData.phone,
        department: orderData.department,
      },
      status: 'New', // 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'
      paymentMethod: orderData.paymentMethod, // 'UPI' | 'Cash'
      paymentStatus: orderData.paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponApplied: appliedCoupon?.code || null,
      total: cartTotal,
      pickupPoint: orderData.pickupPoint || settings.pickupPoints[0],
      trafficSource: orderData.trafficSource || 'direct',
      hasCheese: cart.some((i) => i.addons?.some((a) => a.name.includes('Cheese'))),
      hasSauce: cart.some((i) => i.addons?.some((a) => a.name.includes('Sauce'))),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: orderData.notes || '',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();

    // Broadcast realtime event
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'NEW_ORDER', payload: newOrder });
    }

    trackEvent('ORDER_PLACED', { orderId: newOrder.id, total: newOrder.total, dept: newOrder.customer.department });
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            // Auto update payment if completed with cash
            paymentStatus: newStatus === 'Completed' ? 'Paid' : ord.paymentStatus,
          };
          if (channelRef.current) {
            channelRef.current.postMessage({ type: 'UPDATE_ORDER', payload: updated });
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() };
          if (channelRef.current) {
            channelRef.current.postMessage({ type: 'UPDATE_ORDER', payload: updated });
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // Simulate a live student order for demoing
  const simulateNewOrder = () => {
    const studentNames = ['Aditya Rao', 'Meera Nair', 'Rishi Mehta', 'Priyanka Sen', 'Harsh Vora', 'Kunal Deshmukh'];
    const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];
    const randomDept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const randomPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomItems = [
      menuItems[Math.floor(Math.random() * (menuItems.length - 2))],
      menuItems[Math.floor(Math.random() * (menuItems.length - 2))],
    ];

    const orderNumber = 1000 + orders.length + 1;
    const orderId = `#BPS-${orderNumber}`;
    
    let subtotal = 0;
    const items = randomItems.map((item, idx) => {
      const addons = idx % 2 === 0 ? [{ name: 'Extra Cheese', price: 40 }] : [{ name: 'Smoky Sauce Dip', price: 20 }];
      const itemTotal = item.price + addons.reduce((s, a) => s + a.price, 0);
      subtotal += itemTotal;
      return {
        id: `sim-${idx}`,
        name: item.name,
        price: item.price,
        flavour: item.flavour || 'Tandoori',
        qty: 1,
        addons,
        instructions: idx === 0 ? 'Fresh & hot off the sidecar grill!' : '',
        total: itemTotal,
      };
    });

    const isUPI = Math.random() > 0.4;
    const simOrder = {
      id: orderId,
      items,
      customer: {
        name: randomName,
        phone: randomPhone,
        department: randomDept,
      },
      status: 'New',
      paymentMethod: isUPI ? 'UPI' : 'Cash',
      paymentStatus: isUPI ? 'Paid' : 'Pending',
      subtotal,
      discount: 0,
      couponApplied: null,
      total: subtotal,
      pickupPoint: settings.pickupPoints[0],
      trafficSource: 'qr_poster',
      hasCheese: true,
      hasSauce: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Live match break in 10 mins!',
    };

    setOrders((prev) => [simOrder, ...prev]);
    playOrderChime();
    showToast(`🔔 Simulated Live Order from ${randomName} (${randomDept})!`, 'info');

    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'NEW_ORDER', payload: simOrder });
    }
  };

  // MENU CRUD
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `custom-${Date.now()}`,
      available: true,
      customizable: true,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'UPDATE_MENU', payload: [newItem, ...menuItems] });
    }
    showToast(`Added "${newItem.name}" to menu!`, 'success');
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Menu item updated!', 'success');
  };

  const toggleItemAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Menu item removed', 'info');
  };

  // CLEAR ALL ORDERS (Fresh live mode)
  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER);
    setActiveOrderId(null);
    showToast('All order queue cleared for live service!', 'info');
  };

  // FEEDBACK
  const submitFeedback = (fbData) => {
    const newFeedback = {
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...fbData,
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
    showToast('Thank you! Your feedback helps us smoke better meat!', 'success');
  };

  // SETTINGS
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'UPDATE_SETTINGS', payload: updated });
      }
      return updated;
    });
    showToast('Settings saved successfully', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        menuItems,
        orders,
        cart,
        activeOrderId,
        settings,
        coupons,
        feedbackList,
        appliedCoupon,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartCount,
        toast,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        simulateNewOrder,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
        clearAllOrders,
        submitFeedback,
        updateSettings,
        trackEvent,
        setActiveOrderId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
