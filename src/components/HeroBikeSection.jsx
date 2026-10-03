import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Sparkles, MapPin, Trophy, ShieldCheck, Zap } from 'lucide-react';

export const HeroBikeSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0B] pt-8 pb-16 lg:py-20 bg-grain">
      {/* Dynamic ambient red and flame glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-brand-flame/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Event Badge with pulsing dot */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#18181D] border border-brand-red/40 shadow-flame-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-brand-cream uppercase">
                Live at Interdepartmental Cup 2.0
              </span>
              <Trophy className="w-3.5 h-3.5 text-brand-flame" />
            </div>

            {/* Giant Display Headline */}
            <div className="space-y-2">
              <div className="inline-block brush-badge px-4 py-1 text-white font-heading font-extrabold text-sm sm:text-base tracking-widest uppercase mb-1">
                Custom Smoker Sidecar Motorcycle
              </div>
              <h1 className="font-display text-4xl xs:text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.95] sm:leading-[0.9] break-words">
                NEW <span className="text-brand-red text-flame-glow">BBQ</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-flame via-amber-300 to-brand-cream">
                  PREMIUM TASTE.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-cream/80 max-w-xl font-normal leading-relaxed pt-2">
                Authentic charcoal-smoked chicken, spicy wings, and loaded cheese wraps prepared live in our custom motorcycle smoker. 
                <span className="text-brand-flame font-semibold italic"> "Good Meat Takes Time"</span> — Come hungry, leave happy!
              </p>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg pt-2">
              <div className="bg-[#141418] border border-[#27272F] p-3 rounded-xl text-center">
                <p className="text-brand-flame font-display text-xl sm:text-2xl">100%</p>
                <p className="text-[11px] text-brand-muted font-medium">Hickory Charcoal</p>
              </div>
              <div className="bg-[#141418] border border-[#27272F] p-3 rounded-xl text-center">
                <p className="text-amber-400 font-display text-xl sm:text-2xl">MH-03</p>
                <p className="text-[11px] text-brand-muted font-medium">Smoker Bike Reg</p>
              </div>
              <div className="bg-[#141418] border border-[#27272F] p-3 rounded-xl text-center">
                <p className="text-brand-red font-display text-xl sm:text-2xl">4.9 ★</p>
                <p className="text-[11px] text-brand-muted font-medium">Campus Rated</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <Link
                to="/menu"
                className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red text-white font-bold text-base tracking-wide shadow-flame hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#smoker-bike"
                className="py-3.5 px-6 rounded-xl bg-[#16161A] hover:bg-[#202026] text-brand-cream border border-[#2F2F38] font-bold text-sm tracking-wide transition-colors text-center flex items-center justify-center space-x-2"
              >
                <span>The Smoker Story</span>
                <Flame className="w-4 h-4 text-brand-flame" />
              </a>
            </div>

            {/* Campus Event Info Note */}
            <div className="flex items-center space-x-2 text-xs text-brand-muted pt-1">
              <MapPin className="w-4 h-4 text-brand-red shrink-0" />
              <span>Bharati Vidyapeeth University, Kharghar • Ground Side Stalls</span>
            </div>
          </div>

          {/* Right Column: Smoker Bike Artwork & Visual Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glowing Frame Container */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-brand-red via-brand-flame to-transparent shadow-flame-lg">
                <div className="relative rounded-[22px] overflow-hidden bg-[#121215]">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85"
                    alt="BBQ Pit Stop Custom Smoker Grill"
                    className="w-full h-80 sm:h-96 object-cover object-center filter contrast-110"
                  />
                  
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/30 to-transparent"></div>

                  {/* Bike Spec Card Badge Floating */}
                  <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md border border-brand-flame/50 px-3 py-1.5 rounded-xl shadow-lg">
                    <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">Royal Enfield Bullet</p>
                    <p className="font-mono font-bold text-white text-xs">MH.03.PT.741</p>
                  </div>

                  {/* Food & smoke callouts on card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-brand-flame text-xs font-bold">
                        <Flame className="w-4 h-4 fill-brand-flame" />
                        <span>Smoky Outside</span>
                      </div>
                      <p className="font-display text-xl text-white tracking-wide">
                        Juicy & Tender Inside
                      </p>
                    </div>
                    <Link
                      to="/menu"
                      className="px-3.5 py-2 rounded-lg bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                    >
                      Taste It
                    </Link>
                  </div>
                </div>
              </div>

              {/* Red brush banner decorative underlay */}
              <div className="absolute -bottom-5 -left-4 bg-brand-red text-white font-display text-lg tracking-wider px-4 py-1 rounded shadow-flame transform -rotate-3 z-20">
                FRESHLY CHARRED TO ORDER
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
