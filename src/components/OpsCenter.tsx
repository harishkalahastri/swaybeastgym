import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Users, BarChart3, Database, Bell, X } from 'lucide-react';

interface Lead {
  id?: string;
  name: string;
  whatsapp_number: string;
  source: string;
  status: string;
  created_at: string;
}

export default function OpsCenter() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('demo') === 'true';
    }
    return false;
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'quiz' | 'membership' | 'schema'>('leads');

  // Trigger from URL ?demo=true on load / custom toggle event
  useEffect(() => {
    // Toggle via double-click on specific elements or global message
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggle-ops-center', handleToggle);
    return () => window.removeEventListener('toggle-ops-center', handleToggle);
  }, []);

  // Fetch leads from server occasionally when open
  useEffect(() => {
    if (!isOpen) return;

    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads/list'); // Mock/Fetch helper endpoint
        if (response.ok) {
          const data = await response.json();
          setLeads(data.leads || []);
        }
      } catch (err) {
        console.log('Backend lead fetch disabled or error (using demo stubs):', err);
        // Fallback demo stubs for pitch
        setLeads([
          { id: '1', name: 'Aravind Reddy', whatsapp_number: '+91 98480 22338', source: 'trial_form', status: 'new', created_at: new Date().toISOString() },
          { id: '2', name: 'Neha Sen', whatsapp_number: '+91 99630 11445', source: 'bmi_calculator', status: 'converted', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', name: 'Rahul Kapoor', whatsapp_number: '+91 98850 55667', source: 'fitness_quiz', status: 'contacted', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]);
      }
    };

    fetchLeads();
    const interval = setInterval(fetchLeads, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const mockQuizStats = [
    { goal: 'Build Muscle', count: 142, percentage: '45%' },
    { goal: 'Lose Weight', count: 110, percentage: '35%' },
    { goal: 'General Fitness', count: 48, percentage: '15%' },
    { goal: 'Sport Training', count: 16, percentage: '5%' }
  ];

  const mockMemberships = [
    { name: 'Sameer Varma', plan: 'Annual Transform', expiry: '2027-06-15', status: 'Active', reminder: 'none' },
    { name: 'Kavitha Rao', plan: 'Quarterly Adapt', expiry: '2026-07-28', status: 'Active', reminder: 'sent' },
    { name: 'Pankaj Goel', plan: 'Standard Split', expiry: '2026-05-10', status: 'Expired', reminder: 'failed' }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-lg h-full bg-brand-charcoal border-l border-brand-orange/15 shadow-2xl z-10 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 bg-black/60 border-b border-white/5 flex items-center justify-between text-left">
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-5 h-5 text-brand-orange animate-pulse" />
                  <div>
                    <h3 className="font-bebas text-xl tracking-wider text-white">
                      Smart Gym Operations Center
                    </h3>
                    <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider block">
                      Gym Owner pitch metrics demonstration dashboard
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-white/5 bg-brand-black px-4 py-2 gap-2 text-xs">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center ${activeTab === 'leads' ? 'bg-brand-orange text-black' : 'text-gray-400'}`}
                >
                  <Users className="w-3.5 h-3.5 mr-1" /> Leads
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center ${activeTab === 'quiz' ? 'bg-brand-orange text-black' : 'text-gray-400'}`}
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1" /> Quiz Analytics
                </button>
                <button
                  onClick={() => setActiveTab('membership')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center ${activeTab === 'membership' ? 'bg-brand-orange text-black' : 'text-gray-400'}`}
                >
                  <Bell className="w-3.5 h-3.5 mr-1" /> Renewals
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center ${activeTab === 'schema' ? 'bg-brand-orange text-black' : 'text-gray-400'}`}
                >
                  <Database className="w-3.5 h-3.5 mr-1" /> DB Schema
                </button>
              </div>

              {/* Content Panel Area */}
              <div className="flex-1 p-6 overflow-y-auto text-left space-y-4">
                
                {/* 1. LEADS TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-brand-orange">
                        Live Captured Inbound Funnel
                      </h4>
                      <span className="text-[10px] text-gray-500">Auto-refresh active</span>
                    </div>

                    <div className="space-y-3">
                      {leads.length === 0 ? (
                        <p className="text-xs text-gray-500">No leads recorded yet. Test a landing page form to see it stream here!</p>
                      ) : (
                        leads.map((l: Lead, index: number) => (
                          <div key={l.id || index} className="p-4 bg-brand-black border border-white/5 rounded-xl flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-white">{l.name}</span>
                                <span className="text-[8px] uppercase tracking-wider font-bold text-brand-orange px-1.5 py-0.5 rounded bg-brand-charcoal border border-brand-orange/10">
                                  {l.source}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 block mt-1">{l.whatsapp_number}</span>
                              <span className="text-[9px] text-gray-500 block mt-1">Submitted: {new Date(l.created_at).toLocaleTimeString()}</span>
                            </div>
                            <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                              l.status === 'converted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                              l.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                              'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                            }`}>
                              {l.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 2. QUIZ ANALYTICS TAB */}
                {activeTab === 'quiz' && (
                  <div className="space-y-5">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-brand-orange">
                      Goal Selection Analytics Mapped
                    </h4>
                    
                    <div className="space-y-3">
                      {mockQuizStats.map((item) => (
                        <div key={item.goal} className="p-4 bg-brand-black border border-white/5 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-white">{item.goal}</span>
                            <span className="text-xs font-bold text-brand-orange">{item.count} selections ({item.percentage})</span>
                          </div>
                          {/* Percent bar */}
                          <div className="h-1.5 w-full bg-brand-charcoal rounded-full overflow-hidden">
                            <div className="h-full bg-brand-orange" style={{ width: item.percentage }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. MEMBERSHIP RENEWALS TAB */}
                {activeTab === 'membership' && (
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-brand-orange">
                      Future Renewal Automation Engine
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                      Simulates membership expiration and automated WhatsApp reminders that would trigger downstream.
                    </p>

                    <div className="space-y-3">
                      {mockMemberships.map((m) => (
                        <div key={m.name} className="p-4 bg-brand-black border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-white block">{m.name}</span>
                            <span className="text-[10px] text-gray-400">{m.plan}</span>
                            <span className="text-[9px] text-gray-500 block mt-1">Expiry: {m.expiry}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                              m.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {m.status}
                            </span>
                            <span className="text-[8px] text-gray-500 block mt-1.5 uppercase font-bold">
                              Remind: {m.reminder}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DATABASE SCHEMA TAB */}
                {activeTab === 'schema' && (
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-brand-orange">
                      Postgres Database Layout (Prepared)
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      We have prepared the relational schemas inside Supabase to support lead expansion, calculations, and future memberships out-of-the-box.
                    </p>

                    <div className="space-y-2.5 text-xs font-mono bg-brand-black p-4 rounded-xl border border-white/5 overflow-x-auto text-gray-300">
                      <div><span className="text-brand-orange">TABLE</span> leads (id, name, whatsapp_number, source, status, created_at)</div>
                      <div><span className="text-brand-orange">TABLE</span> trial_bookings (id, lead_id, goal, time)</div>
                      <div><span className="text-brand-orange">TABLE</span> bmi_submissions (id, lead_id, height, weight, bmi, category)</div>
                      <div><span className="text-brand-orange">TABLE</span> quiz_submissions (id, lead_id, goal, freq, exp, matched)</div>
                      <div><span className="text-brand-orange">TABLE</span> memberships (id, lead_id, name, plan, expiry, status, reminder)</div>
                      <div><span className="text-brand-orange">TABLE</span> notification_log (id, lead_id, channel, status, error, created_at)</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom pitch reminder */}
              <div className="p-4 bg-brand-black border-t border-white/5 text-[9px] text-gray-500 text-center uppercase tracking-wider font-bold">
                Pitch Mode Active &bull; Sway Beast Digital Agency Prototype
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
