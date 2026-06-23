import React from 'react';
import { Dumbbell, Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { defaultMetrics } from '../config/metrics';

export default function Footer() {
  const city = defaultMetrics.cityName;
  const gym = defaultMetrics.gymName;

  return (
    <footer className="bg-brand-charcoal pt-16 pb-24 md:pb-8 border-t border-brand-orange/10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Logo & Brand Meta */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-6 h-6 text-brand-orange" />
              <span className="font-bebas text-xl tracking-wider text-white">
                {gym.split(' ')[0]}
                <span className="text-brand-orange"> {gym.split(' ')[1]}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Hyderabad's premium physical engineering network. We build custom strength splits, macro nutritional targets, and track weekly progress composites to guarantee transformations.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com" className="p-2 bg-black hover:bg-brand-orange hover:text-black rounded-lg text-gray-400 transition-colors border border-white/5" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" className="p-2 bg-black hover:bg-brand-orange hover:text-black rounded-lg text-gray-400 transition-colors border border-white/5" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick contact & hours */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bebas text-lg tracking-wider text-white">
              Club Coordinate Details
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-brand-orange mr-2.5 mt-0.5 shrink-0" />
                <span>Road No. 36, Jubilee Hills, Near Metro Station, Hyderabad, Telangana - 500033</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-brand-orange mr-2.5 shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-brand-orange mr-2.5 shrink-0" />
                <span>contact@swaybeast.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-4 h-4 text-brand-orange mr-2.5 mt-0.5 shrink-0" />
                <div>
                  <span className="block">Mon - Sat: 6:00 AM - 11:00 PM</span>
                  <span className="block mt-0.5 text-gray-500">Sun: 8:00 AM - 4:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Location Map (Styled nicely for dark theme) */}
          <div className="lg:col-span-4">
            <h4 className="font-bebas text-lg tracking-wider text-white mb-4">
              Map Location
            </h4>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-brand-orange/10 relative grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.402243763784!2d78.40348737516565!3d17.430932283466133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90d7c3d7373f%3A0xc3cf9c9a59b3f3b9!2sJubilee%20Hills%20Road%20No%2036!5e0!3m2!1sen!2sin!4v1718972800000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* Natural Local SEO Copy Block (Refinement 5 compliant - No spam, useful insights) */}
        <div className="py-8 border-b border-white/5 text-left">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-orange mb-3">
            Local Fitness Resource Center
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed font-light max-w-5xl">
            {gym} is a premium training network offering science-backed <strong>weight loss programs in {city}</strong>. We believe that <strong>personal training in {city}</strong> should be driven by biometrics, joint health checks, and individual biomechanics. Our coaches design strength splits and guide compound movements to ensure members achieve sustainable adaptations. Whether you seek structured barbell-driven <strong>strength training in {city}</strong> or functional mobility protocols, our systems are built around your goals. If you are searching for the <strong>best gym in {city}</strong> for athletic and functional longevity, explore our plans or register for an initial assessment today.
          </p>
        </div>

        {/* Legal & copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} {gym}. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-brand-orange">Terms of Service</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-brand-orange">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
