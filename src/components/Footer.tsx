import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  Lock,
  Ruler,
  RotateCw
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setFilters, setIsSizeGuideOpen, setIsAdminOpen } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleCategoryClick = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat as any, searchQuery: '' }));
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#1A1211] text-[#E8D7D4] border-t border-[#382624]">
      {/* Top Value Banner */}
      <div className="border-b border-[#2C1D1B] py-10 bg-[#221715]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#382624] flex items-center justify-center text-[#E8A598] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-xs font-bold tracking-wider text-white uppercase">100% Certified Purity</h5>
              <p className="text-[11px] text-stone-400">BIS Hallmarked 750 & IGI Diamonds</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#382624] flex items-center justify-center text-[#E8A598] flex-shrink-0">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-xs font-bold tracking-wider text-white uppercase">Lifetime Exchange</h5>
              <p className="text-[11px] text-stone-400">Guaranteed buyback & upgrade value</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#382624] flex items-center justify-center text-[#E8A598] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-xs font-bold tracking-wider text-white uppercase">Insured Armored Transit</h5>
              <p className="text-[11px] text-stone-400">Free, door-to-door tamper-proof delivery</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#382624] flex items-center justify-center text-[#E8A598] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-xs font-bold tracking-wider text-white uppercase">Bespoke Atelier</h5>
              <p className="text-[11px] text-stone-400">Custom bridal & heirloom creations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Story */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#E8A598]" />
              <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase text-white">
                KARAN'S JEWELRY
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Crafting stories in rose gold, conflict-free certified solitaires, and bespoke gemstones since 1994. Elevating every cherished moment into an eternal keepsake.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-stone-400">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#E8A598]" />
                <span>Flagship: 104 Heritage Boulevard, Colaba, Mumbai</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#E8A598]" />
                <span>Concierge: +91 (022) 2890-5544 / +91 98200 99888</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#E8A598]" />
                <span>Bespoke Requests: concierge@karansjewelry.com</span>
              </p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-xs font-bold tracking-widest text-white uppercase">
              Fine Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleCategoryClick('rings')} className="hover:text-[#E8A598] transition">
                  Precious Rings & Bands
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('necklaces')} className="hover:text-[#E8A598] transition">
                  Necklaces & Pendants
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('earrings')} className="hover:text-[#E8A598] transition">
                  Earrings & Drops
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('bracelets')} className="hover:text-[#E8A598] transition">
                  Tennis Bracelets & Bangles
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('solitaires')} className="hover:text-[#E8A598] transition">
                  Certified Solitaires
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('bridal')} className="hover:text-[#E8A598] transition">
                  Royal Bridal Troussier
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Tools */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-xs font-bold tracking-widest text-white uppercase">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-[#E8A598] transition flex items-center space-x-1">
                  <Ruler className="w-3 h-3 text-[#E8A598]" />
                  <span>Virtual Ring Sizer</span>
                </button>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-[#E8A598] transition">
                  Client Testimonials
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-[#E8A598] transition">
                  BIS Hallmark Guide
                </a>
              </li>
              <li>
                <span className="text-stone-400 hover:text-white transition cursor-pointer">
                  Complimentary Lifetime Resizing
                </span>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-xs text-[#E8A598] font-bold hover:underline flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin & Vault Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-xs font-bold tracking-widest text-white uppercase">
              Private Privilege Club
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to receive curated invitations to private preview salons, seasonal high-jewelry launches, and exclusive boutique privileges.
            </p>

            {isSubscribed ? (
              <div className="bg-[#2C1D1B] border border-[#C97A72] p-3 rounded-2xl text-xs text-[#E8A598] font-medium">
                Thank you for subscribing to Karan's Private Salon updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#2C1D1B] border border-[#382624] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C97A72]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D97D74] hover:bg-[#C96B62] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}

            <div className="pt-2 flex items-center space-x-4 text-stone-400">
              <span className="text-xs">Follow our ateliers:</span>
              <a href="#" className="hover:text-[#E8A598] transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-[#E8A598] transition"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-[#E8A598] transition"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Security certifications */}
        <div className="mt-12 pt-8 border-t border-[#2C1D1B] flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} Karan's Jewelry Haute Joaillerie Ltd. All Rights Reserved.</p>
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>PCI-DSS Level 1 Encrypted</span>
            </span>
            <span>&bull;</span>
            <span>GIA & IGI Certified</span>
            <span>&bull;</span>
            <span>BIS Hallmarked</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
