'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { Role } from '@prisma/client';

export async function getAdminActivities(limit = 50) {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!prisma) return [];

  return prisma.adminActivity.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
  });
}
