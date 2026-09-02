import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setDetailViewProduct
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= product.lowStockThreshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.availableSizes ? product.availableSizes[0] : undefined;
    addToCart(product, product.metalType, defaultSize, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    setDetailViewProduct(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-[#E8D7D4] hover:border-[#C97A72] transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top action row: Wishlist Heart & Badges */}
      <div className="flex justify-between items-start z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer ${
            isFavorited 
              ? 'bg-[#D97D74] text-white shadow-md scale-105 sm:scale-110' 
              : 'bg-white/85 text-stone-400 hover:text-[#D97D74] hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Status Pills */}
        <div className="flex flex-col items-end space-y-0.5 sm:space-y-1">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#442824] text-[#F3CBC5] text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}

          {isOutOfStock ? (
            <span className="bg-stone-200 text-stone-700 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-[#FFF1F0] border border-[#FFCCC7] text-[#CF1322] text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full animate-pulse flex items-center space-x-0.5 sm:space-x-1">
              <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{product.stockCount} left</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Image Stage with hover quick-view overlay */}
      <div className="relative aspect-square w-full my-2 sm:my-3 rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF5F4] flex items-center justify-center p-1.5 sm:p-2">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover rounded-md sm:rounded-lg group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Quick View Button on Image Hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickView}
            className="bg-white/95 backdrop-blur-md text-[#2C1D1B] hover:bg-[#2C1D1B] hover:text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg flex items-center space-x-1 sm:space-x-1.5 transition duration-200 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="space-y-1 sm:space-y-2">
        {/* Metal & Diamond Specs Mini-Pill */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500">
          <span className="font-medium text-[#8C5D56] truncate max-w-[90px] sm:max-w-none">{product.metalPurity} {product.metalType}</span>
          {product.diamondWeight && (
            <span className="flex items-center text-stone-600 font-mono text-[9px] sm:text-[10px] shrink-0">
              <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#C97A72] mr-0.5" />
              {product.diamondWeight.split(' ')[0]} ct
            </span>
          )}
        </div>

        {/* Product Title */}
        <h4 className="font-serif text-xs sm:text-base font-medium text-[#2C1D1B] line-clamp-1 group-hover:text-[#C97A72] transition-colors leading-tight">
          {product.title}
        </h4>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-1 text-[10px] sm:text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="ml-0.5 sm:ml-1 font-semibold text-[#2C1D1B] text-[10px] sm:text-xs">{product.rating || 5.0}</span>
          </div>
          <span className="text-stone-400 text-[9px] sm:text-[11px]">({product.reviewCount || 0})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline space-x-1.5 sm:space-x-2 pt-0.5">
          <span className="font-serif text-xs sm:text-lg font-bold text-[#2C1D1B]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-stone-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="pt-1.5 sm:pt-2">
          <button
            id={`add-to-cart-btn-${product.id}`}
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg border text-[10px] sm:text-xs font-semibold tracking-normal sm:tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 ${
              isOutOfStock
                ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                : 'border-[#E09F95] text-[#843933] bg-white hover:bg-[#D97D74] hover:text-white hover:border-[#D97D74] shadow-xs cursor-pointer active:scale-95'
            }`}
          >
            <span className="truncate">{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
