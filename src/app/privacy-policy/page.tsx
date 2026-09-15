import React from 'react';

export const metadata = {
  title: 'Privacy Policy | PT RIN Group Indonesia',
  description: 'Corporate Privacy Policy of PT RIN Group Indonesia regarding visitor information and website services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-neutral-400">Last updated: August 2026</p>
        </div>
      </section>

      <div className="py-20 max-w-4xl mx-auto px-6 space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">1. Information We Collect</h2>
          <p>
            PT RIN Group Indonesia collects information you provide voluntarily when submitting inquiries through our corporate website, including your name, email address, phone number, and message details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">2. Use of Information</h2>
          <p>
            Information collected is strictly utilized to respond to corporate communications, evaluate candidate applications, improve dining hospitality services, and analyze aggregated website engagement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">3. Cookies and Analytics</h2>
          <p>
            We use privacy-friendly analytics mechanisms and Google Analytics 4 to understand website traffic patterns. IP addresses are processed in hashed format to protect personal identifiable information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">4. Contact Information</h2>
          <p>
            For inquiries regarding our privacy practices, please reach out to <a href="mailto:corporate@ringroup.co.id" className="text-[#9E2F2F] underline">corporate@ringroup.co.id</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
