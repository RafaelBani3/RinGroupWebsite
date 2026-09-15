'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { hashIpForPrivacy, trackEvent } from '@/lib/analytics/events';
import { ContactStatus, Role } from '@prisma/client';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(), // Anti-spam honeypot field
});

export async function submitContactForm(data: z.infer<typeof contactSchema>, clientIp?: string) {
  // 1. Anti-spam honeypot check: Bots usually fill hidden fields
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: true }; // Silently reject bot submission
  }

  const parsed = contactSchema.parse(data);

  if (!prisma) {
    throw new Error('Database is currently unavailable.');
  }

  const ipHash = hashIpForPrivacy(clientIp);

  // Rate limiting guard: max 5 messages per hour per hashed IP
  if (ipHash) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSubmissions = await prisma.contactSubmission.count({
      where: {
        ipHash,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentSubmissions >= 5) {
      return {
        success: false,
        error: 'Too many messages sent. Please wait a while before sending another inquiry.',
      };
    }
  }

  const submission = await prisma.contactSubmission.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || null,
      subject: parsed.subject,
      message: parsed.message,
      status: ContactStatus.NEW,
      ipHash: ipHash || null,
    },
  });

  await trackEvent({
    eventName: 'contact_submit',
    path: '/contact',
    ip: clientIp,
    metadata: { subject: parsed.subject },
  });

  return { success: true, id: submission.id };
}

export async function getContactSubmissionsAdmin() {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!prisma) return [];

  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { status },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'ContactSubmission',
    entityId: id,
    metadata: { status },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/contacts');

  return { success: true, submission: updated };
}
