'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { CareerStatus, Role } from '@prisma/client';

const careerSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.string().default('Full-time'),
  description: z.string().min(10, 'Description is required'),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  applicationUrl: z.string().optional().nullable(),
  status: z.nativeEnum(CareerStatus).default(CareerStatus.DRAFT),
  closingDate: z.string().optional().nullable(),
});

export async function getPublicCareers() {
  if (!prisma) return [];

  const now = new Date();

  return prisma.career.findMany({
    where: {
      status: CareerStatus.PUBLISHED,
      OR: [
        { closingDate: null },
        { closingDate: { gte: now } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPublicCareerBySlug(slug: string) {
  if (!prisma) return null;

  return prisma.career.findUnique({
    where: { slug },
  });
}

export async function getAllCareersAdmin() {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!prisma) return [];

  return prisma.career.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCareer(data: z.infer<typeof careerSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = careerSchema.parse(data);

  const career = await prisma.career.create({
    data: {
      ...parsed,
      closingDate: parsed.closingDate ? new Date(parsed.closingDate) : null,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: parsed.status === CareerStatus.PUBLISHED ? 'PUBLISH' : 'CREATE',
    entity: 'Career',
    entityId: career.id,
    metadata: { title: career.title, status: career.status },
  });

  revalidatePath('/');
  revalidatePath('/career');
  revalidatePath(`/career/${career.slug}`);
  revalidatePath('/admin/careers');

  return { success: true, career };
}

export async function updateCareer(id: string, data: z.infer<typeof careerSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = careerSchema.parse(data);

  const updated = await prisma.career.update({
    where: { id },
    data: {
      ...parsed,
      closingDate: parsed.closingDate ? new Date(parsed.closingDate) : null,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: parsed.status === CareerStatus.PUBLISHED ? 'PUBLISH' : 'UPDATE',
    entity: 'Career',
    entityId: updated.id,
    metadata: { title: updated.title, status: updated.status },
  });

  revalidatePath('/');
  revalidatePath('/career');
  revalidatePath(`/career/${updated.slug}`);
  revalidatePath('/admin/careers');

  return { success: true, career: updated };
}

export async function deleteCareer(id: string) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const career = await prisma.career.delete({
    where: { id },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'DELETE',
    entity: 'Career',
    entityId: id,
    metadata: { title: career.title, slug: career.slug },
  });

  revalidatePath('/');
  revalidatePath('/career');
  revalidatePath(`/career/${career.slug}`);
  revalidatePath('/admin/careers');

  return { success: true };
}
