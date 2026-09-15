'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCareer } from '@/actions/career';
import { formatDate } from '@/lib/utils';
import { Edit2, Trash2, ExternalLink, MapPin } from 'lucide-react';

export function CareersTable({ careers }: { careers: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete career vacancy "${title}"?`)) return;

    startTransition(async () => {
      await deleteCareer(id);
      router.refresh();
    });
  };

  if (careers.length === 0) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-12 text-center">
        <p className="text-neutral-400 text-sm">No job openings created yet.</p>
        <Link
          href="/admin/careers/create"
          className="inline-block mt-4 px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black text-xs font-semibold rounded-lg"
        >
          Create First Vacancy
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
              <th className="py-3 px-4">Role Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Closing Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {careers.map((c) => (
              <tr key={c.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4">
                  <p className="font-semibold text-white text-sm">{c.title}</p>
                  <span className="font-mono text-[10px] text-neutral-500">/career/{c.slug}</span>
                </td>
                <td className="py-3 px-4 text-neutral-400">{c.department}</td>
                <td className="py-3 px-4 text-neutral-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B69B63]" />
                    <span>{c.location}</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : c.status === 'DRAFT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {c.closingDate ? formatDate(c.closingDate) : 'Open Until Filled'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {c.status === 'PUBLISHED' && (
                      <Link
                        href={`/career/${c.slug}`}
                        target="_blank"
                        className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="View live vacancy"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/careers/${c.id}`}
                      className="p-1.5 rounded text-neutral-400 hover:text-[#B69B63] hover:bg-neutral-800 transition-colors"
                      title="Edit vacancy"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(c.id, c.title)}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete vacancy"
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
