import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F6F3EC] text-[#242424] px-6 py-24">
      <div className="text-center max-w-md space-y-6">
        <span className="text-[10px] tracking-[0.28em] font-semibold text-[#B69B63] uppercase block">
          404 • Page Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-neutral-900">
          The requested experience is unavailable.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          The dining page or resource you are seeking may have moved or been updated within our restaurant portfolio.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] hover:bg-[#B69B63] text-white hover:text-black font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
