import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MetalType } from '../types';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  Ruler, 
  ShoppingBag, 
  Zap, 
  Check,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    setDetailViewProduct
  } = useStore();

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(
    quickViewProduct?.metalType || 'Rose Gold'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    quickViewProduct?.availableSizes ? quickViewProduct.availableSizes[0] : '7'
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState('');

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= product.lowStockThreshold;

  const metalOptions: { type: MetalType; label: string; color: string }[] = [
    { type: 'Rose Gold', label: '18K Rose Gold', color: 'bg-[#E8A598]' },
    { type: 'Yellow Gold', label: '22K Yellow Gold', color: 'bg-[#E5C158]' },
    { type: 'White Gold', label: '18K White Gold', color: 'bg-[#E2E4E6]' },
    { type: 'Platinum', label: '950 Platinum', color: 'bg-[#D1D5DB]' },
  ];

  const handleAdd = () => {
    addToCart(product, selectedMetal, selectedSize, quantity, engravingText);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedMetal, selectedSize, quantity, engravingText);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOpenFullReviews = () => {
    setDetailViewProduct(product);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E8D7D4] relative"
      >
        {/* Close Button */}
        <button
          id="close-quickview-modal-btn"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 p-2 rounded-full border border-stone-200 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF5F4] border border-[#E8D7D4] relative flex items-center justify-center">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-sm transition cursor-pointer ${
                  isFavorited ? 'bg-[#D97D74] text-white shadow-md' : 'bg-white/80 text-stone-500 hover:text-[#D97D74]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-mono">
                SKU: {product.sku}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImageIdx === idx ? 'border-[#C97A72] ring-2 ring-[#C97A72]/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurances */}
            <div className="bg-[#FAF5F4] p-4 rounded-xl border border-[#E8D7D4] space-y-2 text-xs text-stone-600">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C97A72] flex-shrink-0" />
                <span>{product.certification}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#C97A72] flex-shrink-0" />
                <span>Insured Armored Express Courier Included</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-[#C97A72] flex-shrink-0" />
                <span>30-Day Money Back & Lifetime Exchange Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Purchase Options */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#C97A72] font-semibold">
                  {product.category}
                </span>
                <button
                  type="button"
                  onClick={handleOpenFullReviews}
                  className="flex items-center space-x-1 text-xs text-stone-600 hover:text-[#C97A72] transition cursor-pointer"
                >
                  <div className="flex text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-semibold text-stone-900">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2C1D1B] mt-1">
                {product.title}
              </h2>
              {product.subtitle && (
                <p className="text-xs text-stone-500 mt-1">{product.subtitle}</p>
              )}
            </div>

            {/* Price Box */}
            <div className="flex items-baseline space-x-3 pb-3 border-b border-stone-100">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1D1B]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercent && (
                <span className="bg-[#442824] text-[#F3CBC5] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Metal Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-wider uppercase mb-2">
                Select Precious Metal: <span className="text-[#C97A72] font-bold">{selectedMetal}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {metalOptions.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedMetal(opt.type)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      selectedMetal === opt.type
                        ? 'border-[#C97A72] bg-[#FAF5F4] text-[#2C1D1B] shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border border-black/10 ${opt.color}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector if available */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-stone-700 tracking-wider uppercase">
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] text-[#C97A72] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Ring Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 h-10 px-3 rounded-lg border text-xs font-medium flex items-center justify-center transition ${
                        selectedSize === sz
                          ? 'bg-[#2C1D1B] text-white border-[#2C1D1B]'
                          : 'border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Free Laser Engraving Option */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-wider uppercase mb-1">
                Complimentary Inside Engraving <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="e.g. Forever & Always, 14.02.25"
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs text-[#2C1D1B] focus:outline-none focus:border-[#C97A72]"
              />
            </div>

            {/* Stock Level Warning */}
            <div>
              {isOutOfStock ? (
                <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 font-medium text-center">
                  This fine jewelry piece is currently sold out. Reserve via bespoke order.
                </div>
              ) : isLowStock ? (
                <div className="p-2.5 bg-[#FFF1F0] border border-[#FFCCC7] rounded-xl text-xs text-[#CF1322] font-semibold flex items-center justify-between">
                  <span>Vault Alert: Only {product.stockCount} handcrafted unit(s) remaining</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono">High Demand</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                  <Check className="w-4 h-4" />
                  <span>In Stock ({product.stockCount} units available in showroom vault)</span>
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF5F4] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white text-sm font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E09F95] text-[#843933] bg-white hover:bg-[#D97D74] hover:text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                id="modal-instant-checkout-btn"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-[#E8A598]" />
                <span>Instant Luxury Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
