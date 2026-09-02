import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const {
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    filters,
    setFilters
  } = useStore();

  const handleHomeClick = () => {
    setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogClick = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5F4]/95 backdrop-blur-xl border-t border-[#E8D7D4] px-2 py-1.5 shadow-[0_-8px_25px_rgba(44,29,27,0.08)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        
        {/* Tab 1: Home / Explore */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          id="mobile-nav-home-btn"
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer group"
          aria-label="Home"
        >
          <div className="relative p-1">
            <Home className="w-5 h-5 text-[#2C1D1B] group-hover:text-[#C97A72] transition-colors" />
          </div>
          <span className="text-[10px] font-medium tracking-tight text-[#2C1D1B] mt-0.5">
            Home
          </span>
        </motion.button>

        {/* Tab 2: Catalog / Collections */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          id="mobile-nav-catalog-btn"
          type="button"
          onClick={handleCatalogClick}
          className="flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer group"
          aria-label="Jewellery Catalog"
        >
          <div className="relative p-1">
            <SlidersHorizontal className="w-5 h-5 text-stone-600 group-hover:text-[#C97A72] transition-colors" />
          </div>
          <span className="text-[10px] font-medium tracking-tight text-stone-600 mt-0.5 group-hover:text-[#C97A72]">
            Catalog
          </span>
        </motion.button>

        {/* Tab 3: Wishlist */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          id="mobile-nav-wishlist-btn"
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer group relative"
          aria-label={`Wishlist with ${wishlist.length} items`}
        >
          <div className="relative p-1">
            <Heart className={`w-5 h-5 transition-colors ${
              wishlist.length > 0 ? 'text-[#D97D74] fill-[#D97D74]/20' : 'text-stone-600 group-hover:text-[#C97A72]'
            }`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-[#D97D74] text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
            wishlist.length > 0 ? 'text-[#D97D74] font-semibold' : 'text-stone-600 group-hover:text-[#C97A72]'
          }`}>
            Wishlist
          </span>
        </motion.button>

        {/* Tab 4: Cart / Bag */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          id="mobile-nav-cart-btn"
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer group relative"
          aria-label={`Cart with ${cartItemCount} items`}
        >
          <div className="relative p-1">
            <div className={`p-1 rounded-full transition-colors ${
              cartItemCount > 0 ? 'bg-[#2C1D1B] text-[#E8A598]' : 'text-stone-600 group-hover:text-[#2C1D1B]'
            }`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#D97D74] text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs border border-white">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
            cartItemCount > 0 ? 'text-[#2C1D1B] font-bold' : 'text-stone-600 group-hover:text-[#2C1D1B]'
          }`}>
            Bag
          </span>
        </motion.button>

        {/* Tab 5: Admin Panel / ERP */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          id="mobile-nav-admin-btn"
          type="button"
          onClick={() => setIsAdminOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer group"
          aria-label="Admin Portal"
        >
          <div className="relative p-1">
            <ShieldCheck className="w-5 h-5 text-[#843933] group-hover:text-[#C97A72] transition-colors" />
          </div>
          <span className="text-[10px] font-medium tracking-tight text-[#843933] mt-0.5">
            Admin
          </span>
        </motion.button>

      </div>
    </div>
  );
};
