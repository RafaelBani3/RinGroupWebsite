'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createUserAction, updateUserAction } from '@/actions/users';
import { Role } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import { UserPlus, Check, AlertCircle, Shield, X } from 'lucide-react';

export function UsersManager({ users }: { users: any[] }) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as Role,
    };

    startTransition(async () => {
      const res = await createUserAction(payload);
      if (res.success) {
        setShowCreateModal(false);
        setStatus({ success: true });
        router.refresh();
      } else {
        setStatus({ error: res.error || 'Failed to create user' });
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as Role,
      isActive: formData.get('isActive') === 'on',
      password: (formData.get('password') as string) || undefined,
    };

    startTransition(async () => {
      const res = await updateUserAction(editingUser.id, payload);
      if (res.success) {
        setEditingUser(null);
        setStatus({ success: true });
        router.refresh();
      } else {
        setStatus({ error: 'Failed to update user' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-neutral-400">
          Super Administrator authority: Manage staff accounts and role authorizations.
        </p>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Admin User</span>
        </button>
      </div>

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {status?.success && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>User account updated successfully.</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#111] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#262626]">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#262626] text-[#B69B63] border border-[#3A3A3A]">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {u.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-400">{formatDate(u.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => setEditingUser(u)}
                    className="px-2.5 py-1 bg-[#242424] hover:bg-[#333] text-neutral-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#B69B63]" />
                <span>Create Administrator</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Full Name *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Budi Santoso"
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="user@ringroup.co.id"
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Password (Min 8 chars) *</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Role Permission *</label>
                <select
                  name="role"
                  defaultValue={Role.EDITOR}
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                >
                  <option value={Role.EDITOR}>EDITOR (News, Content, Media)</option>
                  <option value={Role.ADMIN}>ADMIN (Company, Brands, News, Careers, Media, SEO, Settings)</option>
                  <option value={Role.SUPER_ADMIN}>SUPER_ADMIN (Full Access & User Management)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#242424] hover:bg-[#333] text-neutral-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold rounded cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="text-sm font-semibold text-white">Edit User: {editingUser.name}</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Full Name</label>
                <input
                  name="name"
                  defaultValue={editingUser.name}
                  required
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">
                  Change Password (Leave blank to keep unchanged)
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="New password (optional)"
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Role</label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-white rounded p-2.5 outline-none"
                >
                  <option value={Role.EDITOR}>EDITOR</option>
                  <option value={Role.ADMIN}>ADMIN</option>
                  <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingUser.isActive}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#B69B63]"
                />
                <span className="text-xs text-neutral-300">Account Active (Permitted to sign in)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-[#242424] hover:bg-[#333] text-neutral-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold rounded cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
