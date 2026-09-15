import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import { MapPin, Clock, Phone, ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/events';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/public/ScrollAnimation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!prisma) return { title: 'Brand' };

  const brand = await prisma.brand.findUnique({
    where: { slug },
  });

  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: brand.seoTitle || `${brand.name} | PT RIN Group Indonesia`,
    description: brand.seoDescription || brand.shortDescription || brand.tagline || '',
    openGraph: {
      title: brand.seoTitle || brand.name,
      description: brand.seoDescription || brand.shortDescription || '',
      images: brand.ogImage || brand.coverImage ? [{ url: brand.ogImage || brand.coverImage! }] : [],
    },
  };
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!prisma) notFound();

  const brand = await prisma.brand.findUnique({
    where: { slug, status: ContentStatus.PUBLISHED },
    include: {
      locations: { orderBy: { sortOrder: 'asc' } },
      socials: true,
    },
  });

  if (!brand) {
    notFound();
  }

  // Internal non-blocking analytics
  trackEvent({ eventName: 'brand_view', path: `/brands/${slug}` });

  // Related brands
  const relatedBrands = await prisma.brand.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      slug: { not: slug },
    },
    take: 2,
    orderBy: { sortOrder: 'asc' },
  });

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: brand.name,
    description: brand.shortDescription || brand.tagline,
    servesCuisine: brand.category || 'Japanese',
    image: brand.coverImage,
    url: `https://ringroup.co.id/brands/${brand.slug}`,
  };

  return (
    <div className="bg-[#F6F3EC] text-[#242424] min-h-screen">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO COVER */}
      <section className="relative min-h-[70vh] flex items-end pb-16 pt-32 overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              brand.coverImage ||
              'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=2000&auto=format&fit=crop'
            }
            alt={brand.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full space-y-4">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Brands</span>
          </Link>

          <span className="text-[10px] tracking-[0.25em] font-mono text-[#B69B63] uppercase block">
            {brand.category || 'Japanese Dining'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif tracking-tight leading-tight">
            {brand.name}
          </h1>
          {brand.tagline && (
            <p className="text-sm sm:text-base text-neutral-300 font-serif italic max-w-2xl">
              {brand.tagline}
            </p>
          )}
        </div>
      </section>

      {/* 2. BRAND CONCEPT & STORY */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Narrative */}
          <div className="lg:col-span-8 space-y-8">
            {brand.concept && (
              <div className="space-y-3">
                <span className="japanese-eyebrow">The Concept</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight">
                  Dining Experience & Ethos
                </h2>
                <p className="text-xs sm:text-base text-neutral-700 leading-relaxed font-light whitespace-pre-line">
                  {brand.concept}
                </p>
              </div>
            )}

            {brand.story && (
              <div className="space-y-3 pt-4 border-t border-[#DCD6C8]">
                <span className="japanese-eyebrow">Craft & Heritage</span>
                <h3 className="text-xl sm:text-2xl font-serif text-neutral-900 tracking-tight">
                  The Story Behind the Flavor
                </h3>
                <p className="text-xs sm:text-base text-neutral-700 leading-relaxed font-light whitespace-pre-line">
                  {brand.story}
                </p>
              </div>
            )}

            {brand.description && !brand.concept && (
              <div className="space-y-3">
                <p className="text-xs sm:text-base text-neutral-700 leading-relaxed font-light whitespace-pre-line">
                  {brand.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#EFECE4] border border-[#D5CFC2] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
                Brand Identity
              </h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p>
                  <strong className="text-neutral-900 font-medium">Concept: </strong>
                  {brand.category || 'Japanese Dining'}
                </p>
                <p>
                  <strong className="text-neutral-900 font-medium">Outlets: </strong>
                  {brand.locations.length} Locations
                </p>
                <p>
                  <strong className="text-neutral-900 font-medium">Management: </strong>
                  PT RIN Group Indonesia
                </p>
              </div>

              {brand.socials.length > 0 && (
                <div className="pt-4 border-t border-[#DCD6C8] space-y-2">
                  <span className="text-[10px] uppercase font-semibold text-neutral-700 tracking-wider block">
                    Official Social Channels
                  </span>
                  {brand.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#9E2F2F] hover:text-[#B69B63] transition-colors mr-3"
                    >
                      <span>{s.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. GALLERY (Rendered only if images exist) */}
      {brand.gallery && brand.gallery.length > 0 && (
        <section className="py-16 bg-[#ECE7DC] border-y border-[#DCD6C8]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-8">
            <div>
              <span className="japanese-eyebrow">Visual Impressions</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight mt-1">
                Atmosphere & Culinary Craft
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brand.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#D5CFC2] bg-neutral-900"
                >
                  <Image
                    src={imgUrl}
                    alt={`${brand.name} gallery image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. LOCATIONS & HOURS */}
      {brand.locations && brand.locations.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-10 space-y-10">
          <FadeIn>
            <span className="japanese-eyebrow">Locations & Reservations</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight mt-1">
              Visit {brand.name}
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brand.locations.map((loc) => {
              const mapsUrl =
                loc.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${brand.name} ${loc.name} ${loc.address}`
                )}`;

              return (
                <StaggerItem key={loc.id}>
                  <div className="p-8 rounded-2xl bg-[#EFECE4] border border-[#D5CFC2] hover:border-[#B69B63] hover:shadow-[0_8px_30px_rgba(182,155,99,0.12)] transition-all duration-300 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-neutral-900">
                        <MapPin className="w-5 h-5 text-[#B69B63]" />
                        <h3 className="text-lg font-serif font-semibold">{loc.name}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                        {loc.address}
                        {loc.city ? `, ${loc.city}` : ''}
                      </p>

                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-500">
                        {loc.hours && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#B69B63]" />
                            <span>{loc.hours}</span>
                          </div>
                        )}
                        {loc.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#B69B63]" />
                            <span>{loc.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#DCD6C8]">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#B69B63] text-white hover:text-black font-semibold text-xs transition-all duration-300 shadow-xs hover:shadow-md active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#B69B63] group-hover:text-black" />
                        <span>Buka di Google Maps</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      )}

      {/* 5. RELATED BRANDS */}
      {relatedBrands.length > 0 && (
        <section className="py-20 bg-[#171717] text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-10">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-serif tracking-tight">
                Other Dining Concepts by RIN Group
              </h2>
              <Link
                href="/brands"
                className="text-xs text-[#B69B63] hover:text-[#C4AA74] transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedBrands.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/brands/${rel.slug}`}
                  className="group bg-[#222] border border-[#2B2B2B] hover:border-[#B69B63] rounded-xl overflow-hidden p-6 flex items-center justify-between transition-all"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#B69B63] uppercase">
                      {rel.category}
                    </span>
                    <h3 className="text-xl font-serif text-white group-hover:text-[#B69B63] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{rel.tagline}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-[#B69B63] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
