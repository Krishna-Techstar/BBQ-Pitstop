import React from 'react';
import { X, Printer, Phone, MessageCircle, CheckCircle, Clock, MapPin, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const OrderDetailModal = ({ order, isOpen, onClose, onUpdateStatus, onUpdatePayment }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#141418] border border-[#2D2D37] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#25252E] flex items-center justify-between bg-[#18181E]">
          <div className="flex items-center space-x-3">
            <span className="font-display text-2xl text-brand-flame tracking-wider">{order.id}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.status === 'Completed'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : order.status === 'Ready'
                ? 'bg-brand-flame/20 text-brand-flame border border-brand-flame/40'
                : order.status === 'Preparing'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                : 'bg-brand-red/20 text-brand-red border border-brand-red/40'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#24242D] hover:bg-[#30303C] text-brand-cream transition-colors text-xs font-semibold flex items-center space-x-1"
              title="Print Kitchen KOT Slip"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#24242D] hover:bg-[#30303C] text-brand-cream transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Receipt Slip */}
        <div className="p-6 overflow-y-auto space-y-6" id="printable-receipt">
          {/* Slip Header (visible in print) */}
          <div className="border-b border-[#25252E] pb-4 text-center sm:text-left flex justify-between items-start">
            <div>
              <h2 className="font-display text-2xl text-white">BBQ PIT STOP • KITCHEN SLIP</h2>
              <p className="text-xs text-brand-muted">Custom Smoker Sidecar • Bharati Vidyapeeth Cup 2.0</p>
              <p className="text-[11px] font-mono text-brand-flame mt-1">
                Time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="hidden sm:block">
              <QRCodeSVG value={`ORDER:${order.id}`} size={60} />
            </div>
          </div>

          {/* Customer & Dept Info */}
          <div className="bg-[#191920] border border-[#272730] p-4 rounded-xl grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-brand-muted uppercase font-bold text-[10px]">Customer</span>
              <p className="font-bold text-white text-sm">{order.customer.name}</p>
              <p className="text-brand-cream/80 font-mono">{order.customer.phone}</p>
            </div>
            <div>
              <span className="text-brand-muted uppercase font-bold text-[10px]">Department Team</span>
              <p className="font-bold text-amber-400 text-sm">{order.customer.department}</p>
              <p className="text-brand-muted text-[11px]">Point: {order.pickupPoint}</p>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider text-brand-muted">
              Ticket Items
            </h4>
            <div className="divide-y divide-[#24242C] border-y border-[#24242C]">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-start text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-brand-flame text-sm">{it.qty}x</span>
                      <span className="font-bold text-white">{it.name}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px] text-brand-muted mt-1 ml-6">
                      {it.flavour && (
                        <span className="bg-brand-red/20 text-brand-red px-1.5 py-0.5 rounded">
                          Flavour: {it.flavour}
                        </span>
                      )}
                      {it.portion && (
                        <span className="bg-white/10 text-white px-1.5 py-0.5 rounded">
                          {it.portion.name}
                        </span>
                      )}
                      {it.addons?.map((a, i) => (
                        <span key={i} className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                          +{a.name}
                        </span>
                      ))}
                    </div>

                    {it.instructions && (
                      <p className="text-[11px] text-amber-300 font-semibold italic mt-1 ml-6">
                        ★ Special Note: {it.instructions}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-white font-mono">₹{it.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-[#191920] border border-[#272730] p-4 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal:</span>
              <span className="text-white">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({order.couponApplied}):</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-[#2A2A33]">
              <span>Grand Total:</span>
              <span className="text-brand-flame font-display text-xl">₹{order.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span>Payment: <strong className="text-white">{order.paymentMethod}</strong></span>
              <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-amber-950 text-amber-300'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Quick Actions in Modal */}
          <div className="space-y-2 pt-2 border-t border-[#25252E]">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Quick Operations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onUpdateStatus(order.id, 'New')}
                className="py-2 px-2.5 rounded-lg bg-[#202026] hover:bg-brand-red text-white text-xs font-bold transition-colors"
              >
                Mark New
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Preparing')}
                className="py-2 px-2.5 rounded-lg bg-[#202026] hover:bg-amber-600 text-white text-xs font-bold transition-colors"
              >
                Mark Grilling
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Ready')}
                className="py-2 px-2.5 rounded-lg bg-[#202026] hover:bg-brand-flame text-white text-xs font-bold transition-colors"
              >
                Mark Ready
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Completed')}
                className="py-2 px-2.5 rounded-lg bg-[#202026] hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
              >
                Mark Collected
              </button>
            </div>

            {order.paymentStatus !== 'Paid' && (
              <button
                onClick={() => onUpdatePayment(order.id, 'Paid')}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                ✓ Mark Cash Received / Payment Collected
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
