import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/public/ScrollAnimation';

export const metadata = {
  title: 'About PT RIN Group Indonesia | Culinary Excellence & Hospitality',
  description:
    'Discover PT RIN Group Indonesia, our hospitality philosophy, culinary benchmarks, and restaurant management vision.',
};

export default async function AboutPage() {
  const profile = prisma
    ? await prisma.companyProfile.findUnique({ where: { isSingleton: true } })
    : null;

  const standards = [
    {
      title: 'Ingredient Sourcing & Provenance',
      desc: 'Partnering with certified producers to supply prized beef selections, artisanal warishita broth ingredients, and fresh seasonal elements.',
    },
    {
      title: 'Authentic Japanese Technique',
      desc: 'Honoring time-tested preparations from Kansai and Kanto culinary roots, from precise knife-work to charcoal hearth temperature mastery.',
    },
    {
      title: 'The Art of Omotenashi',
      desc: 'Instilling attentive, unhurried hospitality where service staff anticipates guest desires before they are spoken.',
    },
    {
      title: 'Sustainable Operational Rigor',
      desc: 'Developing standardized kitchen routines, hygiene protocols, and continuous mentorship pipelines for restaurant leaders.',
    },
  ];

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24">
      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-4">
          <FadeIn direction="down" delay={0.1}>
            <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
              Corporate Philosophy
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
              About PT RIN Group Indonesia
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              {profile?.description ||
                'A Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Narrative & Philosophy */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <FadeIn className="lg:col-span-6 space-y-6" direction="right">
            <span className="japanese-eyebrow">Culinary & Hospitality Ethos</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight leading-tight">
              More Than Restaurants.
              <br />
              <span className="italic font-light text-[#9E2F2F]">We Build Dining Encounters.</span>
            </h2>
            <div className="space-y-4 text-neutral-700 text-sm md:text-base leading-relaxed font-light">
              <p>
                {profile?.about ||
                  'PT RIN Group Indonesia operates with a commitment to culinary precision, authentic Japanese hospitality, and strategic operational management. Across every concept, our team delivers memorable dining encounters grounded in quality ingredients and guest-first experiences.'}
              </p>
              <p>
                Whether welcoming guests into the serene, private dining rooms of Sukiyaki RIN or the lively evening atmosphere of Yakiniku TEN, our dining spaces are engineered with mindful purpose. Every table arrangement, light ambiance, and tableside interaction is crafted to evoke calm, authentic enjoyment.
              </p>
            </div>
          </FadeIn>

          <FadeIn className="lg:col-span-6 relative" direction="left" delay={0.2}>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#E4DEC8] relative group">
              <Image
                src="https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop"
                alt="Culinary craft by RIN Group"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[#ECE7DC] border-y border-[#DCD6C8]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Vision */}
            <StaggerItem>
              <div className="bg-[#F6F3EC] hover:border-[#B69B63] p-8 sm:p-10 rounded-2xl border border-[#D5CFC2] space-y-4 shadow-xs hover:shadow-[0_12px_32px_rgba(182,155,99,0.15)] hover:-translate-y-1 transition-all duration-300 h-full">
                <span className="text-xs font-mono text-[#B69B63] font-bold uppercase tracking-wider block">
                  Our Vision
                </span>
                <h3 className="text-2xl font-serif text-neutral-900">
                  Shaping Indonesia’s Dining Landscape
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                  {profile?.vision ||
                    'To be the leading hospitality and restaurant group recognized for shaping Indonesia’s dining landscape through authentic, high-standard culinary experiences.'}
                </p>
              </div>
            </StaggerItem>

            {/* Mission */}
            <StaggerItem>
              <div className="bg-[#F6F3EC] hover:border-[#9E2F2F] p-8 sm:p-10 rounded-2xl border border-[#D5CFC2] space-y-4 shadow-xs hover:shadow-[0_12px_32px_rgba(158,47,47,0.15)] hover:-translate-y-1 transition-all duration-300 h-full">
                <span className="text-xs font-mono text-[#9E2F2F] font-bold uppercase tracking-wider block">
                  Our Mission
                </span>
                <h3 className="text-2xl font-serif text-neutral-900">
                  Craft, Hospitality & Growth
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                  {profile?.mission ||
                    '1. Cultivate culinary excellence across all dining concepts.\n2. Practice genuine, attentive hospitality at every guest touchpoint.\n3. Build sustainable, high-performing restaurant operations.\n4. Empower our team members to grow into culinary and service leaders.'}
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Operational Standards */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        <FadeIn className="text-center max-w-2xl mx-auto space-y-3">
          <span className="japanese-eyebrow">Our Benchmarks</span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-neutral-900">
            Uncompromising Standards
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            How we maintain discipline and culinary consistency throughout every restaurant in our portfolio.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {standards.map((std, idx) => (
            <StaggerItem key={idx}>
              <div
                className="p-8 rounded-2xl bg-[#EFECE4] border border-[#D5CFC2] hover:border-[#B69B63] hover:shadow-[0_8px_30px_rgba(182,155,99,0.12)] hover:-translate-y-1 transition-all duration-300 space-y-3 h-full"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B69B63]" />
                  <h3 className="text-lg font-serif font-semibold text-neutral-900">{std.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light pl-8">
                  {std.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#171717] text-white text-center">
        <FadeIn className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif tracking-tight">
            Discover Our Dining Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Explore our curated culinary concepts, signature menus, and restaurant locations.
          </p>
          <div>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_8px_25px_rgba(182,155,99,0.35)] hover:-translate-y-0.5 active:scale-95"
            >
              <span>View Restaurant Brands</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
