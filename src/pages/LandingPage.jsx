import React, { useState } from 'react';
import { HeroBikeSection } from '../components/HeroBikeSection';
import { useStore } from '../context/StoreContext';
import { CustomizeModal } from '../components/CustomizeModal';
import { Link } from 'react-router-dom';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Zap,
} from 'lucide-react';
import { InstagramIcon } from '../components/Icons';

export const LandingPage = () => {
  const { menuItems, addToCart, feedbackList } = useStore();
  const [selectedCustomItem, setSelectedCustomItem] = useState(null);

  // Best sellers: items tagged isBestSeller
  const bestSellers = menuItems.filter((i) => i.isBestSeller).slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <HeroBikeSection />

      {/* 2. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-red text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-brand-flame" />
              <span>Campus Favourites</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase mt-1">
              Top Smoker <span className="text-brand-flame">Best Sellers</span>
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-brand-flame hover:text-white transition-colors"
          >
            <span>View All {menuItems.length} Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="bg-[#141418] border border-[#26262D] rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-[#1A1A20]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent"></div>

                {item.flavour && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-brand-flame border border-brand-flame/30">
                    {item.flavour}
                  </span>
                )}

                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-red text-white shadow-md">
                  HOT SELLER
                </span>

                <div className="absolute bottom-2 left-3 font-display text-2xl text-white">
                  ₹{item.price}
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-flame transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#222228]">
                  <span className="text-[11px] font-medium text-brand-muted">
                    {item.pieces || 'Smoked Special'}
                  </span>
                  <button
                    onClick={() => setSelectedCustomItem(item)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-flame-sm hover:scale-105 active:scale-95 transition-all flex items-center space-x-1"
                  >
                    <span>Add</span>
                    <Flame className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works (Order -> We Grill -> Pick Up) */}
      <section className="bg-[#101013] border-y border-[#202026] py-16 relative bg-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-flame">
              Fast Matchside Street Pit
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase mt-1">
              How It <span className="text-brand-red">Works</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              No long stall queues. Place your order on your phone, watch the smoke roll, and pick up hot!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#16161B] border border-[#272730] p-6 rounded-2xl text-center space-y-4 relative group hover:border-brand-flame/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/30 mx-auto flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                <span className="font-display text-2xl font-bold">1</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Pick Your Cut & Flavour</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Choose from Tandoori, Peri Peri, Sweet Chilli or BBQ glaze. Add extra cheese or secret sauce dip.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#16161B] border border-brand-red/40 p-6 rounded-2xl text-center space-y-4 relative group shadow-flame-sm hover:border-brand-flame transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-flame mx-auto flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                <Flame className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">We Smoke On Sidecar</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Our custom motorcycle smoker cooks over natural wood and charcoal at high heat for maximum char and juiciness.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#16161B] border border-[#272730] p-6 rounded-2xl text-center space-y-4 relative group hover:border-brand-flame/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <span className="font-display text-2xl font-bold">3</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Express Counter Pickup</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Get notified on your mobile tracker in real time. Flash your order code, grab your meal, and cheer your department!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Smoker Bike Deep Dive (Royal Enfield MH.03.PT.741) */}
      <section id="smoker-bike" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#141418] via-[#101013] to-[#0A0A0C] border border-[#2A2A33] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-brand-flame" />
                <span>The Story of MH.03.PT.741</span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide uppercase leading-tight">
                A Royal Enfield <br />
                <span className="text-brand-flame">Turned BBQ Smoker.</span>
              </h2>

              <p className="text-sm text-brand-cream/80 leading-relaxed">
                Engineered specifically for street events and college festivals, our custom sidecar houses a double-tiered offset smoker, heat chamber, and charcoal pit mounted on a legendary Royal Enfield Bullet motorcycle.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-brand-flame/20 flex items-center justify-center text-brand-flame shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Authentic Charcoal & Wood Smoke</h4>
                    <p className="text-xs text-brand-muted">Slow burning Indian babool & hickory charcoal creates the signature red smoke ring.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-brand-flame/20 flex items-center justify-center text-brand-flame shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Smoky Outside, Juicy & Tender Inside</h4>
                    <p className="text-xs text-brand-muted">High radiant heat seals the natural juices so the meat never dries out.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-brand-flame/20 flex items-center justify-center text-brand-flame shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Mobile Pit That Follows The Action</h4>
                    <p className="text-xs text-brand-muted">Stationed directly by the boundary line for the Interdepartmental Cup matches.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <Link
                  to="/menu"
                  className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs uppercase tracking-wider shadow-flame transition-all"
                >
                  Order From The Smoker
                </Link>
                <a
                  href="https://instagram.com/barbequepitstop"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-muted hover:text-white"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>Watch Reels @barbequepitstop</span>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#33333C] shadow-flame">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
                  alt="Custom Smoker Grill Bike"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-brand-flame uppercase font-bold">Stall Motto</p>
                    <p className="font-display text-lg text-white">"Good Meat Takes Time."</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-brand-muted">Bike Reg</p>
                    <p className="font-mono text-xs text-white font-bold">MH.03.PT.741</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interdepartmental Cup 2.0 Feature Banner */}
      <section id="event-cup" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-red via-brand-flame to-brand-red p-0.5 rounded-3xl shadow-flame-lg">
          <div className="bg-[#0F0F12] rounded-[22px] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/20 text-white text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Bharati Vidyapeeth Fest Official Partner</span>
              </div>
              <h3 className="font-display text-3xl sm:text-5xl text-white tracking-wide uppercase">
                Interdepartmental Cup 2.0
              </h3>
              <p className="text-xs sm:text-sm text-brand-cream/80 max-w-xl">
                Different Departments. One Battle. Fuel your department's cheering squad with hot BBQ! Check out our live department leaderboard in the admin analytics.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/menu"
                className="py-3 px-6 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-cream transition-colors text-center shadow-lg"
              >
                Order For Your Dept
              </Link>
              <a
                href="https://wa.me/918291794227?text=Hi%20BBQ%20Pit%20Stop,%20we%20want%20to%20place%20a%20bulk%20department%20order!"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors text-center"
              >
                Bulk Team Orders
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Reviews & Social Proof */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            Verified Customer Love
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase mt-1">
            Student <span className="text-brand-flame">Reviews</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Hear from Bharati Vidyapeeth students enjoying matches with our smoky cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-[#141418] border border-[#272730] p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-brand-flame/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-muted font-mono">{fb.orderId}</span>
                </div>

                <p className="text-xs text-brand-cream/90 italic leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {fb.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-semibold bg-brand-red/15 text-brand-red px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#202026]">
                <p className="font-bold text-xs text-white">{fb.customerName}</p>
                <p className="text-[10px] text-brand-flame font-medium">{fb.department}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customisation modal trigger */}
      <CustomizeModal
        item={selectedCustomItem}
        isOpen={Boolean(selectedCustomItem)}
        onClose={() => setSelectedCustomItem(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};
