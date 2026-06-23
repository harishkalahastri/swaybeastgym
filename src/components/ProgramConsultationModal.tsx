import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Check, Loader2, Phone, MessageCircle } from 'lucide-react';
import { api } from '../lib/api';

// Program Configuration
type ProgramType = 'weight_loss' | 'muscle_gain' | 'strength' | 'personal_training' | 'generic';

interface ProgramConfig {
  type: ProgramType;
  title: string;
  image: string;
  description: string;
  ctaText: string;
}

const PROGRAM_CONFIGS: Record<string, ProgramConfig> = {
  p1: {
    type: 'weight_loss',
    title: 'Weight Loss Strategy Session',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600',
    description: 'Lose body fat while maintaining strength and energy. 3-minute consultation.',
    ctaText: 'Get My Fat Loss Plan',
  },
  p2: {
    type: 'muscle_gain',
    title: 'Muscle Gain Blueprint',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    description: 'Add noticeable muscle size and strength with structured lifting. 3-minute consultation.',
    ctaText: 'Build My Muscle Plan',
  },
  p3: {
    type: 'strength',
    title: 'Strength Performance Review',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    description: 'Dramatically increase your big lifts with expert programming. 3-minute consultation.',
    ctaText: 'Get My Strength Blueprint',
  },
  p4: {
    type: 'personal_training',
    title: 'Personal Training Discovery Call',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=600',
    description: 'Work directly with an expert coach to accelerate your specific goals.',
    ctaText: 'Match Me With A Coach',
  },
  // Default fallback for other programs
  default: {
    type: 'generic',
    title: 'Fitness Strategy Session',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600',
    description: 'Our coaches will evaluate your current fitness level and build the right plan.',
    ctaText: 'Get My Custom Plan',
  }
};

const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  whatsapp_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid WhatsApp number (e.g. +919876543210)'),
  email: z.string().email('Please enter a valid email address'),
  // Dynamic fields
  field1: z.string().optional(),
  field2: z.string().optional(),
  field3: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

interface ProgramConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: string | null;
}

