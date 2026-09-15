'use client';

import React, { useState, useTransition } from 'react';
import { upsertSeoMetadata } from '@/actions/seo';
import { Check, AlertCircle, Save } from 'lucide-react';

interface SeoItem {
  path: string;
  title: string;
  description: string;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  robots?: string | null;
}

export function SeoEditor({ items }: { items: SeoItem[] }) {
  const [selectedPath, setSelectedPath] = useState(items[0]?.path || '/');
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentItem = items.find((i) => i.path === selectedPath) || {
    path: selectedPath,
    title: '',
    description: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robots: 'index, follow',
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      path: selectedPath,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      canonical: (formData.get('canonical') as string) || null,
      ogTitle: (formData.get('ogTitle') as string) || null,
      ogDescription: (formData.get('ogDescription') as string) || null,
      ogImage: (formData.get('ogImage') as string) || null,
      robots: (formData.get('robots') as string) || 'index, follow',
    };

    startTransition(async () => {
      try {
        await upsertSeoMetadata(payload);
        setStatus({ success: true });
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to update SEO metadata' });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Route Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#141414] border border-[#262626] rounded-xl">
        {items.map((i) => (
          <button
            key={i.path}
            type="button"
            onClick={() => {
              setSelectedPath(i.path);
              setStatus(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPath === i.path
                ? 'bg-[#B69B63] text-black font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-[#222]'
            }`}
          >
            {i.path}
          </button>
        ))}
      </div>

      {status?.success && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>SEO metadata for {selectedPath} updated and revalidated successfully.</span>
        </div>
      )}

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSave} key={selectedPath} className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Route SEO: {selectedPath}</h2>
            <p className="text-xs text-neutral-400">Configure search engine titles, snippets, and social cards.</p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? 'Saving...' : 'Save Meta'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Meta Title (Recommended: 50-60 chars)
          </label>
          <input
            name="title"
            defaultValue={currentItem.title}
            required
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Meta Description (Recommended: 120-160 chars)
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={currentItem.description}
            required
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Canonical URL</label>
            <input
              name="canonical"
              defaultValue={currentItem.canonical || ''}
              placeholder="https://ringroup.co.id/..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Robots Directives</label>
            <input
              name="robots"
              defaultValue={currentItem.robots || 'index, follow'}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">OpenGraph / Social Title</label>
            <input
              name="ogTitle"
              defaultValue={currentItem.ogTitle || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">OpenGraph Image URL</label>
            <input
              name="ogImage"
              defaultValue={currentItem.ogImage || ''}
              placeholder="https://..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
