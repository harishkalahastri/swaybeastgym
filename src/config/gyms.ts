import { Dumbbell, Target, Flame, Activity } from 'lucide-react';

export type GymProfile = {
  id: string;
  name: string;
  location: string;
  logoIcon: React.ElementType;
  colors: {
    primary: string; // Hex color for the accent
    primaryRgb: string; // Comma separated RGB e.g. "255, 95, 0"
  };
  hero: {
    headline: string;
    subhead: string;
    videoUrl?: string;
    imageFallback: string;
  };
  metrics: {
    membersCount: number;
    trainersCount: number;
    sessionsCount: number;
    ratingValue: number;
    establishedYear: number;
  };
  trainers: Array<{
    name: string;
    specialty: string;
    bio: string;
    image: string;
  }>;
};

export const gyms: Record<string, GymProfile> = {
  onyx: {
    id: 'onyx',
    name: 'Onyx Fitness',
    location: 'Hyderabad',
    logoIcon: Dumbbell,
    colors: { primary: '#ff5f00', primaryRgb: '255, 95, 0' },
    hero: {
      headline: 'Transform Your Body.\nElevate Your Life.',
      subhead: 'Premium personal training and science-backed programs designed to get you in the best shape of your life.',
      imageFallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 1250, trainersCount: 18, sessionsCount: 7500, ratingValue: 4.9, establishedYear: 2016 },
    trainers: [
      { name: 'Sarah Jenkins', specialty: 'Body Recomposition', bio: 'Helps beginners drop body fat and build sustainable eating habits without starving.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Marcus Chen', specialty: 'Strength & Conditioning', bio: 'Specializes in athletic performance and helping guys add pure lean muscle mass.', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop' },
      { name: 'David Miller', specialty: 'Mobility & Rehab', bio: 'Focuses on fixing bad posture and eliminating joint pain for office workers.', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop' },
    ]
  },
  gbk: {
    id: 'gbk',
    name: 'GBK Fitness Hub',
    location: 'Bangalore',
    logoIcon: Activity,
    colors: { primary: '#0066ff', primaryRgb: '0, 102, 255' },
    hero: {
      headline: 'Build True Strength.\nDominate Every Day.',
      subhead: 'Expert-led functional training designed for high performers who demand real results.',
      imageFallback: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 850, trainersCount: 12, sessionsCount: 4200, ratingValue: 4.8, establishedYear: 2019 },
    trainers: [
      { name: 'Rahul Sharma', specialty: 'Functional Fitness', bio: 'Expert in kettlebells and HIIT to build unstoppable everyday endurance.', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Priya Patel', specialty: 'Women\'s Strength', bio: 'Empowers women to lift heavy and build athletic, toned physiques.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Vikram Singh', specialty: 'Powerlifting', bio: 'Teaches perfect form for squats, bench, and deadlifts to maximize raw power.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop' },
    ]
  },
  sway: {
    id: 'sway',
    name: 'Sway Beast',
    location: 'Mumbai',
    logoIcon: Flame,
    colors: { primary: '#ff0033', primaryRgb: '255, 0, 51' },
    hero: {
      headline: 'Unleash Your Inner Beast.',
      subhead: 'Hardcore training for those who refuse to be average. No excuses, just results.',
      imageFallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 2100, trainersCount: 25, sessionsCount: 15000, ratingValue: 4.9, establishedYear: 2014 },
    trainers: [
      { name: 'Amit Desai', specialty: 'Hypertrophy Specialist', bio: 'Builds massive muscle and dramatic body transformations.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Neha Gupta', specialty: 'Metabolic Conditioning', bio: 'Designs brutal circuits that melt body fat in record time.', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop' },
      { name: 'Ravi Kumar', specialty: 'Competition Prep', bio: 'Takes advanced lifters to the stage with elite nutrition coaching.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' },
    ]
  },
  spartans: {
    id: 'spartans',
    name: 'Spartans Boxing',
    location: 'Delhi',
    logoIcon: Target,
    colors: { primary: '#ffd700', primaryRgb: '255, 215, 0' },
    hero: {
      headline: 'Fight For Your Fitness.',
      subhead: 'Learn authentic boxing techniques while getting the most shredded physique of your life.',
      imageFallback: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 600, trainersCount: 8, sessionsCount: 3000, ratingValue: 5.0, establishedYear: 2021 },
    trainers: [
      { name: 'Coach Raj', specialty: 'Striking Fundamentals', bio: 'Former pro fighter teaching the sweet science to beginners.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Anita Verma', specialty: 'Boxfit', bio: 'Combines heavy bag work with intense cardio to burn 1000+ calories a session.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Tariq Khan', specialty: 'Advanced Sparring', bio: 'Prepares amateur fighters for the ring with elite technical coaching.', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop' },
    ]
  },
  steel: {
    id: 'steel',
    name: 'Steel Gym',
    location: 'Chennai',
    logoIcon: Dumbbell,
    colors: { primary: '#8a8d91', primaryRgb: '138, 141, 145' },
    hero: {
      headline: 'Forge An Unbreakable Body.',
      subhead: 'Old-school iron meets modern sports science. Real training for real people.',
      imageFallback: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 950, trainersCount: 10, sessionsCount: 5500, ratingValue: 4.7, establishedYear: 2018 },
    trainers: [
      { name: 'Karthik N.', specialty: 'Old School Bodybuilding', bio: 'Believes in heavy compounds and basic nutrition for proven results.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop' },
      { name: 'Ananya S.', specialty: 'Strength Foundations', bio: 'Helps people who are intimidated by the weight room gain confidence.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Venkat R.', specialty: 'Injury Prevention', bio: 'Ensures perfect biomechanics to keep you lifting into your 60s.', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop' },
    ]
  }
};

export const defaultGymId = 'sway';
