import React from 'react';
import { getContactSubmissionsAdmin } from '@/actions/contact';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ContactsTable } from '@/components/admin/ContactsTable';

export default async function AdminContactsPage() {
  const submissions = await getContactSubmissionsAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Corporate Contact Inquiries"
        description="Review inbound messages from guests, suppliers, business partners, and candidates."
      />
      <ContactsTable submissions={submissions} />
    </div>
  );
}
