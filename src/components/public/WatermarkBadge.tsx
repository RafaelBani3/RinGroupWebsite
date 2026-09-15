'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function WatermarkBadge() {
  const pathname = usePathname();

  // Do not show on admin or login screens
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <aside
      aria-label="Developer Attribution"
      className="fixed bottom-4 right-4 z-40 pointer-events-auto select-none"
    >
      <div className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717]/85 hover:bg-[#121212] text-neutral-300 hover:text-white backdrop-blur-md border border-[#B69B63]/40 hover:border-[#B69B63] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_6px_25px_rgba(182,155,99,0.35)] hover:-translate-y-0.5 text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B69B63] animate-pulse" />
        <span className="font-light text-neutral-400">Created by</span>
        <span className="font-semibold text-[#B69B63] tracking-wide">RafaelBani</span>
      </div>
    </aside>
  );
}
