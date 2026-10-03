import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Plus, Check, Trash2, X } from 'lucide-react';

export const AdminOffers = () => {
  const { coupons, updateSettings } = useStore();
  const [couponList, setCouponList] = useState(coupons);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'flat', // 'flat' | 'percentage'
    value: 30,
    minOrder: 200,
    desc: 'Special match discount',
    active: true,
  });

  const handleToggle = (code) => {
    const updated = couponList.map((c) =>
      c.code === code ? { ...c, active: !c.active } : c
    );
    setCouponList(updated);
    localStorage.setItem('bbq_coupons_v2', JSON.stringify(updated));
  };

  const handleDelete = (code) => {
    const updated = couponList.filter((c) => c.code !== code);
    setCouponList(updated);
    localStorage.setItem('bbq_coupons_v2', JSON.stringify(updated));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    const newCoupon = {
      ...form,
      code: form.code.trim().toUpperCase(),
      value: Number(form.value),
      minOrder: Number(form.minOrder),
    };

    const updated = [newCoupon, ...couponList];
    setCouponList(updated);
    localStorage.setItem('bbq_coupons_v2', JSON.stringify(updated));
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
            Promo Offers & Student Coupons
          </h3>
          <p className="text-xs text-brand-muted">Configure active discount codes for checkout cart</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-xs uppercase tracking-wider shadow-flame flex items-center space-x-2 w-fit hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {isAdding && (
        <div className="p-5 rounded-2xl bg-[#141418] border border-brand-red/40 space-y-4 max-w-lg">
          <div className="flex justify-between items-center border-b border-[#24242C] pb-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase">Create New Promo Code</h4>
            <button onClick={() => setIsAdding(false)} className="text-brand-muted hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-brand-cream font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FINALS30"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white font-mono uppercase outline-none focus:border-brand-flame"
                />
              </div>

              <div>
                <label className="block text-brand-cream font-semibold mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="flat">Flat ₹ Off</option>
                  <option value="percentage">% Percentage Off</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-brand-cream font-semibold mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-brand-cream font-semibold mb-1">Min Order Total (₹)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-cream font-semibold mb-1">Short Description</label>
              <input
                type="text"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="e.g. ₹30 OFF during quarter finals"
                className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg bg-[#202026] text-brand-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-brand-red hover:bg-brand-red/90 text-white font-bold"
              >
                Save Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {couponList.map((cp) => (
          <div
            key={cp.code}
            className={`p-4 rounded-2xl border transition-all ${
              cp.active
                ? 'bg-[#141418] border-brand-red/30'
                : 'bg-[#121215] border-[#222228] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-base text-brand-flame tracking-wider">
                {cp.code}
              </span>
              <button
                onClick={() => handleToggle(cp.code)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  cp.active ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {cp.active ? 'Active' : 'Disabled'}
              </button>
            </div>

            <p className="text-xs text-white font-semibold mt-2">
              {cp.type === 'flat' ? `₹${cp.value} Flat OFF` : `${cp.value}% OFF`}
            </p>
            <p className="text-[11px] text-brand-muted mt-0.5">{cp.desc}</p>
            <p className="text-[10px] text-amber-400 mt-1">Min Order: ₹{cp.minOrder || 0}</p>

            <div className="pt-3 mt-3 border-t border-[#222228] flex justify-end">
              <button
                onClick={() => handleDelete(cp.code)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
