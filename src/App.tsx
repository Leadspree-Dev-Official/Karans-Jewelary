import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { BrandFeatures } from './components/BrandFeatures';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RingSizeGuideModal } from './components/RingSizeGuideModal';
import { SecureCheckoutModal } from './components/SecureCheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { JewelryCategory, MetalType } from './types';
import { 
  Filter, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw, 
  SlidersHorizontal,
  Check,
  Search,
  ShieldCheck,
  Star
} from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const {
    filteredProducts,
    filters,
    setFilters,
    resetFilters,
    products,
    formatPrice
  } = useStore();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Category counts
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCategorySelect = (category: JewelryCategory | 'all') => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleMetalSelect = (metalType: MetalType | 'all') => {
    setFilters(prev => ({ ...prev, metalType }));
  };

  const handleSortChange = (sortBy: any) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  return (
    <div className="min-h-screen bg-[#FDF9F8] text-[#2C1D1B] flex flex-col font-sans selection:bg-[#E8A598] selection:text-[#2C1D1B] pb-20 md:pb-0">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Carousel Section */}
      <HeroBanner />

      {/* Category Icons Row (from reference image) */}
      <CategoryShowcase />

      {/* Main Catalog Showcase Section */}
      <section id="catalog-section" className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 gap-4 border-b border-[#E8D7D4] pb-5 sm:pb-6">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C97A72] font-bold">
              CURATED SHOWROOM
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#2C1D1B] font-normal">
              Fine Jewellery Collection
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Handcrafted in certified 18K/22K gold, platinum, and ethical conflict-free diamonds.
            </p>
          </div>

          {/* Quick Filter & Sort Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto justify-between md:justify-end">
            {/* Sort dropdown */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E8D7D4] shadow-xs">
              <ArrowUpDown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-stone-500" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-[11px] sm:text-xs font-semibold text-[#2C1D1B] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Pieces</option>
                <option value="bestseller">Bestsellers First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Creations</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-medium text-stone-700 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E8D7D4] cursor-pointer shadow-xs">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="rounded accent-[#D97D74]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 sm:pb-4 mb-5 sm:mb-8 no-scrollbar">
          {[
            { id: 'all', label: `All Creations (${products.length})` },
            { id: 'rings', label: `Rings (${categoryCounts['rings'] || 0})` },
            { id: 'necklaces', label: `Necklaces (${categoryCounts['necklaces'] || 0})` },
            { id: 'earrings', label: `Earrings (${categoryCounts['earrings'] || 0})` },
            { id: 'bracelets', label: `Bracelets (${categoryCounts['bracelets'] || 0})` },
            { id: 'solitaires', label: `Solitaires (${categoryCounts['solitaires'] || 0})` },
            { id: 'bridal', label: `Bridal (${categoryCounts['bridal'] || 0})` },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id as any)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                filters.category === cat.id
                  ? 'bg-[#2C1D1B] text-white shadow-md'
                  : 'bg-white border border-[#E8D7D4] text-stone-700 hover:border-[#C97A72] hover:text-[#2C1D1B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Metal Type Filter Pills */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-6 sm:mb-8 text-xs overflow-x-auto pb-1 no-scrollbar">
          <span className="text-stone-500 font-medium mr-1 text-[11px] sm:text-xs shrink-0">Precious Metal:</span>
          {['all', 'Rose Gold', 'Yellow Gold', 'White Gold', 'Platinum'].map(metal => (
            <button
              key={metal}
              onClick={() => handleMetalSelect(metal as any)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition text-[11px] sm:text-xs cursor-pointer whitespace-nowrap shrink-0 ${
                filters.metalType === metal
                  ? 'bg-[#E8A598]/30 border border-[#C97A72] text-[#843933] font-bold'
                  : 'text-stone-600 hover:text-stone-900 border border-transparent'
              }`}
            >
              {metal === 'all' ? 'All Metals' : metal}
            </button>
          ))}

          {(filters.category !== 'all' || filters.metalType !== 'all' || filters.searchQuery || filters.inStockOnly) && (
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center space-x-1 text-[#C97A72] hover:text-[#843933] font-semibold text-[11px] sm:text-xs transition shrink-0 pl-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Product Grid - 1 row 2 products on mobile */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-[#E8D7D4] p-6 sm:p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF5F4] flex items-center justify-center mx-auto text-[#C97A72]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C1D1B]">No Matching Pieces Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any jewelry piece matching your active filters. Try resetting the search terms or categories.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-[#2C1D1B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* Brand Features (from user reference image: "EXCLUSIVE COLLECTION - Crafted for Every Moment") */}
      <BrandFeatures />

      {/* Customer Review System (Stories of Brilliance & Trust) */}
      <CustomerReviewsSection />

      {/* Footer */}
      <Footer />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Sidebars, Drawers and Global Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductQuickViewModal />
      <ProductDetailModal />
      <RingSizeGuideModal />
      <SecureCheckoutModal />
      <AdminPanel />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainStoreContent />
    </StoreProvider>
  );
}
