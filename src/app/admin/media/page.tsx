import React from 'react';
import { getMediaItems } from '@/actions/media';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default async function AdminMediaPage() {
  const mediaItems = await getMediaItems();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media Asset Library"
        description="Upload and organize imagery, logos, and promotional photography with SEO alt tags."
      />
      <MediaLibrary initialItems={mediaItems as any} />
    </div>
  );
}
