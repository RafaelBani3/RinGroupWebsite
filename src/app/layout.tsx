import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { GoogleAnalytics } from '@/components/public/GoogleAnalytics';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ringroup.co.id'),
  title: {
    default: 'RIN Group Indonesia | Food & Beverage Company',
    template: '%s | RIN Group Indonesia',
  },
  description:
    'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
  openGraph: {
    title: 'RIN Group Indonesia | Food & Beverage Company',
    description:
      'Developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
    type: 'website',
    locale: 'en_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIN Group Indonesia | Food & Beverage Company',
    description:
      'Developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  let settings = null;
  let brands: { name: string; slug: string }[] = [];

  if (prisma) {
    try {
      [profile, settings, brands] = await Promise.all([
        prisma.companyProfile.findUnique({ where: { isSingleton: true } }),
        prisma.siteSetting.findUnique({ where: { isSingleton: true } }),
        prisma.brand.findMany({
          where: { status: ContentStatus.PUBLISHED },
          select: { name: true, slug: true },
          orderBy: { sortOrder: 'asc' },
        }),
      ]);
    } catch {
      // Graceful fallback if database credentials not yet loaded
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ringroup.co.id';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: profile?.name || 'PT RIN Group Indonesia',
        alternateName: profile?.shortName || 'RIN Group',
        url: siteUrl,
        description:
          profile?.description ||
          'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
        ...(profile?.email
          ? {
              contactPoint: {
                '@type': 'ContactPoint',
                email: profile.email,
                contactType: 'corporate inquiries',
              },
            }
          : {}),
        sameAs: [profile?.instagram, profile?.linkedin, profile?.tiktok].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: profile?.name || 'PT RIN Group Indonesia',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#242424]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <GoogleAnalytics gaId={settings?.gaId} />
        <Navbar companyName={profile?.shortName || 'RIN GROUP'} />
        <div className="flex-1">{children}</div>
        <Footer profile={profile} brands={brands} />
      </body>
    </html>
  );
}
