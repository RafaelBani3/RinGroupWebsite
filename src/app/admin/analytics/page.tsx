import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAnalyticsMetrics } from '@/actions/analytics';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AnalyticsDashboardClient } from '@/components/admin/AnalyticsCharts';
import { Role } from '@prisma/client';

export default async function AdminAnalyticsPage() {
  const session = await getSession();

  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    redirect('/admin');
  }

  const metrics = await getAnalyticsMetrics('30d');

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Website Analytics"
        description="Executive business summaries, visitor engagement, top content performance, and traffic channels."
      />
      <AnalyticsDashboardClient data={metrics} />
    </div>
  );
}
