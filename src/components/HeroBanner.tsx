import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Shield, Truck, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setFilters, setQuickViewProduct, products } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      subtitle: 'TIMELESS BEAUTY. PRECIOUS YOU.',
      titleLine1: 'Elegance That',
      titleHighlight: 'Lasts Forever',
      desc: 'Discover our exclusive collection of fine jewellery crafted with perfection and passion. Certified solitaire diamonds, BIS hallmarked gold, and bespoke artistry.',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      featuredProductSku: 'KJ-RNG-002',
      badge: 'Flagship Signature 18K Rose Gold'
    },
    {
      subtitle: 'THE SOLITAIRE MASTERPIECE',
      titleLine1: 'Crafted for Pure',
      titleHighlight: 'Radiance',
      desc: 'Hand-selected conflict-free diamonds cut with mathematical precision to maximize brilliance, fire, and scintillation in 18K solid precious metals.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      featuredProductSku: 'KJ-RNG-001',
      badge: 'GIA & SGL Certified 0.75 ct'
    },
    {
      subtitle: 'HERITAGE BRIDAL SUITE',
      titleLine1: 'Adorned for Your',
      titleHighlight: 'Special Day',
      desc: 'Grand necklaces, cascading chandelier drops, and handcrafted heirloom suites tailored for memorable wedding moments.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      featuredProductSku: 'KJ-NCK-001',
      badge: 'Bespoke Artisan Setting'
    }
  ];

  const currentSlide = heroSlides[activeSlide];

  const handleExploreClick = () => {
    setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroItemClick = () => {
    const matched = products.find(p => p.sku === currentSlide.featuredProductSku);
    if (matched) {
      setQuickViewProduct(matched);
    } else if (products.length > 0) {
      setQuickViewProduct(products[0]);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF2F0] via-[#FAF5F4] to-[#FAF5F4] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#E8D7D4]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#F5D8D3]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#FBE5E1]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <motion.div
              key={`subtitle-${activeSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 text-[#C97A72] text-xs font-bold tracking-[0.25em] uppercase"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentSlide.subtitle}</span>
            </motion.div>

            <motion.h1
              key={`title-${activeSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2C1D1B] font-normal leading-[1.15]"
            >
              {currentSlide.titleLine1} <br />
              <span className="italic font-normal text-[#C97A72] relative">
                {currentSlide.titleHighlight}
                <svg 
                  className="absolute -bottom-2 left-0 w-full text-[#E09F95]/50 h-2" 
                  viewBox="0 0 100 20" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              key={`desc-${activeSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal"
            >
              {currentSlide.desc}
            </motion.p>

            <motion.div
              key={`btn-${activeSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <button
                id="hero-explore-collection-btn"
                onClick={handleExploreClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#D97D74] hover:bg-[#C96B62] text-white font-medium rounded-full text-xs tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#D97D74]/30 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-quick-view-btn"
                onClick={handleHeroItemClick}
                className="w-full sm:w-auto px-6 py-3.5 border border-[#E09F95] text-[#2C1D1B] hover:bg-white/80 font-medium rounded-full text-xs tracking-widest uppercase transition-all duration-200"
              >
                View Featured Piece
              </button>
            </motion.div>
          </div>

          {/* Right Hero Visual Showcase with Ring & Slider */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Side numerical indicators as in screenshot (01, 02, 03) */}
            <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-3">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  id={`hero-slide-indicator-${idx}`}
                  onClick={() => setActiveSlide(idx)}
                  className={`text-xs font-mono tracking-wider transition-all duration-300 flex items-center space-x-2 ${
                    activeSlide === idx 
                      ? 'text-[#C97A72] font-bold scale-110' 
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span className={`h-px transition-all ${activeSlide === idx ? 'w-4 bg-[#C97A72]' : 'w-2 bg-stone-300'}`} />
                  <span>0{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Circular Glowing Canvas Container */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-3 bg-gradient-to-tr from-[#F8DEDB]/80 via-[#FFF0EE] to-[#FFF5F4] shadow-2xl border border-[#F0D5D0]">
              <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-white">
                <motion.img
                  key={`hero-img-${activeSlide}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={currentSlide.image}
                  alt="Karan's Luxury Fine Jewellery"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                  onClick={handleHeroItemClick}
                  referrerPolicy="no-referrer"
                />

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8D7D4] shadow-md flex items-center space-x-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#D97D74] animate-ping" />
                  <span className="text-[11px] font-semibold text-[#2C1D1B] tracking-wide">{currentSlide.badge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Signature Trust Badges from the design screenshot */}
        <div className="mt-12 pt-8 border-t border-[#E8D7D4]/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Badge 1: Certified Diamonds */}
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#E8D7D4] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#F8DEDB]/60 flex items-center justify-center text-[#C97A72] flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#2C1D1B] uppercase">CERTIFIED DIAMONDS</h4>
              <p className="text-xs text-stone-500 font-normal mt-0.5">100% Genuine Conflict-Free Diamonds</p>
            </div>
          </div>

          {/* Badge 2: BIS Hallmarked */}
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#E8D7D4] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#F8DEDB]/60 flex items-center justify-center text-[#C97A72] flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#2C1D1B] uppercase">BIS HALLMARKED</h4>
              <p className="text-xs text-stone-500 font-normal mt-0.5">Assured Purity & Gold Standard Quality</p>
            </div>
          </div>

          {/* Badge 3: Secure Shipping */}
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#E8D7D4] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#F8DEDB]/60 flex items-center justify-center text-[#C97A72] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#2C1D1B] uppercase">SECURE SHIPPING</h4>
              <p className="text-xs text-stone-500 font-normal mt-0.5">100% Insured Armored Safe Delivery</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
