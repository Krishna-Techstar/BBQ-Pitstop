import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { DEPARTMENTS } from '../data/menuData';
import {
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    placeOrder,
    settings,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Parse traffic source from URL query parameter e.g. ?src=instagram
  const searchParams = new URLSearchParams(location.search);
  const trafficSource = searchParams.get('src') || 'direct';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: DEPARTMENTS[0],
    pickupPoint: settings.pickupPoints[0],
    paymentMethod: 'UPI', // 'UPI' | 'Cash'
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);

  // Construct dynamic UPI deep-link
  const upiId = settings.upiId || '8291794227@okbizaxis';
  const payeeName = settings.payeeName || 'BBQ Pit Stop';
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${cartTotal}&cu=INR&tn=BBQ%20Order`;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your name';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const order = placeOrder({
        ...formData,
        trafficSource,
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E11D2E', '#FF7A1A', '#FF9F1C'],
        });
      } catch (err) {
        // Safe fallback
      }

      navigate(`/order-confirmation/${encodeURIComponent(order.id)}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Title */}
      <div className="border-b border-[#24242C] pb-4">
        <div className="flex items-center space-x-2 text-brand-red text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4 text-brand-flame" />
          <span>Quick Counter Checkout</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl text-white tracking-wide uppercase mt-1">
          Review & <span className="text-brand-flame">Confirm Order</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Enter your details so our grill master knows who to call when your meat is hot!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Customer and Pickup Details */}
        <div className="md:col-span-7 space-y-6">
          {/* Customer info card */}
          <div className="bg-[#141418] border border-[#272730] p-5 sm:p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center text-xs">
                1
              </span>
              <span>Your Details</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-brand-cream mb-1">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full bg-[#1A1A1F] border border-[#2D2D35] focus:border-brand-flame rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-brand-muted outline-none"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-cream mb-1">
                  WhatsApp / Mobile Number <span className="text-brand-red">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9820123456"
                  maxLength={10}
                  className="w-full bg-[#1A1A1F] border border-[#2D2D35] focus:border-brand-flame rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-brand-muted outline-none font-mono"
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Used for SMS / WhatsApp pickup notification when your meat is ready.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-cream mb-1">
                  College Department / Team <span className="text-brand-flame">* (Cup 2.0 Leaderboard)</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-[#1A1A1F] border border-[#2D2D35] focus:border-brand-flame rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  Your order counts toward the Interdepartmental Cup food ranking!
                </p>
              </div>
            </div>
          </div>

          {/* Pickup Location card */}
          <div className="bg-[#141418] border border-[#272730] p-5 sm:p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-flame/20 text-brand-flame flex items-center justify-center text-xs">
                2
              </span>
              <span>Pickup Spot</span>
            </h3>

            <div className="space-y-2">
              {settings.pickupPoints.map((point) => (
                <label
                  key={point}
                  className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                    formData.pickupPoint === point
                      ? 'border-brand-flame bg-brand-flame/10 text-white'
                      : 'border-[#272730] bg-[#1A1A1F] text-brand-muted hover:border-[#444]'
                  }`}
                >
                  <input
                    type="radio"
                    name="pickupPoint"
                    checked={formData.pickupPoint === point}
                    onChange={() => setFormData({ ...formData, pickupPoint: point })}
                    className="accent-brand-flame"
                  />
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-brand-flame shrink-0" />
                    <span className="text-xs font-semibold text-white">{point}</span>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-cream mb-1">
                Kitchen Instructions (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Please pack extra napkins, match starts soon"
                className="w-full bg-[#1A1A1F] border border-[#2D2D35] focus:border-brand-flame rounded-xl px-3.5 py-2 text-xs text-white placeholder-brand-muted outline-none"
              />
            </div>
          </div>

          {/* Payment Method card */}
          <div className="bg-[#141418] border border-[#272730] p-5 sm:p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                3
              </span>
              <span>Choose Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  formData.paymentMethod === 'UPI'
                    ? 'border-brand-flame bg-brand-flame/10 text-white shadow-flame-sm'
                    : 'border-[#272730] bg-[#1A1A1F] text-brand-muted hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-brand-flame" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={() => {}}
                    className="accent-brand-flame"
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Instant UPI QR</p>
                  <p className="text-[10px] text-brand-muted">GPay / PhonePe / Paytm</p>
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'Cash' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  formData.paymentMethod === 'Cash'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                    : 'border-[#272730] bg-[#1A1A1F] text-brand-muted hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === 'Cash'}
                    onChange={() => {}}
                    className="accent-emerald-400"
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Cash on Pickup</p>
                  <p className="text-[10px] text-brand-muted">Pay directly at counter</p>
                </div>
              </div>
            </div>

            {/* If UPI selected, render dynamic QR Code */}
            {formData.paymentMethod === 'UPI' && (
              <div className="p-4 rounded-xl bg-[#0F0F12] border border-[#2D2D37] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
                  <QRCodeSVG value={upiString} size={120} level="M" />
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Scan or Tap to Pay
                    </span>
                    <h4 className="font-heading font-bold text-white text-base mt-1">
                      Scan with any UPI App
                    </h4>
                    <p className="text-xs text-brand-muted font-mono">{upiId}</p>
                  </div>

                  <a
                    href={upiString}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <span>Pay ₹{cartTotal} via Mobile App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl space-y-4 sticky top-24">
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider flex items-center justify-between border-b border-[#222228] pb-3">
              <span>Order Summary</span>
              <span className="text-brand-flame text-xs">{cart.length} item(s)</span>
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-white">
                      {item.qty}x {item.name}
                    </p>
                    <div className="flex flex-wrap gap-1 text-[10px] text-brand-muted mt-0.5">
                      {item.flavour && <span>[{item.flavour}]</span>}
                      {item.portion && <span>({item.portion.name})</span>}
                      {item.addons?.map((a, i) => (
                        <span key={i} className="text-amber-400">+{a.name}</span>
                      ))}
                    </div>
                  </div>
                  <span className="font-extrabold text-white shrink-0 ml-2">₹{item.total}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-[#222228] space-y-1.5 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-muted">
                <span>Fest Smoker Service</span>
                <span className="text-emerald-400">FREE</span>
              </div>

              <div className="pt-2 border-t border-[#25252E] flex justify-between items-baseline">
                <span className="font-heading text-lg font-bold text-white uppercase">Total Amount</span>
                <span className="font-display text-3xl text-brand-flame font-bold">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red hover:brightness-110 text-white font-bold text-sm uppercase tracking-wider shadow-flame hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>{formData.paymentMethod === 'UPI' ? 'Verify & Place Order' : 'Confirm Cash Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-brand-muted text-center pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant token generated • Realtime counter display</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
