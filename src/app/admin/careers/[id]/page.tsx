import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CareerForm } from '@/components/admin/CareerForm';

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!prisma) notFound();

  const career = await prisma.career.findUnique({
    where: { id },
  });

  if (!career) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Vacancy: ${career.title}`}
        description="Update role requirements, department, closing date, or vacancy status."
      />
      <CareerForm initialData={career} />
    </div>
  );
}
