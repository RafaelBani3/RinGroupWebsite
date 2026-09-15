'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { Role } from '@prisma/client';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  philosophy: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  email: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
  phone: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
});

export async function getCompanyProfile() {
  if (!prisma) return null;
  return prisma.companyProfile.findUnique({
    where: { isSingleton: true },
  });
}

export async function updateCompanyProfile(data: z.infer<typeof companySchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const parsed = companySchema.parse(data);

  const updated = await prisma.companyProfile.upsert({
    where: { isSingleton: true },
    update: parsed,
    create: {
      ...parsed,
      isSingleton: true,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'CompanyProfile',
    entityId: updated.id,
    metadata: { name: updated.name },
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  revalidatePath('/admin/company');

  return { success: true, profile: updated };
}
