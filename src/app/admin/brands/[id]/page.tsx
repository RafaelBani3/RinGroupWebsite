import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BrandForm } from '@/components/admin/BrandForm';

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!prisma) notFound();

  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      locations: { orderBy: { sortOrder: 'asc' } },
      socials: true,
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Brand: ${brand.name}`}
        description="Update concept details, locations, gallery assets, and SEO."
      />
      <BrandForm initialData={brand} />
    </div>
  );
}
