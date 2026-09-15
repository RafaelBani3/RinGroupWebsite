import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAllUsersAdmin } from '@/actions/users';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UsersManager } from '@/components/admin/UsersManager';
import { Role } from '@prisma/client';

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session || session.role !== Role.SUPER_ADMIN) {
    redirect('/admin');
  }

  const users = await getAllUsersAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Administrative Staff & Roles"
        description="Configure staff user accounts, role-based authorization levels, and login statuses."
      />
      <UsersManager users={users} />
    </div>
  );
}
