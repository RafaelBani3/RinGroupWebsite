import { prisma } from '../prisma';
import crypto from 'crypto';

export type AllowedAnalyticsEvent =
  | 'brand_view'
  | 'career_view'
  | 'news_view'
  | 'contact_submit'
  | 'career_apply_click'
  | 'social_click'
  | 'external_link_click';

export function hashIpForPrivacy(ip?: string | null): string | undefined {
  if (!ip) return undefined;
  const salt = process.env.AUTH_SECRET || 'ringroup-privacy-salt';
  return crypto.createHmac('sha256', salt).update(ip).digest('hex').substring(0, 16);
}

export async function trackEvent(params: {
  eventName: AllowedAnalyticsEvent;
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    if (!prisma) return;

    const ipHash = hashIpForPrivacy(params.ip);

    await prisma.analyticsEvent.create({
      data: {
        eventName: params.eventName,
        path: params.path,
        referrer: params.referrer || null,
        userAgent: params.userAgent ? params.userAgent.substring(0, 255) : null,
        ipHash: ipHash || null,
        metadata: (params.metadata as any) || null,
      },
    });
  } catch (err) {
    // Non-blocking
    console.error('Analytics tracking error:', err);
  }
}
