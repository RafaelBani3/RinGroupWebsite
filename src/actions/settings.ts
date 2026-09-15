'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { Role } from '@prisma/client';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteUrl: z.string().url('Must be a valid URL'),
  defaultSeoTitle: z.string().min(1, 'Default SEO Title is required'),
  defaultMetaDesc: z.string().min(1, 'Default Meta Description is required'),
  defaultOgImage: z.string().optional().nullable(),
  gaId: z.string().optional().nullable(),
  maintenanceMode: z.boolean().default(false),
});

export async function getSiteSettings() {
  if (!prisma) return null;
  return prisma.siteSetting.findUnique({
    where: { isSingleton: true },
  });
}

export async function updateSiteSettings(data: z.infer<typeof settingsSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = settingsSchema.parse(data);

  const settings = await prisma.siteSetting.upsert({
    where: { isSingleton: true },
    update: parsed,
    create: {
      ...parsed,
      isSingleton: true,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'SETTINGS_UPDATE',
    entity: 'SiteSetting',
    entityId: settings.id,
    metadata: {
      maintenanceMode: settings.maintenanceMode,
      gaId: settings.gaId,
    },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');

  return { success: true, settings };
}
