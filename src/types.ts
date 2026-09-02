export type JewelryCategory = 
  | 'all' 
  | 'rings' 
  | 'necklaces' 
  | 'earrings' 
  | 'bracelets' 
  | 'pendants' 
  | 'solitaires' 
  | 'bridal';

export type MetalType = 'Rose Gold' | 'Yellow Gold' | 'White Gold' | 'Platinum';
export type MetalPurity = '18K' | '14K' | '22K' | '950 Platinum';

export interface Product {
  id: string;
  sku: string;
  title: string;
  subtitle?: string;
  category: JewelryCategory;
  price: number; // Base price in INR
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  description: string;
  metalType: MetalType;
  metalPurity: MetalPurity;
  diamondWeight?: string; // e.g. "0.95 ct VVS-EF"
  gemstone?: string;
  grossWeight?: string; // e.g. "4.25 grams"
  certification: string; // e.g. "BIS Hallmarked & SGL Certified"
  stockCount: number;
  lowStockThreshold: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  availableSizes?: string[]; // Ring or bracelet sizes e.g. ["6", "7", "8", "9", "10", "12"]
  rating: number;
  reviewCount: number;
  tags?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerLocation?: string;
  verifiedBuyer: boolean;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  images?: string[];
  status: 'approved' | 'pending' | 'flagged';
  adminReply?: {
    author: string;
    comment: string;
    date: string;
  };
}

export interface CartItem {
  id: string; // Unique combination of product ID + selected options
  product: Product;
  selectedMetal: MetalType;
  selectedSize?: string;
  quantity: number;
  engravingText?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  shippingFee: number;
  taxAmount: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  change: number;
  newStock: number;
  reason: 'Sale Order' | 'Manual Restock' | 'Correction' | 'Return' | 'Initial Stock';
  performedBy: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  timesUsed: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Against INR
}
