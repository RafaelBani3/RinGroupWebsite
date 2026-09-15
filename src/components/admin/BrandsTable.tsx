'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteBrand, reorderBrands } from '@/actions/brand';
import { ArrowUp, ArrowDown, Edit2, Trash2, ExternalLink, MapPin } from 'lucide-react';

export function BrandsTable({ brands }: { brands: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"? This action cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      await deleteBrand(id);
      router.refresh();
    });
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === brands.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updates = [
      { id: brands[index].id, sortOrder: brands[targetIndex].sortOrder },
      { id: brands[targetIndex].id, sortOrder: brands[index].sortOrder },
    ];

    startTransition(async () => {
      await reorderBrands(updates);
      router.refresh();
    });
  };

  if (brands.length === 0) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-12 text-center">
        <p className="text-neutral-400 text-sm">No brands registered in the portfolio yet.</p>
        <Link
          href="/admin/brands/create"
          className="inline-block mt-4 px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black text-xs font-semibold rounded-lg"
        >
          Add First Brand
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
              <th className="py-3 px-4 w-16">Order</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Cuisine / Concept</th>
              <th className="py-3 px-4">Outlets</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {brands.map((b, idx) => (
              <tr key={b.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isPending || idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] font-bold text-[#B69B63]">{b.sortOrder}</span>
                    <button
                      type="button"
                      disabled={isPending || idx === brands.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <span>{b.name}</span>
                    {b.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#B69B63]/20 text-[#B69B63] border border-[#B69B63]/30">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">/brands/{b.slug}</span>
                </td>

                <td className="py-3 px-4 text-neutral-400">
                  {b.category || '—'}
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-neutral-300">
                    <MapPin className="w-3 h-3 text-[#B69B63]" />
                    <span>{b.locations?.length || 0}</span>
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : b.status === 'DRAFT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/brands/${b.slug}`}
                      target="_blank"
                      className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/brands/${b.id}`}
                      className="p-1.5 rounded text-neutral-400 hover:text-[#B69B63] hover:bg-neutral-800 transition-colors"
                      title="Edit brand"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(b.id, b.name)}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete brand"
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
