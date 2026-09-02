import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Truck, 
  Lock, 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowRight, 
  Sparkles,
  QrCode,
  RotateCcw,
  Clock,
  KeyRound,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SecureCheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartTotalDiscount,
    cartGrandTotal,
    appliedCoupon,
    formatPrice,
    currency,
    createOrder
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'otp' | 'success'>('shipping');

  // Shipping Form State
  const [customerInfo, setCustomerInfo] = useState({
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@luxury.com',
    phone: '+91 98200 12345',
    address: '42, Altamount Road, Cumballa Hill',
    apartment: 'Bespoke Suite 1204',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400026',
    country: 'India'
  });
  const [orderNotes, setOrderNotes] = useState('Please pack in premium velvet jewelry box with GIA certification card.');
  const [isGiftWrap, setIsGiftWrap] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState('ROHAN DESHMUKH');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('884');

  // UPI State
  const [upiId, setUpiId] = useState('rohan@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Bank OTP Simulation
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  if (!isCheckoutOpen) return null;

  const taxAmount = Math.round(cartGrandTotal * 0.03); // 3% GST on fine jewellery
  const finalTotal = cartGrandTotal + taxAmount;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address) return;
    setStep('payment');
  };

  const handlePaymentInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      // Direct placement
      handleFinalizePayment();
    } else {
      // Launch 3D Secure / OTP Simulation step
      setStep('otp');
      setOtpTimer(60);
      setOtpCode('');
    }
  };

  const handleFinalizePayment = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      const res = await createOrder(customerInfo, paymentMethod, orderNotes);
      setIsProcessingPayment(false);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        setStep('success');
      }
    }, 1200);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('shipping');
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8D7D4] flex flex-col relative print:border-none print:shadow-none print:max-w-full"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#2C1D1B] text-white flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#E8A598]" />
            <span className="font-serif text-base tracking-wider uppercase">
              Karan's Jewelry Secure Gateway
            </span>
          </div>

          {step !== 'success' && (
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-step progress indicator */}
        {step !== 'success' && (
          <div className="bg-[#FAF5F4] px-6 py-3 border-b border-[#E8D7D4] flex justify-between items-center text-xs print:hidden">
            {[
              { id: 'shipping', label: '1. Shipping & Vault Delivery' },
              { id: 'payment', label: '2. Payment Selection' },
              { id: 'otp', label: '3. 3D Secure Authorization' },
            ].map((st, idx) => (
              <div
                key={st.id}
                className={`flex items-center space-x-1.5 font-medium ${
                  step === st.id
                    ? 'text-[#843933] font-bold'
                    : 'text-stone-400'
                }`}
              >
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto print:max-h-none print:p-8">
          
          {/* STEP 1: Shipping & Delivery Details */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C1D1B]">
                  Insured Vault Delivery Details
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  All fine jewellery parcels are dispatched via armored courier with tamper-evident serial security seals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C97A72]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email for Certificate & Receipt *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C97A72]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (For OTP & Courier) *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C97A72]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                  <input
                    type="text"
                    readOnly
                    value="India (Complimentary Express Transit)"
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-600 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="House/Flat No., Apartment, Street"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C97A72]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.postalCode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                    className="w-full bg-[#FAF5F4] border border-[#E5CDC9] rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Gift Wrap & Instructions */}
              <div className="bg-[#FAF5F4] p-4 rounded-2xl border border-[#E8D7D4] space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrap}
                    onChange={(e) => setIsGiftWrap(e.target.checked)}
                    className="rounded accent-[#D97D74] w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-[#2C1D1B]">
                    Include Karan's Signature LED Illuminated Velvet Presentation Box & Ribbon (Free)
                  </span>
                </label>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Delivery Instructions / Vault Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver in person only"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-stone-800">{cart.length} Item(s) in Bag</p>
                  <p className="text-stone-500">Includes 3% GST & Free Insured Courier</p>
                </div>
                <span className="font-serif text-lg font-bold text-[#843933]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Return to Bag
                </button>
                <button
                  id="checkout-proceed-to-payment-btn"
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-widest flex items-center space-x-2 shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A598]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Secure Payment Method Selection */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentInitiate} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C1D1B]">
                  Choose Secure Payment Gateway
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Transactions are encrypted end-to-end with 256-bit AES cryptographic protocols.
                </p>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'card', label: 'Cards (3D Secure)', icon: CreditCard },
                  { id: 'upi', label: 'UPI / QR Code', icon: Smartphone },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  { id: 'cod', label: 'Pay on Vault Delivery', icon: Truck },
                ].map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-2 transition cursor-pointer ${
                        paymentMethod === opt.id
                          ? 'border-[#C97A72] bg-[#FAF5F4] text-[#843933] shadow-xs ring-1 ring-[#C97A72]'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-center">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4]">
                  {/* Virtual Luxury Card Preview */}
                  <div className="w-full max-w-sm mx-auto h-44 rounded-2xl p-5 bg-gradient-to-tr from-[#2C1D1B] via-[#442C28] to-[#633F3A] text-white shadow-xl flex flex-col justify-between border border-[#8C5D56]/40">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-xs tracking-widest text-[#E8A598] font-bold">KARAN'S PLATINUM ACCESS</span>
                      <ShieldCheck className="w-5 h-5 text-[#E8A598]" />
                    </div>

                    <div className="font-mono text-base sm:text-lg tracking-widest text-stone-200">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-stone-400">Cardholder</p>
                        <p className="font-semibold uppercase tracking-wider">{cardHolder || 'VALUED CLIENT'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-stone-400">Expires</p>
                        <p className="font-mono font-semibold">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number *</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8901 2345 6789"
                        className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Name on Card *</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Rohan Deshmukh"
                        className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="11/28"
                        className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">CVV / CVC (3-digits) *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="884"
                        className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl border border-[#E8D7D4]">
                    <div className="w-24 h-24 bg-stone-900 text-white rounded-xl p-2 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-[#E8A598]" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="text-xs font-bold text-[#2C1D1B]">Scan & Pay with Any UPI App</p>
                      <p className="text-[11px] text-stone-500">Google Pay, PhonePe, Paytm, BHIM or Cred</p>
                      <span className="inline-block text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                        Amount: {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Or Enter Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okaxis"
                      className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4] space-y-3">
                  <label className="block text-xs font-semibold text-stone-700">Select Bank for Direct Wire</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-[#E5CDC9] rounded-xl px-3 py-2.5 text-xs font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank (Instant Transfer)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Standard Chartered">Standard Chartered</option>
                  </select>
                </div>
              )}

              {/* COD Form */}
              {paymentMethod === 'cod' && (
                <div className="bg-[#FFF8F7] p-5 rounded-2xl border border-[#F0D5D0] space-y-2 text-xs text-stone-700">
                  <p className="font-semibold text-[#843933]">Pay Upon Vault Armored Delivery</p>
                  <p className="text-stone-600 leading-relaxed">
                    You can pay via Demand Draft, UPI, or Credit Card when the armored courier agent arrives with your certified parcel. Government photo ID required upon handover.
                  </p>
                </div>
              )}

              {/* Action row */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  &larr; Back to Shipping
                </button>
                <button
                  id="checkout-authenticate-pay-btn"
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-widest shadow-md flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4 text-[#E8A598]" />
                  <span>Authorize {formatPrice(finalTotal)}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 3D Secure / OTP Simulation */}
          {step === 'otp' && (
            <div className="space-y-6 max-w-md mx-auto">
              {/* Bank Gateway Simulation Card */}
              <div className="border border-stone-300 rounded-3xl p-6 bg-white shadow-xl space-y-5">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                      Verified by Visa &bull; 3D Secure 2.0
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                    BANK SIMULATOR
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Merchant:</span>
                    <span className="font-bold text-[#2C1D1B]">Karan's Luxury Fine Jewellery</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Transaction Total:</span>
                    <span className="font-bold text-base text-[#843933]">{formatPrice(finalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Card / Account:</span>
                    <span className="font-mono text-stone-800">XXXX-XXXX-XXXX-6789</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>OTP Sent To:</span>
                    <span className="font-mono text-stone-800">+91 98200 •••••</span>
                  </div>
                </div>

                <div className="bg-[#FAF5F4] p-4 rounded-2xl border border-[#E8D7D4] space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Enter 6-Digit Bank OTP
                    </label>
                    <div className="flex items-center space-x-1 text-xs text-stone-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{otpTimer}s remaining</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl py-2 bg-white border border-[#E5CDC9] rounded-xl focus:outline-none focus:border-[#C97A72]"
                  />

                  {/* Auto fill test helper */}
                  <button
                    type="button"
                    onClick={() => setOtpCode('123456')}
                    className="w-full text-center text-[11px] text-[#C97A72] font-semibold hover:underline"
                  >
                    Click to Auto-fill Test Code (123456)
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    id="submit-otp-verification-btn"
                    onClick={handleFinalizePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-widest shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Verifying with Card Issuer...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Authenticate & Pay Now</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="w-full text-center text-xs text-stone-400 hover:text-stone-600 py-1"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed & Official Receipt Generator */}
          {step === 'success' && completedOrder && (
            <div className="space-y-6 text-center print:text-left">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg print:hidden">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C97A72] font-bold">
                  PAYMENT AUTHORIZED &bull; ORDER CONFIRMED
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1D1B]">
                  Thank You, {completedOrder.customerInfo.fullName}
                </h2>
                <p className="text-xs text-stone-500">
                  Your fine jewelry order has been recorded into our vault dispatch system. An insured tracking code has been issued.
                </p>
              </div>

              {/* Printable Official Invoice Card */}
              <div className="bg-[#FAF5F4] p-6 sm:p-8 rounded-3xl border border-[#E8D7D4] text-left space-y-6 print:bg-white print:border-none print:p-0">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-[#E8D7D4] pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2C1D1B] tracking-wider uppercase">
                      KARAN'S LUXURY JEWELLERY
                    </h3>
                    <p className="text-[11px] text-stone-500">Flagship Showroom: 104 Heritage Boulevard, Colaba, Mumbai</p>
                    <p className="text-[11px] text-stone-500">GSTIN: 27AABCK1234F1Z8 &bull; BIS Reg: HM/MUM/98710</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#843933]">ORDER #{completedOrder.orderNumber}</p>
                    <p className="text-[11px] text-stone-400">Date: {new Date(completedOrder.date).toLocaleDateString()}</p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                      {completedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Recipient and Shipping Details */}
                <div className="grid grid-cols-2 gap-4 text-xs text-stone-700">
                  <div>
                    <p className="font-bold text-stone-900 mb-1">Delivering To:</p>
                    <p>{completedOrder.customerInfo.fullName}</p>
                    <p>{completedOrder.customerInfo.address}</p>
                    <p>{completedOrder.customerInfo.city}, {completedOrder.customerInfo.state} {completedOrder.customerInfo.postalCode}</p>
                    <p>Phone: {completedOrder.customerInfo.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-900 mb-1">Transit Details:</p>
                    <p>Armored Courier: <strong className="font-mono">{completedOrder.trackingNumber}</strong></p>
                    <p>Estimated Delivery: <strong>{completedOrder.estimatedDelivery}</strong></p>
                    <p>Payment: {completedOrder.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-[#E8D7D4] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#2C1D1B] text-[#E8A598] font-mono text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5">Item & Specifications</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Price</th>
                        <th className="px-4 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {completedOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-stone-900">{it.product.title}</p>
                            <p className="text-[11px] text-stone-500">
                              {it.selectedMetal} &bull; {it.selectedSize ? `Size ${it.selectedSize}` : 'Standard'} &bull; SKU: {it.product.sku}
                            </p>
                            {it.engravingText && (
                              <p className="text-[10px] text-stone-400 italic">Engraving: "{it.engravingText}"</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-mono">{it.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatPrice(it.product.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatPrice(it.product.price * it.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-1.5 text-xs text-stone-600 max-w-xs ml-auto border-t border-stone-200 pt-3">
                  <div className="flex justify-between">
                    <span>Showroom Subtotal</span>
                    <span>{formatPrice(completedOrder.subtotal)}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#C97A72]">
                      <span>Discount ({completedOrder.appliedCoupon || 'Promo'})</span>
                      <span>- {formatPrice(completedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Armored Freight</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3% fine jewellery)</span>
                    <span>{formatPrice(completedOrder.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#2C1D1B] pt-2 border-t border-[#E8D7D4]">
                    <span>Total Amount Paid</span>
                    <span className="text-[#843933]">{formatPrice(completedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2 print:hidden">
                <button
                  id="print-invoice-btn"
                  onClick={handlePrintInvoice}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 hover:bg-stone-100 text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Invoice</span>
                </button>

                <button
                  id="order-success-continue-shopping-btn"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2C1D1B] hover:bg-[#442C28] text-white text-xs font-semibold uppercase tracking-widest shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Continue Exploring Showroom</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A598]" />
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
