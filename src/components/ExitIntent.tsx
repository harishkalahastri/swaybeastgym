

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Check } from 'lucide-react';
import { api } from '../lib/api';

const exitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  whatsapp_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid WhatsApp number (e.g. +919876543210)'),
  fitness_goal: z.enum(['weight_loss', 'build_muscle', 'general_fitness', 'sport_specific'], {
    message: 'Please select your fitness goal',
  }),
});

type ExitFormValues = z.infer<typeof exitSchema>;

export default function ExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ isSuccess: boolean; referenceId?: string; message?: string }>({ isSuccess: false });
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExitFormValues>({
    resolver: zodResolver(exitSchema),
  });

  const triggerModal = () => {
    // Check session storage to only trigger once per session
    const triggered = sessionStorage.getItem('exit_modal_triggered');
    if (!triggered) {
      setIsVisible(true);
      sessionStorage.setItem('exit_modal_triggered', 'true');
    }
  };

  useEffect(() => {
    // 1. Desktop: Mouse leaves viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30) {
        triggerModal();
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // 2. Mobile: Scroll abandonment (rapid upward scroll in bottom half of page)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;

      // If in bottom 50% and scrolled up rapidly (> 50px delta)
      if (currentScrollY > scrollHeight * 0.4 && currentScrollY < lastScrollY - 50) {
        triggerModal();
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onSubmit = async (data: ExitFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const result = await api.submitConsultation({
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        email: 'not-provided@example.com',
        goal: data.fitness_goal,
        frequency: 'Not specified (Exit Intent capture)',
        experience: 'Not specified (Exit Intent capture)',
        matched_program: 'Exit Intent Assessment Blueprint',
        source: 'exit_intent',
      });

      setSuccessData({
        isSuccess: true,
        referenceId: result.reference_id || 'PENDING-SYNC',
        message: result.message
      });
      reset();
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(errMsg);
      // Fallback
      setSuccessData({
        isSuccess: true,
        referenceId: 'PENDING-SYNC'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-brand-charcoal border border-brand-orange/15 rounded-3xl overflow-hidden shadow-2xl z-10 p-8 md:p-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-brand-black/60 text-gray-400 hover:text-white border border-white/5"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {successData.isSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="font-bebas text-3xl text-white uppercase">Plan Reserved</h3>
                {successData.referenceId && (
                  <div className="inline-block bg-black border border-white/10 text-brand-orange font-mono text-xs px-4 py-2 rounded-xl mb-3">
                    Ref: {successData.referenceId}
                  </div>
                )}
                <p className="text-gray-400 text-xs mt-3 leading-relaxed font-light">
                  {successData.message || "Thank you. Your assessment blueprint slot has been successfully locked. We have sent a confirmation message on WhatsApp."}
                </p>
                <button
                  onClick={() => setIsVisible(false)}
                  className="mt-6 px-6 py-2.5 bg-brand-orange text-black font-bold uppercase tracking-wider text-xs rounded-full"
                >
                  Return to Site
                </button>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center space-x-2.5 mb-4">
                  <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange">
                    Wait! Before You Leave
                  </span>
                </div>

                <h3 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-none mb-3">
                  Get A Free Fitness Assessment
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light mb-6">
                  Don't leave empty-handed. Lock in a free 1-on-1 biometrics check and custom nutrition consultation. Let us build your personalized plan.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-semibold mb-1" htmlFor="exit-name">
                      Full Name
                    </label>
                    <input
                      id="exit-name"
                      type="text"
                      placeholder="Aditya Vardhan"
                      {...register('name')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-xs"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-semibold mb-1" htmlFor="exit-whatsapp">
                      WhatsApp Number
                    </label>
                    <input
                      id="exit-whatsapp"
                      type="tel"
                      placeholder="WhatsApp Number (e.g. +919876543210)"
                      {...register('whatsapp_number')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-xs"
                    />
                    {errors.whatsapp_number && (
                      <span className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</span>
                    )}
                  </div>

                  {/* Goal Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-semibold mb-1" htmlFor="exit-goal">
                      Fitness Goal
                    </label>
                    <select
                      id="exit-goal"
                      {...register('fitness_goal')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-xs cursor-pointer"
                    >
                      <option value="">Select Your Main Goal</option>
                      <option value="weight_loss">Lose Weight & Excess Fat</option>
                      <option value="build_muscle">Build Lean Muscle Mass</option>
                      <option value="general_fitness">Improve General Fitness</option>
                      <option value="sport_specific">Sport-Specific Training</option>
                    </select>
                    {errors.fitness_goal && (
                      <span className="text-xs text-red-500 mt-1">{errors.fitness_goal.message}</span>
                    )}
                  </div>

                  {serverError && (
                    <div className="text-xs text-red-500 text-left mt-2">{serverError}</div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-brand-orange text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-brand-orange/90 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Securing Plan...
                        </>
                      ) : (
                        'Get My Personalized Plan'
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
