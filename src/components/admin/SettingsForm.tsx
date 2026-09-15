'use client';

import React, { useState, useTransition } from 'react';
import { updateSiteSettings } from '@/actions/settings';
import { Check, AlertCircle, Save } from 'lucide-react';

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      siteName: formData.get('siteName') as string,
      siteUrl: formData.get('siteUrl') as string,
      defaultSeoTitle: formData.get('defaultSeoTitle') as string,
      defaultMetaDesc: formData.get('defaultMetaDesc') as string,
      defaultOgImage: (formData.get('defaultOgImage') as string) || null,
      gaId: (formData.get('gaId') as string) || null,
      maintenanceMode: formData.get('maintenanceMode') === 'on',
    };

    startTransition(async () => {
      try {
        await updateSiteSettings(payload);
        setStatus({ success: true });
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to update system settings' });
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      {status?.success && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Global site settings and cache updated successfully.</span>
        </div>
      )}

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{status.error}</span>
        </div>
      )}

      {/* General Configuration */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          General Site Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Site Title</label>
            <input
              name="siteName"
              defaultValue={initialSettings?.siteName || 'PT RIN Group Indonesia'}
              required
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Production URL</label>
            <input
              name="siteUrl"
              defaultValue={initialSettings?.siteUrl || 'https://ringroup.co.id'}
              required
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Default Global SEO Title</label>
          <input
            name="defaultSeoTitle"
            defaultValue={initialSettings?.defaultSeoTitle || 'RIN Group Indonesia | Food & Beverage Company'}
            required
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Default Global Meta Description</label>
          <textarea
            name="defaultMetaDesc"
            rows={2}
            defaultValue={
              initialSettings?.defaultMetaDesc ||
              'RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.'
            }
            required
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Integrations & Analytics
        </h2>
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
          </label>
          <input
            name="gaId"
            defaultValue={initialSettings?.gaId || ''}
            placeholder="G-..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
          />
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Maintenance Control
        </h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="maintenanceMode"
            defaultChecked={initialSettings?.maintenanceMode ?? false}
            className="w-4 h-4 mt-0.5 rounded border-neutral-700 bg-neutral-900 text-[#B69B63] focus:ring-[#B69B63]"
          />
          <div>
            <span className="text-xs font-semibold text-white block">Enable Public Maintenance Mode</span>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              When activated, public visitors will see a polished Japanese hospitality holding page.
              Admins retain full access to /admin.
            </p>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{isPending ? 'Saving...' : 'Save Settings'}</span>
      </button>
    </form>
  );
}
