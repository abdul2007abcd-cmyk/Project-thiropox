import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Info,
  Sliders,
  X,
  CreditCard,
  PlusCircle,
  RotateCcw,
  Star,
  Home,
  ShoppingBag,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data and Type Imports
import { SelectedItem, Order, Address } from './types';
import { PRESET_ADDRESSES, INITIAL_ORDERS, TIME_SLOTS, FAQ_ITEMS } from './data';

// Component Imports
import Logo from './components/Logo';
import PromoBanner from './components/PromoBanner';
import GarmentPicker from './components/GarmentPicker';
import OrderTracker from './components/OrderTracker';
import SupportPanel from './components/SupportPanel';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'orders' | 'support'>('home');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // App core state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(PRESET_ADDRESSES);
  
  // Interactive booking basket state (transient)
  const [basketItems, setBasketItems] = useState<SelectedItem[]>([]);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(1); // Tomorrow default
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online_payment' | 'whatsapp'>('cash_on_delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Helper to compute basket values
  const getBasketTotals = () => {
    let subtotal = 0;
    let shirtIronQty = 0;
    
    basketItems.forEach(item => {
      let rate = 20;
      if (item.id === 'shirt') {
        rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 55 : 110;
        if (item.service === 'ironing') shirtIronQty += item.quantity;
      }
      else if (item.id === 'trouser') { rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 60 : 120; }
      else if (item.id === 'saree') { rate = item.service === 'ironing' ? 40 : item.service === 'wash_iron' ? 99 : 220; }
      else if (item.id === 'bedsheet') { rate = 50; }
      else { rate = 20; }
      subtotal += rate * item.quantity;
    });

    let savings = 0;
    if (isFirstOrderApplied && shirtIronQty > 0) {
      const freeCount = Math.min(3, shirtIronQty);
      savings = freeCount * 20;
    }

    return {
      subtotal,
      savings,
      finalAmount: Math.max(0, subtotal - savings)
    };
  };

  // Promos
  const [isFirstOrderApplied, setIsFirstOrderApplied] = useState(true);

  // Modal / Add address state
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'PG/Hostel' | 'Other'>('Home');
  const [newAddrDetails, setNewAddrDetails] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');

  // Auto-dismiss toast
  useEffect(() => {
    if (successToast) {
       const timer = setTimeout(() => {
        setSuccessToast(null);
      }, 4050);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Reset bookingStep when leaving or changing tabs
  useEffect(() => {
    if (activeTab === 'booking' && basketItems.length === 0) {
      setBookingStep(1);
    }
  }, [activeTab, basketItems.length]);

  // Advance Order simulation flow
  const handleAdvanceStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const states: Order['status'][] = ['Scheduled', 'Picked Up', 'Cleaning', 'Ironing', 'Folded', 'Delivered'];
      const currentIndex = states.indexOf(order.status);
      let nextIndex = (currentIndex + 1) % states.length;
      const nextStatus = states[nextIndex];

      return {
        ...order,
        status: nextStatus
      };
    }));
    
    setSuccessToast(`Advance simulated: Stage advanced for #${orderId}!`);
  };

  const handlePlaceOrder = () => {
    if (basketItems.length === 0) {
      setSuccessToast("Your basket is empty! Select garments to book.");
      return;
    }

    // Calculations
    let subtotal = 0;
    let descParts: string[] = [];
    let shirtIronQty = 0;

    basketItems.forEach(item => {
      // Direct prices matching
      let rate = 20;
      let label = "Garment";
      if (item.id === 'shirt') { rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 55 : 110; label = "Shirt"; if (item.service === 'ironing') shirtIronQty += item.quantity; }
      else if (item.id === 'trouser') { rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 60 : 120; label = "Jean/Trousers"; }
      else if (item.id === 'saree') { rate = item.service === 'ironing' ? 40 : item.service === 'wash_iron' ? 99 : 220; label = "Saree"; }
      else if (item.id === 'bedsheet') { rate = 50; label = "Bedsheet"; }
      else { rate = 20; label = "Item"; }

      subtotal += rate * item.quantity;
      descParts.push(`${item.quantity}x ${label} (${item.service === 'ironing' ? 'Iron Only' : item.service === 'wash_iron' ? 'Wash+Iron' : 'Dry Clean'})`);
    });

    let savings = 0;
    if (isFirstOrderApplied && shirtIronQty > 0) {
      const freeCount = Math.min(3, shirtIronQty);
      savings = freeCount * 20;
    }

    const finalAmount = Math.max(0, subtotal - savings);
    const matchedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const orderNo = `FF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderNo,
      items: basketItems,
      totalPrice: finalAmount,
      itemsDescription: descParts.join(' • '),
      status: 'Scheduled',
      pickupDate: dateStr,
      pickupTimeSlot: selectedTimeSlot,
      address: matchedAddress,
      paymentMethod: paymentMethod,
      isFirstOrderPromoApplied: isFirstOrderApplied && savings > 0,
      whatsappConfirmed: false,
      orderTime: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setBasketItems([]); // clear cart
    setSuccessToast(`Order Registered: ${orderNo}! Valet assigned.`);
    
    // Jump to tracking screen
    setActiveTab('orders');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrDetails.trim() || !newAddrPhone.trim()) {
      setSuccessToast("Please fill address details & mobile number");
      return;
    }

    const newId = `addr-${Date.now()}`;
    const newAddrObj: Address = {
      id: newId,
      label: newAddrLabel,
      details: newAddrDetails,
      landmark: newAddrLandmark,
      phone: newAddrPhone
    };

    setAddresses([...addresses, newAddrObj]);
    setSelectedAddressId(newId);
    setNewAddrDetails('');
    setNewAddrPhone('');
    setNewAddrLandmark('');
    setIsAddrModalOpen(false);
    setSuccessToast("Secure delivery pickup point saved!");
  };

  return (
    <div className="h-[100dvh] md:h-screen w-screen bg-[#EBF5EE] flex items-center justify-center font-sans selection:bg-brand-yellow/30 selection:text-brand-navy overflow-hidden text-slate-800">
      
      {/* Decorative Brand Circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-light-green/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -24, x: '-50%' }}
            animate={{ opacity: 1, y: 16, x: '-50%' }}
            exit={{ opacity: 0, y: -24, x: '-50%' }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-brand-navy text-[#FAFDFB] rounded-2xl py-4 px-5 shadow-[0_20px_50px_rgba(11,47,100,0.25)] z-50 border-2 border-brand-yellow flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow animate-ping shrink-0"></div>
            <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">{successToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOUTIQUE GARMENT WORKSPACE CONTAINER */}
      <div className="w-full max-w-md mx-auto h-[100dvh] md:h-[820px] bg-[#FAFDFB] flex flex-col relative overflow-hidden md:rounded-[40px] md:shadow-[0_30px_70px_rgba(30,81,40,0.12)] md:border md:border-brand-green/15 z-10 selection:bg-brand-yellow/30">
        
        {/* MAIN WEB PORTLET APP BODY: Scroll window */}
        <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50">
              
              {/* ===================== tab: HOME ===================== */}
              {activeTab === 'home' && (
                <div className="animate-fade-in space-y-6 pb-6">
                  {/* Dynamic Boutique Hero Header */}
                  <div className="bg-[#FAFDFB] px-5 pt-4.5 pb-6 border-b border-gray-150/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Logo size="sm" />
                        <div>
                          <h1 className="text-xl font-black text-brand-navy tracking-tight uppercase leading-none">
                            Fresh & Fold
                          </h1>
                          <p className="text-[9px] text-[#4E9F3D] uppercase tracking-widest font-mono font-black mt-1">
                            Triplicane Chennai
                          </p>
                        </div>
                      </div>
                      <a 
                        href="tel:9444346259"
                        className="bg-brand-navy text-white hover:bg-brand-green text-[9px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-brand-yellow" />
                        <span>Hotline</span>
                      </a>
                    </div>

                    {/* Fresh Clothes Zero Hassle Promo poster details */}
                    <div className="bg-brand-green text-white p-5 rounded-3xl relative overflow-hidden shadow-sm flex flex-col justify-between h-44">
                      {/* Abstract scooter leaf vector */}
                      <Truck className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 -rotate-12 pointer-events-none text-white" />
                      <div className="absolute right-6 top-6 w-16 h-16 rounded-full border-4 border-brand-light-green/10"></div>
                      
                      <div className="space-y-1.5 z-10">
                        <span className="bg-brand-yellow text-brand-navy text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest inline-block select-none">
                          The Happy Choice
                        </span>
                        <h2 className="text-xl font-serif font-black tracking-tight leading-snug">
                          FRESH CLOTHES,<br />ZERO HASSLE!
                        </h2>
                        <p className="text-[10px] text-brand-light-green/95 font-semibold">
                          We Pickup, Clean, Iron & Deliver - So You Can Relax!
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-brand-light-green/20 pt-2.5 z-10">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#D8E9A8] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>Same-Day Pickup Available</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('booking')}
                          className="bg-brand-yellow hover:bg-[#FAFDFB] text-brand-navy text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full transition-all hover:scale-105"
                        >
                          Book Valet
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PROMOTIONS DISPLAY GRID */}
                  <div className="px-5">
                    <PromoBanner 
                      isFirstOrderApplied={isFirstOrderApplied}
                      totalSavings={60}
                    />
                  </div>

                  {/* 5-STAGE PIPELINE CAROUSEL EXPLAINER */}
                  <div className="px-5">
                    <div className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-3xs space-y-3.5">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <span className="text-[10px] font-mono font-extrabold text-[#1e5128] uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-green" />
                          <span>The 5-Step Process</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          How it works
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-0.5 text-center">
                        {[
                          { icon: <Truck className="w-4 h-4 text-brand-green" />, label: '1. Pickup', desc: 'Doorstep pickup' },
                          { icon: <Sparkles className="w-4 h-4 text-[#4E9F3D]" />, label: '2. Clean', desc: 'Sanitary deep' },
                          { icon: <Sliders className="w-4 h-4 text-brand-yellow" />, label: '3. Iron', desc: 'Steam treatment' },
                          { icon: <Package className="w-4 h-4 text-brand-navy" />, label: '4. Fold', desc: 'Fresh wrap' },
                          { icon: <Home className="w-4 h-4 text-brand-green" />, label: '5. Deliver', desc: 'Free drop' }
                        ].map((p, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="w-9 h-9 mx-auto rounded-full bg-slate-100 flex items-center justify-center border border-gray-100">
                              {p.icon}
                            </div>
                            <h5 className="text-[8px] font-black text-brand-navy uppercase tracking-wider leading-none">{p.label}</h5>
                            <span className="text-[6.5px] text-gray-400 block tracking-tight leading-relaxed">{p.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FAST CONCIERGE GARMENTS BOOKING CTA */}
                  <div className="px-5">
                    <div className="bg-[#FAFDFB] p-5 rounded-3xl border-2 border-brand-green/30 space-y-4 shadow-sm text-center">
                      <Package className="w-10 h-10 text-brand-green mx-auto" />
                      <div className="space-y-1">
                        <h3 className="font-serif font-black text-brand-navy text-lg">Instant Doorstep Carriage</h3>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                          Select the counts of Shirts, Jeans, Sarees, Bedsheets or towels and we'll calculate everything. Pickup and delivery is 100% Free!
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('booking');
                        }}
                        className="w-full bg-brand-green hover:bg-brand-accent text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-md shadow-brand-green/10"
                      >
                        <span>Build Custom Laundry Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SERVING ZONE CALLOUT BADGE */}
                  <div className="mx-5 bg-[#D8E9A8]/20 border border-[#D8E9A8]/45 px-4.5 py-4 rounded-2xl flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-navy shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-brand-navy uppercase tracking-wide">
                        Proudly Serving Triplicane, Chennai
                      </h4>
                      <p className="text-[10px] text-gray-500 font-semibold mt-1 leading-relaxed">
                        We cover Ice House, Chepauk, Royapettah, Pycrofts Road, Car Street, and all surrounding Chennai postal grids!
                      </p>
                    </div>
                  </div>

                  {/* FAQS PREVIEW */}
                  <div className="px-5 space-y-3.5 pt-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Frequently Asked</span>
                    <div className="space-y-2.5">
                      {FAQ_ITEMS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-100 text-left space-y-1.5">
                          <h4 className="text-xs font-bold text-brand-navy flex items-start gap-1.5 leading-snug">
                            <Info className="w-3.5 h-3.5 text-brand-green/80 shrink-0 mt-0.5" />
                            <span>{item.question}</span>
                          </h4>
                          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed pl-5">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AUTHENTIC BRAND TESTIMONIAL CARDS */}
                  <div className="px-5 space-y-3 pt-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">What Chennai Says</span>
                    <div className="bg-[#FAFDFB] rounded-3xl p-4.5 border border-gray-150 space-y-3">
                      <div className="flex gap-1 text-xs text-brand-yellow">
                        {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                      <p className="text-[11px] text-gray-800 italic leading-relaxed font-semibold">
                        "Unbelievable level of alignment! Ironing is flat ₹20, and they picked up from Pycrofts Road within 45 mins. Folded in crisp parcels, very neat!"
                      </p>
                      <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-wider pt-2 border-t border-gray-100">
                        <span>Sudhakar S. • Chennai</span>
                        <span>Triplicane Customer</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom trademark brand text */}
                  <div className="text-center pt-6 pb-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    💚 Fresh Clothes. Happy You. 💚
                  </div>
                </div>
              )}

              {/* ===================== tab: BOOKING ===================== */}
              {activeTab === 'booking' && (
                <div className="animate-fade-in space-y-5 px-5 pt-4.5 pb-6">
                  {/* Form Header */}
                  <div className="bg-[#FAFDFB] p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-brand-navy uppercase tracking-tight">Atelier Step Booking</h2>
                      <span className="text-[9px] text-[#4E9F3D] uppercase tracking-widest font-mono font-black block mt-0.5">
                        Step {bookingStep} of 3 • Chennai Doorstep
                      </span>
                    </div>
                    <ShoppingBag className="w-5 h-5 text-brand-green" />
                  </div>

                  {/* Progressive Stepper Indicator */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-3xs select-none">
                    {[
                      { step: 1, title: 'Garments', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                      { step: 2, title: 'Schedule', icon: <Clock className="w-3.5 h-3.5" /> },
                      { step: 3, title: 'Spot & Pay', icon: <MapPin className="w-3.5 h-3.5" /> },
                    ].map((s, idx) => {
                      const isActive = bookingStep === s.step;
                      const isCompleted = bookingStep > s.step;
                      const isDisabled = s.step > 1 && basketItems.length === 0;

                      return (
                        <React.Fragment key={s.step}>
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setBookingStep(s.step)}
                            className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer transition-all"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                              isActive 
                                ? 'bg-brand-green text-white ring-4 ring-brand-green/20 scale-105' 
                                : isCompleted 
                                  ? 'bg-brand-navy text-[#FAFDFB]' 
                                  : 'bg-slate-100 text-gray-400 group-hover:bg-slate-205'
                            }`}>
                              {isCompleted ? '✓' : s.step}
                            </div>
                            <span className={`text-[8.5px] uppercase tracking-wider font-extrabold mt-1.5 transition-colors ${isActive ? 'text-brand-green' : 'text-gray-400'}`}>
                              {s.title}
                            </span>
                          </button>
                          {idx < 2 && (
                            <div className={`h-0.5 w-6 transition-all ${bookingStep > s.step ? 'bg-brand-navy' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* ACTIVE STEP ANIMATION ROUTING */}
                  <AnimatePresence mode="wait">
                    {bookingStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {/* Toggle first order coupon */}
                        <div className="bg-white p-3.5 rounded-2xl border border-red-200/50 flex items-center justify-between text-xs shadow-3xs">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-brand-accent shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800 block">First Order Promo (3 Shirts Free)</span>
                              <span className="text-[9.5px] text-gray-400 block font-semibold font-mono">Save ₹60 on ironing</span>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isFirstOrderApplied}
                              onChange={(e) => {
                                setIsFirstOrderApplied(e.target.checked);
                                setSuccessToast(e.target.checked ? "Activated first order free-laundry offer!" : "Deactivated first order promo.");
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        {/* Garment picker core interface */}
                        <GarmentPicker 
                          selectedItems={basketItems}
                          onItemsChange={setBasketItems}
                          isFirstOrderApplied={isFirstOrderApplied}
                        />

                        {/* Step 1 Control Bar */}
                        <div className="pt-2">
                          {basketItems.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setBookingStep(2)}
                              className="w-full bg-brand-green hover:bg-brand-accent text-[#FAFDFB] text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-brand-green/10 animate-pulse"
                            >
                              <span>Choose Pickup Schedule</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center space-y-2">
                              <ShoppingBag className="w-6 h-6 text-emerald-600/60 mx-auto" />
                              <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                                Please add some garments (count Shirts, Trousers, Sarees, etc. above) to start your zero-charge doorstep pickup carriage process.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {bookingStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        {/* Pick a carriage date */}
                        <div className="space-y-2 text-left">
                          <span className="text-xs uppercase tracking-widest font-mono font-black text-brand-navy block">1. Select Valet Pickup Day</span>
                          <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2].map((offset) => {
                              const d = new Date();
                              d.setDate(d.getDate() + offset);
                              const dayName = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
                              const isSelected = selectedDateOffset === offset;

                              return (
                                <button
                                  key={offset}
                                  type="button"
                                  onClick={() => setSelectedDateOffset(offset)}
                                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-brand-navy text-[#FAFDFB] border-brand-navy shadow-sm' 
                                      : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="text-[10px] font-sans font-bold tracking-widest block uppercase">{dayName}</span>
                                  <span className="text-[8px] block opacity-85 mt-1 font-mono font-bold">
                                    {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Time Slot List */}
                        <div className="space-y-2 text-left">
                          <span className="text-xs uppercase tracking-widest font-mono font-black text-brand-navy block">2. Select Valet Hour window</span>
                          <div className="grid grid-cols-1 gap-2">
                            {TIME_SLOTS.map((slot) => {
                              const isSelected = selectedTimeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                                    isSelected 
                                      ? 'bg-white border-brand-green text-brand-navy shadow-3xs ring-1 ring-brand-green/35' 
                                      : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="font-semibold">{slot}</span>
                                  {isSelected ? (
                                    <span className="w-4 h-4 bg-brand-green rounded-full flex items-center justify-center text-[9px] text-white">✓</span>
                                  ) : (
                                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation Buttons for Step 2 */}
                        <div className="flex gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(1)}
                            className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider py-4 px-5 rounded-xl cursor-pointer transition-all active:scale-95"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingStep(3)}
                            className="flex-1 bg-brand-green hover:bg-brand-accent text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-sm"
                          >
                            <span>Confirm Spot & Pay</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {bookingStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        {/* Selection Address Drops */}
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-widest font-mono font-black text-brand-navy">1. Carriage Spot Address</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddrModalOpen(true);
                                setNewAddrLabel('Home');
                                setNewAddrDetails('');
                                setNewAddrPhone('');
                                setNewAddrLandmark('');
                              }}
                              className="text-[9px] text-[#4E9F3D] font-black uppercase hover:underline font-mono"
                            >
                              + Add Spot
                            </button>
                          </div>

                          <div className="space-y-2">
                            {addresses.map((addr) => {
                              const isSelected = selectedAddressId === addr.id;
                              return (
                                <button
                                  key={addr.id}
                                  type="button"
                                  onClick={() => setSelectedAddressId(addr.id)}
                                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-[#FAFDFB] border-brand-green shadow-3xs' 
                                      : 'bg-white border-gray-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-brand-green' : 'text-gray-400'}`} />
                                  <div>
                                    <span className="text-[9px] font-sans font-black uppercase tracking-wider text-slate-800 block">
                                      {addr.label}
                                    </span>
                                    <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 font-semibold">
                                      {addr.details}
                                    </span>
                                    <div className="flex gap-2 text-[8px] text-gray-400 font-bold mt-1 uppercase">
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-2 h-2 text-gray-400" />
                                        <span>{addr.phone}</span>
                                      </span>
                                      {addr.landmark && <span>• Landmark: {addr.landmark}</span>}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Payment Mode Toggles */}
                        <div className="space-y-2 text-left">
                          <span className="text-xs uppercase tracking-widest font-mono font-black text-brand-navy block">2. Payment Terms</span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {[
                              { id: 'cash_on_delivery', title: 'Cash / UPI on Delivery', subtitle: 'Pay when valet delivers clothes' },
                              { id: 'online_payment', title: 'Secured UPI Link SMS', subtitle: 'SMS digital payment invoice link' },
                              { id: 'whatsapp', title: 'WhatsApp PDF billing', subtitle: 'Approve weights before digital payment' }
                            ].map(pay => {
                              const isSelected = paymentMethod === pay.id;
                              return (
                                <button
                                  key={pay.id}
                                  type="button"
                                  onClick={() => setPaymentMethod(pay.id as any)}
                                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-[#FAFDFB] border-brand-navy shadow-3xs ring-1 ring-brand-navy/10' 
                                      : 'bg-white border-gray-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {isSelected ? (
                                      <div className="w-3.5 h-3.5 rounded-full bg-brand-green flex items-center justify-center text-[8px] text-white font-bold">✓</div>
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-[10.5px] font-bold text-slate-800 block leading-none">{pay.title}</span>
                                    <span className="text-[8.5px] text-gray-400 block leading-tight mt-0.5 font-semibold">{pay.subtitle}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* COMPREHENSIVE RECAP CARD */}
                        <div className="bg-[#FAFDFB] border border-brand-green/15 rounded-2xl p-4 text-left space-y-2.5 shadow-3xs">
                          <span className="text-[9px] font-mono uppercase font-black tracking-widest text-brand-green block">Order Billing Breakdown</span>
                          
                          <div className="text-[11px] font-semibold text-gray-600 space-y-1">
                            {basketItems.map((item, idx) => {
                              let garmentLabel = item.id.toUpperCase();
                              let rate = 20;
                              if (item.id === 'shirt') rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 55 : 110;
                              else if (item.id === 'trouser') rate = item.service === 'ironing' ? 20 : item.service === 'wash_iron' ? 60 : 120;
                              else if (item.id === 'saree') rate = item.service === 'ironing' ? 40 : item.service === 'wash_iron' ? 99 : 220;
                              else if (item.id === 'bedsheet') rate = 50;

                              const amt = rate * item.quantity;
                              return (
                                <div key={idx} className="flex justify-between">
                                  <span>{item.quantity}x {garmentLabel} ({item.service === 'ironing' ? 'Iron' : item.service === 'wash_iron' ? 'Wash+Iron' : 'Dry Clean'})</span>
                                  <span>₹{amt}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="border-t border-gray-100 pt-2 flex flex-col gap-1 text-[11px] font-bold text-slate-700">
                            <div className="flex justify-between font-medium text-gray-400 text-[10px]">
                              <span>Subtotal</span>
                              <span>₹{getBasketTotals().subtotal}</span>
                            </div>
                            {getBasketTotals().savings > 0 && (
                              <div className="flex justify-between text-red-500 text-[10px]">
                                <span>3 Shirts Free Discount</span>
                                <span>-₹{getBasketTotals().savings}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-brand-navy text-xs pt-1 border-t border-dashed border-gray-100">
                              <span>Grand Estimate Total</span>
                              <span className="text-sm font-black text-brand-green font-mono">₹{getBasketTotals().finalAmount}</span>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-2 flex items-center gap-1.5 text-[8.5px] font-mono text-gray-400 font-extrabold uppercase">
                            <Clock className="w-3 h-3 text-brand-accent shrink-0" />
                            <span>Scheduled: Day+{selectedDateOffset} ({selectedTimeSlot})</span>
                          </div>
                        </div>

                        {/* Bottom Navigation Control Bar */}
                        <div className="flex gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setBookingStep(2)}
                            className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider py-4.5 px-5 rounded-xl cursor-pointer transition-all active:scale-95"
                          >
                            Back
                          </button>
                          
                          <button
                            onClick={handlePlaceOrder}
                            className="flex-1 bg-brand-green hover:bg-brand-accent text-white font-black py-4.5 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-md shadow-brand-green/10"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Truck className="w-4 h-4 text-white" />
                              <span>Confirm Booking</span>
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ===================== tab: ORDERS TRACKING ===================== */}
              {activeTab === 'orders' && (
                <div className="animate-fade-in space-y-6 px-5 pt-4.5">
                  <div className="bg-[#FAFDFB] p-4.5 rounded-3xl border border-gray-100 shadow-3xs flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-brand-navy uppercase tracking-tight">Your Care History</h2>
                      <span className="text-[9px] text-[#4E9F3D] uppercase tracking-widest font-mono font-black block mt-0.5">
                        Triplicane Trackers
                      </span>
                    </div>
                    <Truck className="w-6 h-6 text-brand-green shrink-0" />
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderTracker
                        key={order.id}
                        status={order.status}
                        orderId={order.id}
                        itemsDescription={order.itemsDescription}
                        totalPrice={order.totalPrice}
                        pickupDate={order.pickupDate}
                        pickupTimeSlot={order.pickupTimeSlot}
                        addressDetails={order.address.details}
                        paymentMethod={order.paymentMethod}
                        interactive={true}
                        onAdvanceClick={() => handleAdvanceStatus(order.id)}
                      />
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
                        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-brand-navy">No order logs yet</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[240px] mx-auto">
                          Once you dispatch a scooter valet, your real-time 5-step status cycle will list here.
                        </p>
                        <button
                          onClick={() => setActiveTab('booking')}
                          className="mt-4 text-[10px] bg-brand-green text-white px-4.5 py-2.5 rounded-xl uppercase tracking-widest font-black"
                        >
                          Book Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===================== tab: SUPPORT ===================== */}
              {activeTab === 'support' && (
                <div className="animate-fade-in space-y-6 px-5 pt-4.5">
                  <div className="bg-[#FAFDFB] p-4.5 rounded-3xl border border-gray-100 shadow-3xs flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-brand-navy uppercase tracking-tight">Concierge Desk</h2>
                      <span className="text-[9px] text-[#4E9F3D] uppercase tracking-widest font-mono font-black block mt-0.5">
                        Triplicane Chennai Core
                      </span>
                    </div>
                    <Sparkles className="w-5 h-5 text-brand-green" />
                  </div>

                  <SupportPanel />

                  {/* FAQS */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Frequently Asked (Zero Hassle Guarantee)</span>
                    <div className="space-y-2.5">
                      {FAQ_ITEMS.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 text-left space-y-2">
                          <h4 className="text-xs font-black text-brand-navy flex items-start gap-1.5 leading-snug">
                            <Info className="w-3.5 h-3.5 text-brand-green/80 shrink-0 mt-0.5" />
                            <span>{item.question}</span>
                          </h4>
                          <p className="text-[10px] text-gray-505 leading-relaxed pl-5 font-semibold text-gray-500">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated interactive dynamic bottom navigation bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-brand-navy text-[#FAFDFB] rounded-[24px] h-[68px] flex items-center justify-around px-2.5 shadow-[0_15px_40px_rgba(11,47,100,0.3)] z-40 border border-white/5">
              {[
                { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
                { id: 'booking', label: 'Book', icon: <ShoppingBag className="w-5 h-5" />, badge: basketItems.length },
                { id: 'orders', label: 'Track', icon: <Truck className="w-5 h-5" />, badge: orders.filter(o => o.status !== 'Delivered').length },
                { id: 'support', label: 'Support', icon: <MessageSquare className="w-5 h-5" /> }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center flex-1 h-full font-bold relative transition-all cursor-pointer ${
                      isSelected ? 'text-brand-yellow font-black scale-105' : 'text-[#FAFDFB]/75 hover:text-[#FAFDFB]'
                    }`}
                  >
                    <span className="flex items-center justify-center h-5 w-5">{tab.icon}</span>
                    <span className="text-[8px] uppercase tracking-widest mt-1 scale-95 font-sans font-black">{tab.label}</span>
                    
                    {/* Badge alert count bubble */}
                    {tab.badge && tab.badge > 0 ? (
                      <span className="absolute top-2.5 right-4.5 bg-brand-yellow text-brand-navy text-[8px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-brand-navy">
                        {tab.badge}
                      </span>
                    ) : null}

                    {isSelected && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute bottom-1 w-5 h-1 bg-brand-yellow rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      {/* ADDRESS MODIFICATION OVERLAY PANEL */}
      <AnimatePresence>
        {isAddrModalOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAFDFB] w-full max-w-sm rounded-[32px] p-5.5 space-y-4 border border-emerald-100 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-black text-brand-navy text-sm">Save New Delivery Spot</h3>
                <button
                  onClick={() => setIsAddrModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-gray-400 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs font-semibold text-slate-800">
                <div className="space-y-1.5 animate-fade-in-down">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-black">Spot Tag Label</span>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'PG/Hostel', 'Other'].map(lbl => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewAddrLabel(lbl as any)}
                        className={`py-1.5 px-3.5 rounded-lg border text-[11px] font-black tracking-wider uppercase transition-colors ${
                          newAddrLabel === lbl ? 'bg-brand-navy text-white' : 'bg-slate-55 bg-slate-50 border-gray-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-black">Atelier Delivery Address Details</span>
                  <textarea
                    rows={2}
                    value={newAddrDetails}
                    onChange={(e) => setNewAddrDetails(e.target.value)}
                    placeholder="Enter street and house details in Chennai (e.g. 12 Pycrofts Road, Triplicane)..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-green font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-black">Contact Mobile Number</span>
                  <input
                    type="tel"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile phone..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-green font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-black">Landmark (Optional)</span>
                  <input
                    type="text"
                    value={newAddrLandmark}
                    onChange={(e) => setNewAddrLandmark(e.target.value)}
                    placeholder="E.g. Near Star Theatre..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-green font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-brand-accent text-white font-black py-3 rounded-xl uppercase tracking-wider text-[11px] transition-colors mt-2"
                >
                  Save Carriage Destination
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
