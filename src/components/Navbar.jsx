import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Flame, ShoppingBag, Menu, X, Shield, Clock, Trophy, MapPin, Phone } from 'lucide-react';

export const Navbar = ({ onOpenCart }) => {
  const { cartCount, activeOrderId, settings } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#2A2A2E]">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-brand-red/90 via-brand-flame to-brand-red text-white py-1 px-4 text-xs font-semibold tracking-wider flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>LIVE AT THE INTERDEPARTMENTAL CUP 2.0 • BHARATI VIDYAPEETH</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px]">
          <span className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <a href="tel:+918291794227" className="hover:underline">+91 8291794227</a>
          </span>
          <span>|</span>
          <span className="text-amber-200">Tagline: "Come hungry, leave happy!"</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-flame p-0.5 shadow-flame group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0B0B] rounded-[10px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-brand-red animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-white">BBQ PIT STOP</span>
              <span className="text-xs font-bold text-brand-flame uppercase tracking-widest hidden sm:inline">SIDECAR</span>
            </div>
            <p className="text-[10px] text-brand-muted tracking-tight -mt-1 font-medium">CUSTOM SMOKER MOTORCYCLE</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive('/') ? 'text-brand-red bg-brand-red/10' : 'text-brand-cream hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive('/menu') ? 'text-brand-red bg-brand-red/10' : 'text-brand-cream hover:text-white hover:bg-white/5'
            }`}
          >
            Menu
          </Link>
          <a
            href="/#smoker-bike"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-cream hover:text-white hover:bg-white/5 transition-colors"
          >
            Smoker Bike
          </a>
          <a
            href="/#event-cup"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-cream hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1"
          >
            <Trophy className="w-3.5 h-3.5 text-brand-flame" />
            <span>Cup 2.0</span>
          </a>
          <a
            href="/#contact"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-cream hover:text-white hover:bg-white/5 transition-colors"
          >
            Contact
          </a>

          {/* Active order tracker pill */}
          {activeOrderId && (
            <Link
              to={`/track/${activeOrderId}`}
              className="ml-2 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-flame/15 text-brand-flame border border-brand-flame/40 flex items-center space-x-1.5 animate-pulse hover:bg-brand-flame/25 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Track {activeOrderId}</span>
            </Link>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Admin link */}
          <Link
            to="/admin"
            title="Admin Dashboard"
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-muted hover:text-white hover:bg-white/5 border border-[#2A2A2E] transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-flame" />
            <span>Admin</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-sm flex items-center space-x-2 shadow-flame hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-[#0B0B0B] text-brand-flame text-xs font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-brand-cream hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121214] border-b border-[#2A2A2E] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-cream hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-red bg-brand-red/10"
          >
            Browse Menu & Order
          </Link>
          <a
            href="/#smoker-bike"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-cream hover:bg-white/5"
          >
            Smoker Sidecar Story
          </a>
          <a
            href="/#event-cup"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-cream hover:bg-white/5"
          >
            Interdepartmental Cup 2.0
          </a>
          <a
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-cream hover:bg-white/5"
          >
            Location & Contact
          </a>
          {activeOrderId && (
            <Link
              to={`/track/${activeOrderId}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-brand-flame bg-brand-flame/15 border border-brand-flame/30"
            >
              🔥 Track Active Order ({activeOrderId})
            </Link>
          )}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-white"
          >
            Staff & Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};
