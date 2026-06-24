import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { contact } from '../config/contact';
import { defaultMetrics } from '../config/metrics';

export default function TermsOfService() {
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
          <FileText className="w-5 h-5 text-brand-orange" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-orange block mb-3">
            Legal
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight uppercase">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the {gym} website (<strong className="text-white">swaybeastgym.vercel.app</strong>),
              submitting any form, or enrolling in a membership, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              2. Services Offered
            </h2>
            <p>{gym} provides the following services through its website and physical facility:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li>Gym membership access at our Kondapur, Hyderabad facility</li>
              <li>Personal training and coaching consultations</li>
              <li>Fitness assessment and body composition analysis</li>
              <li>Customized workout program recommendations</li>
              <li>Online inquiry and booking via website forms</li>
              <li>AI-powered chatbot for general fitness and membership questions</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              3. Membership & Pricing
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>All prices displayed on the website are in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>{gym} reserves the right to modify pricing at any time. Existing members will be notified of changes before their next renewal period.</li>
              <li>Online membership requests submitted via the website are <strong className="text-white">inquiries only</strong> and do not constitute a confirmed enrollment until verified by our team.</li>
              <li>Free trial sessions are subject to availability and limited to one per individual.</li>
              <li>Membership freeze options are available only on eligible plans and subject to approval.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              4. User Responsibilities
            </h2>
            <p>By using our website and facilities, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li>Provide accurate, truthful, and complete information in all forms</li>
              <li>Not submit false, misleading, or spam entries</li>
              <li>Use the chatbot and website features for their intended purpose</li>
              <li>Follow all safety guidelines, gym rules, and trainer instructions during sessions</li>
              <li>Consult your physician before starting any new fitness program, especially if you have pre-existing medical conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              5. Health Disclaimer
            </h2>
            <p>
              <strong className="text-white">{gym} is not a medical provider.</strong> Our trainers, coaches, and the
              AI chatbot do not provide medical advice, diagnosis, or treatment.
              All fitness programs, nutritional guidance, and assessment recommendations are for general informational
              purposes only. You should consult a qualified healthcare professional before beginning any exercise program.
            </p>
            <p className="mt-3">
              By using our services, you acknowledge that physical exercise carries inherent risks of injury.
              You participate in all training sessions and programs at your own risk.
              {gym} is not liable for any injuries, health complications, or property damage incurred
              during the use of our facilities or programs.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              6. AI Chatbot Disclaimer
            </h2>
            <p>
              Our website features an AI-powered chatbot that answers questions about {gym}'s memberships,
              programs, and services. This chatbot is powered by a third-party AI model and may occasionally
              provide inaccurate information. For verified pricing, availability, and scheduling,
              please contact us directly via phone or WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, graphics, logos, icons, images, design elements,
              and software — is the property of {gym} or its licensors and is protected by Indian and international
              copyright, trademark, and intellectual property laws. You may not reproduce, distribute, or
              create derivative works without our written consent.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              8. Refund & Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Membership fees are <strong className="text-white">non-refundable</strong> once payment has been processed and the membership period has begun.</li>
              <li>Members may request cancellation by contacting us at least 15 days before their next renewal date.</li>
              <li>Freeze requests must be submitted in writing and are subject to plan eligibility.</li>
              <li>Free trial sessions do not require payment and have no cancellation obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by Indian law, {gym} shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of our website
              or services, including but not limited to loss of data, loss of revenue, or personal injury.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              10. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of
              the courts in <strong className="text-white">Hyderabad, Telangana, India</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              11. Changes to These Terms
            </h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will be posted
              on this page with an updated "Last updated" date. Continued use of the website after changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white tracking-wider uppercase mb-4">
              12. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
