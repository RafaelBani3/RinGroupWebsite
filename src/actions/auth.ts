'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, getSession } from '@/lib/auth/session';
import { logAdminActivity } from '@/lib/audit/activity';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAction(formData: FormData) {
  const rawEmail = formData.get('email') as string;
  const rawPassword = formData.get('password') as string;

  const validation = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid form input',
    };
  }

  try {
    if (!prisma) {
      return {
        success: false,
        error: 'Database is not configured. Please define DATABASE_URL in .env.local.',
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: validation.data.email },
    });

    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'Invalid credentials or inactive account.',
      };
    }

    const isMatch = await bcrypt.compare(validation.data.password, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: 'Invalid credentials.',
      };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await logAdminActivity({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return { success: true };
  } catch (err: any) {
    console.error('Login action error:', err);
    return {
      success: false,
      error: 'An unexpected authentication error occurred. Please try again.',
    };
  }
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await logAdminActivity({
      userId: session.userId,
      action: 'LOGIN',
      entity: 'User',
      entityId: session.userId,
      metadata: { type: 'LOGOUT' },
    });
  }
  await destroySession();
  return { success: true };
}
