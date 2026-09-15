import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BrandForm } from '@/components/admin/BrandForm';

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Add New Brand Concept"
        description="Register a new dining concept into the PT RIN Group Indonesia portfolio."
      />
      <BrandForm />
    </div>
  );
}
