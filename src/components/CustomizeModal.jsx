import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Sparkles, Check } from 'lucide-react';
import { FLAVOURS } from '../data/menuData';

export const CustomizeModal = ({ item, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !item) return null;

  // Portion/size selection (if item has portionOptions)
  const [selectedPortion, setSelectedPortion] = useState(
    item.portionOptions ? item.portionOptions[0] : null
  );

  // Flavour selection
  const availableFlavours = ['Tandoori', 'Peri Peri', 'BBQ', 'Sweet Chilli'];
  const [selectedFlavour, setSelectedFlavour] = useState(item.flavour || 'Tandoori');

  // Addons: Cheese (+40), Sauce Dip (+20)
  const [addons, setAddons] = useState({
    cheese: false,
    sauce: false,
  });

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Special instructions
  const [instructions, setInstructions] = useState('');

  // Reset when item changes
  useEffect(() => {
    if (item) {
      setSelectedPortion(item.portionOptions ? item.portionOptions[0] : null);
      setSelectedFlavour(item.flavour || 'Tandoori');
      setAddons({ cheese: false, sauce: false });
      setQuantity(1);
      setInstructions('');
    }
  }, [item]);

  // Compute live price
  const basePrice = selectedPortion ? selectedPortion.price : item.price;
  const addonsPrice = (addons.cheese ? 40 : 0) + (addons.sauce ? 20 : 0);
  const unitPrice = basePrice + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const selectedAddonsList = [];
    if (addons.cheese) selectedAddonsList.push({ name: 'Extra Cheese', price: 40 });
    if (addons.sauce) selectedAddonsList.push({ name: 'Smoky Sauce Dip', price: 20 });

    onAddToCart(item, {
      portion: selectedPortion,
      flavour: selectedFlavour,
      addons: selectedAddonsList,
      instructions: instructions.trim(),
      qty: quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#141417] border border-[#2D2D34] w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-flame max-h-[92vh] flex flex-col">
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0 bg-[#1D1D22]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-black/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand-red text-white mb-1 shadow-md">
              {item.flavour || 'Smoked Special'}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-brand-cream/80 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customisation Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Portion/Size Selector if applicable */}
          {item.portionOptions && (
            <div className="space-y-2">
              <label className="font-heading font-bold text-white uppercase tracking-wider text-xs flex items-center space-x-1">
                <span>Select Portion Size</span>
                <span className="text-brand-red">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.portionOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedPortion(opt)}
                    className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                      selectedPortion?.name === opt.name
                        ? 'border-brand-red bg-brand-red/10 text-white shadow-flame-sm'
                        : 'border-[#2D2D34] bg-[#1A1A1F] text-brand-muted hover:border-[#444]'
                    }`}
                  >
                    <span className="font-semibold text-sm">{opt.name}</span>
                    <span className="text-brand-flame font-bold">₹{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavour selection */}
          {item.category !== 'extras' && (
            <div className="space-y-2">
              <label className="font-heading font-bold text-white uppercase tracking-wider text-xs flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-brand-flame" />
                <span>Choose Flavour Marinade</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFlavours.map((flv) => {
                  const isSelected = selectedFlavour === flv;
                  return (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setSelectedFlavour(flv)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-brand-flame bg-brand-flame/10 text-white shadow-flame-sm'
                          : 'border-[#2D2D34] bg-[#1A1A1F] text-brand-muted hover:border-[#444]'
                      }`}
                    >
                      <span className="font-medium text-xs">{flv}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-flame" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          <div className="space-y-2">
            <label className="font-heading font-bold text-white uppercase tracking-wider text-xs flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Add-ons</span>
            </label>
            <div className="space-y-2">
              <div
                onClick={() => setAddons((prev) => ({ ...prev, cheese: !prev.cheese }))}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  addons.cheese
                    ? 'border-amber-500/80 bg-amber-500/10 text-white'
                    : 'border-[#2D2D34] bg-[#1A1A1F] text-brand-cream/80 hover:border-[#444]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${addons.cheese ? 'bg-amber-500 border-amber-500 text-black' : 'border-[#444]'}`}>
                    {addons.cheese && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Extra Melted Cheese Layer</p>
                    <p className="text-[11px] text-brand-muted">Gooey molten cheddar & mozzarella blend</p>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm">+₹40</span>
              </div>

              <div
                onClick={() => setAddons((prev) => ({ ...prev, sauce: !prev.sauce }))}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  addons.sauce
                    ? 'border-brand-red/80 bg-brand-red/10 text-white'
                    : 'border-[#2D2D34] bg-[#1A1A1F] text-brand-cream/80 hover:border-[#444]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${addons.sauce ? 'bg-brand-red border-brand-red text-white' : 'border-[#444]'}`}>
                    {addons.sauce && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Extra Smoky Sauce Dip (Pitmaster Special)</p>
                    <p className="text-[11px] text-brand-muted">Secret house spicy barbecue & mayo concoction</p>
                  </div>
                </div>
                <span className="font-bold text-brand-flame text-sm">+₹20</span>
              </div>
            </div>
          </div>

          {/* Special instructions */}
          <div className="space-y-1.5">
            <label className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Special Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra spicy, crisp sausages, separate sauce..."
              className="w-full bg-[#1A1A1F] border border-[#2D2D34] focus:border-brand-flame rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-brand-muted/60 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Footer with quantity and dynamic Add to Cart button */}
        <div className="p-4 sm:p-5 bg-[#101013] border-t border-[#2A2A30] flex items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center bg-[#1A1A1F] border border-[#2D2D34] rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-red via-brand-flame to-brand-red text-white font-bold text-sm tracking-wide shadow-flame hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <span>Add to Cart</span>
            <span className="font-extrabold text-base bg-black/30 px-2.5 py-0.5 rounded-lg">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
