import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { AdminKanban } from '../components/admin/AdminKanban';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminBrandEngagement } from '../components/admin/AdminBrandEngagement';
import { AdminMenuManager } from '../components/admin/AdminMenuManager';
import { AdminCustomers } from '../components/admin/AdminCustomers';
import { AdminOffers } from '../components/admin/AdminOffers';
import { AdminSettings } from '../components/admin/AdminSettings';
import { playOrderChime } from '../utils/soundAlert';
import {
  Flame,
  LayoutDashboard,
  BarChart3,
  Globe,
  Utensils,
  Users,
  Tag,
  Settings,
  Shield,
  Volume2,
  PlusCircle,
  LogOut,
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Trash2,
} from 'lucide-react';

const ADMIN_PINS = ['bbq2026', '1234', 'admin'];

export const AdminDashboard = () => {
  const { orders, simulateNewOrder, settings, clearAllOrders } = useStore();
  
  // Auth state (persisted in session)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('bbq_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'analytics' | 'brand' | 'menu' | 'customers' | 'offers' | 'settings'

  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMIN_PINS.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bbq_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Passcode. (Try default: bbq2026)');
    }
  };

  const handleQuickDemoAccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('bbq_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bbq_admin_auth');
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    let totalRevenue = 0;
    let todayRevenue = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;
    let cashCollected = 0;
    let upiCollected = 0;
    let cashPending = 0;

    const todayDate = new Date().toDateString();

    orders.forEach((o) => {
      if (o.status === 'Cancelled') {
        cancelledCount += 1;
        return;
      }

      totalRevenue += o.total;

      const orderDate = new Date(o.createdAt).toDateString();
      if (orderDate === todayDate) {
        todayRevenue += o.total;
      }

      if (o.status === 'Completed') {
        completedCount += 1;
      } else {
        pendingCount += 1;
      }

      if (o.paymentMethod === 'UPI') {
        upiCollected += o.total;
      } else if (o.paymentMethod === 'Cash') {
        if (o.paymentStatus === 'Paid') {
          cashCollected += o.total;
        } else {
          cashPending += o.total;
        }
      }
    });

    const nonCancelled = orders.length - cancelledCount;
    const aov = nonCancelled > 0 ? Math.round(totalRevenue / nonCancelled) : 0;

    return {
      totalRevenue,
      todayRevenue,
      totalOrders: orders.length,
      completedCount,
      pendingCount,
      cancelledCount,
      cashCollected,
      upiCollected,
      cashPending,
      aov,
    };
  }, [orders]);

  // If not logged in, render PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-[#141418] border border-[#2D2D37] p-8 rounded-3xl w-full max-w-md space-y-6 shadow-flame text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red to-brand-flame mx-auto flex items-center justify-center shadow-flame-sm text-white">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
              Stall Staff Access
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              BBQ Pit Stop Kitchen POS & Live Orders Board
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-brand-cream">Staff Passcode</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter passcode (e.g. bbq2026)"
                className="w-full bg-[#1A1A20] border border-[#30303A] focus:border-brand-flame rounded-xl px-4 py-3 text-sm text-white placeholder-brand-muted outline-none text-center font-mono tracking-widest"
              />
              {loginError && <p className="text-xs text-red-400 mt-1">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red text-white font-bold text-xs uppercase tracking-wider shadow-flame hover:scale-[1.01] transition-transform"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-[#222228]">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="text-xs text-brand-flame hover:underline font-semibold"
            >
              1-Tap Quick Demo Access (for Evaluation) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#25252D] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-flame">
              Pitmaster Operating Control Room
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-white tracking-wide uppercase mt-1">
            Admin <span className="text-brand-flame">HQ</span>
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            {settings.eventName} • Custom Smoker Bike MH.03.PT.741
          </p>
        </div>

        {/* Live Simulation & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Chime Test */}
          <button
            onClick={playOrderChime}
            className="p-2.5 rounded-xl bg-[#18181E] hover:bg-[#22222A] text-brand-cream border border-[#2B2B34] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Test Kitchen Sound Alert"
          >
            <Volume2 className="w-4 h-4 text-brand-flame" />
            <span className="hidden sm:inline">Chime</span>
          </button>

          {/* Reset Queue for Live Mode */}
          <button
            onClick={() => {
              if (window.confirm('Clear all orders from the queue for fresh live service?')) {
                clearAllOrders();
              }
            }}
            className="p-2.5 rounded-xl bg-[#18181E] hover:bg-red-950/40 text-brand-muted hover:text-red-400 border border-[#2B2B34] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Clear all orders for live launch"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Queue</span>
          </button>

          {/* Simulate New Order button */}
          <button
            onClick={simulateNewOrder}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-flame flex items-center space-x-1.5 transition-all"
            title="Inject an active student order for testing"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Order</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-[#18181E] hover:bg-red-950/40 text-brand-muted hover:text-red-400 border border-[#2B2B34] transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-[#141418] border border-[#272730] p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Total Revenue</span>
          <div className="font-display text-2xl text-white font-bold">₹{kpis.totalRevenue}</div>
          <p className="text-[10px] text-emerald-400">All-time sports cup</p>
        </div>

        {/* Today's Revenue */}
        <div className="bg-[#141418] border border-brand-red/30 p-4 rounded-2xl space-y-1 shadow-flame-sm">
          <span className="text-[10px] text-brand-flame uppercase font-bold tracking-wider">Today's Revenue</span>
          <div className="font-display text-2xl text-brand-flame font-bold">₹{kpis.todayRevenue}</div>
          <p className="text-[10px] text-brand-muted">AOV: ₹{kpis.aov}</p>
        </div>

        {/* Total Orders & Pending */}
        <div className="bg-[#141418] border border-[#272730] p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Live Tickets</span>
          <div className="font-display text-2xl text-white font-bold">{kpis.totalOrders}</div>
          <p className="text-[10px] text-amber-400 font-semibold">{kpis.pendingCount} pending in queue</p>
        </div>

        {/* Cash Collected & Pending */}
        <div className="bg-[#141418] border border-[#272730] p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Cash Register</span>
          <div className="font-display text-2xl text-emerald-400 font-bold">₹{kpis.cashCollected}</div>
          <p className="text-[10px] text-amber-400">₹{kpis.cashPending} pending pickup</p>
        </div>

        {/* UPI Collected */}
        <div className="bg-[#141418] border border-[#272730] p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">UPI Collections</span>
          <div className="font-display text-2xl text-cyan-400 font-bold">₹{kpis.upiCollected}</div>
          <p className="text-[10px] text-brand-muted">Direct to bank QR</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#25252E] scrollbar-none">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'kanban'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Live Orders (Kanban)</span>
          {kpis.pendingCount > 0 && (
            <span className="bg-[#0B0B0B] text-brand-flame text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {kpis.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Cup 2.0</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'brand'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Attribution & Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'menu'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'customers'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students CRM</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'offers'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Offers</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
              : 'bg-[#141418] text-brand-muted hover:text-white border border-[#25252E]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & CSV</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="pt-2">
        {activeTab === 'kanban' && <AdminKanban />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'brand' && <AdminBrandEngagement />}
        {activeTab === 'menu' && <AdminMenuManager />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'offers' && <AdminOffers />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};
