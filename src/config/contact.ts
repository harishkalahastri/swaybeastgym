/**
 * CENTRALIZED CONTACT CONFIGURATION
 * ===================================
 * Single source of truth for ALL phone numbers, WhatsApp links,
 * social media profiles, and email addresses across the entire website.
 *
 * ⚠️  BEFORE GOING LIVE: Replace ALL placeholder values below
 *     with the real gym owner's actual contact details.
 */

export const contact = {
  // ── Phone ────────────────────────────────────────────────
  /** Display format for UI (Footer, cards, etc.) */
  phoneDisplay: '+91 99999 99999',
  /** tel: link format (no spaces, with country code) */
  phoneLink: 'tel:+919999999999',

  // ── WhatsApp ─────────────────────────────────────────────
  /** WhatsApp number without + prefix, used in wa.me links */
  whatsappNumber: '919999999999',

  /** Pre-built WhatsApp URLs for different intents */
  whatsappLinks: {
    general: (gymName: string) =>
      `https://wa.me/919999999999?text=${encodeURIComponent(`Hello ${gymName}! I'd like to know more about your personal training programs.`)}`,
    membership: () =>
      `https://wa.me/919999999999?text=${encodeURIComponent("Hello! I'd like to know more about membership options.")}`,
    assessment: () =>
      `https://wa.me/919999999999?text=${encodeURIComponent("Hello! I'd like to book a private coach assessment.")}`,
    trial: () =>
      `https://wa.me/919999999999?text=${encodeURIComponent("Hello! I'd like to book a free trial session now.")}`,
    /** Direct link (no prefilled message) — used in success states */
    direct: () => `https://wa.me/919999999999`,
  },

  // ── Email ────────────────────────────────────────────────
  email: 'contact@swaybeast.com',

  // ── Social Media Profiles ────────────────────────────────
  /** Replace with actual gym social profiles before launch */
  social: {
    instagram: 'https://instagram.com/swaybeastfitness',
    facebook: 'https://facebook.com/swaybeastfitness',
  },

  // ── Physical Address ─────────────────────────────────────
  address: {
    full: 'Pillar No. 135, 2nd Floor, Above Vaishnaoi Honda Showroom, Kondapur, Hyderabad, Telangana - 500084',
    short: 'Kondapur, Hyderabad',
    mapQuery: 'Pillar+No+135+Kondapur+Hyderabad',
  },

  // ── Operating Hours ──────────────────────────────────────
  hours: {
    weekday: 'Mon - Sat: 6:00 AM - 11:00 PM',
    weekend: 'Sun: 8:00 AM - 4:00 PM',
    schemaFormat: ['Mo-Sa 06:00-23:00', 'Su 08:00-16:00'],
  },
} as const;
