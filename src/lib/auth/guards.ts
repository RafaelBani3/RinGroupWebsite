import { Role } from '@prisma/client';
import { getSession, SessionPayload } from './session';

export class AuthorizationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthorizationError('Authentication required to perform this action.');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]): Promise<SessionPayload> {
  const session = await requireAuth();

  // SUPER_ADMIN has access to everything
  if (session.role === Role.SUPER_ADMIN) {
    return session;
  }

  if (!allowedRoles.includes(session.role)) {
    throw new AuthorizationError(
      `Access denied. Role ${session.role} does not have permission for this action.`
    );
  }

  return session;
}

export function canManageUsers(role: Role): boolean {
  return role === Role.SUPER_ADMIN;
}

export function canManageSettings(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.ADMIN;
}

export function canManageBrands(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.ADMIN;
}

export function canManageContent(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.ADMIN || role === Role.EDITOR;
}
