import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  ArrowRight,
  Phone,
  MessageCircle,
  Share2,
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { orders, settings } = useStore();

  const orderId = decodeURIComponent(id || '');
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-3xl text-white">Order Not Found</h2>
        <p className="text-xs text-brand-muted">We could not locate this order in the active queue.</p>
        <Link to="/menu" className="inline-block px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold uppercase">
          Go To Menu
        </Link>
      </div>
    );
  }

  const prepTimeMins = settings.estimatedPrepMins || 15;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Success banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-lg">
          <CheckCircle className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-flame">
            Order Successfully Placed!
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase mt-1">
            Smoker In Action!
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mt-1">
            Our pitmaster on the custom sidecar bike has received your ticket and is preparing your BBQ.
          </p>
        </div>
      </div>

      {/* Main Order Ticket Card */}
      <div className="bg-[#141418] border border-[#2B2B34] rounded-3xl p-6 sm:p-8 space-y-6 shadow-flame relative overflow-hidden">
        {/* Top Header of Ticket */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24242C] pb-6">
          <div>
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Order Token Number</p>
            <div className="font-display text-4xl sm:text-5xl text-brand-flame tracking-wider">
              {order.id}
            </div>
            <p className="text-xs text-brand-cream/80 font-medium mt-1">
              Customer: {order.customer.name} ({order.customer.department})
            </p>
          </div>

          <div className="bg-white p-2.5 rounded-xl shadow-md w-fit shrink-0">
            <QRCodeSVG value={`BBQ_ORDER:${order.id}`} size={90} level="M" />
            <p className="text-[9px] text-center text-black font-mono font-bold mt-1">SCAN AT COUNTER</p>
          </div>
        </div>

        {/* ETA & Pickup Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#1A1A20] border border-[#272730] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-flame/15 flex items-center justify-center text-brand-flame shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-brand-muted uppercase font-bold">Estimated Wait</p>
              <p className="text-base font-extrabold text-white">~{prepTimeMins} Minutes</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A20] border border-[#272730] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/15 flex items-center justify-center text-brand-red shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-brand-muted uppercase font-bold">Counter Spot</p>
              <p className="text-xs font-bold text-white line-clamp-1">{order.pickupPoint}</p>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider text-brand-muted">
            Ordered Items
          </h3>
          <div className="space-y-2 divide-y divide-[#222228]">
            {order.items.map((it, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white">
                    {it.qty}x {it.name}
                  </span>
                  <div className="flex gap-1 text-[10px] text-brand-muted">
                    {it.flavour && <span>[{it.flavour}]</span>}
                    {it.addons?.map((a, i) => (
                      <span key={i} className="text-amber-300">+{a.name}</span>
                    ))}
                  </div>
                </div>
                <span className="font-extrabold text-white">₹{it.total}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#25252E] flex justify-between items-baseline text-sm">
            <span className="font-bold text-white uppercase">Amount {order.paymentMethod === 'UPI' ? '(Paid via UPI)' : '(Cash on Pickup)'}</span>
            <span className="font-display text-2xl text-brand-flame font-bold">₹{order.total}</span>
          </div>
        </div>

        {/* Live Tracking CTA */}
        <div className="pt-4 border-t border-[#24242C] space-y-3">
          <Link
            to={`/track/${encodeURIComponent(order.id)}`}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red text-white font-bold text-sm uppercase tracking-wider shadow-flame hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-center"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>Track Order Status Live</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <a
              href={`https://wa.me/918291794227?text=${encodeURIComponent(`Hi BBQ Pit Stop, I placed order ${order.id}. Could you confirm?`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Pitmaster</span>
            </a>
            <span className="text-zinc-600">|</span>
            <a
              href="tel:+918291794227"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-cream hover:underline"
            >
              <Phone className="w-4 h-4 text-brand-flame" />
              <span>Call +91 8291794227</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
