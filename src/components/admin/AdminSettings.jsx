import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Download, MessageSquare, Check, Power, MapPin, IndianRupee, Phone, Copy } from 'lucide-react';

export const AdminSettings = () => {
  const { settings, updateSettings, orders } = useStore();
  const [form, setForm] = useState(settings);
  const [eodSummaryOpen, setEodSummaryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = ['Order ID', 'Date', 'Time', 'Customer Name', 'Phone', 'Department', 'Pickup Point', 'Items', 'Total (INR)', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => {
      const itemsStr = o.items.map((it) => `${it.qty}x ${it.name}`).join('; ');
      const d = new Date(o.createdAt);
      return [
        o.id,
        d.toLocaleDateString(),
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        `"${o.customer.name}"`,
        `"${o.customer.phone}"`,
        `"${o.customer.department}"`,
        `"${o.pickupPoint}"`,
        `"${itemsStr}"`,
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BBQ_Pit_Stop_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // End-of-Day calculation
  const totalRev = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const cashRev = orders.filter(o => o.status !== 'Cancelled' && o.paymentMethod === 'Cash').reduce((s, o) => s + o.total, 0);
  const upiRev = orders.filter(o => o.status !== 'Cancelled' && o.paymentMethod === 'UPI').reduce((s, o) => s + o.total, 0);
  const completedCount = orders.filter(o => o.status === 'Completed').length;
  const activeCount = orders.filter(o => o.status === 'New' || o.status === 'Preparing' || o.status === 'Ready').length;

  const eodText = `🔥 *BBQ PIT STOP – DAILY STALL CLOSING REPORT* 🔥
📅 Date: ${new Date().toLocaleDateString('en-IN')}
📍 Event: ${settings.eventName}
🏍️ Smoker Bike: MH.03.PT.741

📊 *FINANCIAL SUMMARY*
• Total Revenue: ₹${totalRev}
• UPI Collected: ₹${upiRev}
• Cash Collected: ₹${cashRev}

🍔 *ORDERS & KITCHEN SUMMARY*
• Total Tickets: ${orders.length}
• Completed & Served: ${completedCount}
• Pending in queue: ${activeCount}

*Come hungry, leave happy!*
Report generated via BBQ Pit Stop Web Suite.`;

  const handleCopyEOD = () => {
    navigator.clipboard.writeText(eodText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Top Banner Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25252E] pb-4">
        <div>
          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
            Stall Operations & Configuration
          </h3>
          <p className="text-xs text-brand-muted">Operational toggles, UPI endpoints, and CSV logs</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#202026] hover:bg-[#2C2C36] text-brand-cream text-xs font-bold flex items-center space-x-1.5 transition-colors border border-[#30303A]"
          >
            <Download className="w-3.5 h-3.5 text-brand-flame" />
            <span>Export Orders CSV</span>
          </button>

          <button
            onClick={() => setEodSummaryOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-flame-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>End-of-Day Report</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Stall Open / Closed Switch */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#272730] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Power className={`w-5 h-5 ${form.isStallOpen ? 'text-emerald-400' : 'text-red-400'}`} />
              <h4 className="font-heading font-bold text-white text-sm uppercase">Stall Accepting Orders</h4>
            </div>
            <p className="text-xs text-brand-muted">
              {form.isStallOpen ? 'Stall is OPEN! Customer orders are live.' : 'Stall is PAUSED. Customers cannot place new orders.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm({ ...form, isStallOpen: !form.isStallOpen })}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              form.isStallOpen
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                : 'bg-red-950 text-red-300 border border-red-500/40 hover:bg-red-900'
            }`}
          >
            {form.isStallOpen ? 'Stall Open (Active)' : 'Stall Closed'}
          </button>
        </div>

        {/* Event Details */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#272730] space-y-4 text-xs">
          <h4 className="font-heading font-bold text-white text-sm uppercase flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-brand-flame" />
            <span>Event & Location Setup</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-cream font-semibold mb-1">Event Tournament Name</label>
              <input
                type="text"
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                className="w-full bg-[#1A1A20] border border-[#2D2D37] rounded-xl px-3 py-2 text-white outline-none focus:border-brand-flame"
              />
            </div>

            <div>
              <label className="block text-brand-cream font-semibold mb-1">Campus Venue</label>
              <input
                type="text"
                value={form.eventLocation}
                onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                className="w-full bg-[#1A1A20] border border-[#2D2D37] rounded-xl px-3 py-2 text-white outline-none focus:border-brand-flame"
              />
            </div>
          </div>
        </div>

        {/* Payment & Contact Details */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#272730] space-y-4 text-xs">
          <h4 className="font-heading font-bold text-white text-sm uppercase flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-brand-flame" />
            <span>Payment & Communication</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-brand-cream font-semibold mb-1">UPI ID for Payment QR</label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full bg-[#1A1A20] border border-[#2D2D37] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-flame"
              />
            </div>

            <div>
              <label className="block text-brand-cream font-semibold mb-1">Payee Name</label>
              <input
                type="text"
                value={form.payeeName}
                onChange={(e) => setForm({ ...form, payeeName: e.target.value })}
                className="w-full bg-[#1A1A20] border border-[#2D2D37] rounded-xl px-3 py-2 text-white outline-none focus:border-brand-flame"
              />
            </div>

            <div>
              <label className="block text-brand-cream font-semibold mb-1">Support Phone Number</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full bg-[#1A1A20] border border-[#2D2D37] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-flame"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-xs uppercase tracking-wider shadow-flame hover:scale-[1.01] transition-all"
        >
          Save Configuration
        </button>
      </form>

      {/* End-of-Day Summary Modal */}
      {eodSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#2D2D37] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#24242C] pb-3">
              <h4 className="font-heading font-bold text-white text-base uppercase">
                End-of-Day Closing Summary
              </h4>
              <button onClick={() => setEodSummaryOpen(false)} className="text-brand-muted hover:text-white">
                ✕
              </button>
            </div>

            <div className="bg-[#18181E] border border-[#25252E] p-4 rounded-xl font-mono text-xs text-brand-cream whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {eodText}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-brand-muted">Ready to paste into stall WhatsApp group</span>
              <button
                onClick={handleCopyEOD}
                className="px-4 py-2 rounded-xl bg-brand-flame hover:bg-brand-flame/90 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
