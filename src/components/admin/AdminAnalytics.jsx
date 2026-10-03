import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Trophy, Flame, TrendingUp, Users, Sparkles, IndianRupee, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const COLORS = ['#E11D2E', '#FF7A1A', '#FF9F1C', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

export const AdminAnalytics = () => {
  const { orders } = useStore();
  const [timeView, setTimeView] = useState('hourly'); // 'hourly' | 'daily'

  // 1. Department Cup Leaderboard
  const departmentStats = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const dept = o.customer.department || 'General';
      if (!map[dept]) {
        map[dept] = { department: dept, orders: 0, revenue: 0, itemsSold: 0 };
      }
      map[dept].orders += 1;
      map[dept].revenue += o.total;
      map[dept].itemsSold += o.items.reduce((s, it) => s + it.qty, 0);
    });

    return Object.values(map).sort((a, b) => b.orders - a.orders);
  }, [orders]);

  // 2. Revenue & Orders Over Time
  const timeSeriesData = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const d = new Date(o.createdAt);
      const key =
        timeView === 'hourly'
          ? `${d.getHours()}:00`
          : d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      if (!map[key]) {
        map[key] = { label: key, revenue: 0, orders: 0 };
      }
      map[key].revenue += o.total;
      map[key].orders += 1;
    });

    return Object.values(map);
  }, [orders, timeView]);

  // 3. Top Selling Items
  const topItems = useMemo(() => {
    const itemMap = {};
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items.forEach((it) => {
        if (!itemMap[it.name]) {
          itemMap[it.name] = { name: it.name, count: 0, revenue: 0 };
        }
        itemMap[it.name].count += it.qty;
        itemMap[it.name].revenue += it.total;
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [orders]);

  // 4. Flavour Popularity
  const flavourData = useMemo(() => {
    const flvMap = { Tandoori: 0, 'Peri Peri': 0, BBQ: 0, 'Sweet Chilli': 0 };
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items.forEach((it) => {
        if (it.flavour && flvMap[it.flavour] !== undefined) {
          flvMap[it.flavour] += it.qty;
        }
      });
    });

    return Object.entries(flvMap).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // 5. Payment Split
  const paymentSplit = useMemo(() => {
    let upiCount = 0;
    let cashCount = 0;
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      if (o.paymentMethod === 'UPI') upiCount += 1;
      else cashCount += 1;
    });
    return [
      { name: 'UPI Payment', value: upiCount },
      { name: 'Cash on Pickup', value: cashCount },
    ];
  }, [orders]);

  // 6. Addon attach rates (Cheese & Sauce)
  const addOnStats = useMemo(() => {
    let totalNonCancelled = 0;
    let cheeseCount = 0;
    let sauceCount = 0;

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      totalNonCancelled += 1;
      if (o.hasCheese) cheeseCount += 1;
      if (o.hasSauce) sauceCount += 1;
    });

    const cheeseRate = totalNonCancelled ? Math.round((cheeseCount / totalNonCancelled) * 100) : 0;
    const sauceRate = totalNonCancelled ? Math.round((sauceCount / totalNonCancelled) * 100) : 0;

    return { cheeseCount, cheeseRate, sauceCount, sauceRate, totalNonCancelled };
  }, [orders]);

  // 7. Customer Loyalty (New vs Returning)
  const customerLoyalty = useMemo(() => {
    const phones = {};
    let returning = 0;
    let newCust = 0;

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const p = o.customer.phone;
      if (phones[p]) {
        phones[p] += 1;
      } else {
        phones[p] = 1;
      }
    });

    Object.values(phones).forEach((count) => {
      if (count > 1) returning += 1;
      else newCust += 1;
    });

    return [
      { name: 'Returning Students', value: returning },
      { name: 'First-time Customers', value: newCust },
    ];
  }, [orders]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Interdepartmental Cup Leaderboard */}
      <div className="bg-gradient-to-r from-brand-red/15 via-[#18181D] to-brand-flame/15 border border-brand-red/30 p-6 rounded-3xl shadow-flame-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2B35] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl text-white tracking-wide uppercase">
                Interdepartmental Cup 2.0 Leaderboard
              </h3>
              <p className="text-xs text-brand-cream/70">
                Live ranking of college departments based on total BBQ orders placed!
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-[#141418] text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/30 w-fit">
            Bharati Vidyapeeth Fest
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.slice(0, 6).map((dept, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={dept.department}
                className={`p-4 rounded-2xl border transition-all ${
                  isFirst
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-flame-sm'
                    : isSecond
                    ? 'bg-zinc-800/30 border-zinc-500/50'
                    : isThird
                    ? 'bg-amber-900/10 border-amber-700/40'
                    : 'bg-[#141418] border-[#25252D]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-display text-sm font-bold ${
                      isFirst
                        ? 'bg-amber-400 text-black shadow-md'
                        : isSecond
                        ? 'bg-zinc-300 text-black'
                        : isThird
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#222228] text-brand-muted'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-bold text-xs text-white truncate max-w-[150px]">
                      {dept.department}
                    </span>
                  </div>

                  {isFirst && <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />}
                </div>

                <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-[#222228] text-xs">
                  <div>
                    <span className="text-brand-muted">Orders: </span>
                    <strong className="text-white font-mono">{dept.orders}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted">Spent: </span>
                    <strong className="text-brand-flame font-mono">₹{dept.revenue}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Revenue & Orders Over Time */}
      <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
              Revenue & Order Volume
            </h3>
            <p className="text-xs text-brand-muted">Timeline trends during the sports cup matches</p>
          </div>
          <div className="flex items-center bg-[#1A1A20] border border-[#2D2D37] rounded-xl p-1 shrink-0">
            <button
              onClick={() => setTimeView('hourly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                timeView === 'hourly' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white'
              }`}
            >
              Hourly
            </button>
            <button
              onClick={() => setTimeView('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                timeView === 'daily' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white'
              }`}
            >
              Daily
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25252D" />
              <XAxis dataKey="label" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181D', borderColor: '#333', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#E11D2E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="orders" name="Order Count" fill="#FF7A1A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Top Items & Flavour Distribution (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top items */}
        <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
            Top Selling Dishes
          </h3>
          <p className="text-xs text-brand-muted">Most ordered cuts and sandwiches</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25252D" />
                <XAxis type="number" stroke="#888" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181D', borderColor: '#333', borderRadius: '12px' }}
                />
                <Bar dataKey="count" name="Portions Sold" fill="#FF9F1C" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flavour Popularity */}
        <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
            Flavour Marinade Popularity
          </h3>
          <p className="text-xs text-brand-muted">Student taste preferences</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flavourData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {flavourData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181D', borderColor: '#333', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Operations Micro KPIs (Payment Split, Addon Attach, Customer Loyalty) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Split */}
        <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl space-y-3">
          <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">
            Payment Mode Split
          </span>
          <div className="space-y-2 pt-1 text-xs">
            {paymentSplit.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-[#18181E]">
                <span className="text-brand-cream">{p.name}</span>
                <span className="font-bold text-brand-flame font-mono">{p.value} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Addon Attach Rate */}
        <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl space-y-3">
          <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">
            Add-on Attach Rate
          </span>
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-[#18181E] flex justify-between items-center">
              <div>
                <p className="font-bold text-amber-300">Extra Cheese (+₹40)</p>
                <p className="text-[10px] text-brand-muted">{addOnStats.cheeseCount} orders attached</p>
              </div>
              <span className="font-extrabold text-base text-amber-400 font-mono">
                {addOnStats.cheeseRate}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#18181E] flex justify-between items-center">
              <div>
                <p className="font-bold text-brand-flame">Smoky Sauce Dip (+₹20)</p>
                <p className="text-[10px] text-brand-muted">{addOnStats.sauceCount} orders attached</p>
              </div>
              <span className="font-extrabold text-base text-brand-flame font-mono">
                {addOnStats.sauceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Customer Loyalty */}
        <div className="bg-[#141418] border border-[#272730] p-5 rounded-2xl space-y-3">
          <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">
            Student Retention
          </span>
          <div className="space-y-2 pt-1 text-xs">
            {customerLoyalty.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-[#18181E]">
                <span className="text-brand-cream">{c.name}</span>
                <span className="font-bold text-emerald-400 font-mono">{c.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
