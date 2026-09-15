import React from 'react';
import { getAllSeoMetadataAdmin } from '@/actions/seo';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SeoEditor } from '@/components/admin/SeoEditor';

export default async function AdminSeoPage() {
  const seoItems = await getAllSeoMetadataAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Search Engine Optimization (SEO) CMS"
        description="Fine-tune per-route meta titles, structured snippets, and OpenGraph tags for search engines."
      />
      <SeoEditor items={seoItems} />
    </div>
  );
}
