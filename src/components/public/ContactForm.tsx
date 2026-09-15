'use client';

import React, { useState, useTransition } from 'react';
import { submitContactForm } from '@/actions/contact';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      honeypot: (formData.get('website_check') as string) || '', // Honeypot field
    };

    startTransition(async () => {
      try {
        const res = await submitContactForm(payload);
        if (res.success) {
          setStatus({ success: true });
          form.reset();
        } else {
          setStatus({ error: res.error || 'Failed to submit inquiry.' });
        }
      } catch (err: any) {
        setStatus({ error: err.message || 'An unexpected error occurred.' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status?.success && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Thank you. Your message has been safely received by PT RIN Group Indonesia. Our corporate team will respond promptly.
          </span>
        </div>
      )}

      {status?.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-800 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* Hidden honeypot field to trap automated spambots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_check">Leave this field empty</label>
        <input
          id="website_check"
          name="website_check"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Full Name *
          </label>
          <input
            name="name"
            required
            placeholder="Your Name"
            className="w-full bg-[#F6F3EC] border border-[#D5CFC2] focus:border-[#B69B63] text-sm text-neutral-900 rounded-xl p-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full bg-[#F6F3EC] border border-[#D5CFC2] focus:border-[#B69B63] text-sm text-neutral-900 rounded-xl p-3 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Phone / WhatsApp (Optional)
          </label>
          <input
            name="phone"
            placeholder="+62 8..."
            className="w-full bg-[#F6F3EC] border border-[#D5CFC2] focus:border-[#B69B63] text-sm text-neutral-900 rounded-xl p-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Inquiry Subject *
          </label>
          <input
            name="subject"
            required
            placeholder="Partnership, Careers, or Brand Inquiries"
            className="w-full bg-[#F6F3EC] border border-[#D5CFC2] focus:border-[#B69B63] text-sm text-neutral-900 rounded-xl p-3 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">
          Message *
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Please describe your inquiry or proposal in detail..."
          className="w-full bg-[#F6F3EC] border border-[#D5CFC2] focus:border-[#B69B63] text-sm text-neutral-900 rounded-xl p-3 outline-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3.5 bg-[#171717] hover:bg-[#B69B63] text-white hover:text-black font-semibold text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isPending ? 'Sending Inquiry...' : 'Send Corporate Inquiry'}</span>
      </button>
    </form>
  );
}
