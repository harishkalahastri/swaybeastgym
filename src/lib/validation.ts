/**
 * Sway Beast Fitness - Anti-Spam & Validation Layer
 * Enforces Phase 3 strict validation rules before hitting the backend.
 */

// 1. Phone Validation
export const isValidPhone = (phone: string): boolean => {
  // Remove spaces, dashes, parentheses
  const clean = phone.replace(/[\s\-()]/g, '');
  // Indian numbers: optionally start with +91 or 91, then 10 digits
  const regex = /^(?:\+?91|0)?[6789]\d{9}$/;
  return regex.test(clean);
};

// 2. Email Validation
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 3. Goal Validation
const allowedGoals = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'CrossFit', 'Dance Fitness'];
export const isValidGoal = (goal: string): boolean => {
  return allowedGoals.includes(goal);
};

// 4. Rate Limiting / Cooldown Protection (15-Minute Rule)
export const checkRateLimit = (phone: string, eventType: string): boolean => {
  const storageKey = `swaybeast_cooldown_${phone}_${eventType}`;
  const lastSubmission = localStorage.getItem(storageKey);
  
  if (lastSubmission) {
    const timestamp = parseInt(lastSubmission, 10);
    const now = Date.now();
    const minutesSince = (now - timestamp) / (1000 * 60);
    
    // 15-minute cooldown rule
    if (minutesSince < 15) {
      console.warn(`[Anti-Spam] Rate limited. Please wait ${Math.ceil(15 - minutesSince)} minutes.`);
      return false; 
    }
  }

  // Update cooldown timestamp
  localStorage.setItem(storageKey, Date.now().toString());
  return true;
};

// 5. Abandoned Journey Progress Saving
export const savePartialProgress = (phone: string, step: number, data: any) => {
  if (!phone) return;
  const storageKey = `swaybeast_abandoned_journey_${phone}`;
  localStorage.setItem(storageKey, JSON.stringify({
    step,
    data,
    last_updated: Date.now()
  }));
};
