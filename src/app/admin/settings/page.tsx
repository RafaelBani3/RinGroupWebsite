import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getSiteSettings } from '@/actions/settings';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { Role } from '@prisma/client';

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    redirect('/admin');
  }

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="System Settings"
        description="Configure production URLs, default SEO, GA4 integration, and maintenance state."
      />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
