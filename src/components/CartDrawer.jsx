import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, Sparkles, ArrowRight, Check } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addToCart,
    menuItems,
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Upsell: Find Sauce Dip or Cheese item
  const sauceItem = menuItems.find((i) => i.id === 'ext-02') || {
    id: 'ext-02',
    name: 'Smoky Sauce Dip',
    price: 20,
    category: 'extras',
  };
  const hasSauceInCart = cart.some((i) => i.name.includes('Sauce Dip'));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#121215] border-l border-[#2D2D34] shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#25252A] flex items-center justify-between bg-[#16161A]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-brand-flame" />
            <h3 className="font-heading text-lg font-bold text-white tracking-wider uppercase">
              Your Smoker Order ({cart.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#202026] text-brand-cream hover:text-white hover:bg-[#2A2A32] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-brand-red/80" />
            </div>
            <div>
              <h4 className="font-display text-2xl text-white">Your Cart is Empty</h4>
              <p className="text-xs text-brand-muted mt-1 max-w-xs">
                The sidecar smoker is firing! Pick your favourite chicken, wings, drumsticks, or wraps.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/menu');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-xs uppercase tracking-wider shadow-flame hover:scale-105 transition-transform"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-[#18181D] border border-[#27272F] rounded-xl p-3 flex space-x-3 relative group"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-[#222] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between pr-2">
                      <h4 className="font-heading font-bold text-white text-sm truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-brand-muted hover:text-red-400 p-0.5 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Flavours & Options tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.flavour && (
                        <span className="text-[10px] font-semibold bg-brand-red/20 text-brand-red px-1.5 py-0.5 rounded border border-brand-red/30">
                          {item.flavour}
                        </span>
                      )}
                      {item.portion && (
                        <span className="text-[10px] font-semibold bg-white/10 text-brand-cream px-1.5 py-0.5 rounded">
                          {item.portion.name}
                        </span>
                      )}
                      {item.addons?.map((ad, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30"
                        >
                          +{ad.name}
                        </span>
                      ))}
                    </div>

                    {item.instructions && (
                      <p className="text-[10px] text-amber-200/80 italic mt-1 line-clamp-1">
                        Note: {item.instructions}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#222228]">
                      {/* Stepper */}
                      <div className="flex items-center bg-[#101013] border border-[#2D2D35] rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-brand-muted hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center text-brand-muted hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="font-extrabold text-sm text-brand-flame">
                        ₹{item.total}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell recommendation */}
            {!hasSauceInCart && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-brand-red/20 border border-brand-flame/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-flame/20 flex items-center justify-center text-brand-flame shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Add a Smoky Sauce Dip?</p>
                    <p className="text-[10px] text-brand-cream/70">Secret pitmaster garlic BBQ dip (+₹20)</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(sauceItem, { qty: 1 })}
                  className="px-2.5 py-1.5 rounded-lg bg-brand-flame hover:bg-brand-flame/90 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
                >
                  + Add ₹20
                </button>
              </div>
            )}

            {/* Coupon field */}
            <div className="bg-[#18181D] border border-[#27272F] rounded-xl p-3 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-brand-flame" />
                <span>Offers & Coupons</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-extrabold font-mono">{appliedCoupon.code}</span>
                      <span className="ml-1 text-[11px] text-emerald-200">
                        (-₹{cartDiscount})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:text-red-300 underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. CUP50)"
                    className="flex-1 bg-[#101013] border border-[#303038] focus:border-brand-flame rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase tracking-wider outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#272730] hover:bg-brand-red text-white text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-brand-muted">
                <span>Try:</span>
                <span
                  onClick={() => {
                    setCouponInput('CUP50');
                    applyCoupon('CUP50');
                  }}
                  className="font-mono text-brand-flame underline cursor-pointer"
                >
                  CUP50
                </span>
                <span>or</span>
                <span
                  onClick={() => {
                    setCouponInput('STUDENT10');
                    applyCoupon('STUDENT10');
                  }}
                  className="font-mono text-brand-flame underline cursor-pointer"
                >
                  STUDENT10
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Billing Breakdown */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#16161B] border-t border-[#25252A] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{cartSubtotal}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-muted">
                <span>Smoker Packaging & Cutlery</span>
                <span className="text-emerald-400 font-semibold">FREE (Event Special)</span>
              </div>

              <div className="pt-2 border-t border-[#27272F] flex justify-between items-baseline">
                <span className="font-heading text-base font-bold text-white uppercase">
                  Grand Total
                </span>
                <span className="font-display text-2xl text-brand-flame font-bold">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red text-white font-bold text-sm tracking-wide shadow-flame hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-brand-muted">
              Fast counter pickup • Live order status tracking on mobile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
