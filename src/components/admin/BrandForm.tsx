'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBrand, updateBrand } from '@/actions/brand';
import { ContentStatus } from '@prisma/client';
import { AlertCircle, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface BrandFormProps {
  initialData?: any;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);

  // Dynamic locations state
  const [locations, setLocations] = useState<any[]>(
    initialData?.locations || [
      { name: '', address: '', city: 'Tangerang', hours: '11:00 - 22:00', phone: '' },
    ]
  );

  // Dynamic socials state
  const [socials, setSocials] = useState<any[]>(
    initialData?.socials || [{ platform: 'Instagram', url: 'https://instagram.com/' }]
  );

  const addLocation = () => {
    setLocations([...locations, { name: '', address: '', city: '', hours: '', phone: '' }]);
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const updateLocation = (index: number, field: string, value: string) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const addSocial = () => {
    setSocials([...socials, { platform: 'Instagram', url: '' }]);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const galleryRaw = formData.get('gallery') as string;
    const galleryUrls = galleryRaw
      ? galleryRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      tagline: (formData.get('tagline') as string) || null,
      shortDescription: (formData.get('shortDescription') as string) || null,
      description: (formData.get('description') as string) || null,
      category: (formData.get('category') as string) || null,
      concept: (formData.get('concept') as string) || null,
      story: (formData.get('story') as string) || null,
      logoUrl: (formData.get('logoUrl') as string) || null,
      coverImage: (formData.get('coverImage') as string) || null,
      gallery: galleryUrls,
      sortOrder: parseInt(formData.get('sortOrder') as string, 10) || 0,
      status: formData.get('status') as ContentStatus,
      isFeatured: formData.get('isFeatured') === 'on',
      seoTitle: (formData.get('seoTitle') as string) || null,
      seoDescription: (formData.get('seoDescription') as string) || null,
      ogImage: (formData.get('ogImage') as string) || null,
      locations: locations.filter((loc) => loc.name.trim() !== '' && loc.address.trim() !== ''),
      socials: socials.filter((soc) => soc.url.trim() !== ''),
    };

    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateBrand(initialData.id, payload as any);
        } else {
          await createBrand(payload as any);
        }
        setStatus({ success: true });
        router.push('/admin/brands');
        router.refresh();
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to save brand' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/brands"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Brands</span>
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Saving Brand...' : 'Save Brand'}</span>
        </button>
      </div>

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Brand Identity */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Brand Concept & Identity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Brand Name *</label>
            <input
              name="name"
              defaultValue={initialData?.name || ''}
              required
              placeholder="e.g. Sukiyaki RIN"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">URL Slug *</label>
            <input
              name="slug"
              defaultValue={initialData?.slug || ''}
              required
              placeholder="e.g. sukiyaki-rin"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Cuisine / Category</label>
            <input
              name="category"
              defaultValue={initialData?.category || ''}
              placeholder="e.g. Japanese Sukiyaki & Shabu-Shabu"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Tagline</label>
            <input
              name="tagline"
              defaultValue={initialData?.tagline || ''}
              placeholder="e.g. Artisanal Sukiyaki & Shabu-Shabu Experience"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Short Description</label>
          <textarea
            name="shortDescription"
            rows={2}
            defaultValue={initialData?.shortDescription || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Full Dining Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData?.description || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Culinary Concept</label>
            <textarea
              name="concept"
              rows={3}
              defaultValue={initialData?.concept || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Brand Story & Ethos</label>
            <textarea
              name="story"
              rows={3}
              defaultValue={initialData?.story || ''}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Assets */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Visual Assets & Imagery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Cover Image URL</label>
            <input
              name="coverImage"
              defaultValue={initialData?.coverImage || ''}
              placeholder="https://..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Brand Logo URL</label>
            <input
              name="logoUrl"
              defaultValue={initialData?.logoUrl || ''}
              placeholder="https://..."
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Gallery Image URLs (One URL per line)
          </label>
          <textarea
            name="gallery"
            rows={3}
            defaultValue={initialData?.gallery?.join('\n') || ''}
            placeholder="https://...&#10;https://..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
          />
        </div>
      </div>

      {/* Locations */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2">
          <h2 className="text-sm font-semibold text-white">Restaurant Locations & Outlets</h2>
          <button
            type="button"
            onClick={addLocation}
            className="text-xs text-[#B69B63] hover:text-[#C4AA74] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Outlet</span>
          </button>
        </div>

        {locations.map((loc, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-[#111] border border-[#2B2B2B] space-y-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-neutral-400">Outlet #{idx + 1}</span>
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(idx)}
                  className="text-red-400 hover:text-red-300 cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Outlet Name (e.g. Sukiyaki RIN - Alam Sutera)"
                value={loc.name}
                onChange={(e) => updateLocation(idx, 'name', e.target.value)}
                className="w-full bg-[#161616] border border-[#333] text-xs text-white rounded p-2 outline-none"
              />
              <input
                placeholder="City (e.g. Tangerang)"
                value={loc.city || ''}
                onChange={(e) => updateLocation(idx, 'city', e.target.value)}
                className="w-full bg-[#161616] border border-[#333] text-xs text-white rounded p-2 outline-none"
              />
            </div>
            <input
              placeholder="Full Address"
              value={loc.address}
              onChange={(e) => updateLocation(idx, 'address', e.target.value)}
              className="w-full bg-[#161616] border border-[#333] text-xs text-white rounded p-2 outline-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Operating Hours (e.g. 11:00 - 22:00)"
                value={loc.hours || ''}
                onChange={(e) => updateLocation(idx, 'hours', e.target.value)}
                className="w-full bg-[#161616] border border-[#333] text-xs text-white rounded p-2 outline-none"
              />
              <input
                placeholder="Phone / Reservations"
                value={loc.phone || ''}
                onChange={(e) => updateLocation(idx, 'phone', e.target.value)}
                className="w-full bg-[#161616] border border-[#333] text-xs text-white rounded p-2 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2">
          <h2 className="text-sm font-semibold text-white">Brand Social Links</h2>
          <button
            type="button"
            onClick={addSocial}
            className="text-xs text-[#B69B63] hover:text-[#C4AA74] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        {socials.map((soc, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              placeholder="Platform (e.g. Instagram)"
              value={soc.platform}
              onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
              className="w-1/3 bg-[#111] border border-[#333] text-xs text-white rounded p-2 outline-none"
            />
            <input
              placeholder="URL"
              value={soc.url}
              onChange={(e) => updateSocial(idx, 'url', e.target.value)}
              className="flex-1 bg-[#111] border border-[#333] text-xs text-white rounded p-2 outline-none"
            />
            {socials.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocial(idx)}
                className="text-red-400 hover:text-red-300 cursor-pointer p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Publishing & Ordering */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Publishing Status & Display Order
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || ContentStatus.PUBLISHED}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            >
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Display Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div className="pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={initialData?.isFeatured ?? false}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#B69B63] focus:ring-[#B69B63]"
              />
              <span className="text-xs text-neutral-300">Feature on Homepage</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
