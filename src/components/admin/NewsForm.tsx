'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, updateArticle } from '@/actions/news';
import { NewsStatus } from '@prisma/client';
import { RichEditor } from './RichEditor';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface NewsFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
}

export function NewsForm({ initialData, categories }: NewsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [content, setContent] = useState<string>(initialData?.content || '<p></p>');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      categoryId: (formData.get('categoryId') as string) || null,
      coverImage: (formData.get('coverImage') as string) || null,
      excerpt: (formData.get('excerpt') as string) || null,
      content,
      status: formData.get('status') as NewsStatus,
      publishedAt: (formData.get('publishedAt') as string) || null,
      readTimeMinutes: parseInt(formData.get('readTimeMinutes') as string, 10) || 3,
      seoTitle: (formData.get('seoTitle') as string) || null,
      seoDescription: (formData.get('seoDescription') as string) || null,
      ogImage: (formData.get('ogImage') as string) || null,
    };

    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateArticle(initialData.id, payload as any);
        } else {
          await createArticle(payload as any);
        }
        setStatus({ success: true });
        router.push('/admin/news');
        router.refresh();
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to save article' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/news"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Saving Article...' : 'Save Article'}</span>
        </button>
      </div>

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Article Metadata */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Article Details
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Headline / Title *</label>
          <input
            name="title"
            defaultValue={initialData?.title || ''}
            required
            placeholder="e.g. Strengthening Culinary Standards Across Our Restaurant Portfolio"
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">URL Slug *</label>
            <input
              name="slug"
              defaultValue={initialData?.slug || ''}
              required
              placeholder="e.g. culinary-standards-across-concepts"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Cover Image URL</label>
          <input
            name="coverImage"
            defaultValue={initialData?.coverImage || ''}
            placeholder="https://..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Excerpt / Summary</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={initialData?.excerpt || ''}
            placeholder="Short introductory summary for cards and search snippets..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* Rich Content Editor */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Article Body Content
        </h2>
        <RichEditor value={content} onChange={setContent} />
      </div>

      {/* Status & Schedule */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Publishing Workflow & SEO
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || NewsStatus.DRAFT}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            >
              <option value={NewsStatus.DRAFT}>Draft</option>
              <option value={NewsStatus.PUBLISHED}>Published</option>
              <option value={NewsStatus.SCHEDULED}>Scheduled</option>
              <option value={NewsStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Publication Date</label>
            <input
              name="publishedAt"
              type="datetime-local"
              defaultValue={
                initialData?.publishedAt
                  ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
                  : ''
              }
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Reading Time (Min)</label>
            <input
              name="readTimeMinutes"
              type="number"
              defaultValue={initialData?.readTimeMinutes || 3}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Custom SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={initialData?.seoTitle || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Custom SEO Description</label>
            <input
              name="seoDescription"
              defaultValue={initialData?.seoDescription || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
