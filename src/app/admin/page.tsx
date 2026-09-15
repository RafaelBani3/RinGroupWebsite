import React from 'react';
import Link from 'next/link';
import { getDashboardOverview } from '@/actions/analytics';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Users,
  Eye,
  UtensilsCrossed,
  Newspaper,
  Briefcase,
  Mail,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const overview = await getDashboardOverview();

  const statCards = [
    { label: 'Total Visitors (Est.)', value: overview.totalVisitors.toLocaleString(), icon: Users, href: '/admin/analytics' },
    { label: 'Page Views', value: overview.pageViews.toLocaleString(), icon: Eye, href: '/admin/analytics' },
    { label: 'Published Brands', value: overview.publishedBrands, icon: UtensilsCrossed, href: '/admin/brands' },
    { label: 'Published News', value: overview.publishedNews, icon: Newspaper, href: '/admin/news' },
    { label: 'Active Careers', value: overview.activeCareers, icon: Briefcase, href: '/admin/careers' },
    { label: 'New Inquiries', value: overview.newContacts, icon: Mail, href: '/admin/contacts' },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Corporate Overview"
        description="Welcome to PT RIN Group Indonesia digital management center."
      >
        <Link
          href="/admin/brands"
          className="px-3.5 py-1.5 rounded-lg bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <span>Manage Brands</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </AdminHeader>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="bg-[#161616] border border-[#262626] hover:border-[#383838] p-4 rounded-xl transition-all group"
            >
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <Icon className="w-4 h-4 text-[#B69B63]" />
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl font-semibold text-white tracking-tight">{c.value}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{c.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Inquiries & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contact Inquiries */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B69B63]" />
              <span>Recent Contact Inquiries</span>
            </h2>
            <Link
              href="/admin/contacts"
              className="text-xs text-[#B69B63] hover:underline"
            >
              View All
            </Link>
          </div>

          {overview.recentContacts.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No contact inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {overview.recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-start justify-between gap-4"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-white truncate">{contact.name}</p>
                    <p className="text-[11px] text-[#B69B63] truncate">{contact.subject}</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{contact.message}</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Log */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B69B63]" />
              <span>Recent Admin Activity</span>
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs text-[#B69B63] hover:underline"
            >
              View Audit Log
            </Link>
          </div>

          {overview.recentActivities.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No admin actions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {overview.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B69B63] shrink-0" />
                    <span className="font-semibold text-neutral-200 uppercase text-[10px] tracking-wider">
                      {act.action}
                    </span>
                    <span className="text-neutral-400 truncate">
                      {act.entity} {act.user?.name ? `by ${act.user.name}` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">
                    {formatDate(act.createdAt)} {formatTime(act.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
