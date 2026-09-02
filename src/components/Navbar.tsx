import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  Gem,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { CURRENCIES } from '../data/mockData';
import { JewelryCategory } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartItemCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    currency,
    setCurrencyCode,
    formatPrice,
    filters,
    setFilters,
    products,
    setQuickViewProduct
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search preview items
  const searchResults = searchQuery.trim()
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.metalType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleCategorySelect = (category: JewelryCategory) => {
    setFilters(prev => ({ ...prev, category, searchQuery: '' }));
    setIsMobileMenuOpen(false);
    // Smooth scroll to catalog section
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery }));
    setIsSearchOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories: { label: string; value: JewelryCategory }[] = [
    { label: 'HOME', value: 'all' },
    { label: 'COLLECTIONS', value: 'all' },
    { label: 'RINGS', value: 'rings' },
    { label: 'NECKLACES', value: 'necklaces' },
    { label: 'EARRINGS', value: 'earrings' },
    { label: 'BRACELETS', value: 'bracelets' },
    { label: 'SOLITAIRES', value: 'solitaires' },
    { label: 'BRIDAL', value: 'bridal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5F4]/95 backdrop-blur-md border-b border-[#E8D7D4] transition-all">
      {/* Top Luxury Announcement Ribbon */}
      <div className="bg-[#2C1D1B] text-[#E8A598] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wider font-light">
          <div className="hidden sm:flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E09F95]" />
            <span>Complimentary Insured Worldwide Delivery | 100% BIS Hallmarked Pure Gold & GIA Diamonds</span>
          </div>
          <div className="sm:hidden text-center w-full">
            <span>Special Code <strong>KARAN10</strong> for 10% Off Fine Jewellery</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-[#E6D0CC]">
            <span>Promo: <strong className="text-white bg-[#422926] px-1.5 py-0.5 rounded text-[11px] font-mono">KARAN10</strong></span>
            <div className="h-3 w-px bg-white/20" />
            
            {/* Currency Selector */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                id="currency-selector-btn"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center space-x-1 hover:text-white transition font-medium cursor-pointer"
              >
                <span>{currency.code} ({currency.symbol})</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#2C1D1B] border border-[#523733] rounded-lg shadow-xl py-1 z-50">
                  {Object.values(CURRENCIES).map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrencyCode(curr.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#442C28] transition ${
                        currency.code === curr.code ? 'text-[#E8A598] font-semibold' : 'text-stone-300'
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="font-mono text-stone-400">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#2C1D1B] hover:bg-[#F3E6E4] transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Karan's Jewelry */}
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleCategorySelect('all'); }}
              className="group flex flex-col items-center select-none"
            >
              <div className="flex items-center space-x-2">
                <Gem className="w-6 h-6 text-[#C97A72] group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#2C1D1B] uppercase">
                  KARAN'S
                </span>
              </div>
              <span className="text-[10px] tracking-[0.35em] text-[#8C5D56] font-sans uppercase font-medium mt-0.5">
                LUXURY JEWELLERY
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {categories.map((cat, idx) => {
              const isActive = filters.category === cat.value && cat.label !== 'HOME';
              return (
                <button
                  key={idx}
                  id={`nav-cat-${cat.value}-${idx}`}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`text-xs tracking-[0.15em] font-medium transition-colors duration-200 py-1 border-b-2 cursor-pointer ${
                    isActive 
                      ? 'border-[#C97A72] text-[#C97A72] font-semibold' 
                      : 'border-transparent text-[#4A3B39] hover:text-[#C97A72]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon & Dropdown */}
            <div className="relative">
              <button
                id="search-toggle-btn"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2 rounded-full text-[#4A3B39] hover:text-[#C97A72] hover:bg-[#F3E6E4] transition"
                aria-label="Search jewelry catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Quick Search Overlay Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#E8D7D4] rounded-2xl shadow-2xl p-4 z-50">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search solitaires, rings, gold, emerald..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#2C1D1B] focus:outline-none focus:border-[#C97A72] focus:ring-1 focus:ring-[#C97A72]"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>

                  {/* Search Results Preview */}
                  {searchResults.length > 0 && (
                    <div className="mt-3 divide-y divide-stone-100 max-h-64 overflow-y-auto">
                      <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase py-1">Quick Matches</p>
                      {searchResults.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setQuickViewProduct(item);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center space-x-3 py-2 px-1 hover:bg-[#FAF5F4] rounded-lg cursor-pointer transition"
                        >
                          <img 
                            src={item.images[0]} 
                            alt={item.title} 
                            className="w-10 h-10 object-cover rounded-md border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#2C1D1B] truncate">{item.title}</p>
                            <p className="text-[11px] text-[#C97A72] font-medium">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery.trim() && searchResults.length === 0 && (
                    <p className="text-xs text-stone-500 py-3 text-center">No jewelry found matching "{searchQuery}"</p>
                  )}

                  <div className="mt-3 pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-[#C97A72] font-semibold hover:underline"
                    >
                      View All Results &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="wishlist-drawer-toggle-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 rounded-full text-[#4A3B39] hover:text-[#C97A72] hover:bg-[#F3E6E4] transition"
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D97D74] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-[#2C1D1B] text-white hover:bg-[#442C28] px-3.5 py-2 rounded-full transition-all duration-200 shadow-sm group"
              aria-label={`Shopping bag (${cartItemCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 text-[#E8A598] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">{cartItemCount}</span>
              {cartItemCount > 0 && (
                <span className="hidden sm:inline-block text-xs font-light text-stone-300 pl-1 border-l border-white/20">
                  {formatPrice(cartSubtotal)}
                </span>
              )}
            </button>

            {/* Admin Panel Toggle Button */}
            <button
              id="admin-panel-toggle-btn"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 border border-[#C97A72]/40 text-[#843933] hover:bg-[#C97A72] hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              title="Catalog, Stock & Order Management Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8D7D4] bg-[#FAF5F4] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold px-2">Jewelry Collections</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategorySelect(cat.value)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  filters.category === cat.value
                    ? 'bg-[#C97A72] text-white'
                    : 'bg-white text-[#4A3B39] hover:bg-[#F3E6E4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8D7D4] flex justify-between items-center px-2">
            <span className="text-xs text-stone-500 font-medium">Currency</span>
            <div className="flex space-x-1">
              {Object.values(CURRENCIES).map(curr => (
                <button
                  key={curr.code}
                  onClick={() => setCurrencyCode(curr.code)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currency.code === curr.code ? 'bg-[#2C1D1B] text-white' : 'bg-white text-stone-700'
                  }`}
                >
                  {curr.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
