import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Review, 
  CartItem, 
  Order, 
  Coupon, 
  StockLog, 
  CurrencyConfig, 
  JewelryCategory, 
  MetalType,
  PaymentMethod 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS, 
  CURRENCIES 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}

interface FilterState {
  category: JewelryCategory;
  searchQuery: string;
  metalType?: MetalType | 'all';
  priceRange: [number, number];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  onlyInStock: boolean;
}

interface StoreContextType {
  // Products & Catalog
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Stock Management
  updateStock: (productId: string, newStock: number, reason: StockLog['reason']) => void;
  restockProduct: (productId: string, addedQty: number) => void;
  stockLogs: StockLog[];
  lowStockProducts: Product[];

  // Reviews
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
  voteHelpfulReview: (reviewId: string) => void;
  updateReviewStatus: (reviewId: string, status: Review['status']) => void;
  replyToReview: (reviewId: string, replyComment: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, selectedMetal: MetalType, selectedSize?: string, quantity?: number, engraving?: string) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalDiscount: number;
  cartGrandTotal: number;
  cartItemCount: number;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;

  // Orders & Checkout
  orders: Order[];
  createOrder: (
    customerInfo: Order['customerInfo'], 
    paymentMethod: PaymentMethod, 
    notes?: string
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => void;

  // Currency
  currency: CurrencyConfig;
  setCurrencyCode: (code: string) => void;
  formatPrice: (priceInINR: number) => string;
  convertPrice: (priceInINR: number) => number;

  // Filters & UI state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // UI Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  detailViewProduct: Product | null;
  setDetailViewProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Notifications
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Reset to demo defaults
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or mock defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kj_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('kj_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kj_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('kj_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    const saved = localStorage.getItem('kj_stock_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        productId: 'prod-1',
        productName: 'Radiant Solitaire Ring',
        sku: 'KJ-RNG-001',
        timestamp: new Date().toISOString(),
        change: 10,
        newStock: 8,
        reason: 'Initial Stock',
        performedBy: 'Karan Mehra'
      }
    ];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kj_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kj_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currencyCode, setCurrencyCodeState] = useState<string>('INR');

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [detailViewProduct, setDetailViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    metalType: 'all',
    priceRange: [0, 400000],
    sortBy: 'featured',
    onlyInStock: false,
  });

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('kj_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kj_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kj_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kj_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('kj_stock_logs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  useEffect(() => {
    localStorage.setItem('kj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kj_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast Helper
  const addToast = (message: string, type: Toast['type'] = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency Handlers
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const setCurrencyCode = (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyCodeState(code);
      addToast(`Currency switched to ${CURRENCIES[code].name} (${CURRENCIES[code].symbol})`, 'info');
    }
  };

  const convertPrice = (priceInINR: number): number => {
    return Math.round(priceInINR * currency.exchangeRate);
  };

  const formatPrice = (priceInINR: number): string => {
    const converted = convertPrice(priceInINR);
    if (currency.code === 'INR') {
      return `₹ ${converted.toLocaleString('en-IN')}`;
    }
    return `${currency.symbol} ${converted.toLocaleString('en-US')}`;
  };

  // Catalog Management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]);

    // Record initial stock log
    const stockLog: StockLog = {
      id: `log-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.title,
      sku: newProduct.sku,
      timestamp: new Date().toISOString(),
      change: newProduct.stockCount,
      newStock: newProduct.stockCount,
      reason: 'Initial Stock',
      performedBy: 'Admin'
    };
    setStockLogs(prev => [stockLog, ...prev]);
    addToast(`"${newProduct.title}" added to catalog with ${newProduct.stockCount} units.`, 'success', 'Jewelry Added');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));
    addToast('Product specifications updated successfully.', 'success', 'Catalog Updated');
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(p => p.id !== id));
    addToast(`"${product?.title || 'Product'}" removed from catalog.`, 'info', 'Product Deleted');
  };

  // Stock Management
  const updateStock = (productId: string, newStock: number, reason: StockLog['reason']) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const change = newStock - p.stockCount;
        const stockLog: StockLog = {
          id: `log-${Date.now()}`,
          productId: p.id,
          productName: p.title,
          sku: p.sku,
          timestamp: new Date().toISOString(),
          change,
          newStock,
          reason,
          performedBy: 'Inventory Manager'
        };
        setStockLogs(l => [stockLog, ...l]);
        return { ...p, stockCount: Math.max(0, newStock) };
      }
      return p;
    }));
    addToast('Stock level adjusted successfully.', 'success', 'Inventory Updated');
  };

  const restockProduct = (productId: string, addedQty: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const newStock = p.stockCount + addedQty;
    updateStock(productId, newStock, 'Manual Restock');
  };

  const lowStockProducts = products.filter(p => p.stockCount <= p.lowStockThreshold);

  // Review System
  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId && r.status === 'approved');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      status: 'approved', // Auto-approved for realistic immediate feedback, admin can moderate
    };
    setReviews(prev => [newReview, ...prev]);

    // Recalculate average product rating
    const existing = reviews.filter(r => r.productId === reviewData.productId && r.status === 'approved');
    const allRatings = [...existing.map(r => r.rating), reviewData.rating];
    const avg = Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1));

    setProducts(prev => prev.map(p => {
      if (p.id === reviewData.productId) {
        return {
          ...p,
          rating: avg,
          reviewCount: (p.reviewCount || 0) + 1
        };
      }
      return p;
    }));

    addToast('Your review has been verified and published!', 'success', 'Review Submitted');
  };

  const voteHelpfulReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    }));
    addToast('Thank you for your feedback.', 'info');
  };

  const updateReviewStatus = (reviewId: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
    addToast(`Review marked as ${status}.`, 'info', 'Review Moderated');
  };

  const replyToReview = (reviewId: string, replyComment: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          adminReply: {
            author: "Karan's Luxury Care",
            comment: replyComment,
            date: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
    addToast('Store response posted to review.', 'success', 'Replied');
  };

  // Cart & Wishlist
  const addToCart = (
    product: Product, 
    selectedMetal: MetalType, 
    selectedSize?: string, 
    quantity: number = 1,
    engraving?: string
  ): boolean => {
    if (product.stockCount <= 0) {
      addToast(`Sorry, "${product.title}" is currently out of stock.`, 'error', 'Out of Stock');
      return false;
    }

    const cartItemId = `${product.id}-${selectedMetal}-${selectedSize || 'std'}`;
    const existing = cart.find(item => item.id === cartItemId);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty + quantity > product.stockCount) {
      addToast(`Only ${product.stockCount} unit(s) available in vault.`, 'warning', 'Limited Vault Stock');
      return false;
    }

    if (existing) {
      setCart(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart(prev => [...prev, {
        id: cartItemId,
        product,
        selectedMetal,
        selectedSize,
        quantity,
        engravingText: engraving
      }]);
    }

    addToast(`Added "${product.title}" (${selectedMetal}) to your shopping bag.`, 'success', 'Bag Updated');
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    addToast('Item removed from shopping bag.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    if (quantity > item.product.stockCount) {
      addToast(`Cannot exceed vault stock of ${item.product.stockCount} units.`, 'warning', 'Stock Limit');
      return;
    }

    setCart(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const cartTotalDiscount = (() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;

    if (appliedCoupon.flatDiscount) {
      return Math.min(appliedCoupon.flatDiscount, cartSubtotal);
    }
    if (appliedCoupon.discountPercent) {
      const calc = (cartSubtotal * appliedCoupon.discountPercent) / 100;
      return appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    }
    return 0;
  })();

  const cartGrandTotal = Math.max(0, cartSubtotal - cartTotalDiscount);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      addToast(`Removed "${product.title}" from saved wishlist.`, 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      addToast(`Saved "${product.title}" to your wishlist.`, 'success', 'Saved to Wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === normalized && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired luxury promo code.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      return { 
        success: false, 
        message: `This coupon requires a minimum purchase of ${formatPrice(found.minOrderValue)}.` 
      };
    }

    setAppliedCoupon(found);
    addToast(`Promo code "${found.code}" applied! You saved on this order.`, 'success', 'Discount Applied');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed.', 'info');
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    addToast(`Coupon "${newCoupon.code}" created.`, 'success', 'Promo Created');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  // Order & Payment Checkout
  const createOrder = async (
    customerInfo: Order['customerInfo'],
    paymentMethod: PaymentMethod,
    notes?: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Shopping bag is empty.' };
    }

    // Verify stock availability
    for (const item of cart) {
      const currentProd = products.find(p => p.id === item.product.id);
      if (!currentProd || currentProd.stockCount < item.quantity) {
        return { 
          success: false, 
          error: `Insufficient stock for "${item.product.title}". Only ${currentProd?.stockCount || 0} left in vault.` 
        };
      }
    }

    // Deduct stock for all items
    const updatedProducts = products.map(prod => {
      const cartItem = cart.find(item => item.product.id === prod.id);
      if (cartItem) {
        const newStock = Math.max(0, prod.stockCount - cartItem.quantity);
        // Log stock movement
        const stockLog: StockLog = {
          id: `log-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.title,
          sku: prod.sku,
          timestamp: new Date().toISOString(),
          change: -cartItem.quantity,
          newStock,
          reason: 'Sale Order',
          performedBy: customerInfo.fullName
        };
        setStockLogs(l => [stockLog, ...l]);
        return { ...prod, stockCount: newStock };
      }
      return prod;
    });

    setProducts(updatedProducts);

    // Calculate tax & shipping
    const shippingFee = 0; // Free insured luxury courier
    const taxAmount = Math.round(cartGrandTotal * 0.03); // 3% GST on fine jewellery in India

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `KJ-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      customerInfo,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartTotalDiscount,
      appliedCoupon: appliedCoupon?.code,
      shippingFee,
      taxAmount,
      total: cartGrandTotal + taxAmount,
      currency: currency.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      trackingNumber: `KJ-EXPRESS-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: status,
          trackingNumber: trackingNumber || o.trackingNumber
        };
      }
      return o;
    }));
    addToast(`Order status updated to ${status}.`, 'success', 'Order Updated');
  };

  // Filtered Products Logic
  const resetFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      metalType: 'all',
      priceRange: [0, 400000],
      sortBy: 'featured',
      onlyInStock: false,
    });
  };

  const filteredProducts = products.filter(product => {
    // Category match
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle?.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
      const matchSku = product.sku.toLowerCase().includes(q);
      if (!matchTitle && !matchSubtitle && !matchDesc && !matchTags && !matchSku) {
        return false;
      }
    }

    // Metal type match
    if (filters.metalType && filters.metalType !== 'all' && product.metalType !== filters.metalType) {
      return false;
    }

    // Price range match
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Stock availability
    if (filters.onlyInStock && product.stockCount <= 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setCart([]);
    setWishlist([]);
    setAppliedCoupon(null);
    localStorage.clear();
    addToast('Reset catalog, orders, and stock to initial showroom values.', 'info', 'Demo Reset');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        updateStock,
        restockProduct,
        stockLogs,
        lowStockProducts,

        reviews,
        getProductReviews,
        addReview,
        voteHelpfulReview,
        updateReviewStatus,
        replyToReview,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalDiscount,
        cartGrandTotal,
        cartItemCount,

        wishlist,
        toggleWishlist,
        isInWishlist,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,

        orders,
        createOrder,
        updateOrderStatus,

        currency,
        setCurrencyCode,
        formatPrice,
        convertPrice,

        filters,
        setFilters,
        resetFilters,
        filteredProducts,

        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        quickViewProduct,
        setQuickViewProduct,
        detailViewProduct,
        setDetailViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,

        toasts,
        addToast,
        removeToast,

        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
