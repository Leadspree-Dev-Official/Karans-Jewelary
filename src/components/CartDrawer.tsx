import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalDiscount,
    cartGrandTotal,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E8D7D4]"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8D7D4] flex items-center justify-between bg-[#FAF5F4]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#C97A72]" />
            <h3 className="font-serif text-lg font-bold text-[#2C1D1B]">
              Your Shopping Bag ({cart.length})
            </h3>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FFF8F7] px-5 py-2.5 border-b border-[#F0D5D0] flex items-center space-x-2 text-xs text-[#843933]">
          <Sparkles className="w-4 h-4 text-[#D97D74] flex-shrink-0" />
          <span>Complimentary insured armored delivery unlocked for this order!</span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF5F4] flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#2C1D1B]">Your Shopping Bag is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore our fine jewellery creations and discover pieces crafted with timeless radiance.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#D97D74] text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                Browse Jewelry
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-serif text-xs font-semibold text-[#2C1D1B] truncate pr-2">
                      {item.product.title}
                    </h5>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#8C5D56] font-medium">
                    {item.selectedMetal} &bull; {item.selectedSize ? `Size ${item.selectedSize}` : 'Standard'}
                  </p>

                  {item.engravingText && (
                    <p className="text-[10px] text-stone-500 italic">
                      Engraving: "{item.engravingText}"
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-[#FAF5F4] p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif text-sm font-bold text-[#2C1D1B]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Box */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8D7D4] bg-[#FAF5F4] space-y-4">
            
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Promo <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-red-600 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Luxury Promo (e.g. KARAN10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#C97A72]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold rounded-xl uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p className={`text-[11px] mt-1 ${couponMessage.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
              <div className="flex justify-between">
                <span>Showroom Subtotal</span>
                <span className="font-medium text-[#2C1D1B]">{formatPrice(cartSubtotal)}</span>
              </div>

              {cartTotalDiscount > 0 && (
                <div className="flex justify-between text-[#C97A72] font-medium">
                  <span>Exclusive Privilege Discount</span>
                  <span>- {formatPrice(cartTotalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Armored Transit</span>
                <span className="text-emerald-700 font-semibold">FREE (100% Insured)</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-[#E8D7D4] text-sm">
                <span className="font-serif font-bold text-[#2C1D1B]">Estimated Total</span>
                <span className="font-serif font-bold text-lg text-[#843933]">{formatPrice(cartGrandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="cart-drawer-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white font-semibold text-xs uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#E8A598]" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C97A72]" />
              <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
