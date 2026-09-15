import React from 'react';
import Link from 'next/link';
import { getAllArticlesAdmin } from '@/actions/news';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsTable } from '@/components/admin/NewsTable';
import { Plus } from 'lucide-react';

export default async function AdminNewsListPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="News & Insights CMS"
        description="Publish and curate stories across corporate updates, culinary crafts, and hospitality culture."
      >
        <Link
          href="/admin/news/create"
          className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </Link>
      </AdminHeader>

      <NewsTable articles={articles} />
    </div>
  );
}
