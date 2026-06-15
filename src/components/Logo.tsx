import React from 'react';
import { Shirt, Award, Leaf, Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const containerClasses = {
    sm: 'w-16 h-16 text-[10px]',
    md: 'w-28 h-28 text-xs',
    lg: 'w-48 h-48 text-sm'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-[5px]',
    md: 'text-[8px]',
    lg: 'text-[11px]'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Circle with Leaf & Border */}
      <div className={`rounded-full border-4 border-brand-green bg-white flex flex-col items-center justify-center relative shadow-md ${containerClasses[size]}`}>
        {/* Hanger Icon at the top inside */}
        <div className="absolute top-[10%] text-brand-green/80 flex flex-col items-center">
          <svg className="w-1/3 max-w-[24px] h-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" />
            <path d="M12 5v3" />
            <path d="M12 8L2 14c0 2 2 3 4 3h12c2 0 4-1 4-3L12 8z" />
          </svg>
        </div>

        {/* Botanical leaves accents on the side */}
        <div className="absolute left-[8%] top-[25%] text-brand-accent transform -rotate-12 select-none pointer-events-none">
          <Leaf className="w-5 h-5 text-brand-green fill-current" />
        </div>
        <div className="absolute right-[8%] top-[18%] text-brand-accent/80 transform rotate-12 select-none pointer-events-none">
          <Sparkles className="w-4 h-4 text-brand-yellow fill-current" />
        </div>

        {/* Fresh Text */}
        <div className={`font-serif font-black italic text-brand-navy ${titleSizes[size]} tracking-tight leading-none mt-4 flex flex-col items-center`}>
          <span className="text-brand-green not-italic font-extrabold tracking-wide">Fresh</span>
          <span className="text-brand-yellow font-serif text-[85%] -mt-1 font-black">& Fold</span>
        </div>

        {/* Laundry Pickup & Delivery Bottom Ring Text */}
        <div className={`absolute bottom-[10%] text-center text-brand-green font-mono uppercase font-black font-extrabold tracking-widest ${subtitleSizes[size]} w-[85%] border-t border-brand-light-green/20 pt-1`}>
          Pickup & Delivery
        </div>
      </div>
    </div>
  );
}
