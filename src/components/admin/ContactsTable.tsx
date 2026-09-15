'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateContactStatus } from '@/actions/contact';
import { formatDate, formatTime } from '@/lib/utils';
import { ContactStatus } from '@prisma/client';
import { Mail, CheckCircle2, Archive } from 'lucide-react';

export function ContactsTable({ submissions }: { submissions: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    startTransition(async () => {
      await updateContactStatus(id, newStatus);
      router.refresh();
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-12 text-center">
        <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-neutral-400 text-sm">No corporate contact inquiries received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className={`bg-[#161616] border rounded-xl p-5 transition-all space-y-3 ${
            sub.status === 'NEW' ? 'border-[#B69B63]/60 bg-[#191919]' : 'border-[#262626]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{sub.name}</span>
                <span className="text-neutral-400 text-xs font-mono">({sub.email})</span>
                {sub.phone && (
                  <span className="text-neutral-400 text-xs font-mono">• {sub.phone}</span>
                )}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    sub.status === 'NEW'
                      ? 'bg-[#B69B63]/20 text-[#B69B63] border border-[#B69B63]/40'
                      : sub.status === 'READ'
                      ? 'bg-neutral-800 text-neutral-300'
                      : 'bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-xs text-[#B69B63] font-medium mt-0.5">Subject: {sub.subject}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-neutral-500 mr-2">
                {formatDate(sub.createdAt)} at {formatTime(sub.createdAt)}
              </span>
              {sub.status === 'NEW' && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(sub.id, ContactStatus.READ)}
                  className="px-2.5 py-1 bg-[#262626] hover:bg-[#333] text-neutral-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Read</span>
                </button>
              )}
              {sub.status !== 'ARCHIVED' && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(sub.id, ContactStatus.ARCHIVED)}
                  className="px-2.5 py-1 bg-[#262626] hover:bg-[#333] text-neutral-400 hover:text-neutral-200 rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-[#111] rounded-lg border border-[#242424] text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
            {sub.message}
          </div>
        </div>
      ))}
    </div>
  );
}
