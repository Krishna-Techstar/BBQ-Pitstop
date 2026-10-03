import React, { useMemo, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Phone, MessageCircle, Search, IndianRupee, Trophy } from 'lucide-react';

export const AdminCustomers = () => {
  const { orders } = useStore();
  const [search, setSearch] = useState('');

  // Aggregate customers by phone
  const customerList = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const phone = o.customer.phone;
      if (!map[phone]) {
        map[phone] = {
          name: o.customer.name,
          phone,
          department: o.customer.department,
          orderCount: 0,
          totalSpent: 0,
          lastOrderAt: o.createdAt,
          lastOrderId: o.id,
        };
      }
      map[phone].orderCount += 1;
      map[phone].totalSpent += o.total;
      if (new Date(o.createdAt) > new Date(map[phone].lastOrderAt)) {
        map[phone].lastOrderAt = o.createdAt;
        map[phone].lastOrderId = o.id;
      }
    });

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customerList.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.department.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
            Customer Directory ({customerList.length} Students)
          </h3>
          <p className="text-xs text-brand-muted">Aggregated order histories, spending, and contact details</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, phone, dept..."
            className="w-full bg-[#141418] border border-[#272730] focus:border-brand-flame rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-brand-muted outline-none"
          />
        </div>
      </div>

      <div className="bg-[#141418] border border-[#272730] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A20] text-brand-muted uppercase font-heading tracking-wider border-b border-[#25252E]">
              <tr>
                <th className="py-3 px-4">Student Customer</th>
                <th className="py-3 px-4">Department / Team</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202026] text-brand-cream">
              {filtered.map((c, i) => (
                <tr key={c.phone} className="hover:bg-[#18181E] transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white text-xs">{c.name}</p>
                    <p className="text-[11px] text-brand-muted font-mono">{c.phone}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-amber-400">{c.department}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#202028] text-white font-mono font-bold">
                      {c.orderCount}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-brand-flame text-sm">
                    ₹{c.totalSpent}
                  </td>

                  <td className="py-3 px-4 text-brand-muted text-[11px]">
                    {new Date(c.lastOrderAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.lastOrderAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <a
                      href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hi ${c.name}, thanks for ordering from BBQ Pit Stop at Interdepartmental Cup!`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors"
                      title="Send WhatsApp Promo"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
