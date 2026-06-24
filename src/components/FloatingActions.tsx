import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ArrowUp, CalendarRange } from 'lucide-react';
import { contact } from '../config/contact';
interface FloatingActionsProps {
  onOpenAssessment: () => void;
}

export default function FloatingActions({ onOpenAssessment }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#trial-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. MOBILE STICKY CONVERSION BAR (Thumb optimized, bottom of viewport, hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-black/85 backdrop-blur-md border-t border-brand-orange/15 py-3 px-4 shadow-xl flex items-center justify-between">
        <button
          onClick={(e) => { e.preventDefault(); onOpenAssessment(); }}
          className="flex-1 mr-2 py-3 bg-brand-orange text-black font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/10"
        >
          <CalendarRange className="w-4 h-4 mr-2" />
          Start Assessment
        </button>
        
        <a
          href={contact.whatsappLinks.membership()}
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl mx-1 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          aria-label="WhatsApp Coach"
        >
          <MessageSquare className="w-4 h-4 text-white" />
        </a>

        <a
          href={contact.phoneLink}
          className="p-3 bg-brand-charcoal text-white rounded-xl border border-white/5 ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Call Gym"
        >
          <Phone className="w-4 h-4 text-brand-orange" />
        </a>
      </div>

      {/* 2. GLOBAL FLOATING ACTION DOCK (Desktop bottom-right. On mobile, shifted up to not overlap sticky bar) */}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex flex-col space-y-3 items-center pointer-events-none">
        
        {/* Scroll To Top button (grows on scroll status) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-brand-charcoal/90 hover:bg-brand-orange hover:text-black text-white rounded-full border border-brand-orange/10 shadow-lg pointer-events-auto transition-all duration-300 hover:scale-105"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating WhatsApp chat link (Desktop only, mobile has it in bar) */}
        <a
          href={contact.whatsappLinks.assessment()}
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex p-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl pointer-events-auto transition-all duration-300 hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </a>

        {/* Floating Calendar Trial button (Desktop only) */}
        <button
          onClick={(e) => { e.preventDefault(); onOpenAssessment(); }}
          className="hidden md:flex p-3.5 bg-brand-orange text-black rounded-full shadow-2xl pointer-events-auto transition-all duration-300 hover:scale-105 hover:bg-brand-orange/90"
          aria-label="Book Assessment"
        >
          <CalendarRange className="w-5 h-5" />
        </button>

      </div>
    </>
  );
}
