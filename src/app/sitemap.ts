import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { ContentStatus, NewsStatus, CareerStatus } from '@prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ringroup.co.id';
  const now = new Date();

  // 1. Static public corporate routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/career`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  if (!prisma) {
    return staticRoutes;
  }

  try {
    const [brands, news, careers] = await Promise.all([
      // Published Brands only
      prisma.brand.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      // Published News articles only (must have publishedAt <= now)
      prisma.newsArticle.findMany({
        where: {
          status: NewsStatus.PUBLISHED,
          publishedAt: { lte: now },
        },
        select: { slug: true, updatedAt: true },
      }),
      // Published Careers only
      prisma.career.findMany({
        where: {
          status: CareerStatus.PUBLISHED,
          OR: [{ closingDate: null }, { closingDate: { gte: now } }],
        },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
      url: `${baseUrl}/news/${n.slug}`,
      lastModified: n.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    const careerRoutes: MetadataRoute.Sitemap = careers.map((c) => ({
      url: `${baseUrl}/career/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...brandRoutes, ...newsRoutes, ...careerRoutes];
  } catch {
    return staticRoutes;
  }
}
