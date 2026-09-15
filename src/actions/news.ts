'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { NewsStatus, Role } from '@prisma/client';

const articleSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  coverImage: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  status: z.nativeEnum(NewsStatus).default(NewsStatus.DRAFT),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  readTimeMinutes: z.number().int().default(3),
});

export async function getPublicArticles(categorySlug?: string) {
  if (!prisma) return [];

  const now = new Date();

  return prisma.newsArticle.findMany({
    where: {
      status: NewsStatus.PUBLISHED,
      publishedAt: {
        lte: now,
      },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });
}

export async function getPublicArticleBySlug(slug: string) {
  if (!prisma) return null;

  const now = new Date();

  return prisma.newsArticle.findFirst({
    where: {
      slug,
      status: NewsStatus.PUBLISHED,
      publishedAt: {
        lte: now,
      },
    },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });
}

export async function getAllArticlesAdmin() {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!prisma) return [];

  return prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });
}

export async function getNewsCategories() {
  if (!prisma) return [];
  return prisma.newsCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: NewsStatus.PUBLISHED,
              publishedAt: { lte: new Date() },
            },
          },
        },
      },
    },
  });
}

export async function createArticle(data: z.infer<typeof articleSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  const parsed = articleSchema.parse(data);

  let effectivePublishedAt = parsed.publishedAt ? new Date(parsed.publishedAt) : null;
  if (parsed.status === NewsStatus.PUBLISHED && !effectivePublishedAt) {
    effectivePublishedAt = new Date();
  }

  const article = await prisma.newsArticle.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      categoryId: parsed.categoryId || null,
      authorId: session.userId,
      status: parsed.status,
      publishedAt: effectivePublishedAt,
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      ogImage: parsed.ogImage || null,
      readTimeMinutes: parsed.readTimeMinutes,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: parsed.status === NewsStatus.PUBLISHED ? 'PUBLISH' : 'CREATE',
    entity: 'NewsArticle',
    entityId: article.id,
    metadata: { title: article.title, status: article.status },
  });

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath(`/news/${article.slug}`);
  revalidatePath('/admin/news');

  return { success: true, article };
}

export async function updateArticle(id: string, data: z.infer<typeof articleSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  const parsed = articleSchema.parse(data);

  let effectivePublishedAt = parsed.publishedAt ? new Date(parsed.publishedAt) : null;
  if (parsed.status === NewsStatus.PUBLISHED && !effectivePublishedAt) {
    effectivePublishedAt = new Date();
  }

  const updated = await prisma.newsArticle.update({
    where: { id },
    data: {
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      categoryId: parsed.categoryId || null,
      status: parsed.status,
      publishedAt: effectivePublishedAt,
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      ogImage: parsed.ogImage || null,
      readTimeMinutes: parsed.readTimeMinutes,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: parsed.status === NewsStatus.PUBLISHED ? 'PUBLISH' : 'UPDATE',
    entity: 'NewsArticle',
    entityId: updated.id,
    metadata: { title: updated.title, status: updated.status },
  });

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath(`/news/${updated.slug}`);
  revalidatePath('/admin/news');

  return { success: true, article: updated };
}

export async function deleteArticle(id: string) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const article = await prisma.newsArticle.delete({
    where: { id },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'DELETE',
    entity: 'NewsArticle',
    entityId: id,
    metadata: { title: article.title, slug: article.slug },
  });

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath(`/news/${article.slug}`);
  revalidatePath('/admin/news');

  return { success: true };
}
