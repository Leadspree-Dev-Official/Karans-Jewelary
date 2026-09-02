import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickViewProduct
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E8D7D4]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8D7D4] flex items-center justify-between bg-[#FAF5F4]">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-[#D97D74] fill-current" />
            <h3 className="font-serif text-lg font-bold text-[#2C1D1B]">
              Your Saved Pieces ({wishlist.length})
            </h3>
          </div>
          <button
            id="close-wishlist-drawer-btn"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF5F4] flex items-center justify-center text-stone-300">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#2C1D1B]">No Saved Pieces Yet</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Click the heart icon on any jewelry piece to save it to your private showroom wishlist.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#2C1D1B] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            wishlist.map(product => (
              <div key={product.id} className="pt-4 first:pt-0 flex space-x-4">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-xl border border-stone-200 cursor-pointer"
                  onClick={() => {
                    setQuickViewProduct(product);
                    setIsWishlistOpen(false);
                  }}
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <h5 
                      onClick={() => {
                        setQuickViewProduct(product);
                        setIsWishlistOpen(false);
                      }}
                      className="font-serif text-xs font-semibold text-[#2C1D1B] truncate pr-2 hover:text-[#C97A72] cursor-pointer"
                    >
                      {product.title}
                    </h5>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="text-stone-400 hover:text-red-600 transition"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#8C5D56] font-medium">
                    {product.metalPurity} {product.metalType} &bull; {product.diamondWeight || 'Fine Gemstone'}
                  </p>

                  <p className="font-serif text-sm font-bold text-[#2C1D1B] pt-0.5">
                    {formatPrice(product.price)}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        addToCart(product, product.metalType, product.availableSizes?.[0] || '7', 1);
                      }}
                      disabled={product.stockCount <= 0}
                      className="w-full py-2 px-3 rounded-lg border border-[#E09F95] text-[#843933] bg-white hover:bg-[#D97D74] hover:text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stockCount <= 0 ? 'Sold Out' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-5 border-t border-[#E8D7D4] bg-[#FAF5F4]">
            <button
              onClick={() => {
                wishlist.forEach(p => {
                  if (p.stockCount > 0) {
                    addToCart(p, p.metalType, p.availableSizes?.[0] || '7', 1);
                  }
                });
                setIsWishlistOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
            >
              <span>Add All Available to Bag</span>
              <ArrowRight className="w-4 h-4 text-[#E8A598]" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
