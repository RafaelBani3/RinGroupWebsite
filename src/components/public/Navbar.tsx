'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  companyName?: string;
}

export function Navbar({ companyName = 'RIN GROUP' }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Skip rendering public navbar if on admin or login routes
  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboardRoute) return null;

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Our Brands', href: '/brands' },
    { label: 'Career', href: '/career' },
    { label: 'News & Insights', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F6F3EC]/92 backdrop-blur-md shadow-xs border-b border-[#E5E0D5]/70 py-3.5 text-[#171717]'
          : isHome
          ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white'
          : 'bg-[#F6F3EC] border-b border-[#E5E0D5] py-4 text-[#171717]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <Link href="/" className="group flex items-center gap-3">
          <div>
            <span
              className={`text-[10px] tracking-[0.28em] font-bold uppercase block transition-colors ${
                scrolled || !isHome ? 'text-[#B69B63]' : 'text-[#D4AF37]'
              }`}
            >
              Indonesia
            </span>
            <span
              className={`text-lg font-serif tracking-[0.18em] font-semibold transition-colors ${
                scrolled || !isHome ? 'text-[#171717]' : 'text-white'
              }`}
            >
              {companyName}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-all duration-300 ${
                  isActive
                    ? 'text-[#B69B63] font-semibold'
                    : scrolled || !isHome
                    ? 'text-[#4A4A4A] hover:text-[#171717]'
                    : 'text-neutral-200 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B69B63]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/brands"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 ${
              scrolled || !isHome
                ? 'bg-[#171717] hover:bg-[#2A2A2A] text-white shadow-xs'
                : 'bg-white/15 hover:bg-white text-white hover:text-black backdrop-blur-xs border border-white/25'
            }`}
          >
            <span>Explore Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled || !isHome ? 'text-[#171717]' : 'text-white'
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[#171717] text-white z-50 flex flex-col justify-between p-8 animate-in fade-in duration-300">
          <nav className="space-y-6 pt-6">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#B69B63] uppercase block">
              Navigation
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-xl font-serif tracking-wide text-neutral-200 hover:text-[#B69B63] transition-colors py-2 border-b border-neutral-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <Link
              href="/brands"
              className="w-full py-3 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-center rounded-lg block text-xs tracking-wider uppercase transition-colors"
            >
              Explore Brand Portfolio
            </Link>
            <p className="text-[11px] text-neutral-500 text-center">
              PT RIN Group Indonesia • Food & Beverage Management
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
