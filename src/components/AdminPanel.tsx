import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, JewelryCategory, MetalType, MetalPurity, Review, Order } from '../types';
import { 
  X, 
  LayoutDashboard, 
  Layers, 
  Boxes, 
  ShoppingBag, 
  Star, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  RotateCcw, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Eye, 
  Send,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'overview' | 'catalog' | 'stock' | 'orders' | 'reviews' | 'coupons';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    stockLogs,
    lowStockProducts,
    updateStock,
    restockProduct,
    orders,
    updateOrderStatus,
    reviews,
    updateReviewStatus,
    replyToReview,
    coupons,
    addCoupon,
    toggleCouponStatus,
    formatPrice,
    resetToDefaultData
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filters in Admin
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<JewelryCategory | 'all'>('all');

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    sku: 'KJ-RNG-005',
    title: '',
    subtitle: '',
    category: 'rings',
    price: 45000,
    originalPrice: 50000,
    discountPercent: 10,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'],
    description: '',
    metalType: 'Rose Gold',
    metalPurity: '18K',
    diamondWeight: '0.85 ct VVS',
    gemstone: 'Natural Diamond',
    grossWeight: '4.20 grams',
    certification: 'BIS Hallmarked 750 & IGI Certified',
    stockCount: 10,
    lowStockThreshold: 3,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: false,
    availableSizes: ['6', '7', '8', '9', '10'],
    rating: 5.0,
    reviewCount: 0,
    tags: ['New', 'Fine Jewelry'],
  });

  // Reply Review Modal State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Quick Restock Modal
  const [quickRestockProductId, setQuickRestockProductId] = useState<string | null>(null);
  const [quickRestockAmount, setQuickRestockAmount] = useState<number>(5);

  // New Coupon Form State
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(25000);

  if (!isAdminOpen) return null;

  // Overview metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);

  const totalVaultUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stockCount), 0);

  // Handlers for Add/Edit Product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormData({
      sku: `KJ-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      subtitle: '',
      category: 'rings',
      price: 45000,
      originalPrice: 50000,
      discountPercent: 10,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'],
      description: '',
      metalType: 'Rose Gold',
      metalPurity: '18K',
      diamondWeight: '0.80 ct VVS',
      gemstone: 'Natural Diamond',
      grossWeight: '4.10 grams',
      certification: 'BIS Hallmarked 750',
      stockCount: 8,
      lowStockThreshold: 3,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      availableSizes: ['6', '7', '8', '9', '10'],
      rating: 5.0,
      reviewCount: 0,
      tags: ['Luxury', 'Rose Gold'],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormData({
      sku: p.sku,
      title: p.title,
      subtitle: p.subtitle || '',
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      discountPercent: p.discountPercent || 0,
      images: p.images,
      description: p.description,
      metalType: p.metalType,
      metalPurity: p.metalPurity,
      diamondWeight: p.diamondWeight || '',
      gemstone: p.gemstone || '',
      grossWeight: p.grossWeight || '',
      certification: p.certification,
      stockCount: p.stockCount,
      lowStockThreshold: p.lowStockThreshold,
      isBestseller: !!p.isBestseller,
      isNewArrival: !!p.isNewArrival,
      isFeatured: !!p.isFeatured,
      availableSizes: p.availableSizes || ['6', '7', '8', '9', '10'],
      rating: p.rating,
      reviewCount: p.reviewCount,
      tags: p.tags || [],
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.sku) return;

    if (editingProductId) {
      updateProduct(editingProductId, formData);
    } else {
      addProduct(formData);
    }
    setIsProductModalOpen(false);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      description: newCouponDesc || `${newCouponPercent}% off on fine jewellery`,
      discountPercent: newCouponPercent,
      minOrderValue: newCouponMinOrder,
      expiryDate: '2026-12-31',
      isActive: true,
      timesUsed: 0
    });

    setIsNewCouponOpen(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const filteredCatalog = products.filter(p => {
    const matchCat = selectedCatalogCategory === 'all' || p.category === selectedCatalogCategory;
    const matchQ = !catalogSearch.trim() || 
      p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF5F4] rounded-3xl max-w-6xl w-full h-[92vh] shadow-2xl border border-[#E8D7D4] flex flex-col overflow-hidden"
      >
        {/* Admin Navigation Header */}
        <div className="bg-[#2C1D1B] text-white px-6 py-4 flex justify-between items-center border-b border-[#442C28] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#C97A72] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase flex items-center space-x-2">
                <span>Karan's Jewelry Master Admin</span>
                <span className="text-[10px] bg-[#442C28] text-[#E8A598] px-2 py-0.5 rounded font-mono">
                  ERP & Catalog v2.4
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Live Inventory Vault, Catalog Editor, Order Logistics & Customer Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetToDefaultData}
              className="hidden sm:flex items-center space-x-1.5 bg-[#442C28] hover:bg-[#5A3B35] text-stone-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              title="Reset mock data to default state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E8A598]" />
              <span>Reset Showroom Data</span>
            </button>

            <button
              id="close-admin-panel-btn"
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-[#442C28] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-white px-6 py-2.5 border-b border-[#E8D7D4] flex space-x-2 sm:space-x-4 overflow-x-auto flex-shrink-0">
          {[
            { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
            { id: 'catalog', label: `Catalog Management (${products.length})`, icon: Layers },
            { id: 'stock', label: `Inventory & Stock (${lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length} Alert` : 'Vault OK'})`, icon: Boxes },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'reviews', label: `Review Moderation (${reviews.length})`, icon: Star },
            { id: 'coupons', label: `Promos & Coupons (${coupons.length})`, icon: Tag },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#2C1D1B] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#FAF5F4] hover:text-[#2C1D1B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8A598]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Low Stock Warning Banner if any */}
              {lowStockProducts.length > 0 && (
                <div className="bg-[#FFF1F0] border border-[#FFCCC7] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-[#CF1322] flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[#CF1322] uppercase tracking-wider">
                        Vault Inventory Alert: {lowStockProducts.length} Item(s) Below Safety Threshold
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {lowStockProducts.map(p => `${p.title} (${p.stockCount} left)`).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('stock')}
                    className="px-4 py-2 bg-[#CF1322] text-white text-xs font-semibold rounded-xl hover:bg-red-800 transition"
                  >
                    Restock Vault Now
                  </button>
                </div>
              )}

              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Sales Revenue</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#2C1D1B] mt-2">
                    {formatPrice(totalRevenue)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>+18.4% month-over-month</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Vault Units</span>
                    <div className="p-2 rounded-xl bg-[#FAF5F4] text-[#843933]">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#2C1D1B] mt-2">
                    {totalVaultUnits} Pieces
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium mt-1">
                    Valued at {formatPrice(totalInventoryValue)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Orders Dispatched</span>
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#2C1D1B] mt-2">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium mt-1">
                    100% Insured Delivery
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customer Rating</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#2C1D1B] mt-2">
                    4.9 / 5.0
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium mt-1">
                    {reviews.length} Verified Reviews
                  </p>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-white rounded-2xl border border-[#E8D7D4] p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-base font-bold text-[#2C1D1B]">
                    Recent Showroom Dispatches & Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C97A72] font-semibold hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 3).map(ord => (
                    <div key={ord.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#843933]">{ord.orderNumber}</span>
                        <span className="text-stone-400 mx-2">&bull;</span>
                        <span className="font-semibold text-stone-800">{ord.customerInfo.fullName}</span>
                        <span className="text-stone-400 mx-2">&bull;</span>
                        <span className="text-stone-500">{ord.items.length} piece(s)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-serif font-bold text-[#2C1D1B]">{formatPrice(ord.total)}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG MANAGEMENT */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              {/* Catalog Controls Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-[#E8D7D4]">
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by Title or SKU..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C97A72]"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={selectedCatalogCategory}
                    onChange={(e) => setSelectedCatalogCategory(e.target.value as any)}
                    className="bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-1.5 text-xs font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="solitaires">Solitaires</option>
                    <option value="bridal">Bridal</option>
                  </select>

                  <button
                    id="admin-add-new-product-btn"
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold rounded-xl uppercase tracking-wider flex items-center space-x-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#E8A598]" />
                    <span>Add New Jewelry</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#E8D7D4] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C1D1B] text-[#E8A598] font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Jewelry Piece</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Metal & Specs</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Badges</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredCatalog.map(product => (
                      <tr key={product.id} className="hover:bg-[#FAF5F4] transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-stone-900 line-clamp-1">{product.title}</p>
                              <p className="text-[10px] text-stone-400 font-mono">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-stone-800 font-medium">{product.metalPurity} {product.metalType}</p>
                          <p className="text-[10px] text-stone-400">{product.diamondWeight || 'Fine Metal'}</p>
                        </td>
                        <td className="px-4 py-3 font-serif font-bold text-[#2C1D1B]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            product.stockCount <= 0
                              ? 'bg-stone-200 text-stone-700'
                              : product.stockCount <= product.lowStockThreshold
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {product.stockCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center space-x-1">
                          {product.isBestseller && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                              Bestseller
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-semibold">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                            title="Edit Piece"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STOCK & INVENTORY MANAGEMENT */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              {/* Inventory Table with Quick Adjustments */}
              <div className="bg-white rounded-2xl border border-[#E8D7D4] overflow-hidden shadow-xs">
                <div className="p-4 border-b border-[#E8D7D4] bg-[#FAF5F4] flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#2C1D1B]">Vault Stock Manager</h3>
                    <p className="text-[11px] text-stone-500">Live piece counter and safety threshold alarms.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#843933]">
                    Total: {totalVaultUnits} pieces in vault
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C1D1B] text-[#E8A598] font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Product / SKU</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Safety Threshold</th>
                      <th className="px-4 py-3 text-center">Current Vault Stock</th>
                      <th className="px-4 py-3 text-right">Quick Restock Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map(product => {
                      const isLow = product.stockCount <= product.lowStockThreshold && product.stockCount > 0;
                      const isOut = product.stockCount <= 0;

                      return (
                        <tr key={product.id} className="hover:bg-[#FAF5F4] transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="font-semibold text-stone-900">{product.title}</p>
                                <p className="text-[10px] text-stone-400 font-mono">SKU: {product.sku}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {isOut ? (
                              <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                                Sold Out
                              </span>
                            ) : isLow ? (
                              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-fit">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low Vault Stock</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Optimal</span>
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center font-mono text-stone-500">
                            &le; {product.lowStockThreshold} units
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center space-x-2 bg-[#FAF5F4] border border-stone-200 rounded-xl p-1">
                              <button
                                onClick={() => updateStock(product.id, Math.max(0, product.stockCount - 1), 'Correction')}
                                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white font-bold"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-mono font-bold text-sm text-[#2C1D1B]">
                                {product.stockCount}
                              </span>
                              <button
                                onClick={() => updateStock(product.id, product.stockCount + 1, 'Manual Restock')}
                                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-right space-x-1.5">
                            <button
                              onClick={() => restockProduct(product.id, 5)}
                              className="px-2.5 py-1 rounded-lg border border-stone-300 text-xs font-medium hover:bg-stone-100 transition"
                            >
                              +5 Units
                            </button>
                            <button
                              onClick={() => restockProduct(product.id, 10)}
                              className="px-2.5 py-1 rounded-lg bg-[#2C1D1B] text-white text-xs font-medium hover:bg-[#442C28] transition"
                            >
                              +10 Units
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Stock Movement Audit Log */}
              <div className="bg-white rounded-2xl border border-[#E8D7D4] p-5 shadow-xs space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#2C1D1B]">
                  Vault Inventory Audit History
                </h3>

                <div className="border border-[#E8D7D4] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5F4] text-stone-600 text-[11px]">
                      <tr>
                        <th className="px-3 py-2">Timestamp</th>
                        <th className="px-3 py-2">Jewelry Item</th>
                        <th className="px-3 py-2">Movement</th>
                        <th className="px-3 py-2">New Balance</th>
                        <th className="px-3 py-2">Reason</th>
                        <th className="px-3 py-2">Authorizer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                      {stockLogs.map(log => (
                        <tr key={log.id}>
                          <td className="px-3 py-2 text-stone-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="px-3 py-2 font-sans font-medium text-stone-800">{log.productName} ({log.sku})</td>
                          <td className="px-3 py-2">
                            <span className={log.change >= 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                              {log.change >= 0 ? `+${log.change}` : log.change}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-bold text-[#2C1D1B]">{log.newStock}</td>
                          <td className="px-3 py-2 font-sans text-stone-600">{log.reason}</td>
                          <td className="px-3 py-2 font-sans text-stone-500">{log.performedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8D7D4] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C1D1B] text-[#E8A598] font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Order Number</th>
                      <th className="px-4 py-3">Customer & Delivery</th>
                      <th className="px-4 py-3">Items Purchased</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Update Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#FAF5F4] transition">
                        <td className="px-4 py-3">
                          <p className="font-mono font-bold text-[#843933]">{order.orderNumber}</p>
                          <p className="text-[10px] text-stone-400">{new Date(order.date).toLocaleDateString()}</p>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded uppercase">
                            {order.paymentMethod} &bull; {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-semibold text-stone-900">{order.customerInfo.fullName}</p>
                          <p className="text-[11px] text-stone-500">{order.customerInfo.city}, {order.customerInfo.state}</p>
                          <p className="text-[10px] font-mono text-stone-400">Tracking: {order.trackingNumber}</p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <p key={idx} className="text-[11px] text-stone-700">
                                &bull; {it.quantity}x {it.product.title} ({it.selectedMetal})
                              </p>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3 font-serif font-bold text-[#2C1D1B]">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8D7D4] overflow-hidden shadow-xs">
                <div className="p-4 bg-[#FAF5F4] border-b border-[#E8D7D4]">
                  <h3 className="font-serif text-sm font-bold text-[#2C1D1B]">Client Testimonial Moderation</h3>
                  <p className="text-[11px] text-stone-500">Approve, flag, or reply with official Karan's Jewelry signatures.</p>
                </div>

                <div className="divide-y divide-stone-100 p-4 space-y-4">
                  {reviews.map(rev => {
                    const product = products.find(p => p.id === rev.productId);

                    return (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-stone-900">{rev.customerName}</span>
                              <span className="text-stone-400 text-[11px]">({rev.customerLocation} &bull; {rev.date})</span>
                              {rev.verifiedBuyer && (
                                <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500">Item: <strong>{product?.title || 'Jewelry'}</strong></p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex text-amber-500">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i <= rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                              ))}
                            </div>

                            <button
                              onClick={() => updateReviewStatus(rev.id, rev.status === 'approved' ? 'flagged' : 'approved')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${
                                rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {rev.status}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-stone-800">{rev.title}</p>
                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                        {/* Admin response */}
                        {rev.adminReply ? (
                          <div className="bg-[#FAF5F4] p-3 rounded-xl border-l-2 border-[#C97A72] text-xs">
                            <p className="font-semibold text-[#843933]">{rev.adminReply.author}:</p>
                            <p className="text-stone-600 italic">"{rev.adminReply.comment}"</p>
                          </div>
                        ) : (
                          <div>
                            {replyingReviewId === rev.id ? (
                              <div className="flex space-x-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Write official store reply..."
                                  value={adminReplyText}
                                  onChange={(e) => setAdminReplyText(e.target.value)}
                                  className="flex-1 bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-1.5 text-xs"
                                />
                                <button
                                  onClick={() => {
                                    if (adminReplyText.trim()) {
                                      replyToReview(rev.id, adminReplyText.trim());
                                      setReplyingReviewId(null);
                                      setAdminReplyText('');
                                    }
                                  }}
                                  className="px-4 py-1.5 bg-[#2C1D1B] text-white text-xs font-semibold rounded-xl"
                                >
                                  Post Reply
                                </button>
                                <button
                                  onClick={() => setReplyingReviewId(null)}
                                  className="px-3 py-1.5 text-xs text-stone-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplyingReviewId(rev.id)}
                                className="text-xs text-[#C97A72] font-semibold hover:underline"
                              >
                                + Add Official Store Response
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONS & COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E8D7D4]">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2C1D1B]">Active Luxury Promo Codes</h3>
                  <p className="text-[11px] text-stone-500">Manage campaign discounts and minimum purchase thresholds.</p>
                </div>

                <button
                  onClick={() => setIsNewCouponOpen(true)}
                  className="px-4 py-2 bg-[#2C1D1B] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4 text-[#E8A598]" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map(cpn => (
                  <div
                    key={cpn.code}
                    className="bg-white p-5 rounded-2xl border border-[#E8D7D4] shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-sm font-bold text-[#843933] bg-[#FAF5F4] px-2.5 py-1 rounded-lg border border-[#E8D7D4]">
                          {cpn.code}
                        </span>
                        <button
                          onClick={() => toggleCouponStatus(cpn.code)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {cpn.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-xs text-stone-600 mt-2 font-medium">{cpn.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                      <p>Min Order: <strong>{formatPrice(cpn.minOrderValue)}</strong></p>
                      <p>Used: <strong>{cpn.timesUsed} times</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8D7D4] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C1D1B] mb-1">
              {editingProductId ? 'Edit Jewelry Specifications' : 'Add New Fine Jewelry Piece'}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Update precious metal details, diamond certification, prices, and showroom vault stock.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="solitaires">Solitaires</option>
                    <option value="bridal">Bridal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Jewelry Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Diamond Blossom Ring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Vault Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Metal Type</label>
                  <select
                    value={formData.metalType}
                    onChange={(e) => setFormData({ ...formData, metalType: e.target.value as any })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Purity</label>
                  <select
                    value={formData.metalPurity}
                    onChange={(e) => setFormData({ ...formData, metalPurity: e.target.value as any })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="18K">18K</option>
                    <option value="22K">22K</option>
                    <option value="14K">14K</option>
                    <option value="950 Platinum">950 Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Diamond Specs</label>
                  <input
                    type="text"
                    placeholder="0.95 ct VVS-EF"
                    value={formData.diamondWeight}
                    onChange={(e) => setFormData({ ...formData, diamondWeight: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Certification Standard</label>
                <input
                  type="text"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Photograph URL *</label>
                <input
                  type="url"
                  required
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded accent-[#D97D74]"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded accent-[#D97D74]"
                  />
                  <span>Feature in Highlights</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {editingProductId ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {isNewCouponOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E8D7D4] shadow-2xl relative">
            <button
              onClick={() => setIsNewCouponOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>

            <h3 className="font-serif text-lg font-bold text-[#2C1D1B] mb-3">
              Create Promotional Code
            </h3>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WEDDING20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Discount Percentage (%) *</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Min Order Value (INR ₹) *</label>
                <input
                  type="number"
                  required
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1D1B] text-white text-xs font-semibold rounded-xl"
                >
                  Activate Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
