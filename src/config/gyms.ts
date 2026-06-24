import { Flame } from 'lucide-react';

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
  sway: {
    id: 'sway',
    name: 'Sway Beast',
    location: 'Kondapur, Hyderabad',
    logoIcon: Flame,
    colors: { primary: '#ff0033', primaryRgb: '255, 0, 51' },
    hero: {
      headline: 'Unleash Your Inner Beast.',
      subhead: 'Hardcore training for those who refuse to be average. No excuses, just results.',
      imageFallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    },
    metrics: { membersCount: 1250, trainersCount: 18, sessionsCount: 7500, ratingValue: 4.9, establishedYear: 2016 },
    trainers: [
      { name: 'Amit Desai', specialty: 'Hypertrophy Specialist', bio: 'Builds massive muscle and dramatic body transformations.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Neha Gupta', specialty: 'Metabolic Conditioning', bio: 'Designs brutal circuits that melt body fat in record time.', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop' },
      { name: 'Ravi Kumar', specialty: 'Competition Prep', bio: 'Takes advanced lifters to the stage with elite nutrition coaching.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' },
    ]
  }
};

export const defaultGymId = 'sway';

