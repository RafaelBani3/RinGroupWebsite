import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CareerForm } from '@/components/admin/CareerForm';

export default function CreateCareerPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Post New Vacancy"
        description="Add a new employment opportunity within PT RIN Group Indonesia restaurant operations."
      />
      <CareerForm />
    </div>
  );
}
