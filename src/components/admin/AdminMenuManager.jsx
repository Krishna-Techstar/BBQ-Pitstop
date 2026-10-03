import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, FLAVOURS } from '../../data/menuData';
import { Plus, Edit2, Trash2, Check, X, Flame, Image, Sparkles } from 'lucide-react';

export const AdminMenuManager = () => {
  const { menuItems, addMenuItem, updateMenuItem, toggleItemAvailability, deleteMenuItem } = useStore();
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'chicken',
    flavour: 'Tandoori',
    price: 150,
    pieces: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isBestSeller: false,
    available: true,
  });

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      flavour: item.flavour || 'Tandoori',
      price: item.price,
      pieces: item.pieces || '',
      description: item.description || '',
      image: item.image || '',
      isBestSeller: Boolean(item.isBestSeller),
      available: item.available !== false,
    });
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      name: '',
      category: 'chicken',
      flavour: 'Tandoori',
      price: 160,
      pieces: 'Smoked Portion',
      description: 'Hickory smoked over charcoal pit',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      isBestSeller: false,
      available: true,
    });
    setIsCreating(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isCreating) {
      addMenuItem({
        ...form,
        price: Number(form.price),
      });
      setIsCreating(false);
    } else if (editingItem) {
      updateMenuItem(editingItem.id, {
        ...form,
        price: Number(form.price),
      });
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
            Menu Catalog Manager ({menuItems.length} items)
          </h3>
          <p className="text-xs text-brand-muted">
            Update pricing, switch sold-out toggles, and add event specials
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-flame text-white font-bold text-xs uppercase tracking-wider shadow-flame flex items-center space-x-2 w-fit hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Item Modal Form (Create / Edit) */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#2D2D37] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#25252E] pb-3">
              <h4 className="font-heading font-bold text-white text-base uppercase">
                {isCreating ? 'Add New Menu Item' : `Edit "${editingItem.name}"`}
              </h4>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="text-brand-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-brand-cream font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none focus:border-brand-flame"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-cream font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-brand-cream font-semibold mb-1">Flavour Marinade</label>
                  <select
                    value={form.flavour}
                    onChange={(e) => setForm({ ...form, flavour: e.target.value })}
                    className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {FLAVOURS.filter((f) => f.id !== 'all').map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-cream font-semibold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-brand-cream font-semibold mb-1">Portion / Pieces Tag</label>
                  <input
                    type="text"
                    value={form.pieces}
                    onChange={(e) => setForm({ ...form, pieces: e.target.value })}
                    placeholder="e.g. 6 pcs, Full Breast"
                    className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-cream font-semibold mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-brand-cream font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1A1A20] border border-[#30303A] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="accent-brand-flame"
                  />
                  <span className="text-white font-medium">Highlight as Best Seller</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="accent-emerald-400"
                  />
                  <span className="text-white font-medium">Available (In Stock)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#202026] text-brand-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="bg-[#141418] border border-[#272730] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A20] text-brand-muted uppercase font-heading tracking-wider border-b border-[#25252E]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Flavour</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202026] text-brand-cream">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#18181E] transition-colors">
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white text-xs">{item.name}</p>
                      <p className="text-[10px] text-brand-muted line-clamp-1">{item.pieces || item.description}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4 uppercase text-[11px] font-mono text-brand-muted">
                    {item.category}
                  </td>

                  <td className="py-3 px-4">
                    {item.flavour ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-red/15 text-brand-red border border-brand-red/25">
                        {item.flavour}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                    ₹{item.price}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        item.available
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                          : 'bg-red-950 text-red-300 border border-red-500/40 hover:bg-red-900'
                      }`}
                    >
                      {item.available ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-[#202026] hover:bg-[#2C2C36] text-brand-cream transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-1.5 rounded-lg bg-[#202026] hover:bg-red-950 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
