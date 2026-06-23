import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Welcome to Sway Beast Fitness. I can answer questions about our programs, trainers, pricing, or booking a trial. Select your language below.' }
  ]);
  const [lang, setLang] = useState<'en' | 'hi' | 'te'>('en');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg = textToSend.trim();
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          language: lang,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
      // Stub local fallback response
      setTimeout(() => {
        let fallbackMsg = '';
        if (lang === 'hi') {
          fallbackMsg = 'हमारे यहाँ 1-on-1 कोचिंग, वेट लॉस और स्ट्रेंथ ट्रेनिंग प्रोग्राम उपलब्ध हैं। आप नीचे फ्री ट्रायल बुक कर सकते हैं।';
        } else if (lang === 'te') {
          fallbackMsg = 'మా వద్ద వ్యక్తిగత కోచింగ్, వెయిట్ లాస్ మరియు స్ట్రెంత్ ట్రైనింగ్ ప్రోగ్రామ్స్ ఉన్నాయి. మీరు ఉచిత ట్రయల్ బుక్ చేసుకోవచ్చు.';
        } else {
          fallbackMsg = 'We offer elite 1-on-1 personal training, fat loss splits, and strength conditioning. To book a trial, please use the form below.';
        }
        setMessages((prev) => [...prev, { sender: 'bot', text: fallbackMsg }]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  const quickPrompts = {
    en: [
      'What programs are offered?',
      'How much is membership?',
      'How do I book a trial?'
    ],
    hi: [
      'कौन से प्रोग्राम उपलब्ध हैं?',
      'मेम्बरशिप की फीस क्या है?',
      'ट्रायल कैसे बुक करें?'
    ],
    te: [
      'ఏ ఏ ప్రోగ్రాములు ఉన్నాయి?',
      'మెంబర్‌షిప్ ధర ఎంత?',
      'ట్రయల్ ఎలా బుక్ చేసుకోవాలి?'
    ]
  };

  return (
    <>
      {/* Chat Launcher Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 p-4 bg-brand-charcoal border border-brand-orange/20 text-white rounded-full shadow-2xl hover:scale-105 pointer-events-auto transition-transform duration-300 hover:border-brand-orange group flex items-center justify-center"
        aria-label="Toggle Fitness Assistant Chat"
      >
        <MessageSquare className="w-6 h-6 text-brand-orange" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bebas text-sm tracking-wide ml-0 group-hover:ml-2">
          Chat Coach
        </span>
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed bottom-40 left-4 md:bottom-24 md:left-8 z-50 w-[calc(100%-2rem)] md:w-full max-w-sm h-[480px] bg-brand-charcoal/95 border border-brand-orange/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Header info */}
            <div className="p-4 bg-black/60 border-b border-white/5 flex items-center justify-between text-left">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-brand-orange/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bebas text-lg tracking-wider text-white">
                    Sway Beast Chat Assistant
                  </h3>
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider block">
                    Grounded Pitch AI
                  </span>
                </div>
              </div>

              {/* Language Selection Toggle */}
              <div className="flex items-center space-x-1.5 bg-brand-black px-2 py-1 rounded-md border border-white/5">
                <button
                  onClick={() => setLang('en')}
                  className={`text-[9px] font-bold px-1 rounded ${lang === 'en' ? 'text-brand-orange bg-brand-charcoal' : 'text-gray-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`text-[9px] font-bold px-1 rounded ${lang === 'hi' ? 'text-brand-orange bg-brand-charcoal' : 'text-gray-400'}`}
                >
                  HI
                </button>
                <button
                  onClick={() => setLang('te')}
                  className={`text-[9px] font-bold px-1 rounded ${lang === 'te' ? 'text-brand-orange bg-brand-charcoal' : 'text-gray-400'}`}
                >
                  TE
                </button>
              </div>

              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Thread list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed text-left ${
                      m.sender === 'user'
                        ? 'bg-brand-orange text-black font-semibold rounded-tr-none'
                        : 'bg-brand-black text-gray-300 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-brand-black text-gray-400 p-3 rounded-2xl rounded-tl-none flex items-center space-x-2 border border-white/5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-orange" />
                    <span className="text-[10px]">Analyzing prompt...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt triggers */}
            <div className="px-4 py-2 border-t border-white/5 flex flex-wrap gap-1.5 justify-start">
              {quickPrompts[lang].map((p, pidx) => (
                <button
                  key={pidx}
                  onClick={() => handleQuickQuestion(p)}
                  className="text-[10px] bg-brand-black hover:border-brand-orange/50 text-gray-400 hover:text-white px-3 py-2 min-h-[44px] flex items-center rounded-lg border border-white/5 transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Action panel bottom */}
            <div className="p-3 bg-black/60 border-t border-white/5 flex items-center justify-between gap-2">
              <a
                href="#trial-form"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 bg-brand-orange text-black font-bold uppercase tracking-wider text-[9px] rounded-lg shrink-0 hover:bg-brand-orange/90"
              >
                Book Trial
              </a>
              
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask about programs, timings..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(inputText);
                  }}
                  className="w-full pl-3 pr-9 py-2 bg-brand-black text-white rounded-lg border border-white/5 focus:border-brand-orange/30 focus:outline-none text-xs"
                />
                <button
                  onClick={() => handleSendMessage(inputText)}
                  className="absolute right-1 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-orange hover:text-white"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
