'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteArticle } from '@/actions/news';
import { formatDate } from '@/lib/utils';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';

export function NewsTable({ articles }: { articles: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;

    startTransition(async () => {
      await deleteArticle(id);
      router.refresh();
    });
  };

  if (articles.length === 0) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-12 text-center">
        <p className="text-neutral-400 text-sm">No articles or insights published yet.</p>
        <Link
          href="/admin/news/create"
          className="inline-block mt-4 px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black text-xs font-semibold rounded-lg"
        >
          Create First Article
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#111] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#262626]">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Published Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4">
                  <p className="font-semibold text-white text-sm line-clamp-1">{a.title}</p>
                  <span className="font-mono text-[10px] text-neutral-500">/news/{a.slug}</span>
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {a.category?.name || 'Uncategorized'}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      a.status === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : a.status === 'SCHEDULED'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : a.status === 'DRAFT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {a.publishedAt ? formatDate(a.publishedAt) : 'Not published'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {a.status === 'PUBLISHED' && (
                      <Link
                        href={`/news/${a.slug}`}
                        target="_blank"
                        className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="View live article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/news/${a.id}`}
                      className="p-1.5 rounded text-neutral-400 hover:text-[#B69B63] hover:bg-neutral-800 transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(a.id, a.title)}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