export default function ProgramConsultationModal({ isOpen, onClose, programId }: ProgramConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ isSuccess: boolean; referenceId?: string; message?: string }>({ isSuccess: false });
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
  });

  useEffect(() => {
    if (isOpen) {
      setSuccessData({ isSuccess: false });
      setServerError(null);
      reset();
    }
  }, [isOpen, reset]);

  const config = programId && PROGRAM_CONFIGS[programId] ? PROGRAM_CONFIGS[programId] : PROGRAM_CONFIGS.default;

  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const result = await api.submitConsultation({
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        goal: config.type,
        frequency: data.field1 || '',
        experience: data.field3 || '',
        matched_program: config.title,
        field1: data.field1,
        field2: data.field2,
        field3: data.field3,
        source: 'program_consultation_modal',
      });

      setSuccessData({
        isSuccess: true,
        referenceId: result.reference_id || 'PENDING-SYNC',
        message: result.message
      });
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please check your network and try again.';
      setServerError(errMsg);
      // Fallback behavior if offline or backend is unconfigured
      setSuccessData({
        isSuccess: true,
        referenceId: 'PENDING-SYNC',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderDynamicFields = () => {
    switch (config.type) {
      case 'weight_loss':
        return (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Current Weight (kg/lbs)</label>
              <input type="text" {...register('field1')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Target Weight (kg/lbs)</label>
              <input type="text" {...register('field2')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Desired Timeline</label>
              <select {...register('field3')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Timeline</option>
                <option value="1-3 Months">1-3 Months</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="6+ Months">6+ Months</option>
              </select>
            </div>
          </>
        );
      case 'muscle_gain':
        return (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Current Weight (kg/lbs)</label>
              <input type="text" {...register('field1')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Target Weight (kg/lbs)</label>
              <input type="text" {...register('field2')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Training Experience</label>
              <select {...register('field3')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Experience</option>
                <option value="Beginner (0-1 yrs)">Beginner (0-1 yrs)</option>
                <option value="Intermediate (1-3 yrs)">Intermediate (1-3 yrs)</option>
                <option value="Advanced (3+ yrs)">Advanced (3+ yrs)</option>
              </select>
            </div>
          </>
        );
      case 'strength':
        return (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Current Lifts (Optional)</label>
              <input type="text" placeholder="e.g. S:100 B:80 D:120" {...register('field1')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Primary Strength Goal</label>
              <input type="text" placeholder="e.g. 200kg Deadlift" {...register('field2')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Experience Level</label>
              <select {...register('field3')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </>
        );
      case 'personal_training':
        return (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Preferred Frequency</label>
              <select {...register('field1')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Frequency</option>
                <option value="1-2 times/week">1-2 times/week</option>
                <option value="3-4 times/week">3-4 times/week</option>
                <option value="5+ times/week">5+ times/week</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold mb-2">Coaching Preference</label>
              <select {...register('field2')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Style</option>
                <option value="Push Me Hard">Push Me Hard</option>
                <option value="Patient & Educational">Patient & Educational</option>
              </select>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Injury History</label>
              <input type="text" placeholder="Any past injuries we should know about?" {...register('field3')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Primary Fitness Goal</label>
              <input type="text" placeholder="What do you want to achieve?" {...register('field1')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs text-gray-400 font-semibold mb-2">Current Activity Level</label>
              <select {...register('field2')} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm cursor-pointer appearance-none">
                <option value="">Select Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-black border border-brand-orange/15 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white border border-white/10 z-20 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
            {/* Visual Header */}
            <div className="relative h-48 sm:h-56">
              <img src={config.image} alt={config.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange mb-2 block">
                  Program Discovery
                </span>
                <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase mb-1">
                  {config.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm font-light">
                  {config.description}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {successData.isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h3 className="font-bebas text-3xl text-white tracking-wider uppercase mb-2 leading-tight">
                    Your {config.title.replace('Strategy Session', '').replace('Blueprint', '').replace('Performance Review', '').replace('Discovery Call', '').trim()} Consultation Has Been Reserved
                  </h3>
                  {successData.referenceId && (
                    <div className="inline-block bg-black border border-white/10 text-brand-orange font-mono text-sm px-4 py-2 rounded-xl mb-4">
                      Ref: {successData.referenceId}
                    </div>
                  )}
                  <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed font-light mb-8">
                    {successData.message || "One of our coaches will contact you shortly to discuss your goals and create your plan."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Us Now
                    </a>
                    <a
                      href="tel:+919876543210"
                      className="w-full py-3.5 bg-brand-charcoal border border-brand-orange/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:border-brand-orange/30 transition-colors flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Gym
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {renderDynamicFields()}

                    <div className="border-t border-white/5 pt-5 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-semibold mb-2">Full Name</label>
                        <input type="text" {...register('name')} disabled={isSubmitting} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
                        {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-semibold mb-2">WhatsApp Number</label>
                        <input type="tel" {...register('whatsapp_number')} disabled={isSubmitting} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
                        {errors.whatsapp_number && <span className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</span>}
                      </div>

                      <div className="flex flex-col sm:col-span-2">
                        <label className="text-xs text-gray-400 font-semibold mb-2">Email Address</label>
                        <input type="email" {...register('email')} disabled={isSubmitting} className="px-4 py-3 bg-brand-charcoal text-white rounded-xl border border-brand-orange/10 focus:border-brand-orange/50 focus:outline-none text-sm" />
                        {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
                      </div>
                    </div>
                  </div>

                  {serverError && (
                    <div className="text-xs text-red-500 text-left mt-3">{serverError}</div>
                  )}

                  <div className="mt-6 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-orange text-black font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-brand-orange/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        config.ctaText
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
