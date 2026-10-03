import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const StickyCartBar = ({ onOpenCart }) => {
  const { cartCount, cartTotal } = useStore();
  const location = useLocation();

  // Don't show sticky bar on checkout page or if cart is empty
  if (cartCount === 0 || location.pathname === '/checkout') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden animate-slide-up pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto bg-gradient-to-r from-brand-red via-brand-flame to-brand-red p-0.5 rounded-2xl shadow-flame-lg">
        <button
          onClick={onOpenCart}
          className="w-full bg-[#121215] px-4 py-3 rounded-[14px] flex items-center justify-between text-white active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-red/20 border border-brand-red/50 flex items-center justify-center text-brand-flame">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                <span className="text-brand-muted text-xs">•</span>
                <span className="font-extrabold text-brand-flame text-sm">₹{cartTotal}</span>
              </div>
              <p className="text-[10px] text-brand-muted">Fresh from the sidecar smoker</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 font-bold text-xs uppercase tracking-wider text-brand-cream bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span>View Cart</span>
            <ChevronRight className="w-4 h-4 text-brand-flame" />
          </div>
        </button>
      </div>
    </div>
  );
};
