import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { JewelryCategory } from '../types';

export const CategoryShowcase: React.FC = () => {
  const { setFilters } = useStore();

  const categories: {
    title: string;
    category: JewelryCategory;
    image: string;
    count: string;
    tag: string;
  }[] = [
    {
      title: 'RINGS',
      category: 'rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      count: '18+ Designs',
      tag: 'Solitaires & Bands'
    },
    {
      title: 'NECKLACES',
      category: 'necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      count: '14+ Designs',
      tag: 'Pendants & Chokers'
    },
    {
      title: 'EARRINGS',
      category: 'earrings',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      count: '22+ Designs',
      tag: 'Drops & Solitaire Studs'
    },
    {
      title: 'BRACELETS',
      category: 'bracelets',
      image: 'https://images.unsplash.com/photo-1611591475166-f5ffaa2c48aa?auto=format&fit=crop&w=800&q=80',
      count: '10+ Designs',
      tag: 'Bangles & Tennis Cuffs'
    }
  ];

  const handleSelectCategory = (cat: JewelryCategory) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-[#FAF5F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              id={`category-card-${cat.category}`}
              onClick={() => handleSelectCategory(cat.category)}
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D7D4] hover:border-[#C97A72] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF5F4] flex items-center justify-center p-2 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 text-[10px] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-stone-600 font-medium shadow-xs">
                  {cat.count}
                </span>
              </div>

              {/* Title & Action */}
              <div className="mt-4 text-left">
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#2C1D1B] uppercase group-hover:text-[#C97A72] transition-colors">
                  {cat.title}
                </h3>
                <div className="mt-1 flex items-center text-xs font-medium text-stone-500 group-hover:text-[#C97A72] transition-colors">
                  <span>Discover Now</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
