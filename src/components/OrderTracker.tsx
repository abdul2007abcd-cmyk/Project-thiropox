import React from 'react';
import { Truck, CheckCircle, Smartphone, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface OrderTrackerProps {
  status: 'Scheduled' | 'Picked Up' | 'Cleaning' | 'Ironing' | 'Folded' | 'Delivered';
  orderId: string;
  itemsDescription: string;
  totalPrice: number;
  pickupDate: string;
  pickupTimeSlot: string;
  addressDetails: string;
  paymentMethod: string;
  onAdvanceClick?: () => void;
  interactive?: boolean;
}

export default function OrderTracker({
  status,
  orderId,
  itemsDescription,
  totalPrice,
  pickupDate,
  pickupTimeSlot,
  addressDetails,
  paymentMethod,
  onAdvanceClick,
  interactive = false
}: OrderTrackerProps) {
  
  // High fidelity five-steps from flyer:
  // PICKUP -> CLEAN -> IRON -> FOLD -> DELIVER
  const steps = [
    { label: 'PICKUP', statusMatch: ['Scheduled', 'Picked Up'], desc: 'Scooter dispatched' },
    { label: 'CLEAN', statusMatch: ['Cleaning'], desc: 'Eco botanical bath' },
    { label: 'IRON', statusMatch: ['Ironing'], desc: 'Deep steam press' },
    { label: 'FOLD', statusMatch: ['Folded'], desc: 'Hand packaging' },
    { label: 'DELIVER', statusMatch: ['Delivered'], desc: 'Doorstep arrival' }
  ];

  // Helper to determine step visual state
  const getStepState = (stepIndex: number) => {
    const currentStatusIndex = ['Scheduled', 'Picked Up', 'Cleaning', 'Ironing', 'Folded', 'Delivered'].indexOf(status);
    
    // Scheduled is index 0, Picked Up is 1, Cleaning is 2, Ironing is 3, Folded is 4, Delivered is 5
    // Let's map current index to step columns
    let activeStepIndex = 0;
    if (status === 'Scheduled') activeStepIndex = 0;
    else if (status === 'Picked Up') activeStepIndex = 0;
    else if (status === 'Cleaning') activeStepIndex = 1;
    else if (status === 'Ironing') activeStepIndex = 2;
    else if (status === 'Folded') activeStepIndex = 3;
    else if (status === 'Delivered') activeStepIndex = 4;

    if (currentStatusIndex === 5) {
      return 'completed'; // Entire process is finished
    }

    if (stepIndex < activeStepIndex) {
      return 'completed';
    } else if (stepIndex === activeStepIndex) {
      return 'active';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-150/70 shadow-sm space-y-5 text-left relative overflow-hidden">
      {/* Absolute faint background water bubble circle accent */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-[#FAFDFB] rounded-full -mr-8 -mt-8 pointer-events-none border border-gray-50"></div>

      {/* Header Info */}
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <span className="text-[9px] font-mono font-black text-brand-accent uppercase tracking-wider block">Atelier Order Voucher</span>
          <h3 className="font-serif font-black text-brand-navy text-sm tracking-wide">ID: {orderId}</h3>
        </div>
        <span className={`text-[10px] font-sans font-black uppercase px-3 py-1 rounded-full ${
          status === 'Delivered' 
            ? 'bg-emerald-100 text-[#1e5128]' 
            : 'bg-brand-yellow/15 text-brand-navy border border-brand-yellow/30'
        }`}>
          {status}
        </span>
      </div>

      <p className="text-xs font-bold text-gray-700 leading-tight">
        {itemsDescription}
      </p>

      {/* Visual Five Step Pipeline from Flyer */}
      <div className="space-y-3.5">
        <span className="text-[9px] font-mono text-gray-400 font-extrabold uppercase tracking-widest block">
          5-Stage Fresh & Fold cycle
        </span>

        <div className="flex items-center justify-between relative pt-1">
          {/* Horizontal Connector Line */}
          <div className="absolute top-4 left-[5%] right-[5%] h-0.5 bg-gray-100 -z-0"></div>
          
          {steps.map((step, idx) => {
            const state = getStepState(idx);
            return (
              <div key={idx} className="flex flex-col items-center flex-1 z-10 relative">
                {/* Circle Marker */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  state === 'completed' 
                    ? 'bg-brand-green text-white shadow-xs' 
                    : state === 'active' 
                    ? 'bg-brand-yellow text-brand-navy border-2 border-brand-navy animate-pulse shadow-md font-boldScale'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {state === 'completed' ? (
                    <span className="text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                  )}
                </div>
                
                {/* Step Name */}
                <span className={`text-[9px] font-black uppercase mt-1.5 tracking-wider ${
                  state === 'active' ? 'text-brand-navy font-black' : state === 'completed' ? 'text-[#1e5128]' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>

                {/* mini status context indicator */}
                <span className="text-[7px] text-gray-400 scale-90 whitespace-nowrap mt-0.5 font-semibold">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Parameters details */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-[11px] text-gray-600 font-semibold leading-relaxed">
        <div className="flex justify-between">
          <span>Scheduled Pickup Time:</span>
          <span className="font-bold text-brand-navy">{pickupDate} | {pickupTimeSlot}</span>
        </div>
        <div className="flex items-start justify-between gap-3 text-wrap">
          <span className="shrink-0">Concierge Carriage Spot:</span>
          <span className="text-right text-[#1e5128] font-bold line-clamp-1 truncate max-w-[190px]">
            {addressDetails}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-200/55 pt-1.5">
          <span>Payment Terms:</span>
          <span className="font-bold text-brand-navy uppercase text-[10px]">
            {paymentMethod === 'cash_on_delivery' ? 'Cash/UPI at Doorstep' : paymentMethod === 'online_payment' ? 'Secured Online Link' : 'WhatsApp Final Invoice'}
          </span>
        </div>
        <div className="flex justify-between font-black text-brand-navy text-xs border-t border-slate-200/55 pt-1.5">
          <span>Order Price Total:</span>
          <span className="text-brand-green font-mono text-sm leading-none">₹{totalPrice}</span>
        </div>
      </div>

      {/* Interactive Advancement simulation button ONLY when sandbox mode */}
      {interactive && onAdvanceClick && (
        <button
          onClick={onAdvanceClick}
          className="w-full bg-brand-green hover:bg-brand-accent text-[#FAFDFB] text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
          <span>Fast-Forward Cycle (Advance Order Stage)</span>
        </button>
      )}
    </div>
  );
}
