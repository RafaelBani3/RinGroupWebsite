'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  profile?: any;
  brands?: { name: string; slug: string }[];
}

export function Footer({ profile, brands = [] }: FooterProps) {
  const pathname = usePathname();

  // Omit footer on admin/login pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] text-neutral-300 border-t border-[#262626] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-neutral-800">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase block">
              PT RIN GROUP INDONESIA
            </span>
            <h2 className="text-2xl font-serif text-white tracking-tight leading-snug">
              Creating Experiences
              <br />
              Beyond the Table.
            </h2>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              {profile?.description ||
                'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.'}
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B69B63] hover:text-[#C4AA74] transition-colors group"
              >
                <span>Corporate Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Brands Directory */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-200">
              Brand Portfolio
            </p>
            <ul className="space-y-2 text-xs text-neutral-400">
              {brands.length > 0 ? (
                brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/brands/${b.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/brands" className="hover:text-white transition-colors">Sukiyaki RIN</Link></li>
                  <li><Link href="/brands" className="hover:text-white transition-colors">Yakiniku TEN</Link></li>
                  <li><Link href="/brands" className="hover:text-white transition-colors">Ryu Jin</Link></li>
                  <li><Link href="/brands" className="hover:text-white transition-colors">Sumomatsu</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-200">
              Company
            </p>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About RIN Group</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">Our Dining Concepts</Link></li>
              <li><Link href="/career" className="hover:text-white transition-colors">Careers & Culture</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News & Insights</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Corporate Contact</Link></li>
            </ul>
          </div>

          {/* Corporate Office & Legal */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-200">
              Headquarters
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {profile?.address || 'Corporate Office: Alam Sutera, Tangerang, Banten, Indonesia'}
            </p>
            <div className="space-y-1 text-xs text-neutral-400 pt-1">
              <p>Email: {profile?.email || 'corporate@ringroup.co.id'}</p>
              {profile?.phone && <p>Phone: {profile.phone}</p>}
            </div>
            {profile?.instagram && (
              <div className="pt-2">
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#B69B63] hover:underline"
                >
                  Follow on Instagram
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="text-neutral-400">© {currentYear} RafaelBani. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#B69B63]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B69B63] inline-block" />
              <span>Crafted & Engineered by</span>
              <strong className="text-white font-medium">RafaelBani</strong>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/login" className="hover:text-neutral-400 transition-colors opacity-60">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
