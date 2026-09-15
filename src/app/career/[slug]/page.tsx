import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CareerStatus } from '@prisma/client';
import { MapPin, Briefcase, Calendar, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics/events';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!prisma) return { title: 'Career' };

  const job = await prisma.career.findUnique({
    where: { slug },
  });

  if (!job) return { title: 'Job Not Found' };

  return {
    title: `${job.title} | Careers at PT RIN Group Indonesia`,
    description: job.description.substring(0, 160),
  };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!prisma) notFound();

  const job = await prisma.career.findUnique({
    where: { slug },
  });

  if (!job || job.status !== CareerStatus.PUBLISHED) {
    notFound();
  }

  // Check if job closing date has passed
  const isExpired = job.closingDate ? new Date(job.closingDate) < new Date() : false;

  trackEvent({ eventName: 'career_view', path: `/career/${slug}` });

  // JSON-LD JobPosting Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: job.employmentType ? job.employmentType.toUpperCase().replace('-', '_') : 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'PT RIN Group Indonesia',
      sameAs: 'https://ringroup.co.id',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'ID',
      },
    },
    datePosted: job.createdAt.toISOString(),
    ...(job.closingDate ? { validThrough: job.closingDate.toISOString() } : {}),
  };

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <Link
            href="/career"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Openings</span>
          </Link>

          <span className="text-[10px] tracking-[0.25em] font-mono text-[#B69B63] uppercase block">
            {job.department} • {job.employmentType}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B69B63]" />
              <span>{job.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#B69B63]" />
              <span>{job.employmentType}</span>
            </span>
            {job.closingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B69B63]" />
                <span>Closing: {formatDate(job.closingDate)}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Spec Content */}
      <section className="py-20 max-w-4xl mx-auto px-6 space-y-12">
        {isExpired && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>This position closed on {formatDate(job.closingDate)}. Applications are no longer being actively accepted.</span>
          </div>
        )}

        {/* Position Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-neutral-900 border-b border-[#D5CFC2] pb-2">
            Position Overview
          </h2>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-light">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-neutral-900 border-b border-[#D5CFC2] pb-2">
              Key Responsibilities
            </h3>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-light">
              {job.responsibilities}
            </div>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-neutral-900 border-b border-[#D5CFC2] pb-2">
              Qualifications & Competencies
            </h3>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-light">
              {job.requirements}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-neutral-900 border-b border-[#D5CFC2] pb-2">
              Benefits & Compensation
            </h3>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-light">
              {job.benefits}
            </div>
          </div>
        )}

        {/* Application CTA */}
        <div className="p-8 rounded-2xl bg-[#EFECE4] border border-[#D5CFC2] space-y-4">
          <h3 className="text-xl font-serif font-semibold text-neutral-900">
            Apply for this Position
          </h3>
          <p className="text-xs text-neutral-600 font-light leading-relaxed">
            Interested candidates are invited to submit their latest curriculum vitae, portfolio (if applicable), and contact details to our human resources division.
          </p>
          <div>
            {!isExpired ? (
              <a
                href={
                  job.applicationUrl ||
                  `mailto:careers@ringroup.co.id?subject=Application:%20${encodeURIComponent(job.title)}`
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] hover:bg-[#B69B63] text-white hover:text-black font-semibold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </a>
            ) : (
              <button
                disabled
                className="px-6 py-3 rounded-full bg-neutral-300 text-neutral-500 font-semibold text-xs uppercase tracking-wider cursor-not-allowed"
              >
                Applications Closed
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
