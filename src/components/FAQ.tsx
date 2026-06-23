import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: 'Do you offer free trials?',
      a: 'Yes. We offer an initial 1-session trial pass for Hyderabad residents. This includes full equipment floor access, a biometric composition check, and a 30-minute consultation split with an assigned senior coach.'
    },
    {
      q: 'Are your trainers certified?',
      a: 'Absolutely. We do not hire general floor assistants. Every trainer at Sway Beast holds advanced certifications in exercise physiology, sports science, or physical therapy, alongside specialized credentials in barbell safety.'
    },
    {
      q: 'What are the gym timings?',
      a: 'We are open from 6:00 AM to 11:00 PM Monday through Saturday, and 8:00 AM to 4:00 PM on Sundays. Coaching hours are scheduled via pre-booked slots inside these operational timings.'
    },
    {
      q: 'Is personal training available?',
      a: 'Yes, 1-on-1 private personal training is our core service. We design adaptive coaching routines, log metrics, and guide your form. We also offer semi-private conditioning slots for small groups of 3-4 members.'
    },
    {
      q: 'Do you provide nutritional diet plans?',
      a: 'Yes. Every membership tier above Standard includes custom macro nutritional targets. We calculate calorie totals and protein splits based on your metabolic rate and goals. We do not support unsustainable crash fasting.'
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-black relative border-b border-brand-orange/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-orange block mb-3">
            CLEARING DOUBTS
          </span>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[0.95]">
            Frequently Asked <span className="font-serif italic text-brand-orange lowercase font-normal">questions</span>
          </h2>
          <p className="text-gray-400 text-sm mt-4">
            Everything you need to know about our training processes, schedules, and membership policies.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-brand-charcoal border border-brand-orange/5 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 hover:border-brand-orange/20"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bebas text-lg sm:text-xl tracking-wide text-white group-hover:text-brand-orange transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-orange transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-gray-400 leading-relaxed font-light border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
