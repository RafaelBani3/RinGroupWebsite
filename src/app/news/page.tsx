import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicArticles, getNewsCategories } from '@/actions/news';
import { formatDate } from '@/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'News & Insights | PT RIN Group Indonesia',
  description:
    'Read official corporate announcements, culinary craft stories, and hospitality perspectives from PT RIN Group Indonesia.',
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [articles, categories] = await Promise.all([
    getPublicArticles(category),
    getNewsCategories(),
  ]);

  return (
    <div className="bg-[#F6F3EC] text-[#242424] pt-24 min-h-screen">
      {/* Header Banner */}
      <section className="py-20 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-4">
          <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase">
            Newsroom & Stories
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
            News & Insights
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Perspectives on culinary craft, guest hospitality, brand milestones, and restaurant operations.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D5CFC2] pb-4">
          <Link
            href="/news"
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              !category
                ? 'bg-[#171717] text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#EFECE4]'
            }`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/news?category=${c.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                category === c.slug
                  ? 'bg-[#171717] text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#EFECE4]'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p>No articles found under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group bg-[#EFECE4] border border-[#D5CFC2] hover:border-[#B69B63] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <Image
                    src={
                      art.coverImage ||
                      'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop'
                    }
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono uppercase tracking-wider">
                    {art.category?.name || 'General'}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                      <span>{formatDate(art.publishedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B69B63]" />
                        <span>{art.readTimeMinutes} min read</span>
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-semibold text-neutral-900 group-hover:text-[#9E2F2F] transition-colors line-clamp-2">
                      {art.title}
                    </h2>
                    <p className="text-xs text-neutral-600 font-light line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DCD6C8] flex items-center justify-between text-xs text-[#B69B63] font-semibold">
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
