import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { NewsStatus } from '@prisma/client';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics/events';
import sanitizeHtml from 'sanitize-html';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!prisma) return { title: 'News' };

  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seoTitle || `${article.title} | RIN Group Insights`,
    description: article.seoDescription || article.excerpt || '',
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || '',
      images: article.ogImage || article.coverImage ? [{ url: article.ogImage || article.coverImage! }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!prisma) notFound();

  const now = new Date();

  const article = await prisma.newsArticle.findFirst({
    where: {
      slug,
      status: NewsStatus.PUBLISHED,
      publishedAt: { lte: now },
    },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  if (!article) {
    notFound();
  }

  trackEvent({ eventName: 'news_view', path: `/news/${slug}` });

  const related = await prisma.newsArticle.findMany({
    where: {
      status: NewsStatus.PUBLISHED,
      publishedAt: { lte: now },
      slug: { not: slug },
    },
    take: 2,
    orderBy: { publishedAt: 'desc' },
  });

  const cleanContent = sanitizeHtml(article.content, {
    allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt?.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'PT RIN Group Indonesia',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PT RIN Group Indonesia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ringroup.co.id/logo.png',
      },
    },
  };

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-[#B69B63] font-mono uppercase tracking-wider">
            <span>{article.category?.name || 'News'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="pt-2 text-xs text-neutral-400 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B69B63]" />
              <span>{formatDate(article.publishedAt)}</span>
            </span>
            {article.author?.name && (
              <span>Published by {article.author.name}</span>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-[#D5CFC2] bg-neutral-900 relative">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content Body */}
      <article className="py-16 max-w-3xl mx-auto px-6">
        {article.excerpt && (
          <p className="text-base sm:text-lg font-serif italic text-neutral-800 pb-8 border-b border-[#D5CFC2] mb-8 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed space-y-4 font-light [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:text-neutral-900 [&_h2]:pt-6 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:text-neutral-900 [&_blockquote]:border-l-2 [&_blockquote]:border-[#B69B63] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </article>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="py-16 bg-[#ECE7DC] border-t border-[#DCD6C8]">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <h3 className="text-2xl font-serif text-neutral-900">
              Related Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="p-6 rounded-xl bg-[#F6F3EC] border border-[#D5CFC2] hover:border-[#B69B63] space-y-2 block transition-all"
                >
                  <span className="text-[10px] uppercase font-mono text-[#B69B63]">
                    {formatDate(rel.publishedAt)}
                  </span>
                  <h4 className="text-base font-serif font-semibold text-neutral-900 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
