import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import MyJourney from './pages/MyJourney';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center text-center p-5"
    >
      <div className="mb-5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
          <path d="m6.5 6.5 11 11"/>
          <path d="m21 21-1-1"/>
          <path d="m3 3 1 1"/>
          <path d="m18.5 5.5 3 3"/>
          <path d="m2.5 15.5 3 3"/>
          <path d="m16 16 .5-.5 3 3-.5.5z"/>
          <path d="m5 5 .5-.5 3 3-.5.5z"/>
          <path d="M12 5V3"/>
          <path d="M12 21v-2"/>
          <path d="M19 12h2"/>
          <path d="M3 12h2"/>
        </svg>
        <span className="font-bebas text-3xl tracking-widest font-bold uppercase">SWAY <span className="text-brand-orange">BEAST</span></span>
      </div>
      <h1 className="text-xl md:text-2xl mb-3 font-bold">Premium Fitness Engineering & Biomechanics Club</h1>
      <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        Located in Kondapur, Hyderabad. Experience science-backed personal training, custom hypertrophy programs, fat loss splits, and advanced athletic longevity coaching.
      </p>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-brand-orange/20 border-t-brand-orange rounded-full"
      />
    </motion.div>
  );
}

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Transformations from './components/Transformations';
import EarlyLead from './components/EarlyLead';
import SuccessStories from './components/SuccessStories';
import Metrics from './components/Metrics';
import WhySucceed from './components/WhySucceed';
import WhyUs from './components/WhyUs';
import Programs from './components/Programs';
import Process from './components/Process';
import AssessmentFlow from './components/AssessmentFlow';
import Gallery from './components/Gallery';
import FirstVisit from './components/FirstVisit';
import Pricing from './components/Pricing';
import TrialForm from './components/TrialForm';
import Trainers from './components/Trainers';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import Chatbot from './components/Chatbot';
import ExitIntent from './components/ExitIntent';
import OpsCenter from './components/OpsCenter';
import EnrollmentModal from './components/EnrollmentModal';
import type { SelectedPlan } from './components/EnrollmentModal';
import ProgramConsultationModal from './components/ProgramConsultationModal';

function HomePage() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [selectedEnrollmentPlan, setSelectedEnrollmentPlan] = useState<SelectedPlan | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const handleOpenEnrollment = (plan: SelectedPlan) => {
    setSelectedEnrollmentPlan(plan);
    setIsEnrollmentOpen(true);
  };

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setIsProgramModalOpen(true);
  };

  const isAnyModalOpen = isAssessmentOpen || isEnrollmentOpen || isProgramModalOpen;
  
  // Store lenis instance so we can pause/resume it
  const lenisRef = React.useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle modal scroll locking
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = 'unset';
      lenisRef.current?.start();
    }

    return () => {
      document.body.style.overflow = 'unset';
      lenisRef.current?.start();
    };
  }, [isAnyModalOpen]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* 1. Global Navigation */}
      <Navbar
        onOpenAssessment={() => setIsAssessmentOpen(true)}
      />

      {/* 2. Structured Layout sections */}
      <main>
        {/* Section 1: Hero */}
        <Hero onOpenAssessment={() => setIsAssessmentOpen(true)} />

        {/* Section 2: Outcomes/Before-After Grid */}
        <Transformations />

        {/* Section 3: Early Lead capture (Fast-track) */}
        <EarlyLead />

        {/* Section 4: Success Stories Stories carousel */}
        <SuccessStories />

        {/* Section 5: Results & Metrics local dashboard */}
        <Metrics />

        {/* Section 6: Why Members Succeed (Emotional/Logical bridge) */}
        <WhySucceed />

        {/* Section 7: Why Choose Us (Bullet list + action picture) */}
        <WhyUs />

        {/* Section 8: Programs Adaptation Splits */}
        <Programs onSelectProgram={handleSelectProgram} />

        {/* Section 8.5: Our Process */}
        <Process onOpenAssessment={() => setIsAssessmentOpen(true)} />

        {/* Section 11: Club zones gallery */}
        <Gallery />

        {/* Section 12: First Visit ExperienceTimeline Visual Funnel */}
        <FirstVisit />

        {/* Section 13: Membership pricing cards */}
        <Pricing onSelectPlan={handleOpenEnrollment} />

        {/* Section 14: Comprehensive trial booking form */}
        <TrialForm />

        {/* Section 15: Coaches grid bio details */}
        <Trainers />

        {/* Section 16: Accordion FAQ checklist */}
        <FAQ />

        {/* Section 17: Full-bleed urgency CTA banner */}
        <FinalCTA />
      </main>

      {/* 3. Footer & SEO Metadata */}
      <Footer />

      {/* 4. Global Overlays, Sticky CTAs & Analytics panels */}
      <FloatingActions onOpenAssessment={() => setIsAssessmentOpen(true)} />
      <Chatbot />
      <ExitIntent />
      <OpsCenter />

      {/* Premium Assessment Flow Modal */}
      <AssessmentFlow 
        isOpen={isAssessmentOpen} 
        onClose={() => setIsAssessmentOpen(false)} 
      />

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        plan={selectedEnrollmentPlan}
      />

      {/* Program Consultation Modal */}
      <ProgramConsultationModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        programId={selectedProgramId}
      />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} key="splash" />}
      </AnimatePresence>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-journey" element={<MyJourney />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}
