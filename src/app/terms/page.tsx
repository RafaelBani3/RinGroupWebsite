import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | PT RIN Group Indonesia',
  description: 'Terms of Use for the PT RIN Group Indonesia corporate website and restaurant brand services.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-neutral-400">Last updated: August 2026</p>
        </div>
      </section>

      <div className="py-20 max-w-4xl mx-auto px-6 space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the corporate web platform of PT RIN Group Indonesia, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">2. Intellectual Property</h2>
          <p>
            All brand trademarks, trade names, culinary concept descriptions, logos, and visual assets belonging to PT RIN Group Indonesia and its dining concepts (including Sukiyaki RIN, Yakiniku TEN, Ryu Jin, Sumomatsu) remain the intellectual property of the company.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-neutral-900">3. Disclaimer of Warranties</h2>
          <p>
            The content provided on this website is for corporate informational purposes. While we strive to maintain current information, restaurant operating hours, menus, and concept details are subject to operational change without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}
