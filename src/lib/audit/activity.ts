import { prisma } from '../prisma';

export interface ActivityLogInput {
  userId?: string | null;
  action:
    | 'LOGIN'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'PUBLISH'
    | 'UNPUBLISH'
    | 'SETTINGS_UPDATE'
    | 'USER_CREATE'
    | 'USER_UPDATE';
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
}

export async function logAdminActivity(data: ActivityLogInput) {
  try {
    if (!prisma) return;

    // Sanitize metadata to never include sensitive credentials or tokens
    const safeMetadata = { ...data.metadata };
    delete safeMetadata.password;
    delete safeMetadata.passwordHash;
    delete safeMetadata.token;
    delete safeMetadata.secret;

    await prisma.adminActivity.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        metadata: safeMetadata as any,
        ipHash: data.ipHash || null,
      },
    });
  } catch (error) {
    // Non-blocking: audit log failure should not crash core application transactions
    console.error('Failed to write admin activity log:', error);
  }
}
