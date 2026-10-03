import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, FLAVOURS } from '../data/menuData';
import { CustomizeModal } from '../components/CustomizeModal';
import {
  Search,
  Flame,
  Plus,
  Filter,
  Sparkles,
  Drumstick,
  Utensils,
  Sandwich,
  Zap,
  Bone,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';

const CATEGORY_ICONS = {
  all: Flame,
  chicken: Drumstick,
  wings: Sparkles,
  drumsticks: Bone,
  'full-leg': Zap,
  wraps: Sandwich,
  hotdogs: Utensils,
  extras: PlusCircle,
};

export const MenuPage = () => {
  const { menuItems, addToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFlavour, setSelectedFlavour] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomItem, setSelectedCustomItem] = useState(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Flavour filter
      if (selectedFlavour !== 'all' && item.flavour !== selectedFlavour) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesFlavour = item.flavour?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesFlavour;
      }
      return true;
    });
  }, [menuItems, selectedCategory, selectedFlavour, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#25252D] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-red text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-flame" />
            <span>Bharati Vidyapeeth Event Menu</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wide uppercase mt-1">
            Pit Stop <span className="text-brand-flame">Menu Card</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/80 mt-1">
            Slow-smoked chicken cuts, wings, and loaded wraps charred over natural coals. (All items non-veg)
          </p>
        </div>

        {/* Quick Flavour Badges Indicator */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-brand-muted">
          <span className="font-bold text-white text-[11px] uppercase mr-1">Flavours:</span>
          <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30 text-[10px] font-semibold">Tandoori</span>
          <span className="px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-500/30 text-[10px] font-semibold">Peri Peri</span>
          <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">BBQ</span>
          <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 text-[10px] font-semibold">Sweet Chilli</span>
        </div>
      </div>

      {/* Search and Flavour Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken, wings, wraps, flavours..."
              className="w-full bg-[#141418] border border-[#272730] focus:border-brand-flame rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-brand-muted outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Flavour Filter Chips */}
          <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-2 shrink-0 scrollbar-none">
            {FLAVOURS.map((flv) => {
              const active = selectedFlavour === flv.id;
              return (
                <button
                  key={flv.id}
                  onClick={() => setSelectedFlavour(flv.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-brand-red text-white border-brand-red shadow-flame-sm'
                      : 'bg-[#16161B] text-brand-muted border-[#272730] hover:text-white hover:border-[#444]'
                  }`}
                >
                  {flv.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#202026]">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Flame;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  active
                    ? 'bg-gradient-to-r from-brand-red to-brand-flame text-white shadow-flame-sm'
                    : 'bg-[#141418] text-brand-cream/80 hover:text-white hover:bg-[#1E1E24] border border-[#26262F]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-brand-flame'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#25252E] space-y-3">
          <AlertCircle className="w-10 h-10 text-brand-muted mx-auto" />
          <h3 className="font-heading text-xl text-white">No items found</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            We couldn't find any items matching your filters. Try clearing your search or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFlavour('all');
            }}
            className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold uppercase"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isSoldOut = !item.available;
            return (
              <div
                key={item.id}
                className={`bg-[#141418] border border-[#272730] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 group ${
                  isSoldOut
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-brand-red/50 hover:shadow-flame-sm'
                }`}
              >
                {/* Item Image */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#1A1A20]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {item.flavour && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-brand-flame border border-brand-flame/30">
                        {item.flavour}
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-brand-red text-white">
                        POPULAR
                      </span>
                    )}
                  </div>

                  {isSoldOut ? (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-xs uppercase tracking-widest shadow-lg">
                        SOLD OUT FOR TODAY
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-3 font-display text-2xl text-white">
                      ₹{item.price}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-flame transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#202026]">
                    <span className="text-[11px] text-brand-muted font-medium">
                      {item.pieces || (item.portionOptions ? 'Portion Choice' : 'Fresh Smoked')}
                    </span>

                    <button
                      disabled={isSoldOut}
                      onClick={() => setSelectedCustomItem(item)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                        isSoldOut
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-brand-red to-brand-flame hover:brightness-110 text-white shadow-flame-sm hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{item.customizable ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Customisation Modal */}
      <CustomizeModal
        item={selectedCustomItem}
        isOpen={Boolean(selectedCustomItem)}
        onClose={() => setSelectedCustomItem(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};
