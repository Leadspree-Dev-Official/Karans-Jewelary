import React from 'react';
import { useStore } from '../context/StoreContext';
import { RotateCw, Sparkles, Headphones, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export const BrandFeatures: React.FC = () => {
  const { setFilters } = useStore();

  const handleDiscoverMore = () => {
    setFilters(prev => ({ ...prev, category: 'bridal', searchQuery: '' }));
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#FAF5F4] border-t border-[#E8D7D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Model Photograph with Luxury Jewelry */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Fine jewelry on model"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1D1B]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#E8D7D4] text-center">
                <p className="text-[11px] uppercase tracking-widest text-[#C97A72] font-bold">Karan's Haute Joaillerie</p>
                <p className="font-serif text-sm font-semibold text-[#2C1D1B]">Bridal & Evening Splendor</p>
              </div>
            </div>
          </div>

          {/* Center: Headline & Story */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C97A72] font-bold">
              EXCLUSIVE COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1D1B] font-normal leading-tight">
              Crafted for Every <br />
              <span className="italic font-normal text-[#C97A72]">Moment</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              From everyday understated elegance to unforgettable milestone celebrations, find the perfect heirloom piece that tells your unique story with timeless brilliance.
            </p>

            <div>
              <button
                id="brand-features-discover-more-btn"
                onClick={handleDiscoverMore}
                className="px-7 py-3 bg-[#D97D74] hover:bg-[#C96B62] text-white font-medium rounded-full text-xs tracking-widest uppercase transition-all duration-300 shadow-md flex items-center justify-center space-x-2 mx-auto lg:mx-0 cursor-pointer"
              >
                <span>DISCOVER MORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: 3 Luxury Guarantee Badges as in screenshot */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Lifetime Exchange */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs flex items-center space-x-4 hover:border-[#C97A72] transition">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5F4] flex items-center justify-center text-[#C97A72] flex-shrink-0 border border-[#E8D7D4]">
                <RotateCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold tracking-wider text-[#2C1D1B] uppercase">
                  LIFETIME EXCHANGE
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  100% Value Guarantee on All Fine Gold & Diamonds
                </p>
              </div>
            </div>

            {/* 2. Free Resizing */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs flex items-center space-x-4 hover:border-[#C97A72] transition">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5F4] flex items-center justify-center text-[#C97A72] flex-shrink-0 border border-[#E8D7D4]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold tracking-wider text-[#2C1D1B] uppercase">
                  FREE RESIZING
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Complimentary Ring Sizing for Lifetime
                </p>
              </div>
            </div>

            {/* 3. Customer Support */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs flex items-center space-x-4 hover:border-[#C97A72] transition">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5F4] flex items-center justify-center text-[#C97A72] flex-shrink-0 border border-[#E8D7D4]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold tracking-wider text-[#2C1D1B] uppercase">
                  CUSTOMER SUPPORT
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  24/7 Dedicated Jewellery Advisors & Concierge
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
