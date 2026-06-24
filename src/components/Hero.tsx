import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion } from 'framer-motion';
import { Flame, Dumbbell, Star, Activity, ArrowRight, MessageSquare } from 'lucide-react';
import { useGym } from '../context/GymContext';
import { defaultMetrics } from '../config/metrics';
import { contact } from '../config/contact';

interface HeroProps {
  onOpenAssessment: () => void;
}

export default function Hero({ onOpenAssessment }: HeroProps) {
  const { gym } = useGym();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [membersCount, setMembersCount] = useState(0);

  // Scroll bindings for the orbit
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    // Count-up trust metrics animation
    const end = gym.metrics.membersCount;
    const duration = 1500;
    const startTime = performance.now();

    function animateCount(timestamp: number) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setMembersCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }

    requestAnimationFrame(animateCount);
  }, []);

  useEffect(() => {
    // HLS video logic
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (prefersReducedMotion || !gym.hero.videoUrl) {
      // If user prefers reduced motion or no video provided, set static poster, don't play video
      if (video) video.pause();
      return;
    }

    const hlsUrl = gym.hero.videoUrl;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay blocked or failed', e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay blocked or failed', e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = rect.height;
      const progress = Math.max(0, Math.min(1, -rect.top / height));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTransformations = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#transformations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Badge icons dictionary
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-5 h-5 text-brand-orange" />;
      case 'dumbbell':
        return <Dumbbell className="w-5 h-5 text-brand-orange" />;
      case 'star':
        return <Star className="w-5 h-5 text-brand-orange" />;
      case 'activity':
      default:
        return <Activity className="w-5 h-5 text-brand-orange" />;
    }
  };

  // Orbit Calculation Helper for 4 Badges (Desktop only)
  // We place the orbit center on the right side of the screen where the background athlete is.
  // xCenter = 72vw, yCenter = 50vh. Rx = 15vw, Ry = 15vh.
  // Scroll rotation is kept subtle (about 45 degrees max) to prevent overlapping typography.
  const getOrbitStyles = (index: number) => {
    if (prefersReducedMotion) return {};
    
    const startAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const baseAngle = startAngles[index];
    // Slow orbit scroll linked rotation
    const currentAngle = baseAngle + scrollProgress * Math.PI * 0.4;
    
    const rx = 15; // in vw
    const ry = 15; // in vh
    
    const x = Math.cos(currentAngle) * rx;
    const y = Math.sin(currentAngle) * ry;
    
    return {
      transform: `translate(${x}vw, ${y}vh)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  const badgeConfig = defaultMetrics.heroBadges;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center bg-black overflow-hidden"
    >
      {/* Video HLS Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-center opacity-75"
          poster={gym.hero.imageFallback}
          muted
          loop
          playsInline
        />
        {/* Soft dark vignette gradients to ensure high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Headline & Subhead */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Animated Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal/60 border border-brand-orange/20 backdrop-blur-md mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs uppercase font-semibold tracking-wider text-gray-300">
                Premium Coaching Network
              </span>
            </motion.div>

            {/* Typography Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-bebas text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] text-white tracking-tight uppercase whitespace-pre-line"
            >
              {gym.hero.headline}
            </motion.h1>

            {/* Subheadline & Trust counter */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed"
            >
              {gym.hero.subhead}
            </motion.p>

            {/* Trust Stat Counter (Count-up animation) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex items-center space-x-6 py-2 px-4 rounded-xl bg-brand-charcoal/30 border border-brand-orange/5 backdrop-blur-sm"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-brand-black object-cover"
                    src={`https://images.unsplash.com/photo-${
                      i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1507003211169-0a1dd7228f2d' : i === 3 ? '1494790108377-be9c29b29330' : '1500648767791-00dcc994a43e'
                    }?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                    alt="Member"
                  />
                ))}
              </div>
              <div>
                <span className="font-bebas text-xl text-brand-orange font-bold">
                  {membersCount}+ Members
                </span>
                <span className="text-xs text-gray-400 block tracking-wide uppercase">
                  ⭐ {gym.metrics.ratingValue} Avg Google Rating
                </span>
              </div>
            </motion.div>

            {/* MANDATORY Above-the-Fold CTA Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              {/* Primary: Book Free Trial */}
              <a
                href="#trial-form"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-brand-orange rounded-full hover:bg-brand-orange/90 transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-brand-orange/20"
              >
                Book Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>

              {/* Secondary: Take Assessment */}
              <button
                onClick={(e) => { e.preventDefault(); onOpenAssessment(); }}
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold uppercase tracking-wider text-white border border-brand-orange/30 bg-brand-charcoal/40 backdrop-blur-md rounded-full hover:border-brand-orange hover:bg-brand-charcoal/60 transition-all duration-300"
              >
                Take Assessment
              </button>

              {/* Tertiary: WhatsApp Coach */}
              <a
                href={contact.whatsappLinks.general(gym.name)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-brand-orange transition-colors py-3 min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-brand-orange" />
                WhatsApp Coach
              </a>
            </motion.div>
          </div>

          {/* Orbit Badges / Mobile Layout Grid */}
          <div className="lg:col-span-5 relative h-[300px] lg:h-[600px] flex items-center justify-center lg:block mt-8 lg:mt-0">
            {/* Desktop: Orbiting Absolute Badges */}
            <div className="hidden lg:block absolute inset-0">
              {/* Visual Anchor for Orbit center */}
              <div className="absolute top-[50%] left-[72%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-orange/30 animate-ping" />

              {badgeConfig.map((badge, idx) => (
                <div
                  key={badge.label}
                  className="absolute top-[50%] left-[45%] z-20"
                  style={getOrbitStyles(idx)}
                >
                  <div className="glass-card flex items-center space-x-3.5 px-5 py-3 rounded-2xl border border-brand-orange/15 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="p-2 bg-brand-orange/10 rounded-xl">
                      {getIcon(badge.icon)}
                    </div>
                    <div>
                      <div className="font-bebas text-lg tracking-wider text-white">
                        {badge.value}
                      </div>
                      <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                        {badge.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Grid of 2x2 badges positioned clean & stacked */}
            <div className="lg:hidden w-full grid grid-cols-2 gap-4">
              {badgeConfig.map((badge) => (
                <div
                  key={badge.label}
                  className="glass-card flex items-center space-x-3 p-4 rounded-2xl border border-brand-orange/10 bg-brand-charcoal/50 backdrop-blur-md"
                >
                  <div className="p-2 bg-brand-orange/10 rounded-lg">
                    {getIcon(badge.icon)}
                  </div>
                  <div>
                    <div className="font-bebas text-base tracking-wider text-white">
                      {badge.value}
                    </div>
                    <div className="text-[9px] uppercase font-semibold tracking-wider text-gray-400">
                      {badge.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Downward gradient overlay for next section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
