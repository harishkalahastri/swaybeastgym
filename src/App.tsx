import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import MyJourney from './pages/MyJourney';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/my-journey" element={<MyJourney />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
