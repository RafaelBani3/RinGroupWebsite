import React from 'react';
import Link from 'next/link';
import { getAllCareersAdmin } from '@/actions/career';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CareersTable } from '@/components/admin/CareersTable';
import { Plus } from 'lucide-react';

export default async function AdminCareersListPage() {
  const careers = await getAllCareersAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Career Vacancies CMS"
        description="Manage active job openings, requirements, departments, and application status."
      >
        <Link
          href="/admin/careers/create"
          className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </Link>
      </AdminHeader>

      <CareersTable careers={careers} />
    </div>
  );
}
