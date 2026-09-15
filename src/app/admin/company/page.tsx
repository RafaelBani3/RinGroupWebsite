import React from 'react';
import { getCompanyProfile } from '@/actions/company';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CompanyForm } from '@/components/admin/CompanyForm';

export default async function AdminCompanyPage() {
  const profile = await getCompanyProfile();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Company Profile CMS"
        description="Manage verified corporate identity, mission, vision, philosophy, and official contact information."
      />
      <CompanyForm initialData={profile} />
    </div>
  );
}
