'use client';

import React, { useState, useTransition } from 'react';
import { updateCompanyProfile } from '@/actions/company';
import { Check, AlertCircle, Save } from 'lucide-react';

export function CompanyForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      shortName: formData.get('shortName') as string,
      description: formData.get('description') as string,
      about: formData.get('about') as string,
      vision: formData.get('vision') as string,
      mission: formData.get('mission') as string,
      philosophy: formData.get('philosophy') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      mapUrl: formData.get('mapUrl') as string,
      logo: formData.get('logo') as string,
      favicon: formData.get('favicon') as string,
      ogImage: formData.get('ogImage') as string,
      instagram: formData.get('instagram') as string,
      linkedin: formData.get('linkedin') as string,
      tiktok: formData.get('tiktok') as string,
    };

    startTransition(async () => {
      try {
        const res = await updateCompanyProfile(payload);
        if (res.success) {
          setStatus({ success: true });
        }
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to update company profile' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {status?.success && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Company profile updated and public cache revalidated successfully.</span>
        </div>
      )}

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Corporate Identity */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Corporate Identity & Names
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Official Legal Name</label>
            <input
              name="name"
              defaultValue={initialData?.name || 'PT RIN Group Indonesia'}
              required
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Brand / Short Name</label>
            <input
              name="shortName"
              defaultValue={initialData?.shortName || 'RIN Group'}
              required
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Company Description (Brief Overview)</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* About, Vision & Mission */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          About, Vision, Mission & Philosophy
        </h2>
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate About Narrative</label>
          <textarea
            name="about"
            rows={4}
            defaultValue={initialData?.about || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate Vision</label>
            <textarea
              name="vision"
              rows={3}
              defaultValue={initialData?.vision || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate Mission</label>
            <textarea
              name="mission"
              rows={3}
              defaultValue={initialData?.mission || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Hospitality Philosophy</label>
          <textarea
            name="philosophy"
            rows={2}
            defaultValue={initialData?.philosophy || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Contact Details & Office Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate Email</label>
            <input
              name="email"
              type="email"
              defaultValue={initialData?.email || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate Phone</label>
            <input
              name="phone"
              defaultValue={initialData?.phone || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Office Address</label>
          <textarea
            name="address"
            rows={2}
            defaultValue={initialData?.address || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Google Maps URL</label>
          <input
            name="mapUrl"
            type="url"
            defaultValue={initialData?.mapUrl || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Official Social Channels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Instagram URL</label>
            <input
              name="instagram"
              defaultValue={initialData?.instagram || ''}
              placeholder="https://instagram.com/..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">LinkedIn URL</label>
            <input
              name="linkedin"
              defaultValue={initialData?.linkedin || ''}
              placeholder="https://linkedin.com/..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">TikTok URL</label>
            <input
              name="tiktok"
              defaultValue={initialData?.tiktok || ''}
              placeholder="https://tiktok.com/..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{isPending ? 'Saving Changes...' : 'Save Company Profile'}</span>
      </button>
    </form>
  );
}
