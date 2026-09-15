import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getNewsCategories } from '@/actions/news';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsForm } from '@/components/admin/NewsForm';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!prisma) notFound();

  const [article, categories] = await Promise.all([
    prisma.newsArticle.findUnique({ where: { id } }),
    getNewsCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Article: ${article.title}`}
        description="Update article content, category, schedule, and SEO meta tags."
      />
      <NewsForm initialData={article} categories={categories} />
    </div>
  );
}
