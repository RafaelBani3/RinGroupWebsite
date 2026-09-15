import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ContentStatus, NewsStatus } from '@prisma/client';
import { ArrowRight, ArrowUpRight, Utensils, HeartHandshake, Compass, Award, MapPin, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/public/ScrollAnimation';

export default async function HomePage() {
  let brands: any[] = [];
  let articles: any[] = [];

  if (prisma) {
    try {
      const now = new Date();
      [brands, articles] = await Promise.all([
        prisma.brand.findMany({
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { sortOrder: 'asc' },
          take: 6,
          include: { locations: { orderBy: { sortOrder: 'asc' } } },
        }),
        prisma.newsArticle.findMany({
          where: {
            status: NewsStatus.PUBLISHED,
            publishedAt: { lte: now },
          },
          orderBy: { publishedAt: 'desc' },
          take: 3,
          include: { category: true },
        }),
      ]);
    } catch {
      // Fallback
    }
  }

  const pillars = [
    {
      icon: Award,
      num: '01',
      title: 'Culinary Excellence',
      desc: 'Precision in flavor, strict ingredient integrity, and dedication to authentic Japanese culinary craft across every kitchen.',
    },
    {
      icon: HeartHandshake,
      num: '02',
      title: 'Hospitality',
      desc: 'Grounding every guest encounter in mindful anticipation, genuine warmth, and attentive dining parlor service.',
    },
    {
      icon: Compass,
      num: '03',
      title: 'Brand Development',
      desc: 'Creating resonant culinary concepts tailored to Indonesian diners seeking refined, unforgettable gastronomic journeys.',
    },
    {
      icon: Utensils,
      num: '04',
      title: 'Operational Rigor',
      desc: 'Disciplined culinary systems, stringent quality benchmarks, and continuous development of service personnel.',
    },
  ];

  const processSteps = [
    { num: '01', step: 'Concept', desc: 'Identifying unmet culinary desires and envisioning unique dining formats.' },
    { num: '02', step: 'Brand Development', desc: 'Crafting identity, recipes, warishita blends, and aesthetic ambiance.' },
    { num: '03', step: 'Restaurant Operations', desc: 'Establishing kitchen discipline, premium supply lines, and standards.' },
    { num: '04', step: 'Guest Experience', desc: 'Delivering tableside artistry and memorable Japanese hospitality.' },
    { num: '05', step: 'Continuous Growth', desc: 'Refining culinary craft, expanding carefully, and nurturing people.' },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#121212]">
        {/* Background Atmosphere Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&auto=format&fit=crop"
            alt="RIN Group Japanese dining experience"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center text-white py-24">
          <FadeIn direction="down" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B69B63]/40 bg-black/40 backdrop-blur-xs mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B69B63] animate-pulse" />
              <span className="text-[11px] tracking-[0.25em] font-medium text-[#D4AF37] uppercase">
                PT RIN Group Indonesia
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.25} distance={35}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight leading-[1.08] text-white">
              Creating Experiences
              <br />
              <span className="italic font-light text-[#E8DEC7]">Beyond the Table.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} distance={25}>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              RIN Group is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.
            </p>
          </FadeIn>

          <FadeIn delay={0.55} distance={20}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-[0_8px_25px_rgba(182,155,99,0.35)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Discover RIN Group
              </Link>
              <Link
                href="/brands"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-wider uppercase backdrop-blur-xs border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explore Our Brands</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Subtle Bottom Japanese Accent Scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-400 text-[10px] tracking-[0.2em] uppercase font-mono flex flex-col items-center gap-2 opacity-70 animate-bounce">
          <span>Scroll to Explore</span>
          <span className="w-[1px] h-6 bg-[#B69B63]" />
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-24 lg:py-32 bg-[#F6F3EC] text-[#242424]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <FadeIn className="lg:col-span-7 space-y-6" direction="right">
              <span className="japanese-eyebrow">The Company Ethos</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#171717] tracking-tight leading-tight">
                More Than Restaurants.
                <br />
                <span className="italic font-light text-[#9E2F2F]">We Build Culinary Experiences.</span>
              </h2>
              <div className="space-y-4 text-neutral-700 text-sm md:text-base leading-relaxed font-light">
                <p>
                  At PT RIN Group Indonesia, dining is approached as a harmonious discipline of culinary craftsmanship, respectful hospitality, and meticulous restaurant operations.
                </p>
                <p>
                  From simmering artisanal broths for traditional sukiyaki to perfecting the hearth fire for premium yakiniku, our restaurant brands are engineered to immerse guests in authentic culinary heritage elevated by contemporary standards.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#171717] uppercase border-b-2 border-[#B69B63] pb-1 hover:text-[#9E2F2F] transition-colors"
                >
                  <span>Learn About Our Philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </FadeIn>

            {/* Right Editorial Image Frame */}
            <FadeIn className="lg:col-span-5 relative" direction="left" delay={0.2}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#E4DEC8] group">
                <Image
                  src="https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop"
                  alt="Japanese dining hospitality by RIN Group"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#171717] text-white p-6 rounded-xl shadow-xl max-w-xs hidden sm:block border border-[#2B2B2B]">
                <p className="text-xs font-serif italic text-[#B69B63] mb-1">Omotenashi</p>
                <p className="text-[11px] text-neutral-300 leading-snug">
                  Anticipating every guest need with warmth, precision, and heartfelt service.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. BRAND PORTFOLIO SHOWCASE */}
      <section className="py-24 lg:py-32 bg-[#ECE7DC] text-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
          <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCD6C8] pb-8">
            <div>
              <span className="japanese-eyebrow">Our Brands</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight mt-1">
                Different Concepts.
                <br />
                <span className="italic font-light text-neutral-600">One Shared Standard.</span>
              </h2>
            </div>
            <Link
              href="/brands"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#9E2F2F] transition-colors"
            >
              <span>View Entire Portfolio</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </FadeIn>

          {/* Dynamic Brands Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brands.map((b) => (
              <StaggerItem key={b.id}>
                <div className="group relative bg-[#F6F3EC] rounded-2xl overflow-hidden border border-[#D5CFC2] hover:border-[#B69B63] transition-all duration-500 shadow-sm hover:shadow-[0_16px_40px_rgba(182,155,99,0.18)] hover:-translate-y-1.5 flex flex-col h-full">
                  {/* Cover Image */}
                  <Link href={`/brands/${b.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-800">
                    <Image
                      src={
                        b.coverImage ||
                        'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={b.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-[#B69B63] block">
                          {b.category || 'Dining Concept'}
                        </span>
                        <h3 className="text-2xl font-serif font-medium">{b.name}</h3>
                      </div>
                      <span className="p-2 rounded-full bg-white/20 backdrop-blur-xs text-white group-hover:bg-[#B69B63] group-hover:text-black transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2">
                        {b.shortDescription || b.tagline}
                      </p>
                    </div>

                    {/* Outlets with Google Maps Button */}
                    {b.locations && b.locations.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#E5E0D5]">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                          Cabang Outlet & Peta
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {b.locations.map((loc: any) => {
                            const mapsUrl =
                              loc.mapUrl ||
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${b.name} ${loc.name} ${loc.address}`
                              )}`;
                            return (
                              <a
                                key={loc.id}
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Petunjuk arah ke ${loc.name} di Google Maps`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFECE4] hover:bg-[#B69B63] text-neutral-800 hover:text-black text-[11px] font-medium transition-all duration-200 border border-[#D5CFC2] hover:border-[#B69B63] active:scale-95"
                              >
                                <MapPin className="w-3 h-3 text-[#9E2F2F]" />
                                <span>{loc.name.replace(`${b.name} — `, '')}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-neutral-500">
                      <span className="italic font-serif text-[#9E2F2F]">{b.tagline}</span>
                      <Link
                        href={`/brands/${b.slug}`}
                        className="font-semibold text-neutral-800 group-hover:text-[#9E2F2F] transition-colors flex items-center gap-1"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. PHILOSOPHY — 4 PILLARS */}
      <section className="py-24 lg:py-32 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
          <FadeIn className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
              Built Around Food.
              <br />
              <span className="italic font-light text-[#D5CFC2]">Driven by People.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Our hospitality ethos is guided by four enduring pillars that establish consistent quality, warmth, and operational excellence across all brands.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <StaggerItem key={p.num}>
                  <div className="bg-[#1F1F1F] border border-[#2B2B2B] hover:border-[#B69B63]/70 hover:shadow-[0_8px_30px_rgba(182,155,99,0.15)] hover:-translate-y-1.5 p-8 rounded-2xl transition-all duration-300 space-y-4 group h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#B69B63] font-bold">{p.num}</span>
                      <Icon className="w-5 h-5 text-neutral-500 group-hover:text-[#B69B63] transition-colors" />
                    </div>
                    <h3 className="text-lg font-serif text-white">{p.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">{p.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. PROCESS TIMELINE */}
      <section className="py-24 lg:py-32 bg-[#F6F3EC] text-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
          <FadeIn className="max-w-2xl space-y-3">
            <span className="japanese-eyebrow">Methodology</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
              From Concept to Experience.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Developing a successful dining venture requires harmonious alignment between creative culinary design, continuous operational training, and rigorous standard maintenance.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t border-[#D5CFC2] pt-8">
            {processSteps.map((step) => (
              <StaggerItem key={step.num}>
                <div className="space-y-3 p-4 rounded-xl hover:bg-[#EFECE4] transition-colors duration-200">
                  <span className="text-2xl font-serif text-[#9E2F2F] font-bold block">{step.num}</span>
                  <h3 className="text-base font-semibold text-neutral-900">{step.step}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. LATEST NEWS & INSIGHTS TEASER */}
      {articles.length > 0 && (
        <section className="py-24 bg-[#EFECE4] text-[#171717] border-t border-[#E5E0D5]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
            <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5CFC2] pb-6">
              <div>
                <span className="japanese-eyebrow">Newsroom</span>
                <h2 className="text-3xl sm:text-4xl font-serif tracking-tight mt-1">
                  Stories & Perspectives.
                </h2>
              </div>
              <Link
                href="/news"
                className="group text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#9E2F2F] transition-colors flex items-center gap-1"
              >
                <span>Read All Articles</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <StaggerItem key={art.id}>
                  <Link
                    href={`/news/${art.slug}`}
                    className="group bg-[#F6F3EC] border border-[#D5CFC2] hover:border-[#B69B63] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_12px_32px_rgba(182,155,99,0.15)] hover:-translate-y-1 h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-800">
                      <Image
                        src={
                          art.coverImage ||
                          'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop'
                        }
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                          <span>{art.category?.name || 'General'}</span>
                          <span>{formatDate(art.publishedAt)}</span>
                        </div>
                        <h3 className="text-base font-serif font-semibold text-neutral-900 group-hover:text-[#9E2F2F] transition-colors line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-light">
                          {art.excerpt}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-[#B69B63] pt-2 flex items-center gap-1">
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* 7. CAREER & CORPORATE CONTACT CTA */}
      <section className="py-24 bg-[#141414] text-white border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-[#1C1C1C] to-[#121212] border border-[#2B2B2B] hover:border-[#B69B63]/50 transition-colors duration-500 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase block">
                  Career Opportunities
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                  Build the Next Dining
                  <br />
                  Experience With Us.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                  We are continually seeking passionate culinary talents, restaurant leaders, and service visionaries to expand our brands across Indonesia.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/career"
                    className="px-7 py-3 rounded-full bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                  >
                    Explore Openings
                  </Link>
                  <Link
                    href="/contact"
                    className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all duration-300 border border-white/20 hover:-translate-y-0.5 active:scale-95"
                  >
                    Contact Company
                  </Link>
                </div>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#333] group">
                <Image
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                  alt="RIN Group culinary team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
