import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Dumbbell, Calendar, Activity, CheckCircle2, MessageCircle, PhoneCall, Loader2, ArrowDown } from 'lucide-react';
import { api } from '../lib/api';
import { contact } from '../config/contact';

// Mock types for UI buildout until full Supabase hooks are written
type AuthState = 'enter_phone' | 'enter_otp' | 'authenticated';

const JOURNEY_STAGES = [
  { id: 'assessment', label: 'Assessment Completed', status: 'completed' },
  { id: 'trainer', label: 'Trainer Assigned', status: 'completed' },
  { id: 'trial', label: 'Trial Scheduled', status: 'pending' },
  { id: 'activation', label: 'Membership Activated', status: 'upcoming' }
];

const MOCK_ACTIVITIES = Array.from({ length: 25 }).map((_, i) => ({
  id: `act-${i}`,
  action: i === 0 ? 'Trial Confirmed' : i === 1 ? 'Trainer Assigned' : 'Status Updated',
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  type: i % 2 === 0 ? 'success' : 'info'
}));

export default function MyJourney() {
  const [authState, setAuthState] = useState<AuthState>('enter_phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination State
  const [visibleActivities, setVisibleActivities] = useState(10);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await api.sendOtp(phone);
      setAuthState('enter_otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await api.verifyOtp(phone, otp);
      setAuthState('authenticated');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreActivities = () => {
    setVisibleActivities(prev => Math.min(prev + 10, MOCK_ACTIVITIES.length));
  };

  if (authState !== 'authenticated') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">My Journey</h1>
            <p className="text-gray-400">Secure access to your fitness portal</p>
          </div>

          <form onSubmit={authState === 'enter_phone' ? handleSendOtp : handleVerifyOtp} className="space-y-6">
            {authState === 'enter_phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                    placeholder="e.g. 9988776655"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Enter 6-Digit OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono tracking-[0.5em] text-center focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                    placeholder="------"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-orange text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ff7b00] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authState === 'enter_phone' ? 'Send OTP' : 'Verify & Login'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <header className="bg-[#111] border-b border-white/10 pt-8 pb-6 px-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Welcome Back</h1>
            <p className="text-brand-orange font-medium">{phone}</p>
          </div>
          <div className="flex gap-3">
            <a href={contact.phoneLink} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-colors">
              <PhoneCall className="w-5 h-5" />
            </a>
            <a href={contact.whatsappLinks.direct()} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Journey Status Component */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-orange" />
            Current Journey Status
          </h2>
          <div className="space-y-4">
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-4 relative">
                {/* Connecting line */}
                {i !== JOURNEY_STAGES.length - 1 && (
                  <div className={`absolute left-3 top-8 bottom-[-16px] w-[2px] ${stage.status === 'completed' ? 'bg-brand-orange' : 'bg-white/10'}`} />
                )}
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  stage.status === 'completed' ? 'bg-brand-orange text-black' :
                  stage.status === 'pending' ? 'bg-[#111] border-2 border-brand-orange text-brand-orange' :
                  'bg-[#111] border-2 border-white/20 text-white/20'
                }`}>
                  {stage.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className={`font-medium ${stage.status === 'upcoming' ? 'text-gray-500' : 'text-white'}`}>
                  {stage.label}
                  {stage.status === 'pending' && <span className="ml-3 text-xs bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full uppercase font-bold tracking-wider">In Progress</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Trial */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-orange/10 rounded-xl">
                <Calendar className="w-6 h-6 text-brand-orange" />
              </div>
              <span className="text-xs font-mono text-gray-500">SB-TRIAL-0001</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Trial Session</h3>
            <p className="text-gray-400 mb-4">Pending Confirmation</p>
            <div className="bg-black rounded-xl p-4 text-sm text-gray-300">
              Trainer Assignment in progress. We will contact you on WhatsApp shortly.
            </div>
          </div>

          {/* Active Membership */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 opacity-50 grayscale">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <Dumbbell className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Membership</h3>
            <p className="text-gray-400">No active plan</p>
          </div>
        </div>

        {/* Activity Timeline (Paginated) */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {MOCK_ACTIVITIES.slice(0, visibleActivities).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="text-white font-medium">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>

          {visibleActivities < MOCK_ACTIVITIES.length && (
            <button
              onClick={loadMoreActivities}
              className="w-full mt-4 py-4 border border-white/10 rounded-xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
            >
              Load More <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </section>

      </main>
    </div>
  );
}
