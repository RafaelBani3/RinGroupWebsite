'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCareer, updateCareer } from '@/actions/career';
import { CareerStatus } from '@prisma/client';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface CareerFormProps {
  initialData?: any;
}

export function CareerForm({ initialData }: CareerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      department: formData.get('department') as string,
      location: formData.get('location') as string,
      employmentType: (formData.get('employmentType') as string) || 'Full-time',
      description: formData.get('description') as string,
      responsibilities: (formData.get('responsibilities') as string) || null,
      requirements: (formData.get('requirements') as string) || null,
      benefits: (formData.get('benefits') as string) || null,
      applicationUrl: (formData.get('applicationUrl') as string) || null,
      status: formData.get('status') as CareerStatus,
      closingDate: (formData.get('closingDate') as string) || null,
    };

    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateCareer(initialData.id, payload as any);
        } else {
          await createCareer(payload as any);
        }
        setStatus({ success: true });
        router.push('/admin/careers');
        router.refresh();
      } catch (err: any) {
        setStatus({ error: err.message || 'Failed to save career vacancy' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/careers"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vacancies</span>
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Saving Vacancy...' : 'Save Vacancy'}</span>
        </button>
      </div>

      {status?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Basic Role Specs */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Position Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Job Title *</label>
            <input
              name="title"
              defaultValue={initialData?.title || ''}
              required
              placeholder="e.g. Restaurant General Manager"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">URL Slug *</label>
            <input
              name="slug"
              defaultValue={initialData?.slug || ''}
              required
              placeholder="e.g. restaurant-general-manager"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Department *</label>
            <input
              name="department"
              defaultValue={initialData?.department || ''}
              required
              placeholder="e.g. Operations / Culinary"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Location *</label>
            <input
              name="location"
              defaultValue={initialData?.location || ''}
              required
              placeholder="e.g. Tangerang / Alam Sutera"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Employment Type</label>
            <select
              name="employmentType"
              defaultValue={initialData?.employmentType || 'Full-time'}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">Position Summary *</label>
          <textarea
            name="description"
            rows={3}
            required
            defaultValue={initialData?.description || ''}
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
          />
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Responsibilities, Requirements & Benefits
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Key Responsibilities (One item per line or bullet point)
          </label>
          <textarea
            name="responsibilities"
            rows={4}
            defaultValue={initialData?.responsibilities || ''}
            placeholder="- Lead daily dining operations...&#10;- Coach service staff..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Qualifications & Requirements (One item per line or bullet point)
          </label>
          <textarea
            name="requirements"
            rows={4}
            defaultValue={initialData?.requirements || ''}
            placeholder="- Minimum 3 years in premium F&B...&#10;- Knowledge of Japanese hospitality..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Benefits & Compensation Package
          </label>
          <textarea
            name="benefits"
            rows={3}
            defaultValue={initialData?.benefits || ''}
            placeholder="- Competitive compensation...&#10;- Medical coverage..."
            className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none font-mono text-xs"
          />
        </div>
      </div>

      {/* Application & Publishing Status */}
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[#262626] pb-2">
          Application Link & Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || CareerStatus.DRAFT}
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            >
              <option value={CareerStatus.DRAFT}>Draft</option>
              <option value={CareerStatus.PUBLISHED}>Published</option>
              <option value={CareerStatus.CLOSED}>Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Application Closing Date</label>
            <input
              name="closingDate"
              type="date"
              defaultValue={
                initialData?.closingDate
                  ? new Date(initialData.closingDate).toISOString().slice(0, 10)
                  : ''
              }
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Application Email or URL</label>
            <input
              name="applicationUrl"
              defaultValue={initialData?.applicationUrl || 'mailto:careers@ringroup.co.id'}
              placeholder="mailto:careers@ringroup.co.id"
              className="w-full bg-[#111] border border-[#2B2B2B] focus:border-[#B69B63] text-sm text-white rounded-lg p-2.5 outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
