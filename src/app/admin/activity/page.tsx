import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAdminActivities } from '@/actions/activity';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatDate, formatTime } from '@/lib/utils';
import { History } from 'lucide-react';
import { Role } from '@prisma/client';

export default async function AdminActivityPage() {
  const session = await getSession();

  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    redirect('/admin');
  }

  const activities = await getAdminActivities(100);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Administrative Audit Trail"
        description="Immutable record of user logins, content publications, brand modifications, and system configuration updates."
      />

      <div className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            <History className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            <p>No audit activity recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#111] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                      {formatDate(act.createdAt)} {formatTime(act.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          act.action === 'LOGIN'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : act.action === 'CREATE' || act.action === 'PUBLISH'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : act.action === 'DELETE'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                        }`}
                      >
                        {act.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{act.entity}</td>
                    <td className="py-3 px-4">
                      {act.user ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-medium">{act.user.name}</span>
                          <span className="text-[10px] font-mono text-neutral-500">({act.user.role})</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">System / Unauthenticated</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 max-w-xs truncate font-mono text-[11px]">
                      {act.metadata ? JSON.stringify(act.metadata) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
