import React from 'react';
import { ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { contact } from '../config/contact';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-brand-orange text-black relative overflow-hidden">
      {/* Decorative vector lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="10%" x2="100%" y2="90%" stroke="black" strokeWidth="4" />
          <line x1="0" y1="90%" x2="100%" y2="10%" stroke="black" strokeWidth="4" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <span className="text-[10px] uppercase font-bold tracking-widest text-black/80 block mb-2">
          LIMITED SLOTS AVAILABLE
        </span>
        
        <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-black uppercase tracking-tight">
          Stop Guessing.<br />
          Start <span className="font-serif italic lowercase font-normal">engineering</span> Results.
        </h2>
        
        <p className="mt-6 text-sm sm:text-base text-black/80 max-w-xl mx-auto font-medium">
          Secure your free physical biometrics mapping and nutritional assessment slot today. Our senior coaching slots are capped to ensure maximum client focus.
        </p>

        {/* Action Button stack in black styles */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Book Trial */}
          <a
            href="#trial-form"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-wider text-white bg-black rounded-full hover:bg-black/90 transition-all shadow-xl"
          >
            Book Free Trial
            <ArrowRight className="w-4 h-4 ml-2 text-brand-orange" />
          </a>

          {/* WhatsApp */}
          <a
            href={contact.whatsappLinks.trial()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp Coach
          </a>

          {/* Call Gym */}
          <a
            href={contact.phoneLink}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
          >
            <Phone className="w-4 h-4 mr-1.5" />
            Call Gym
          </a>
        </div>

      </div>
    </section>
  );
}
