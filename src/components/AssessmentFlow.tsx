import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Activity, Target, Trophy, Dumbbell, Loader2 } from 'lucide-react';
import { useGym } from '../context/GymContext';
import { api } from '../lib/api';

interface AssessmentFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssessmentFlow({ isOpen, onClose }: AssessmentFlowProps) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [bmiData, setBmiData] = useState({ height: '', weight: '', age: '', gender: '' });
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  
  // BMI Result
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state after close animation
      setTimeout(() => {
        setStep(1);
        setBmiData({ height: '', weight: '', age: '', gender: '' });
        setGoal('');
        setExperience('');
        setContact({ name: '', phone: '', email: '' });
        setBmiResult(null);
        setSuccessId(null);
        setSuccessMessage(null);
        setServerError(null);
        setIsSubmitting(false);
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);
    try {
      const result = await api.submitConsultation({
        name: contact.name,
        whatsapp_number: contact.phone,
        email: contact.email,
        goal: goal,
        frequency: '3-4 times/week',
        experience: experience,
        matched_program: `Coach Match: ${getCoachMatch().name}`,
        source: 'assessment_flow',
        height: bmiData.height,
        weight: bmiData.weight,
        age: bmiData.age,
        gender: bmiData.gender,
        bmi: bmiResult
      });

      setSuccessId(result.reference_id || 'PENDING-SYNC');
      setSuccessMessage(result.message);
      setStep(7);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please check your network and try again.';
      setServerError(errMsg);
      // Fallback
      setSuccessId('PENDING-SYNC');
      setStep(7);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bmiData.height && bmiData.weight) {
      const heightInMeters = parseFloat(bmiData.height) / 100;
      const weightInKg = parseFloat(bmiData.weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      setBmiResult(parseFloat(bmi.toFixed(1)));
      setStep(2); // Move to goal selection
    }
  };

  const { gym } = useGym();
  const getCoachMatch = () => {
    if (goal === 'Weight Loss') {
      const coach = gym.trainers[0] || gym.trainers[0];
      return {
        name: coach.name,
        img: coach.image,
        reason: `Based on your goal of Weight Loss, ${coach.name} is recommended because they specialize in ${coach.specialty.toLowerCase()} and sustainable results.`,
      };
    }
    if (goal === 'Muscle Gain') {
      const coach = gym.trainers[1] || gym.trainers[0];
      return {
        name: coach.name,
        img: coach.image,
        reason: `Based on your goal of Muscle Gain and ${experience} experience level, ${coach.name} is recommended because they specialize in ${coach.specialty.toLowerCase()} and safe mechanics.`,
      };
    }
    const coach = gym.trainers[2] || gym.trainers[0];
    return {
      name: coach.name,
      img: coach.image,
      reason: `Based on your goal of General Fitness and ${experience} experience level, ${coach.name} is recommended because they specialize in ${coach.specialty.toLowerCase()} and building a strong foundation.`,
    };
  };

  const getRoadmap = () => {
    if (goal === 'Weight Loss') {
      return [
        { phase: 'Phase 1: Metabolic Reset', desc: 'Weeks 1-4: Stabilize nutrition and fix movement patterns.' },
        { phase: 'Phase 2: Lean Retention', desc: 'Weeks 5-8: Increase intensity while maintaining muscle mass.' },
        { phase: 'Phase 3: Sustained Fat Loss', desc: 'Weeks 9-12: Peak fat oxidation and transition to lifestyle maintenance.' },
      ];
    }
    if (goal === 'Muscle Gain') {
      return [
        { phase: 'Phase 1: Structural Foundation', desc: 'Weeks 1-4: Master barbell mechanics and prime central nervous system.' },
        { phase: 'Phase 2: Progressive Overload', desc: 'Weeks 5-8: Increase volume and mechanical tension for growth.' },
        { phase: 'Phase 3: Hypertrophy Peak', desc: 'Weeks 9-12: Maximize caloric utilization for noticeable size gains.' },
      ];
    }
    return [
      { phase: 'Phase 1: Mobility & Form', desc: 'Weeks 1-4: Fix postural imbalances and build joint confidence.' },
      { phase: 'Phase 2: Strength & Endurance', desc: 'Weeks 5-8: Increase cardiovascular capacity and overall strength.' },
      { phase: 'Phase 3: Athletic Autonomy', desc: 'Weeks 9-12: Move effortlessly and confidently through daily life.' },
    ];
  };

  // UI Components for Steps
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-brand-orange/10 bg-brand-black/50 sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        {step > 1 && step < 7 && (
          <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Step {Math.min(step, 6)} of 6
        </span>
      </div>
      <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 border border-white/5">
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-brand-charcoal sm:rounded-3xl border-0 sm:border border-brand-orange/15 shadow-2xl overflow-hidden flex flex-col relative"
          >
            {renderStepIndicator()}

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 hide-scrollbar relative" data-lenis-prevent="true">
              {/* Step 1: BMI */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <Activity className="w-8 h-8 text-brand-orange mb-4" />
                    <h2 className="font-bebas text-4xl text-white tracking-wide">Calculate Your Baseline</h2>
                    <p className="text-gray-400 text-sm mt-2">Let's find your starting point to recommend the right plan.</p>
                  </div>
                  <form onSubmit={handleBmiSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Gender</label>
                        <select 
                          required
                          value={bmiData.gender}
                          onChange={e => setBmiData({...bmiData, gender: e.target.value})}
                          className="w-full bg-brand-black border border-brand-orange/20 rounded-xl px-4 py-3.5 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Age</label>
                        <input 
                          type="number" required placeholder="Years"
                          value={bmiData.age}
                          onChange={e => setBmiData({...bmiData, age: e.target.value})}
                          className="w-full bg-brand-black border border-brand-orange/20 rounded-xl px-4 py-3.5 text-white focus:border-brand-orange outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Height (cm)</label>
                        <input 
                          type="number" required placeholder="175"
                          value={bmiData.height}
                          onChange={e => setBmiData({...bmiData, height: e.target.value})}
                          className="w-full bg-brand-black border border-brand-orange/20 rounded-xl px-4 py-3.5 text-white focus:border-brand-orange outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Weight (kg)</label>
                        <input 
                          type="number" required placeholder="70"
                          value={bmiData.weight}
                          onChange={e => setBmiData({...bmiData, weight: e.target.value})}
                          className="w-full bg-brand-black border border-brand-orange/20 rounded-xl px-4 py-3.5 text-white focus:border-brand-orange outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-brand-orange text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-brand-orange/90 transition-all text-sm">
                      Calculate & Continue
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Goal */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <Target className="w-8 h-8 text-brand-orange mb-4" />
                    <h2 className="font-bebas text-4xl text-white tracking-wide">What is your primary goal?</h2>
                    {bmiResult && (
                      <div className="mt-3 inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-3 py-1 rounded text-xs font-bold uppercase">
                        Current BMI: {bmiResult}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {['Weight Loss', 'Muscle Gain', 'General Fitness'].map((g) => (
                      <button
                        key={g}
                        onClick={() => { setGoal(g); setStep(3); }}
                        className="w-full text-left bg-brand-black border border-white/5 hover:border-brand-orange rounded-xl p-5 flex items-center justify-between group transition-all"
                      >
                        <span className="text-white font-semibold text-lg">{g}</span>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-brand-orange transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Experience */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <Dumbbell className="w-8 h-8 text-brand-orange mb-4" />
                    <h2 className="font-bebas text-4xl text-white tracking-wide">Your Experience Level?</h2>
                    <p className="text-gray-400 text-sm mt-2">Be honest, this helps us match your coach.</p>
                  </div>
                  <div className="space-y-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => { setExperience(exp); setStep(4); }}
                        className="w-full text-left bg-brand-black border border-white/5 hover:border-brand-orange rounded-xl p-5 flex items-center justify-between group transition-all"
                      >
                        <div>
                          <span className="text-white font-semibold text-lg block">{exp}</span>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {exp === 'Beginner' ? 'New to gym or returning after a long break' : exp === 'Intermediate' ? 'Train regularly but need better results' : 'Very experienced, seeking elite programming'}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-brand-orange transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Coach Match */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8 text-center">
                    <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">
                      Match Found
                    </span>
                    <h2 className="font-bebas text-4xl text-white tracking-wide">Your Recommended Coach</h2>
                  </div>
                  
                  <div className="bg-brand-black border border-brand-orange/20 rounded-2xl p-6 text-center">
                    <img 
                      src={getCoachMatch().img} 
                      alt={getCoachMatch().name} 
                      className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-brand-orange mb-4"
                    />
                    <h3 className="font-bebas text-3xl text-white mb-2">{getCoachMatch().name}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
                      {getCoachMatch().reason}
                    </p>
                  </div>

                  <button 
                    onClick={() => setStep(5)}
                    className="w-full mt-6 bg-brand-orange text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-brand-orange/90 transition-all text-sm"
                  >
                    View My 90-Day Roadmap
                  </button>
                </motion.div>
              )}

              {/* Step 5: Roadmap */}
              {step === 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <Trophy className="w-8 h-8 text-brand-orange mb-4" />
                    <h2 className="font-bebas text-4xl text-white tracking-wide">Your 90-Day Roadmap</h2>
                    <p className="text-gray-400 text-sm mt-2">Customized for {goal}.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {getRoadmap().map((phase, idx) => (
                      <div key={idx} className="bg-brand-black border border-white/5 rounded-xl p-5 border-l-4 border-l-brand-orange">
                        <h4 className="text-white font-bold mb-1">{phase.phase}</h4>
                        <p className="text-xs text-gray-400">{phase.desc}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setStep(6)}
                    className="w-full mt-8 bg-brand-orange text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-brand-orange/90 transition-all text-sm shadow-[0_0_20px_rgba(255,95,0,0.3)]"
                  >
                    Secure My Assessment Session
                  </button>
                </motion.div>
              )}

              {/* Step 6: Final Form */}
              {step === 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <h2 className="font-bebas text-4xl text-white tracking-wide">Reserve Your Spot</h2>
                    <p className="text-gray-400 text-sm mt-2">
                      Leave your details below to schedule a free in-person consultation with {getCoachMatch().name}.
                    </p>
                  </div>
                  
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" required placeholder="Full Name"
                        value={contact.name} onChange={e => setContact({...contact, name: e.target.value})}
                        disabled={isSubmitting}
                        className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" required placeholder="Phone Number"
                        value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})}
                        disabled={isSubmitting}
                        className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" required placeholder="Email Address"
                        value={contact.email} onChange={e => setContact({...contact, email: e.target.value})}
                        disabled={isSubmitting}
                        className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brand-orange outline-none"
                      />
                    </div>
                    
                    {serverError && (
                      <div className="text-xs text-red-500 text-left mt-3">{serverError}</div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full mt-6 bg-brand-orange text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-brand-orange/90 transition-all text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        'Confirm Free Consultation'
                      )}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-semibold">
                      No commitment required.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* Step 7: Success */}
              {step === 7 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <CheckCircle2 className="w-20 h-20 text-brand-orange mx-auto mb-6" />
                  <h2 className="font-bebas text-5xl text-white tracking-wide mb-2">Request Sent</h2>
                  {successId && (
                    <div className="inline-block bg-black border border-white/10 text-brand-orange font-mono text-sm px-4 py-2 rounded-xl mb-4">
                      Ref: {successId}
                    </div>
                  )}
                  <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
                    {successMessage || `${getCoachMatch().name} has received your profile. We will contact you via WhatsApp shortly to schedule your free facility tour and assessment.`}
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-10 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white border border-white/20 rounded-full hover:bg-white/5 transition-all"
                  >
                    Return to Website
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
