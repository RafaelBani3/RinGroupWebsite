'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error without exposing to UI
    console.error('Handled application error:', error.message);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F6F3EC] text-[#242424] px-6 py-24">
      <div className="text-center max-w-md space-y-6">
        <span className="text-[10px] tracking-[0.28em] font-semibold text-[#9E2F2F] uppercase block">
          Notice • Service Interruption
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-neutral-900">
          An unexpected interruption occurred.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          We apologize for the inconvenience. Our technical engineering team has been notified and standard hospitality operations remain in progress.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#2A2A2A] text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EFECE4] hover:bg-[#E5E0D5] text-neutral-800 font-semibold text-xs tracking-wider uppercase transition-colors border border-[#D5CFC2]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
