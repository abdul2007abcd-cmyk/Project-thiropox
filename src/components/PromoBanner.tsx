import React from 'react';
import { Gift, Sparkles, Tag, Check, HelpCircle, Truck } from 'lucide-react';

interface PromoBannerProps {
  onApplyPromo?: (promoId: string) => void;
  isFirstOrderApplied: boolean;
  totalSavings: number;
}

export default function PromoBanner({ onApplyPromo, isFirstOrderApplied, totalSavings }: PromoBannerProps) {
  return (
    <div className="space-y-4">
      {/* FREE PICKUP & DELIVERY - AT YOUR DOORSTEP BAR */}
      <div className="w-full bg-brand-navy rounded-2xl p-3 border-2 border-brand-yellow flex items-center justify-between shadow-lg relative overflow-hidden">
        {/* Decorative scooter icon */}
        <Truck className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 rotate-12 pointer-events-none text-white shrink-0" />
        
        <div className="flex items-center gap-2.5 z-10">
          <div className="bg-brand-yellow text-brand-navy text-[11px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
            <Truck className="w-3 text-brand-navy shrink-0" />
            <span>Free</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold leading-tight uppercase tracking-wider">
              Pickup & Delivery
            </h4>
            <p className="text-[10px] text-[#FAFDFB]/80 font-semibold">
              At your doorstep (No extra charge!)
            </p>
          </div>
        </div>
        <span className="text-[9px] bg-brand-accent text-white px-2.5 py-1 rounded-full font-mono uppercase tracking-widest shrink-0 font-extrabold mr-1">
          100% Free
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* IRONING ONLY ₹20 BAR – Matching the specific design of the left side of the Flyer */}
        <div className="bg-white rounded-3xl border-2 border-brand-green p-4 flex flex-col justify-between shadow-xs relative overflow-hidden select-none hover:shadow-md transition-all">
          <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 text-brand-green pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-2.5">
            <span className="bg-brand-green text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest">
              Ironing Only
            </span>
            <span className="text-[10px] text-brand-accent font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>Neatly & Perfect</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-sans text-xs font-extrabold italic transform -rotate-6">Only</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-serif font-black text-brand-navy">₹20</span>
              <span className="text-[11px] font-bold text-gray-505 text-gray-500 uppercase tracking-widest">per item</span>
            </div>
          </div>

          <div className="mt-3 bg-brand-yellow/10 border border-brand-yellow/35 text-brand-navy rounded-xl px-3 py-2 text-[10px] font-extrabold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>NO HIDDEN CHARGES! Flat price for any garment.</span>
          </div>
        </div>

        {/* SPECIAL OFFER! FIRST 3 SHIRTS FREE IRONING - Right side of Flyer */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-red-500 p-4 flex flex-col justify-between shadow-xs relative overflow-hidden select-none hover:shadow-md transition-all">
          {/* Top-right Gift icon visual */}
          <div className="absolute right-3 top-3 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-3xs">
            <Gift className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider inline-block">
              SPECIAL OFFER!
            </span>
            <h3 className="text-brand-navy font-black text-base tracking-tight leading-snug">
              FIRST 3 SHIRTS <br />
              <span className="text-red-500 uppercase font-black tracking-wide">FREE IRONING</span>
            </h3>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-red-50 pt-2.5">
            <div>
              <span className="text-[9px] text-gray-400 block font-semibold">*For New Customers Only</span>
              {isFirstOrderApplied && (
                <span className="text-[10px] text-brand-accent font-black tracking-widest uppercase flex items-center gap-1 mt-0.5 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Auto-applied ₹60 Saved!
                </span>
              )}
            </div>
            {!isFirstOrderApplied && onApplyPromo && (
              <button
                onClick={() => onApplyPromo('first_3_free')}
                className="bg-brand-navy hover:bg-brand-green text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Apply Coupon
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
