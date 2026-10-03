import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderDetailModal } from './OrderDetailModal';
import {
  Flame,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  IndianRupee,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

const COLUMNS = [
  { id: 'New', title: 'New Orders', color: 'border-brand-red', badgeBg: 'bg-brand-red text-white' },
  { id: 'Preparing', title: 'Smoking on Grill', color: 'border-amber-500', badgeBg: 'bg-amber-500 text-black' },
  { id: 'Ready', title: 'Ready for Pickup', color: 'border-brand-flame', badgeBg: 'bg-brand-flame text-white' },
  { id: 'Completed', title: 'Collected', color: 'border-emerald-600', badgeBg: 'bg-emerald-600 text-white' },
  { id: 'Cancelled', title: 'Cancelled', color: 'border-zinc-700', badgeBg: 'bg-zinc-700 text-zinc-300' },
];

export const AdminKanban = () => {
  const { orders, updateOrderStatus, updatePaymentStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [mobileColumnFilter, setMobileColumnFilter] = useState('all');

  // Elapsed time formatter
  const getElapsedString = (createdAt) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const mins = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  const isOrderDelayed = (order) => {
    if (order.status === 'Completed' || order.status === 'Cancelled') return false;
    const diffMs = Date.now() - new Date(order.createdAt).getTime();
    return diffMs > 15 * 60 * 1000; // More than 15 mins
  };

  // Quick advance status helper
  const advanceStatus = (order, e) => {
    e.stopPropagation();
    if (order.status === 'New') {
      updateOrderStatus(order.id, 'Preparing');
    } else if (order.status === 'Preparing') {
      updateOrderStatus(order.id, 'Ready');
    } else if (order.status === 'Ready') {
      updateOrderStatus(order.id, 'Completed');
    }
  };

  const handleTogglePayment = (order, e) => {
    e.stopPropagation();
    const next = order.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
    updatePaymentStatus(order.id, next);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Board Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search token #, name, or department..."
            className="w-full bg-[#141418] border border-[#272730] focus:border-brand-flame rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-brand-muted outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-brand-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>Live Queue Connected</span>
        </div>
      </div>

      {/* Mobile Column Filter Pills */}
      <div className="flex sm:hidden overflow-x-auto gap-2 pb-2 scrollbar-none">
        <button
          onClick={() => setMobileColumnFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-colors ${
            mobileColumnFilter === 'all'
              ? 'bg-brand-red text-white'
              : 'bg-[#18181E] text-brand-muted border border-[#26262F]'
          }`}
        >
          All Columns
        </button>
        {COLUMNS.map((c) => (
          <button
            key={c.id}
            onClick={() => setMobileColumnFilter(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-colors ${
              mobileColumnFilter === c.id
                ? 'bg-brand-flame text-white'
                : 'bg-[#18181E] text-brand-muted border border-[#26262F]'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Clean Live Queue Empty State */}
      {orders.length === 0 && (
        <div className="p-8 text-center bg-[#141418] border border-dashed border-emerald-500/30 rounded-3xl space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
            Live Stall Operational — Queue Clear
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Ready for customer orders! As students place orders from their phones, tickets will land here in real time with audio chime.
          </p>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.filter((col) => mobileColumnFilter === 'all' || col.id === mobileColumnFilter).map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-[#121215] border-t-4 ${col.color} border-x border-b border-[#222228] rounded-2xl flex flex-col min-w-[260px] h-[720px] shadow-lg`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#202026] flex items-center justify-between bg-[#151519] rounded-t-xl">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                  {col.title}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${col.badgeBg}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-3 overflow-y-auto space-y-3 flex-1">
                {colOrders.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-xs text-brand-muted/50 border border-dashed border-[#25252D] rounded-xl">
                    No orders here
                  </div>
                ) : (
                  colOrders.map((ord) => {
                    const delayed = isOrderDelayed(ord);

                    return (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`bg-[#18181D] border rounded-xl p-3.5 space-y-2.5 cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
                          delayed
                            ? 'border-brand-red bg-brand-red/5 shadow-flame-sm animate-pulse'
                            : 'border-[#282830] hover:border-[#40404C]'
                        }`}
                      >
                        {/* Token & Elapsed */}
                        <div className="flex items-center justify-between">
                          <span className="font-display text-lg text-white font-bold tracking-wider">
                            {ord.id}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              delayed
                                ? 'bg-brand-red text-white font-bold'
                                : 'bg-[#222229] text-brand-muted'
                            }`}
                          >
                            {getElapsedString(ord.createdAt)}
                          </span>
                        </div>

                        {/* Customer & Dept */}
                        <div>
                          <p className="font-bold text-xs text-white truncate">
                            {ord.customer.name}
                          </p>
                          <p className="text-[11px] text-amber-400 font-medium truncate">
                            {ord.customer.department}
                          </p>
                        </div>

                        {/* Items summary */}
                        <div className="bg-[#121215] p-2 rounded-lg text-[11px] space-y-0.5 text-brand-cream/80">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="truncate">
                                {it.qty}x {it.name}
                              </span>
                              <span className="text-[10px] text-brand-muted ml-1 shrink-0 font-mono">
                                ₹{it.total}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Notes preview */}
                        {ord.notes && (
                          <p className="text-[10px] text-brand-flame italic line-clamp-1">
                            Note: {ord.notes}
                          </p>
                        )}

                        {/* Price & Payment Pill */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#23232A]">
                          <div>
                            <span className="font-extrabold text-sm text-brand-flame">
                              ₹{ord.total}
                            </span>
                            <span className="text-[10px] text-brand-muted ml-1">({ord.paymentMethod})</span>
                          </div>

                          <button
                            onClick={(e) => handleTogglePayment(ord, e)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                              ord.paymentStatus === 'Paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30 hover:bg-emerald-800'
                            }`}
                          >
                            {ord.paymentStatus === 'Paid' ? 'Paid ✓' : 'Pay Pending'}
                          </button>
                        </div>

                        {/* Quick 1-tap Status Advance */}
                        {col.id !== 'Completed' && col.id !== 'Cancelled' && (
                          <button
                            onClick={(e) => advanceStatus(ord, e)}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-flame hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1 shadow-sm transition-all"
                          >
                            <span>
                              {col.id === 'New' && 'Start Grilling →'}
                              {col.id === 'Preparing' && 'Mark Ready →'}
                              {col.id === 'Ready' && 'Mark Collected ✓'}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
        onUpdatePayment={updatePaymentStatus}
      />
    </div>
  );
};
