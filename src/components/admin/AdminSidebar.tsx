'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  Newspaper,
  Briefcase,
  Image as ImageIcon,
  SearchCheck,
  BarChart3,
  Mail,
  Settings,
  Users,
  History,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { Role } from '@prisma/client';

interface AdminSidebarProps {
  user: {
    userId: string;
    email: string;
    name: string;
    role: Role;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles?: Role[];
  }

  const navItems: NavItem[] = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Company Profile', href: '/admin/company', icon: Building2 },
    { label: 'Brands Portfolio', href: '/admin/brands', icon: UtensilsCrossed },
    { label: 'News & Articles', href: '/admin/news', icon: Newspaper },
    { label: 'Careers', href: '/admin/careers', icon: Briefcase },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'SEO Metadata', href: '/admin/seo', icon: SearchCheck },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
    { label: 'Inquiries', href: '/admin/contacts', icon: Mail },
    { label: 'Settings', href: '/admin/settings', icon: Settings, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
    { label: 'User Accounts', href: '/admin/users', icon: Users, roles: [Role.SUPER_ADMIN] },
    { label: 'Activity Logs', href: '/admin/activity', icon: History, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
  ];

  return (
    <aside className="w-64 bg-[#141414] border-r border-[#262626] text-[#E0E0E0] flex flex-col h-screen sticky top-0 select-none z-30 shrink-0">
      {/* Top Brand Header */}
      <div className="p-5 border-b border-[#262626] flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-[#B69B63] uppercase block">
            Corporate CMS
          </span>
          <span className="text-base font-semibold tracking-wider text-white">RIN GROUP</span>
        </div>
        <Link
          href="/"
          target="_blank"
          title="Open public website"
          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(user.role)) {
            return null;
          }

          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#B69B63]/15 text-[#E6D5B8] border border-[#B69B63]/30 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1C1C1C]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#B69B63]' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-[#262626] bg-[#111111]">
        <div className="flex items-center justify-between mb-2">
          <div className="overflow-hidden pr-2">
            <p className="text-xs font-medium text-neutral-200 truncate">{user.name}</p>
            <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-[#262626] text-[#B69B63] border border-[#3A3A3A]">
            {user.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 mt-2 rounded bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 text-xs border border-neutral-800 hover:border-red-900/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
