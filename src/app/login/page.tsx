'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(formData);
      if (!res.success) {
        setError(res.error || 'Authentication failed');
      } else {
        router.push('/admin');
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4 selection:bg-[#B69B63] selection:text-black">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#B69B63]/40 bg-[#1A1A1A] text-[#B69B63] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[11px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase block mb-1">
            PT RIN GROUP INDONESIA
          </span>
          <h1 className="text-2xl font-serif text-white tracking-tight">
            Corporate Administration
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Sign in to access the Content Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#181818] border border-[#2B2B2B] rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3 rounded bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-neutral-300 mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@ringroup.co.id"
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#B69B63] focus:ring-1 focus:ring-[#B69B63] text-sm text-white rounded-lg pl-9 pr-3 py-2.5 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-neutral-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#B69B63] focus:ring-1 focus:ring-[#B69B63] text-sm text-white rounded-lg pl-9 pr-3 py-2.5 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-[#B69B63] hover:bg-[#C4AA74] active:bg-[#9E8552] text-black font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              {isPending ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-[11px] text-neutral-500">
          <p>Restricted access. All login attempts and modifications are audited.</p>
        </div>
      </div>
    </div>
  );
}
