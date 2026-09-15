import React from 'react';
import { getNewsCategories } from '@/actions/news';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsForm } from '@/components/admin/NewsForm';

export default async function CreateNewsPage() {
  const categories = await getNewsCategories();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Compose New Article"
        description="Craft an editorial article or announcement for RIN Group's newsroom."
      />
      <NewsForm categories={categories} />
    </div>
  );
}
