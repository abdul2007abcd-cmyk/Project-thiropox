import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Phone, MapPin, Search, Plus, Truck, ShoppingBag, Gift } from 'lucide-react';
import { FAQ_ITEMS } from '../data';

export default function SupportPanel() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Vanakkam! Welcome to Fresh & Fold Chennai support. How can we assist you with your laundry or tailoring pickup today in Triplicane?",
      time: '12:45 PM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Serviceability checker
  const [postalSearch, setPostalSearch] = useState('');
  const [serviceResult, setServiceResult] = useState<string | null>(null);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    setChatLog(prev => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setChatMessage('');
    setIsTyping(true);

    // Simulate smart agent response
    setTimeout(() => {
      let reply = "Got it! Let me check that for you. Our Triplicane hub is fully operational today! If you wish to proceed, you can book instantly through our App form or we can schedule a valet courier directly from here.";
      
      const normalized = userMsg.toLowerCase();
      if (normalized.includes('price') || normalized.includes('rate') || normalized.includes('cost')) {
        reply = "Our rates are highly transparent: Ironing is flat ₹20/item, kids wear ₹15/item. Wash + Iron starts at ₹55/item. No hidden delivery fees! Check out our Booking panel for a real-time invoice builder.";
      } else if (normalized.includes('free') || normalized.includes('offer') || normalized.includes('discount')) {
        reply = "Yes! Our special offer is active: Your very first 3 Shirts are Ironed 100% FREE! We also offer absolutely free pickup and delivery in Triplicane with no minimum order!";
      } else if (normalized.includes('whatsapp') || normalized.includes('phone') || normalized.includes('contact')) {
        reply = "Our official hotline is 9444346259. You can call us or message anytime. Press standard dialer links on the bottom of our Home panel to start a real chat!";
      }

      setChatLog(prev => [...prev, { sender: 'agent', text: reply, time: now }]);
      setIsTyping(false);
    }, 1200);
  };

  const checkServiceability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalSearch.trim()) return;

    const locationQueries = [
      'triplicane', 'chepauk', 'mylapore', 'royapettah', 'anna salai', 'mount road', 'ice house', 'egmore', 'chennai', '600005', '600004', '600014', '600002'
    ];

    const isMatch = locationQueries.some(q => postalSearch.toLowerCase().includes(q));

    if (isMatch) {
      setServiceResult("Service is Available! We proudly offer 100% FREE Doorstep Pickup & Delivery in your area with zero extra fees.");
    } else {
      setServiceResult("Notice: That is slightly outside our primary Triplicane hub. But we normally can accommodate bulk orders. Please ping our Support team via WhatsApp above to request a custom valet!");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* WHATSAPP CALLOUT CARD */}
      <div className="bg-emerald-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        {/* Dynamic WhatsApp background branding */}
        <MessageSquare className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 rotate-12 text-white shrink-0" />

        <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider inline-block mb-2">
          Direct Line Concierge
        </span>

        <h3 className="font-serif font-black text-xl leading-tight">
          Book on Call or WhatsApp
        </h3>
        
        <p className="text-[11px] text-[#FAFDFB]/85 mt-2 max-w-[280px] font-semibold">
          Prefer personal booking over forms? Send us a list of your clothes or call directly. We operate 7 days a week!
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-emerald-500/40 select-none">
          <a
            href="tel:9444346259"
            className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 h-[48px] text-xs font-black uppercase tracking-wider px-4 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-brand-green" />
            <span>Call 9444346259</span>
          </a>
          <a
            href="https://wa.me/919444346259?text=Hello%20Fresh%20and%20Fold,%20I%20want%20to%20schedule%20a%20laundry%20pickup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-900 hover:bg-emerald-950 text-[#FAFDFB] h-[48px] text-xs font-black uppercase tracking-wider px-4 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-light-green" />
            <span>Live Chat</span>
          </a>
        </div>
      </div>

      {/* CHENNAI SERVICEABILITY APP CHECKER */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <span className="text-[10px] font-mono text-gray-400 font-extrabold uppercase tracking-widest block">
          Zone Coverage Area Validator
        </span>
        <h3 className="font-serif font-black text-brand-navy text-sm">
          Check if Free Delivery applies to you
        </h3>
        
        <form onSubmit={checkServiceability} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input
            type="text"
            value={postalSearch}
            onChange={(e) => setPostalSearch(e.target.value)}
            placeholder="Type area (e.g. Triplicane, Chepauk, Royapettah...)"
            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-9 pr-20 text-xs font-medium focus:outline-none focus:border-brand-green"
          />
          <button
            type="submit"
            className="absolute right-1.5 bg-brand-green hover:bg-brand-accent text-white py-1.5 px-3.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
          >
            Verify
          </button>
        </form>

        {serviceResult && (
          <div className="p-3 rounded-xl text-[11px] font-bold leading-relaxed bg-brand-light-green/15 text-[#1e5128] border border-brand-light-green/30">
            {serviceResult}
          </div>
        )}
      </div>

      {/* DEEP INTERACTIVE SUPPORT CHAT SIMULATOR */}
      <div className="bg-[#FAFDFB] rounded-3xl border border-gray-150 p-4.5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
          <div>
            <span className="text-[9px] font-mono uppercase text-gray-400 block font-black">Interactive AI Desk</span>
            <span className="text-xs font-bold text-brand-navy">Pre-Order Assistant</span>
          </div>
        </div>

        {/* Chat Logs scroll window */}
        <div className="space-y-3.5 h-48 overflow-y-auto pr-1 no-scrollbar text-xs">
          {chatLog.map((log, idx) => {
            const isUser = log.sender === 'user';
            return (
              <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl leading-normal ${
                  isUser 
                    ? 'bg-brand-navy text-[#FAFDFB] rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none font-semibold'
                }`}>
                  <p>{log.text}</p>
                </div>
                <span className="text-[8px] text-gray-400 mt-1 font-mono">{log.time}</span>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-2.5 rounded-xl max-w-xs animate-pulse text-[10px] text-gray-400 font-mono">
              Fresh & Fold is preparing a reply...
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendChatMessage} className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            disabled={isTyping}
            placeholder="Ask about rate, offer, location, timing..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="w-10 h-10 bg-emerald-650 bg-emerald-600 hover:bg-[#4E9F3D] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
