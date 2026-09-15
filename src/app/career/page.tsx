import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicCareers } from '@/actions/career';
import { MapPin, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Careers at RIN Group Indonesia | Join Our Culinary Team',
  description:
    'Explore professional restaurant management and culinary career opportunities with PT RIN Group Indonesia.',
};

export default async function CareerPage() {
  const careers = await getPublicCareers();

  const values = [
    {
      title: 'Craft & Precision',
      desc: 'We cultivate an environment where culinary art and technical precision are honored, encouraged, and continuously developed.',
    },
    {
      title: 'Attentive Mentorship',
      desc: 'Our restaurant managers and head chefs guide newer team members through immersive hospitality training and career pathways.',
    },
    {
      title: 'Integrity & Team Well-being',
      desc: 'We prioritize fair operational scheduling, respectful kitchen culture, and competitive performance recognition.',
    },
    {
      title: 'Growth Across Brands',
      desc: 'With multiple dining formats expanding across Indonesia, internal advancement opportunities are actively fostered.',
    },
  ];

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-4">
          <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
            Careers & Culture
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
            Build the Next Dining Experience
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Join a forward-looking hospitality team shaping distinctive restaurant concepts across Indonesia.
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="japanese-eyebrow">Our People</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight leading-tight">
              Driven by Passion.
              <br />
              <span className="italic font-light text-[#9E2F2F]">Empowered by Rigor.</span>
            </h2>
            <div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-light">
              <p>
                A restaurant is only as exceptional as the team that breathes life into its kitchens and dining rooms. At PT RIN Group Indonesia, we invest deeply in empowering our personnel to master Japanese culinary craft, service mindfulness, and restaurant leadership.
              </p>
              <p>
                Whether you aspire to lead floor operations, perfect tableside sukiyaki preparations, or manage kitchen supply chains, RIN Group provides an inspiring ground to grow your hospitality career.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#E4DEC8] relative">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                alt="RIN Group team in restaurant"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-[#ECE7DC] border-y border-[#DCD6C8]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="japanese-eyebrow">The Workplace</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight">
              Why Build Your Career at RIN Group
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 bg-[#F6F3EC] rounded-2xl border border-[#D5CFC2] space-y-3 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B69B63]" />
                  <h4 className="text-base font-serif font-semibold text-neutral-900">{v.title}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-light pl-6">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions List */}
      <section className="py-24 max-w-5xl mx-auto px-6 md:px-10 space-y-10">
        <div className="text-center space-y-2">
          <span className="japanese-eyebrow">Vacancies</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
            Current Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Review verified open positions across restaurant floor operations and leadership.
          </p>
        </div>

        {careers.length === 0 ? (
          <div className="p-12 text-center bg-[#EFECE4] border border-[#D5CFC2] rounded-2xl space-y-3">
            <Briefcase className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-800">No Active Vacancies Right Now</p>
            <p className="text-xs text-neutral-600 max-w-md mx-auto font-light">
              We periodically post new openings for our dining concepts. You may send speculative inquiries to{' '}
              <a href="mailto:careers@ringroup.co.id" className="text-[#9E2F2F] underline font-medium">
                careers@ringroup.co.id
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {careers.map((job) => (
              <Link
                key={job.id}
                href={`/career/${job.slug}`}
                className="group block p-6 sm:p-8 bg-[#EFECE4] hover:bg-white border border-[#D5CFC2] hover:border-[#B69B63] rounded-2xl transition-all duration-300 shadow-xs hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#B69B63] block">
                      {job.department} • {job.employmentType}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-900 group-hover:text-[#9E2F2F] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 font-light line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#DCD6C8]">
                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-[#B69B63]" />
                      <span>{job.location}</span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-[#171717] group-hover:bg-[#B69B63] text-white group-hover:text-black font-semibold text-xs transition-colors flex items-center gap-1">
                      <span>View Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
