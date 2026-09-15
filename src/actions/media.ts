'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { storage } from '@/lib/storage';
import { Role } from '@prisma/client';

export async function getMediaItems(folder?: string, search?: string) {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!prisma) return [];

  return prisma.media.findMany({
    where: {
      ...(folder && folder !== 'all' ? { folder } : {}),
      ...(search
        ? {
            OR: [
              { filename: { contains: search, mode: 'insensitive' } },
              { altText: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function uploadMediaAction(formData: FormData) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);

  const file = formData.get('file') as File;
  const altText = (formData.get('altText') as string) || '';
  const folder = (formData.get('folder') as string) || 'general';

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  try {
    const uploadResult = await storage.upload(file, folder);

    const media = await prisma.media.create({
      data: {
        url: uploadResult.url,
        filename: uploadResult.filename,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        altText: altText || null,
        folder,
      },
    });

    await logAdminActivity({
      userId: session.userId,
      action: 'CREATE',
      entity: 'Media',
      entityId: media.id,
      metadata: { filename: media.filename, folder: media.folder },
    });

    revalidatePath('/admin/media');

    return { success: true, media };
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed' };
  }
}

export async function updateMediaMetadata(id: string, altText: string, folder: string) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);

  const updated = await prisma.media.update({
    where: { id },
    data: { altText, folder },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'Media',
    entityId: id,
    metadata: { altText, folder },
  });

  revalidatePath('/admin/media');

  return { success: true, media: updated };
}

export async function deleteMediaAction(id: string) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return { success: false, error: 'Media not found' };
  }

  await storage.delete(media.url);
  await prisma.media.delete({ where: { id } });

  await logAdminActivity({
    userId: session.userId,
    action: 'DELETE',
    entity: 'Media',
    entityId: id,
    metadata: { filename: media.filename },
  });

  revalidatePath('/admin/media');

  return { success: true };
}
