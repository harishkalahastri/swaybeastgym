

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { CalendarRange, Check, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

const trialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  whatsapp_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid WhatsApp number (e.g. +919876543210)'),
  email: z.string().email('Please enter a valid email address'),
  fitness_goal: z.enum(['weight_loss', 'build_muscle', 'general_fitness', 'sport_specific'], {
    message: 'Please select a training goal',
  }),
  preferred_time: z.enum(['morning_6_10', 'midday_10_4', 'evening_4_9'], {
    message: 'Please select your preferred time slot',
  }),
});

type TrialFormValues = z.infer<typeof trialSchema>;

export default function TrialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ isSuccess: boolean; referenceId?: string; message?: string }>({ isSuccess: false });
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TrialFormValues>({
    resolver: zodResolver(trialSchema),
  });

  const onSubmit = async (data: TrialFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const result = await api.submitTrial({
        ...data,
        source: 'trial_form',
      });

      setSuccessData({ 
        isSuccess: true, 
        referenceId: result.reference_id || result.leadId || 'PENDING-SYNC',
        message: result.message
      });
      reset();
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please check your network and try again.';
      setServerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="trial-form" className="py-24 bg-black relative border-b border-brand-orange/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-orange block mb-3">
            SECURE A SLOT
          </span>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[0.95]">
            Book Your Free <span className="font-serif italic text-brand-orange lowercase font-normal">trial</span>
          </h2>
          <p className="text-gray-400 text-sm mt-4 max-w-lg mx-auto">
            Experience our premium equipment, custom coaching assessment, and macro nutritional mapping. Lock in your session below.
          </p>
        </div>

        {/* Card Form container */}
        <div className="glass-card bg-brand-charcoal border border-brand-orange/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-center">
          
          {successData.isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="font-bebas text-4xl text-white tracking-wider uppercase mb-2">
                You're Booked!
              </h3>
              {successData.referenceId && (
                <div className="inline-block bg-black border border-white/10 text-brand-orange font-mono text-sm px-4 py-2 rounded-xl mb-4">
                  Ref: {successData.referenceId}
                </div>
              )}
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed font-light">
                {successData.message || "We have registered your details. A coach will reach out to you shortly to confirm your slot. We've sent a confirmation message on WhatsApp."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-brand-orange/10 rounded-xl">
                  <CalendarRange className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="font-bebas text-2xl text-white tracking-wide uppercase">
                  Assessment Scheduling Form
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-semibold mb-2" htmlFor="trial-name">
                    Full Name
                  </label>
                  <input
                    id="trial-name"
                    type="text"
                    placeholder="Aditya Vardhan"
                    {...register('name')}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-semibold mb-2" htmlFor="trial-whatsapp">
                    WhatsApp Number
                  </label>
                  <input
                    id="trial-whatsapp"
                    type="tel"
                    placeholder="WhatsApp Number (e.g. +919876543210)"
                    {...register('whatsapp_number')}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm"
                  />
                  {errors.whatsapp_number && (
                    <span className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-semibold mb-2" htmlFor="trial-email">
                    Email Address
                  </label>
                  <input
                    id="trial-email"
                    type="email"
                    placeholder="aditya@example.com"
                    {...register('email')}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>
                  )}
                </div>

                {/* Goal Dropdown */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-semibold mb-2" htmlFor="trial-goal">
                    Training Goal
                  </label>
                  <select
                    id="trial-goal"
                    {...register('fitness_goal')}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer"
                  >
                    <option value="">Select Goal</option>
                    <option value="weight_loss">Lose Weight & Body Fat</option>
                    <option value="build_muscle">Build Lean Muscle Mass</option>
                    <option value="general_fitness">General Health & Stamina</option>
                    <option value="sport_specific">Athletic & CNS Power</option>
                  </select>
                  {errors.fitness_goal && (
                    <span className="text-xs text-red-500 mt-1">{errors.fitness_goal.message}</span>
                  )}
                </div>

                {/* Preferred Time Dropdown */}
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-xs text-gray-400 font-semibold mb-2" htmlFor="trial-time">
                    Preferred Time Slot
                  </label>
                  <select
                    id="trial-time"
                    {...register('preferred_time')}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-brand-black text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer"
                  >
                    <option value="">Select Time Slot</option>
                    <option value="morning_6_10">Morning Split (6:00 AM - 10:00 AM)</option>
                    <option value="midday_10_4">Midday Split (10:00 AM - 4:00 PM)</option>
                    <option value="evening_4_9">Evening Split (4:00 PM - 9:00 PM)</option>
                  </select>
                  {errors.preferred_time && (
                    <span className="text-xs text-red-500 mt-1">{errors.preferred_time.message}</span>
                  )}
                </div>
              </div>

              {serverError && (
                <div className="text-xs text-red-500 text-left mt-3">{serverError}</div>
              )}

              {/* Action and disclaimer */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[10px] text-gray-500 text-left max-w-md">
                  By submitting, you agree to receive WhatsApp updates and email notifications regarding your trial booking coordinates.
                </p>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-brand-orange text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-brand-orange/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Booking Slot...
                      </>
                    ) : (
                      'Book My Free Trial \u2192'
                    )}
                  </button>
                  <p className="text-[10px] text-brand-orange/80 font-medium">
                    Joined by 300+ members in Kondapur & Hitec City
                  </p>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
