import React, { useState } from 'react';
import { Garment, ServiceType, SelectedItem } from '../types';
import { LOCAL_GARMENTS } from '../data';
import { 
  Plus, Minus, Check, ShoppingCart, Trash2, ArrowRight,
  Shirt, Sparkles, Layers, RefreshCw, Scissors, Smile, Heart, Folder, ShoppingBag 
} from 'lucide-react';

function getGarmentIcon(id: string) {
  switch (id) {
    case 'shirt':
      return <Shirt className="w-5 h-5 text-brand-green" />;
    case 'trouser':
      return <Layers className="w-5 h-5 text-brand-green" />;
    case 'kurtis':
      return <Heart className="w-5 h-5 text-brand-green" />;
    case 'saree':
      return <Sparkles className="w-5 h-5 text-brand-green" />;
    case 'bedsheet':
      return <Folder className="w-5 h-5 text-brand-green" />;
    case 'towel':
      return <RefreshCw className="w-5 h-5 text-brand-green" />;
    case 'kidswear':
      return <Smile className="w-5 h-5 text-brand-green" />;
    case 'suit':
      return <Scissors className="w-5 h-5 text-brand-green" />;
    default:
      return <Shirt className="w-5 h-5 text-brand-green" />;
  }
}

interface GarmentPickerProps {
  selectedItems: SelectedItem[];
  onItemsChange: (items: SelectedItem[]) => void;
  isFirstOrderApplied: boolean;
}

