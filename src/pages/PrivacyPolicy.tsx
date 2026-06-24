import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { contact } from '../config/contact';
import { defaultMetrics } from '../config/metrics';

export default function PrivacyPolicy() {
  const gym = defaultMetrics.gymName;
  const lastUpdated = 'June 24, 2026';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-brand-charcoal border-b border-brand-orange/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Shield className="w-5 h-5 text-brand-orange" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-orange block mb-3">
            Legal
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          
          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              1. Who We Are
            </h2>
            <p>
              {gym} ("{gym}", "we", "us", or "our") operates the website at{' '}
              <strong className="text-white">swaybeastgym.vercel.app</strong> and the physical fitness facility located at{' '}
              <strong className="text-white">{contact.address.full}</strong>.
              This Privacy Policy explains how we collect, use, store, and protect your personal data
              when you interact with our website, forms, chatbot, or visit our gym.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              2. Data We Collect
            </h2>
            <p>We collect the following categories of personal data:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li><strong className="text-white">Identity Data:</strong> Full name, age, gender</li>
              <li><strong className="text-white">Contact Data:</strong> WhatsApp number, email address, phone number</li>
              <li><strong className="text-white">Fitness Data:</strong> Fitness goals, experience level, preferred workout frequency, height, weight, BMI (when voluntarily provided via assessment forms)</li>
              <li><strong className="text-white">Membership Data:</strong> Selected plan, preferred start date, enrollment records</li>
              <li><strong className="text-white">Technical Data:</strong> Browser type, device type, approximate location (city-level, not GPS), pages visited</li>
              <li><strong className="text-white">Communication Data:</strong> Messages sent via our chatbot or WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              3. How We Collect Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>When you fill out the Trial Form, Assessment Flow, Early Lead form, or Enrollment Modal on our website</li>
              <li>When you interact with our AI Chatbot</li>
              <li>When you contact us via WhatsApp, phone, or email</li>
              <li>When you visit our gym and provide information at the front desk</li>
              <li>Automatically through cookies and similar technologies when you browse our website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              4. Why We Use Your Data
            </h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li>To process membership inquiries, trial bookings, and enrollment requests</li>
              <li>To recommend suitable fitness programs based on your assessment responses</li>
              <li>To contact you regarding your inquiry via WhatsApp, phone call, or email</li>
              <li>To provide customer support and respond to your questions</li>
              <li>To improve our website, services, and user experience</li>
              <li>To comply with legal obligations under Indian law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              5. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely on <strong className="text-white">Supabase</strong> (cloud database infrastructure hosted on AWS).
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Row-Level Security (RLS) policies on database tables</li>
              <li>Server-side deduplication to prevent duplicate entries</li>
              <li>Environment-level secret management for API keys</li>
            </ul>
            <p className="mt-3">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy,
              or as required by Indian law. You may request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              6. Data Sharing
            </h2>
            <p>We do <strong className="text-white">not</strong> sell your personal data. We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li><strong className="text-white">Service Providers:</strong> Supabase (database), Vercel (hosting), Groq (AI chatbot processing) — only to the extent necessary for service delivery</li>
              <li><strong className="text-white">Gym Staff:</strong> Coaches and trainers who need your fitness data to design your program</li>
              <li><strong className="text-white">Legal Authorities:</strong> If required by law, court order, or regulatory request</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              7. Your Rights (DPDPA 2023)
            </h2>
            <p>
              Under India's <strong className="text-white">Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li><strong className="text-white">Access:</strong> Request a summary of the personal data we hold about you</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete personal data</li>
              <li><strong className="text-white">Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw your consent for data processing at any time</li>
              <li><strong className="text-white">Grievance Redressal:</strong> File a complaint with us or the Data Protection Board of India</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              8. Cookies
            </h2>
            <p>
              Our website uses <strong className="text-white">localStorage</strong> to persist form submission data for offline resilience
              (our SyncEngine queues submissions locally and syncs when connectivity is restored).
              We do not currently use third-party tracking cookies. If we add analytics tools in the future,
              this policy will be updated accordingly.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              9. Contact Us
            </h2>
            <p>
              For any privacy-related inquiries, data access requests, or complaints, please contact us:
            </p>
            <ul className="list-none space-y-2 mt-3 text-sm">
              <li>📧 Email: <a href={`mailto:${contact.email}`} className="text-brand-orange hover:underline">{contact.email}</a></li>
              <li>📞 Phone: <a href={contact.phoneLink} className="text-brand-orange hover:underline">{contact.phoneDisplay}</a></li>
              <li>📍 Address: {contact.address.full}</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
