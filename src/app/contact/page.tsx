import React from 'react';
import { prisma } from '@/lib/prisma';
import { ContactForm } from '@/components/public/ContactForm';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Contact PT RIN Group Indonesia | Corporate Inquiries',
  description:
    'Reach out to PT RIN Group Indonesia for corporate relations, restaurant opportunities, culinary partnerships, and business development.',
};

export default async function ContactPage() {
  const profile = prisma
    ? await prisma.companyProfile.findUnique({ where: { isSingleton: true } })
    : null;

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-4">
          <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
            Corporate Contact
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            We welcome inquiries regarding culinary partnerships, restaurant opportunities, leasing inquiries, and corporate relations.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-[#EFECE4] border border-[#D5CFC2] rounded-3xl p-8 sm:p-12 shadow-xs space-y-6">
            <div>
              <span className="japanese-eyebrow">Message Us</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight mt-1">
                Send an Inquiry
              </h2>
              <p className="text-xs text-neutral-600 font-light mt-1">
                Fill out the form below and our team will be in touch with you.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Contact Details & Headquarters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#EFECE4] border border-[#D5CFC2] rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-serif font-semibold text-neutral-900 border-b border-[#D5CFC2] pb-3">
                Corporate Office
              </h3>

              <div className="space-y-4 text-xs text-neutral-700 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B69B63] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {profile?.address ||
                      'Alam Sutera Boulevard, Tangerang, Banten, Indonesia'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#B69B63] shrink-0" />
                  <a
                    href={`mailto:${profile?.email || 'corporate@ringroup.co.id'}`}
                    className="hover:underline font-medium text-neutral-900"
                  >
                    {profile?.email || 'corporate@ringroup.co.id'}
                  </a>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#B69B63] shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              {profile?.mapUrl && (
                <div className="pt-2">
                  <a
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#9E2F2F] hover:text-[#B69B63] font-medium transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Social Channels */}
            <div className="bg-[#EFECE4] border border-[#D5CFC2] rounded-3xl p-8 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-4 text-xs">
                {profile?.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-[#9E2F2F] font-medium transition-colors"
                  >
                    Instagram →
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-[#9E2F2F] font-medium transition-colors"
                  >
                    LinkedIn →
                  </a>
                )}
                {profile?.tiktok && (
                  <a
                    href={profile.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-[#9E2F2F] font-medium transition-colors"
                  >
                    TikTok →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