export default function GarmentPicker({ selectedItems, onItemsChange, isFirstOrderApplied }: GarmentPickerProps) {
  const [activeTab, setActiveTab] = useState<ServiceType>('ironing');
  const [searchWord, setSearchWord] = useState('');

  const handleUpdateQty = (garmentId: string, service: ServiceType, change: number) => {
    const existing = selectedItems.find(item => item.id === garmentId && item.service === service);
    
    if (existing) {
      const newQty = existing.quantity + change;
      if (newQty <= 0) {
        onItemsChange(selectedItems.filter(item => !(item.id === garmentId && item.service === service)));
      } else {
        onItemsChange(selectedItems.map(item => 
          (item.id === garmentId && item.service === service) ? { ...item, quantity: newQty } : item
        ));
      }
    } else if (change > 0) {
      onItemsChange([...selectedItems, { id: garmentId, quantity: change, service }]);
    }
  };

  const handleClearBasket = () => {
    onItemsChange([]);
  };

  const getQuantityFor = (garmentId: string, service: ServiceType): number => {
    return selectedItems.find(item => item.id === garmentId && item.service === service)?.quantity || 0;
  };

  // Pricing rules matching the reference flyer
  // Ironing flat ₹20/item, others as defined in local data.
  const getDisplayPrice = (garment: Garment, service: ServiceType) => {
    if (service === 'ironing') {
      return garment.prices.ironing; // Shirts/Jeans flat ₹20, Kidswear/towel flat ₹15, sarees ₹40
    } else if (service === 'wash_iron') {
      return garment.prices.wash_iron;
    } else {
      return garment.prices.dry_clean;
    }
  };

  // Filter garments based on search word
  const filteredGarments = LOCAL_GARMENTS.filter(g => 
    g.name.toLowerCase().includes(searchWord.toLowerCase())
  );

  // Cart totals calculation
  const getSubtotal = () => {
    let sub = 0;
    let shirtIronQty = 0;

    selectedItems.forEach(item => {
      const garment = LOCAL_GARMENTS.find(g => g.id === item.id);
      if (!garment) return;
      
      const price = getDisplayPrice(garment, item.service);
      
      if (item.service === 'ironing' && item.id === 'shirt') {
        shirtIronQty += item.quantity;
      }
      
      sub += price * item.quantity;
    });

    // Apply "First 3 shirts free ironing" deduction if true
    let savings = 0;
    if (isFirstOrderApplied && shirtIronQty > 0) {
      const freeCount = Math.min(3, shirtIronQty);
      savings = freeCount * 20; // 20 per shirt
    }

    return {
      rawSubtotal: sub,
      savings: savings,
      finalSubtotal: Math.max(0, sub - savings)
    };
  };

  const totals = getSubtotal();

  return (
    <div className="space-y-4">
      {/* Service Type Selection Tabs - Identical to flyer categories */}
      <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200">
        {[
          { id: 'ironing', label: 'Ironing Only', badge: '₹20' },
          { id: 'wash_iron', label: 'Wash + Iron', badge: 'Deep' },
          { id: 'dry_clean', label: 'Dry Clean', badge: 'Care' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as ServiceType)}
            className={`py-3 rounded-xl text-xs uppercase font-sans tracking-wider font-extrabold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[8px] font-mono font-black py-0.5 px-2 rounded-full ${activeTab === tab.id ? 'bg-brand-yellow text-brand-navy' : 'bg-gray-200'}`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Garments Grid under "WE HANDLE" */}
      <div className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-widest text-[#1e5128] font-extrabold flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-brand-green" />
            <span>We Handle & Custom-Care</span>
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Select Quantities
          </span>
        </div>

        {/* Search within garments */}
        <input 
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Filter items (e.g. Sarees, Jeans, Bedsheets...)"
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-green font-medium"
        />

        <div className="grid grid-cols-1 divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1 no-scrollbar">
          {filteredGarments.map(garment => {
            const qty = getQuantityFor(garment.id, activeTab);
            const itemPrice = getDisplayPrice(garment, activeTab);
            const isShirtFreeIroningPromoMatched = isFirstOrderApplied && activeTab === 'ironing' && garment.id === 'shirt';

            return (
              <div key={garment.id} className="py-3 flex items-center justify-between gap-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shadow-3xs">
                    {getGarmentIcon(garment.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1.5 leading-snug">
                      {garment.name}
                      {garment.popular && (
                        <span className="bg-brand-accent/15 text-[#1e5128] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-brand-accent block mt-0.5">
                      ₹{itemPrice} per item
                      {isShirtFreeIroningPromoMatched && (
                        <span className="text-red-500 font-extrabold ml-1.5 uppercase text-[8px]">
                          (First 3 Free!)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Counter controls */}
                <div className="flex items-center gap-2">
                  {qty > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(garment.id, activeTab, -1)}
                        className="w-8 h-8 rounded-lg border border-gray-250 bg-white hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-gray-550 transition-colors active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-xs text-brand-navy">
                        {qty}
                      </span>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleUpdateQty(garment.id, activeTab, 1)}
                    className="h-8 px-2.5 rounded-lg bg-brand-green hover:bg-brand-accent text-white flex items-center justify-center gap-1 text-xs font-extrabold tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {qty === 0 && <span>Add</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Items Basket Preview */}
      {selectedItems.length > 0 && (
        <div className="bg-emerald-50/50 border border-[#D8E9A8]/40 rounded-3xl p-4.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-emerald-100/60 pb-2.5">
            <span className="text-[11px] font-sans font-extrabold uppercase text-brand-navy flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-brand-accent" />
              Your Laundry Basket
            </span>
            <button
              onClick={handleClearBasket}
              className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 font-bold uppercase transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
            {selectedItems.map((item, index) => {
              const garment = LOCAL_GARMENTS.find(g => g.id === item.id);
              if (!garment) return null;
              const unitPrice = getDisplayPrice(garment, item.service);
              const totalPrice = unitPrice * item.quantity;
              const serviceLabel = item.service === 'ironing' ? 'Iron Only' : item.service === 'wash_iron' ? 'Wash + Iron' : 'Dry Clean';

              return (
                <div key={`${item.id}-${item.service}-${index}`} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-400 font-bold">{item.quantity}x</span>
                    <span className="font-semibold text-brand-navy">{garment.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium uppercase font-bold">
                      {serviceLabel}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-brand-navy">₹{totalPrice}</span>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="pt-2 border-t border-emerald-150/40 space-y-1 text-xs">
            {totals.savings > 0 && (
              <div className="flex items-center justify-between text-red-650 text-red-600 font-bold">
                <span>First Order Discount</span>
                <span>-₹{totals.savings}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-black text-brand-navy text-sm pt-1">
              <span>Total Basket Subtotal</span>
              <span className="font-mono text-base text-brand-green">₹{totals.finalSubtotal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
