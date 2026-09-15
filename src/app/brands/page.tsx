import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import { ArrowUpRight, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/public/ScrollAnimation';

export const metadata = {
  title: 'Our Restaurant Brands | PT RIN Group Indonesia',
  description:
    'Explore the distinctive dining portfolio managed by PT RIN Group Indonesia, including Sukiyaki RIN, Yakiniku TEN, Ryu Jin, and Sumomatsu.',
};

export default async function BrandsPage() {
  const brands = prisma
    ? await prisma.brand.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { sortOrder: 'asc' },
        include: { locations: { orderBy: { sortOrder: 'asc' } } },
      })
    : [];

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-4">
          <FadeIn direction="down" delay={0.1}>
            <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
              Culinary Portfolio
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
              Our Restaurant Brands
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              Different dining formats united by an uncompromising standard of ingredient integrity, authentic craftsmanship, and attentive Japanese hospitality.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        {brands.length === 0 ? (
          <div className="py-16 text-center text-neutral-500">
            <p>No published restaurant concepts available at this moment.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {brands.map((brand) => (
              <StaggerItem key={brand.id}>
                <div className="group bg-[#EFECE4] border border-[#D5CFC2] hover:border-[#B69B63] rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-[0_16px_40px_rgba(182,155,99,0.18)] hover:-translate-y-1.5 flex flex-col h-full">
                  {/* Visual Cover */}
                  <Link href={`/brands/${brand.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-900">
                    <Image
                      src={
                        brand.coverImage ||
                        'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={brand.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-[#B69B63] block">
                          {brand.category || 'Culinary Concept'}
                        </span>
                        <h2 className="text-3xl font-serif font-medium tracking-tight">
                          {brand.name}
                        </h2>
                      </div>
                      <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-xs text-white group-hover:bg-[#B69B63] group-hover:text-black transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <p className="text-xs font-serif italic text-[#9E2F2F] tracking-wide">
                        {brand.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                        {brand.shortDescription || brand.description}
                      </p>
                    </div>

                    {/* Outlets & Google Maps Links */}
                    {brand.locations && brand.locations.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-[#DCD6C8]">
                        <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                          Lokasi & Cabang ({brand.locations.length} Outlet)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {brand.locations.map((loc) => {
                            const mapsUrl =
                              loc.mapUrl ||
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${brand.name} ${loc.name} ${loc.address}`
                              )}`;
                            return (
                              <a
                                key={loc.id}
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Buka ${loc.name} di Google Maps`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5E0D4] hover:bg-[#B69B63] text-neutral-800 hover:text-black text-[11px] font-medium transition-all duration-200 border border-[#D5CFC2] hover:border-[#B69B63] hover:shadow-xs active:scale-95"
                              >
                                <MapPin className="w-3 h-3 text-[#9E2F2F]" />
                                <span>{loc.name.replace(`${brand.name} — `, '')}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#DCD6C8] flex items-center justify-between text-xs">
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 group-hover:text-[#9E2F2F] transition-colors"
                      >
                        <span>Lihat Konsep & Menu Lengkap</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}
