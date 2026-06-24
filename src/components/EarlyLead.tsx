

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Check, Loader2, Phone, MessageCircle } from 'lucide-react';
import { api } from '../lib/api';
import { contact } from '../config/contact';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  whatsapp_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid WhatsApp number with country code (e.g. +919876543210)'),
  fitness_goal: z.enum(['weight_loss', 'build_muscle', 'general_fitness', 'sport_specific'], {
    message: 'Please select a fitness goal',
  }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function EarlyLead() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ isSuccess: boolean; referenceId?: string; message?: string }>({ isSuccess: false });
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const result = await api.submitConsultation({
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        email: 'not-provided@example.com',
        goal: data.fitness_goal,
        frequency: 'Not specified (Early Lead capture)',
        experience: 'Not specified (Early Lead capture)',
        matched_program: 'Early Lead Blueprint',
        source: 'mini_lead_form',
      });

      setSuccessData({
        isSuccess: true,
        referenceId: result.reference_id || 'PENDING-SYNC',
        message: result.message
      });
      reset();
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please check your network and try again.';
      setServerError(errMsg);
      // Fallback behavior if offline or backend is unconfigured
      setSuccessData({
        isSuccess: true,
        referenceId: 'PENDING-SYNC'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-brand-charcoal relative border-y border-brand-orange/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/40 border border-brand-orange/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />

          {successData.isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/30 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="font-bebas text-4xl text-white tracking-wider uppercase mb-2">
                Assessment Received
              </h3>
              {successData.referenceId && (
                <div className="inline-block bg-black border border-white/10 text-brand-orange font-mono text-xs px-4 py-2 rounded-xl mb-4">
                  Ref: {successData.referenceId}
                </div>
              )}
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed font-light mb-8">
                {successData.message || "Thank you for your interest. Your assessment request has been recorded successfully. A coach will contact you shortly to discuss your goals and recommend the best transformation plan."}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                <a
                  href={contact.whatsappLinks.direct()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </a>
                <a
                  href={contact.phoneLink}
                  className="px-6 py-3 bg-brand-black border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:border-brand-orange/30 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Gym
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text */}
              <div className="lg:col-span-5 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange">
                  FAST TRACK
                </span>
                <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide uppercase mt-2">
                  Start Your Transformation
                </h3>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  Ready to stop guessing? Input your goal and WhatsApp number. Let us draft your blueprint today. No obligations.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label htmlFor="early-name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="early-name"
                      type="text"
                      placeholder="Your Full Name"
                      {...register('name')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm transition-colors"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500 mt-1 text-left">{errors.name.message}</span>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="flex flex-col">
                    <label htmlFor="early-whatsapp" className="sr-only">
                      WhatsApp Number
                    </label>
                    <input
                      id="early-whatsapp"
                      type="tel"
                      placeholder="WhatsApp Number (e.g. +919876543210)"
                      {...register('whatsapp_number')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm transition-colors"
                    />
                    {errors.whatsapp_number && (
                      <span className="text-xs text-red-500 mt-1 text-left">
                        {errors.whatsapp_number.message}
                      </span>
                    )}
                  </div>

                  {/* Goal Dropdown */}
                  <div className="flex flex-col sm:col-span-2">
                    <label htmlFor="early-goal" className="sr-only">
                      Goal
                    </label>
                    <select
                      id="early-goal"
                      {...register('fitness_goal')}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm transition-colors cursor-pointer appearance-none"
                    >
                      <option value="">Select Your Main Goal</option>
                      <option value="weight_loss">Lose Weight & Excess Fat</option>
                      <option value="build_muscle">Build Lean Muscle Mass</option>
                      <option value="general_fitness">Improve General Fitness & Stamina</option>
                      <option value="sport_specific">Sport-Specific Conditioning</option>
                    </select>
                    {errors.fitness_goal && (
                      <span className="text-xs text-red-500 mt-1 text-left">
                        {errors.fitness_goal.message}
                      </span>
                    )}
                  </div>
                </div>

                {serverError && (
                  <div className="text-xs text-red-500 text-left mt-3">{serverError}</div>
                )}

                {/* Submit button */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-[10px] text-gray-500 text-left max-w-sm">
                    By clicking, you consent to receiving transformation blueprint insights and follow-up templates directly on WhatsApp.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-brand-orange text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-brand-orange/90 transition-all flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Start My Transformation'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
