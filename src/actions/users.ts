'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { Role } from '@prisma/client';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(Role),
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(Role),
  isActive: z.boolean(),
  password: z.string().optional().nullable(),
});

export async function getAllUsersAdmin() {
  await requireRole([Role.SUPER_ADMIN]);
  if (!prisma) return [];

  return prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUserAction(data: z.infer<typeof createUserSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN]);
  const parsed = createUserSchema.parse(data);

  const existing = await prisma.user.findUnique({
    where: { email: parsed.email },
  });
  if (existing) {
    return { success: false, error: 'A user with this email address already exists.' };
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(parsed.password, salt);

  const newUser = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'USER_CREATE',
    entity: 'User',
    entityId: newUser.id,
    metadata: { email: newUser.email, role: newUser.role },
  });

  revalidatePath('/admin/users');
  return { success: true, user: newUser };
}

export async function updateUserAction(id: string, data: z.infer<typeof updateUserSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN]);
  const parsed = updateUserSchema.parse(data);

  const updatePayload: any = {
    name: parsed.name,
    email: parsed.email,
    role: parsed.role,
    isActive: parsed.isActive,
  };

  if (parsed.password && parsed.password.trim().length >= 8) {
    const salt = await bcrypt.genSalt(12);
    updatePayload.passwordHash = await bcrypt.hash(parsed.password, salt);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'USER_UPDATE',
    entity: 'User',
    entityId: updated.id,
    metadata: { email: updated.email, role: updated.role, isActive: updated.isActive },
  });

  revalidatePath('/admin/users');
  return { success: true, user: updated };
}
