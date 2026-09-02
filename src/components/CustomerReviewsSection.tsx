import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Filter 
} from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, products, voteHelpfulReview, addReview } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'verified'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Rating metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;
  const threeStarCount = reviews.filter(r => r.rating === 3).length;

  const filteredReviews = reviews.filter(r => {
    if (selectedFilter === '5') return r.rating === 5;
    if (selectedFilter === '4') return r.rating === 4;
    if (selectedFilter === 'verified') return r.verifiedBuyer;
    return true;
  });

  const handleGlobalReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || !reviewTitle.trim()) return;

    addReview({
      productId: selectedProductId || products[0].id,
      customerName: reviewName,
      customerLocation: reviewLocation || 'India',
      verifiedBuyer: true,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    });

    setIsSubmitModalOpen(false);
    setReviewName('');
    setReviewLocation('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <section id="reviews-section" className="py-16 bg-[#FBF2F0]/80 border-t border-[#E8D7D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C97A72] font-bold">
            CLIENT TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C1D1B]">
            Stories of Brilliance & Trust
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Read authentic reviews from patrons who celebrated life's most precious milestones with Karan's fine jewellery.
          </p>
        </div>

        {/* Aggregate Ratings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D7D4] shadow-sm mb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Big Score */}
          <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#E8D7D4] pb-6 md:pb-0 md:pr-8">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-[#2C1D1B]">{avgRating}</span>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-500 font-medium">Based on {totalReviews} Verified Orders</p>
              </div>
            </div>
            <p className="text-xs text-stone-600">
              99.4% of clients recommend Karan's Jewelry for purity, bespoke finish, and insured delivery.
            </p>
          </div>

          {/* Center: Rating Distribution */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center space-x-3 text-xs">
              <span className="w-12 text-stone-600 font-medium">5 Star</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D97D74] rounded-full" 
                  style={{ width: `${(fiveStarCount / Math.max(1, totalReviews)) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-stone-500">{fiveStarCount}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="w-12 text-stone-600 font-medium">4 Star</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E8A598] rounded-full" 
                  style={{ width: `${(fourStarCount / Math.max(1, totalReviews)) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-stone-500">{fourStarCount}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="w-12 text-stone-600 font-medium">3 Star</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-300 rounded-full" 
                  style={{ width: `${(threeStarCount / Math.max(1, totalReviews)) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-stone-500">{threeStarCount}</span>
            </div>
          </div>

          {/* Right: CTA to write review */}
          <div className="md:col-span-3 flex flex-col items-center justify-center space-y-3">
            <button
              id="global-write-review-btn"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 px-4 rounded-full bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#E8A598]" />
              <span>Share Experience</span>
            </button>
            <span className="text-[11px] text-stone-500 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Client Submissions</span>
            </span>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
          <span className="text-xs text-stone-500 font-medium flex items-center mr-2">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter:
          </span>
          {[
            { id: 'all', label: `All Reviews (${reviews.length})` },
            { id: '5', label: `5 Stars Only (${fiveStarCount})` },
            { id: '4', label: `4 Stars (${fourStarCount})` },
            { id: 'verified', label: 'Verified Buyers' },
          ].map(flt => (
            <button
              key={flt.id}
              onClick={() => setSelectedFilter(flt.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedFilter === flt.id
                  ? 'bg-[#2C1D1B] text-white'
                  : 'bg-white border border-[#E8D7D4] text-stone-700 hover:border-[#C97A72]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReviews.map(rev => {
            const product = products.find(p => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-[#E8D7D4] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Star row & Verified badge */}
                  <div className="flex justify-between items-center">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                      ))}
                    </div>

                    {rev.verifiedBuyer && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Comment */}
                  <h4 className="font-serif text-sm font-bold text-[#2C1D1B] line-clamp-1">
                    {rev.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>

                  {/* Tagged Product */}
                  {product && (
                    <div className="bg-[#FAF5F4] p-2 rounded-xl flex items-center space-x-2 border border-[#E8D7D4]/60">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-8 h-8 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] font-medium text-stone-700 truncate">
                        Purchased: {product.title}
                      </span>
                    </div>
                  )}

                  {/* Admin Reply */}
                  {rev.adminReply && (
                    <div className="bg-[#FAF5F4] p-2.5 rounded-lg border-l-2 border-[#C97A72] text-[11px] text-stone-600">
                      <span className="font-bold text-[#843933]">{rev.adminReply.author}: </span>
                      <span>"{rev.adminReply.comment}"</span>
                    </div>
                  )}
                </div>

                {/* Author & Helpful vote */}
                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[11px]">
                  <div>
                    <p className="font-semibold text-stone-900">{rev.customerName}</p>
                    <p className="text-stone-400">{rev.customerLocation} &bull; {rev.date}</p>
                  </div>

                  <button
                    onClick={() => voteHelpfulReview(rev.id)}
                    className="flex items-center space-x-1 text-stone-500 hover:text-[#C97A72] transition cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Global Review Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8D7D4] shadow-2xl relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C1D1B] mb-1">
              Submit Your Jewellery Review
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Your valuable feedback helps our artisans refine our bespoke creations.
            </p>

            <form onSubmit={handleGlobalReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Select Piece Purchased *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#C97A72]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.metalType}) — SKU: {p.sku}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating *</label>
                <div className="flex space-x-2 text-amber-500">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewRating(st)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${st <= reviewRating ? 'fill-current' : 'text-stone-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stunning brilliance and elegant rose gold!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the packaging, sparkle, finish, and service..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
