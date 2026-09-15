import React from 'react';
import Link from 'next/link';
import { getAllBrandsAdmin } from '@/actions/brand';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BrandsTable } from '@/components/admin/BrandsTable';
import { Plus } from 'lucide-react';

export default async function AdminBrandsListPage() {
  const brands = await getAllBrandsAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Restaurant Brands Portfolio"
        description="Manage dynamic dining concepts, outlets, galleries, and public presentation order."
      >
        <Link
          href="/admin/brands/create"
          className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand Concept</span>
        </Link>
      </AdminHeader>

      <BrandsTable brands={brands} />
    </div>
  );
}
