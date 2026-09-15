'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { Role } from '@prisma/client';

const seoSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  title: z.string().min(2, 'Meta title is required'),
  description: z.string().min(5, 'Meta description is required'),
  canonical: z.string().optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  robots: z.string().default('index, follow'),
});

export async function getSeoMetadata(path: string) {
  if (!prisma) return null;
  return prisma.seoMetadata.findUnique({
    where: { path },
  });
}

export async function getAllSeoMetadataAdmin() {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!prisma) return [];

  return prisma.seoMetadata.findMany({
    orderBy: { path: 'asc' },
  });
}

export async function upsertSeoMetadata(data: z.infer<typeof seoSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = seoSchema.parse(data);

  const seo = await prisma.seoMetadata.upsert({
    where: { path: parsed.path },
    update: parsed,
    create: parsed,
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'SeoMetadata',
    entityId: seo.id,
    metadata: { path: seo.path, title: seo.title },
  });

  revalidatePath(parsed.path);
  revalidatePath('/admin/seo');

  return { success: true, seo };
}
