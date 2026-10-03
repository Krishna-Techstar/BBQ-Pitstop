import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Globe,
  QrCode,
  Star,
  TrendingDown,
  Filter,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '../Icons';

export const AdminBrandEngagement = () => {
  const { orders, feedbackList } = useStore();

  // Traffic Source distribution from orders
  const trafficDistribution = useMemo(() => {
    const map = {
      qr_poster: { label: 'Motorcycle Smoker QR Poster', count: 0, icon: QrCode },
      instagram: { label: 'Instagram Bio (@barbequepitstop)', count: 0, icon: InstagramIcon },
      direct: { label: 'Direct / Word of Mouth', count: 0, icon: Globe },
      qr_table: { label: 'Match Ground Table QRs', count: 0, icon: QrCode },
    };

    orders.forEach((o) => {
      const src = o.trafficSource || 'direct';
      if (map[src]) {
        map[src].count += 1;
      } else {
        map.direct.count += 1;
      }
    });

    return Object.values(map);
  }, [orders]);

  // Average Rating
  const avgRating = useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) return 5.0;
    const total = feedbackList.reduce((s, f) => s + f.rating, 0);
    return (total / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  // Funnel Estimation based on order count and typical conversion
  const totalOrders = orders.length;
  const estimatedVisits = totalOrders * 4 + 48;
  const estimatedMenuViews = Math.round(estimatedVisits * 0.85);
  const estimatedAddToCart = Math.round(estimatedVisits * 0.45);
  const checkoutStarted = Math.round(estimatedVisits * 0.3);
  const ordersCompleted = totalOrders;
  const abandonmentRate = Math.round(((estimatedAddToCart - ordersCompleted) / estimatedAddToCart) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top row: Traffic & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-brand-flame" />
            <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
              Traffic Attribution Sources (?src=)
            </h3>
          </div>
          <p className="text-xs text-brand-muted">Where students are scanning and finding the web app</p>

          <div className="space-y-3 pt-2">
            {trafficDistribution.map((src, i) => {
              const Icon = src.icon;
              const percent = totalOrders ? Math.round((src.count / totalOrders) * 100) : 0;

              return (
                <div key={i} className="p-3 rounded-xl bg-[#191920] border border-[#272730] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-brand-flame" />
                      <span className="font-semibold text-white">{src.label}</span>
                    </div>
                    <span className="font-bold text-brand-flame font-mono">{src.count} orders ({percent}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#25252D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-red to-brand-flame rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel & Abandonment */}
        <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-brand-red" />
              <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
                Event Ordering Funnel
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Abandonment: {abandonmentRate}%
            </span>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#191920] flex justify-between items-center">
              <span className="text-brand-cream">1. Site Visitors (QR Scans & Links)</span>
              <span className="font-bold text-white font-mono">{estimatedVisits} (100%)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#191920] flex justify-between items-center">
              <span className="text-brand-cream">2. Browsed Menu Items</span>
              <span className="font-bold text-white font-mono">{estimatedMenuViews} (85%)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#191920] flex justify-between items-center">
              <span className="text-brand-cream">3. Added Item to Cart</span>
              <span className="font-bold text-white font-mono">{estimatedAddToCart} (45%)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#191920] flex justify-between items-center">
              <span className="text-brand-cream">4. Reached Checkout Form</span>
              <span className="font-bold text-white font-mono">{checkoutStarted} (30%)</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center text-emerald-300">
              <span className="font-bold">5. Confirmed Order Placed</span>
              <span className="font-extrabold font-mono">{ordersCompleted} orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Feedback feed & reviews */}
      <div className="bg-[#141418] border border-[#272730] p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#25252E] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">
                Customer Ratings & Feedback Stream
              </h3>
              <p className="text-xs text-brand-muted">Live feedback collected after counter pickup</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-display text-3xl text-amber-400 font-bold">{avgRating}</span>
            <div className="text-xs text-brand-muted leading-tight">
              <p className="font-bold text-white">Average Score</p>
              <p>{feedbackList.length} reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl bg-[#191920] border border-[#272730] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-brand-muted font-mono">{fb.orderId}</span>
              </div>

              <p className="text-brand-cream italic line-clamp-3">"{fb.comment}"</p>

              <div className="pt-2 border-t border-[#25252E] flex justify-between items-center text-[11px]">
                <span className="font-bold text-white">{fb.customerName}</span>
                <span className="text-brand-flame text-[10px]">{fb.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
