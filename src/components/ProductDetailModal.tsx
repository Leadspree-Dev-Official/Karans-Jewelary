import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MetalType } from '../types';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Truck, 
  RotateCcw, 
  Heart, 
  ShoppingBag, 
  Check, 
  ThumbsUp, 
  MessageSquare, 
  Ruler, 
  Upload, 
  CheckCircle2,
  Calendar,
  Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    detailViewProduct,
    setDetailViewProduct,
    addToCart,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    getProductReviews,
    addReview,
    voteHelpfulReview,
    products,
    setQuickViewProduct
  } = useStore();

  const [selectedMetal, setSelectedMetal] = useState<MetalType>('Rose Gold');
  const [selectedSize, setSelectedSize] = useState<string>('7');
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageUrl, setReviewImageUrl] = useState('');

  if (!detailViewProduct) return null;

  const product = detailViewProduct;
  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockCount <= 0;
  const reviews = getProductReviews(product.id);

  // Recommendations: Other products from same or different categories
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || !reviewTitle.trim()) {
      return;
    }

    addReview({
      productId: product.id,
      customerName: reviewName,
      customerLocation: reviewLocation || 'Verified Connoisseur',
      verifiedBuyer: true,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      images: reviewImageUrl ? [reviewImageUrl] : undefined,
    });

    // Reset form
    setIsWritingReview(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewImageUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[#E8D7D4] flex flex-col relative"
      >
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#E8D7D4] flex justify-between items-center bg-[#FAF5F4]">
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-[#C97A72]" />
            <span className="font-serif text-lg font-bold tracking-wider text-[#2C1D1B] uppercase">
              Karan's Fine Jewelry Studio
            </span>
          </div>

          <button
            id="close-product-detail-modal-btn"
            onClick={() => setDetailViewProduct(null)}
            className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Visual & Customization Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF5F4] border border-[#E8D7D4] relative flex items-center justify-center shadow-inner">
                <img
                  src={product.images[selectedImgIdx] || product.images[0]}
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
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        selectedImgIdx === idx ? 'border-[#C97A72] ring-2 ring-[#C97A72]/30' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customization Details Column */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#C97A72] font-bold">
                    {product.category} &bull; {product.sku}
                  </span>
                  
                  {/* Rating summary pill */}
                  <div className="flex items-center space-x-1.5 bg-[#FAF5F4] px-2.5 py-1 rounded-full border border-[#E8D7D4]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-[#2C1D1B]">{product.rating}</span>
                    <span className="text-[11px] text-stone-400">({reviews.length} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl font-normal text-[#2C1D1B] mt-2">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-sm text-stone-600 mt-1 font-light">{product.subtitle}</p>
                )}
              </div>

              {/* Price & Discount */}
              <div className="flex items-baseline space-x-3 py-3 border-y border-stone-100">
                <span className="font-serif text-3xl font-bold text-[#2C1D1B]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="bg-[#442824] text-[#F3CBC5] text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Description summary */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Metal Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 tracking-wider uppercase mb-2">
                  Precious Metal: <span className="text-[#C97A72]">{selectedMetal}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Rose Gold', 'Yellow Gold', 'White Gold', 'Platinum'] as MetalType[]).map(metal => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                        selectedMetal === metal
                          ? 'border-[#C97A72] bg-[#FAF5F4] text-[#2C1D1B] shadow-xs'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {metal} (18K)
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {product.availableSizes && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-stone-800 tracking-wider uppercase">
                      Select Ring Size (US / Indian)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#C97A72] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Sizing Chart</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-11 h-10 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center transition ${
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

              {/* Laser Engraving Option */}
              <div>
                <label className="block text-xs font-bold text-stone-800 tracking-wider uppercase mb-1">
                  Complimentary Inside Ring Laser Engraving
                </label>
                <input
                  type="text"
                  placeholder="Custom Name / Date (Max 20 Characters)"
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2 text-xs text-[#2C1D1B] focus:outline-none focus:border-[#C97A72]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
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
                    onClick={() => addToCart(product, selectedMetal, selectedSize, quantity, engravingText)}
                    disabled={isOutOfStock}
                    className="flex-1 py-3.5 px-4 rounded-xl border border-[#E09F95] text-[#843933] bg-white hover:bg-[#D97D74] hover:text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, selectedMetal, selectedSize, quantity, engravingText);
                    setDetailViewProduct(null);
                    setIsCheckoutOpen(true);
                  }}
                  disabled={isOutOfStock}
                  className="w-full py-4 px-4 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#E8A598]" />
                  <span>Direct Secure Checkout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Overview, Full Specifications, Customer Reviews */}
          <div className="border-t border-[#E8D7D4] pt-6">
            <div className="flex border-b border-[#E8D7D4] space-x-8">
              {[
                { id: 'overview', label: 'Item Overview & Heritage' },
                { id: 'specs', label: 'Certified Specifications' },
                { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-sm font-semibold tracking-wider transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#C97A72] text-[#C97A72]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4]">
                    <Award className="w-6 h-6 text-[#C97A72] mb-2" />
                    <h4 className="font-serif text-sm font-bold text-[#2C1D1B]">Bespoke Craftsmanship</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Every gemstone is hand-set under 40x microscopic inspection for absolute alignment and light dispersion.
                    </p>
                  </div>
                  <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4]">
                    <ShieldCheck className="w-6 h-6 text-[#C97A72] mb-2" />
                    <h4 className="font-serif text-sm font-bold text-[#2C1D1B]">Govt. BIS Hallmarking</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Laser engraved with BIS purity stamp, HUID 6-digit identification code, and laboratory diamond appraisal card.
                    </p>
                  </div>
                  <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4]">
                    <RotateCcw className="w-6 h-6 text-[#C97A72] mb-2" />
                    <h4 className="font-serif text-sm font-bold text-[#2C1D1B]">Lifetime Buyback & Polish</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Complimentary ultrasonic cleaning and prong inspection at all Karan's Jewelry showrooms worldwide.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Full Specifications Table */}
            {activeTab === 'specs' && (
              <div className="py-6">
                <div className="bg-[#FAF5F4] rounded-2xl border border-[#E8D7D4] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-[#E8D7D4]">
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50 w-1/3">Stock Keeping Unit (SKU)</td>
                        <td className="px-6 py-3.5 text-[#2C1D1B] font-mono font-medium">{product.sku}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50">Precious Metal Purity</td>
                        <td className="px-6 py-3.5 text-[#2C1D1B]">{product.metalPurity} ({product.metalType})</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50">Diamond / Gemstone Weight</td>
                        <td className="px-6 py-3.5 text-[#2C1D1B] font-semibold">{product.diamondWeight || 'Solitaire Fine Stone'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50">Gross Metal Weight</td>
                        <td className="px-6 py-3.5 text-[#2C1D1B]">{product.grossWeight || 'Approx. 4.50 grams'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50">Gemstone Origin</td>
                        <td className="px-6 py-3.5 text-[#2C1D1B]">{product.gemstone || 'Natural Conflict-Free Diamond'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-semibold text-stone-600 bg-white/50">Official Certification</td>
                        <td className="px-6 py-3.5 text-[#C97A72] font-semibold">{product.certification}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Integrated Customer Review System */}
            {activeTab === 'reviews' && (
              <div className="py-6 space-y-6">
                {/* Review Header Banner & Action */}
                <div className="bg-[#FAF5F4] p-6 rounded-2xl border border-[#E8D7D4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center bg-white px-4 py-3 rounded-xl border border-[#E8D7D4]">
                      <span className="font-serif text-3xl font-bold text-[#2C1D1B]">{product.rating}</span>
                      <div className="flex text-amber-500 justify-center my-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.rating) ? 'fill-current' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Out of 5 Stars</span>
                    </div>

                    <div>
                      <h4 className="font-serif text-base font-bold text-[#2C1D1B]">Connoisseur Impressions</h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {reviews.length} verified buyers have rated this jewelry piece.
                      </p>
                    </div>
                  </div>

                  <button
                    id="write-review-btn"
                    onClick={() => setIsWritingReview(!isWritingReview)}
                    className="px-5 py-2.5 rounded-full bg-[#D97D74] hover:bg-[#C96B62] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Write a Review</span>
                  </button>
                </div>

                {/* Write a Review Modal / Expandable Form */}
                <AnimatePresence>
                  {isWritingReview && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleReviewSubmit}
                      className="bg-white p-6 rounded-2xl border border-[#C97A72]/40 shadow-lg space-y-4"
                    >
                      <h4 className="font-serif text-base font-bold text-[#2C1D1B]">
                        Share Your Review of "{product.title}"
                      </h4>

                      {/* Star Rating Picker */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating *</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 text-amber-500 hover:scale-110 transition"
                            >
                              <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Radhika Roy"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C97A72]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">City / Country</label>
                          <input
                            type="text"
                            placeholder="e.g. New Delhi, India"
                            value={reviewLocation}
                            onChange={(e) => setReviewLocation(e.target.value)}
                            className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C97A72]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Absolute masterclass in rose gold craftsmanship!"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C97A72]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Review *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Tell us about the diamond shine, weight, packaging box, and comfort..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C97A72]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Photo URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={reviewImageUrl}
                          onChange={(e) => setReviewImageUrl(e.target.value)}
                          className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C97A72]"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsWritingReview(false)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-wider"
                        >
                          Submit Verified Review
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* List of Verified Reviews */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-[#FAF5F4] rounded-2xl border border-dashed border-[#E8D7D4]">
                      <Star className="w-8 h-8 text-[#C97A72] mx-auto opacity-50 mb-2" />
                      <p className="text-sm font-serif text-[#2C1D1B]">Be the first to review this fine piece</p>
                      <p className="text-xs text-stone-500 mt-1">Share your experience with fellow jewelry collectors.</p>
                    </div>
                  ) : (
                    reviews.map(rev => (
                      <div
                        key={rev.id}
                        className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-xs text-[#2C1D1B]">{rev.customerName}</span>
                              {rev.verifiedBuyer && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-400">{rev.customerLocation} &bull; {rev.date}</span>
                          </div>

                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i <= rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                            ))}
                          </div>
                        </div>

                        <h5 className="text-xs font-bold text-[#2C1D1B]">{rev.title}</h5>
                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                        {/* Customer Photos */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="flex space-x-2 pt-1">
                            {rev.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="Customer review photo"
                                className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                        )}

                        {/* Admin Official Store Reply */}
                        {rev.adminReply && (
                          <div className="bg-[#FAF5F4] p-3 rounded-xl border-l-2 border-[#C97A72] text-xs space-y-1">
                            <div className="flex items-center space-x-1 text-[#843933] font-semibold text-[11px]">
                              <Sparkles className="w-3 h-3" />
                              <span>{rev.adminReply.author}</span>
                              <span className="text-stone-400 font-normal">({rev.adminReply.date})</span>
                            </div>
                            <p className="text-stone-600 text-xs italic leading-relaxed">
                              "{rev.adminReply.comment}"
                            </p>
                          </div>
                        )}

                        {/* Helpful vote */}
                        <div className="pt-2 flex justify-between items-center text-[11px] text-stone-400 border-t border-stone-100">
                          <span>Was this review helpful?</span>
                          <button
                            onClick={() => voteHelpfulReview(rev.id)}
                            className="flex items-center space-x-1 text-stone-600 hover:text-[#C97A72] transition font-medium cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations: "You May Also Adore" */}
          <div className="border-t border-[#E8D7D4] pt-6">
            <h4 className="font-serif text-lg font-bold text-[#2C1D1B] mb-4">
              You May Also Adore
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setDetailViewProduct(rel);
                  }}
                  className="bg-[#FAF5F4] p-3 rounded-xl border border-[#E8D7D4] hover:border-[#C97A72] cursor-pointer transition flex items-center space-x-3 group"
                >
                  <img
                    src={rel.images[0]}
                    alt={rel.title}
                    className="w-14 h-14 object-cover rounded-lg group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2C1D1B] truncate group-hover:text-[#C97A72]">
                      {rel.title}
                    </p>
                    <p className="text-[11px] font-bold text-[#843933]">{formatPrice(rel.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
