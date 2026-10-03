import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 'New', label: 'Order Received', desc: 'Ticket printed at sidecar', icon: Clock },
  { id: 'Preparing', label: 'Smoking on Grill', desc: 'Charcoal flames & hickory wood', icon: Flame },
  { id: 'Ready', label: 'Ready for Pickup!', desc: 'Hot & bagged at counter', icon: Sparkles },
  { id: 'Completed', label: 'Collected', desc: 'Enjoy your matchside BBQ!', icon: CheckCircle2 },
];

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, submitFeedback, clearCart } = useStore();

  const orderId = decodeURIComponent(id || '');
  const order = orders.find((o) => o.id === orderId);

  // Post-pickup feedback state
  const [rating, setRating] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState(['Extra Smoky', 'Juicy']);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const availableTags = ['Extra Smoky', 'Juicy', 'Quick Service', 'Great Sauce', 'Perfect Spices', 'Loved The Bike'];

  // Current step index
  const currentStepIndex = order ? STEPS.findIndex((s) => s.id === order.status) : 0;
  const isCompleted = order?.status === 'Completed';

  // Trigger celebratory confetti if order just turned ready or completed
  useEffect(() => {
    if (order?.status === 'Ready' || order?.status === 'Completed') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#E11D2E', '#FF7A1A', '#FF9F1C'],
        });
      } catch (err) {}
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-3xl text-white">Order Not Found</h2>
        <p className="text-xs text-brand-muted">This order tracking link is invalid or expired.</p>
        <Link to="/menu" className="inline-block px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold uppercase">
          Browse Menu
        </Link>
      </div>
    );
  }

  const toggleTag = (tag) => {
    setFeedbackTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitFeedback({
      orderId: order.id,
      customerName: order.customer.name,
      department: order.customer.department,
      rating,
      tags: feedbackTags,
      comment: comment.trim() || 'Awesome food!',
    });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24242C] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-flame">
              Real-time Smoker Tracker
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase mt-1">
            Order <span className="text-brand-flame">{order.id}</span>
          </h1>
          <p className="text-xs text-brand-cream/80 mt-0.5">
            {order.customer.name} • {order.customer.department}
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#18181D] border border-[#2B2B33] text-xs font-mono text-brand-muted">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-flame" />
          <span>Live tab updates</span>
        </div>
      </div>

      {/* Status banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        order.status === 'Ready'
          ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border-emerald-500 shadow-flame'
          : order.status === 'Preparing'
          ? 'bg-gradient-to-r from-brand-red/20 to-brand-flame/20 border-brand-red shadow-flame'
          : order.status === 'Completed'
          ? 'bg-[#18181D] border-zinc-700'
          : 'bg-[#141418] border-[#2A2A33]'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            order.status === 'Ready'
              ? 'bg-emerald-500 text-black'
              : order.status === 'Preparing'
              ? 'bg-gradient-to-br from-brand-red to-brand-flame text-white animate-pulse'
              : order.status === 'Completed'
              ? 'bg-zinc-700 text-white'
              : 'bg-brand-red/20 text-brand-red'
          }`}>
            <Flame className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase">
              {order.status === 'New' && 'Ticket In Queue'}
              {order.status === 'Preparing' && 'Smoking Hot on the Sidecar!'}
              {order.status === 'Ready' && 'Ready for Pickup!'}
              {order.status === 'Completed' && 'Order Collected!'}
            </h3>
            <p className="text-xs text-brand-cream/80">
              {order.status === 'New' && 'Our pitmaster has queued your item on the hickory charcoal.'}
              {order.status === 'Preparing' && 'Meat is sizzling on the custom motorcycle smoker grates.'}
              {order.status === 'Ready' && `Please head to ${order.pickupPoint} to collect your order!`}
              {order.status === 'Completed' && 'Hope you loved every smoky bite! Come hungry, leave happy.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Visualization */}
      <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-6">
        <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider text-brand-muted">
          Kitchen Progress Stepper
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-brand-flame bg-brand-flame/10 shadow-flame-sm scale-[1.02]'
                    : isPassed
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : 'border-[#222228] bg-[#121215] text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-brand-flame text-white'
                      : isPassed
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#1C1C22] text-zinc-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                </div>

                <p className={`font-heading font-bold text-sm leading-tight ${isCurrent ? 'text-white' : isPassed ? 'text-emerald-300' : 'text-zinc-500'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-brand-muted mt-1 leading-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pickup Location & Contact Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-brand-flame">
            <MapPin className="w-4 h-4" />
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Pickup Point
            </span>
          </div>
          <p className="font-bold text-sm text-white">{order.pickupPoint}</p>
          <p className="text-xs text-brand-muted">Bharati Vidyapeeth Kharghar Campus Ground</p>
        </div>

        <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Need Help With Order?
            </span>
            <p className="text-xs text-brand-muted">Connect directly with the stall staff</p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={`https://wa.me/918291794227?text=${encodeURIComponent(`Hi BBQ Pit Stop, I am at the counter for order ${order.id}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+918291794227"
              className="py-2 px-3 rounded-xl bg-[#22222A] hover:bg-[#2C2C36] text-brand-cream font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-flame" />
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Post-pickup Feedback Form (Shows when status is Completed or Ready) */}
      {(order.status === 'Ready' || order.status === 'Completed') && (
        <div className="bg-[#141418] border border-brand-red/30 p-6 rounded-3xl space-y-5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-flame" />
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
              Rate Your Smoker Experience
            </h3>
          </div>

          {feedbackSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center space-y-1">
              <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-400" />
              <p className="font-bold text-sm">Feedback Received!</p>
              <p className="text-xs text-emerald-200/80">Thank you for supporting BBQ Pit Stop at Cup 2.0!</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        rating >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2">
                  {rating === 5 ? '5/5 Supreme BBQ!' : `${rating}/5 Stars`}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const selected = feedbackTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selected
                          ? 'bg-brand-red text-white border-brand-red shadow-flame-sm'
                          : 'bg-[#1C1C22] text-brand-muted border-[#2D2D37] hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Comment field */}
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked (e.g. Wings were super juicy, great char!)..."
                className="w-full bg-[#1A1A1F] border border-[#2D2D37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-brand-muted outline-none focus:border-brand-flame"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs uppercase tracking-wider shadow-flame transition-all"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Order Again button */}
          <div className="pt-2 border-t border-[#222228] flex justify-between items-center">
            <span className="text-xs text-brand-muted">Hungry for another round?</span>
            <button
              onClick={() => {
                clearCart();
                navigate('/menu');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
            >
              <span>Order Again</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
