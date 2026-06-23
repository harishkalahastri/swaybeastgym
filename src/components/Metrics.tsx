import React, { useState, useEffect, useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { Users, Shield, Calendar, Award } from 'lucide-react';
import { defaultMetrics } from '../config/metrics';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function Counter({ value, suffix = '', duration = 1.5 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    
    const end = value;
    const startTime = performance.now();

    function animateCount(timestamp: number) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }

    requestAnimationFrame(animateCount);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Metrics() {
  const metricsData = [
    {
      id: 'm1',
      icon: <Users className="w-6 h-6 text-brand-orange" />,
      title: 'Active Members',
      value: defaultMetrics.membersCount,
      suffix: '+',
      description: 'Consulted and trained under our specialized guidelines.'
    },
    {
      id: 'm2',
      icon: <Award className="w-6 h-6 text-brand-orange" />,
      title: 'Expert Coaches',
      value: defaultMetrics.trainersCount,
      suffix: '',
      description: 'Certified specialists managing custom transformation plans.'
    },
    {
      id: 'm3',
      icon: <Shield className="w-6 h-6 text-brand-orange" />,
      title: 'Sessions Delivered',
      value: defaultMetrics.sessionsCount,
      suffix: '+',
      description: 'Completed hours of tracking, recovery, and lifting.'
    },
    {
      id: 'm4',
      icon: <Calendar className="w-6 h-6 text-brand-orange" />,
      title: 'Established',
      value: defaultMetrics.establishedYear,
      suffix: '',
      description: 'Leading the premium fitness ecosystem in Hyderabad.'
    }
  ];

  return (
    <section className="py-20 bg-brand-charcoal/30 border-y border-brand-orange/5 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Pitch Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-orange block mb-3">
            LOCAL AUTHORITY
          </span>
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase tracking-wider">
            Numbers That Validate Our Process
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Sway Beast Fitness is not just a commercial gym. We are a results-focused engineering platform tracking data and ensuring every training hour converts.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-2xl border border-brand-orange/5 bg-brand-charcoal/40 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-brand-orange/10 rounded-xl w-fit mb-6">
                  {item.icon}
                </div>
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  {item.title}
                </h3>
                <div className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-2">
                  <Counter value={item.value} suffix={item.suffix} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
