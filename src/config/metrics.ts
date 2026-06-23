export interface TrustMetric {
  value: string;
  label: string;
  icon: string; // key matching SVG representation
}

export interface GymMetrics {
  // Hero Floating Badges
  heroBadges: TrustMetric[];
  
  // Results & Dashboard Section
  membersCount: number;
  trainersCount: number;
  sessionsCount: number;
  ratingValue: number;
  establishedYear: number;
  
  // SEO Metadata
  cityName: string;
  gymName: string;
}

export const defaultMetrics: GymMetrics = {
  heroBadges: [
    { value: "25K+", label: "Calories Burned", icon: "flame" },
    { value: "300+", label: "Transformations", icon: "dumbbell" },
    { value: "4.9", label: "Member Rating", icon: "star" },
    { value: "10K+", label: "Sessions Done", icon: "activity" }
  ],
  membersCount: 1250,
  trainersCount: 18,
  sessionsCount: 7500,
  ratingValue: 4.9,
  establishedYear: 2016,
  cityName: "Hyderabad",
  gymName: "Sway Beast Fitness"
};
