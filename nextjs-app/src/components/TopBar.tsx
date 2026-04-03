'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAB_NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/ontology', label: 'Ontology Map' },
  { href: '/explorer', label: 'Data Model Explorer' },
];

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center justify-between h-12 px-6 border-b shrink-0"
      style={{ background: '#fff', borderColor: 'rgba(7,42,108,0.06)' }}
    >
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {TAB_NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-[13px] font-medium rounded-md transition-all"
              style={
                active
                  ? { color: '#072A6C', background: 'rgba(7,42,108,0.05)' }
                  : { color: '#B0B8C9' }
              }
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px]"
          style={{ background: '#F4F5F8', color: '#B0B8C9' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="hidden sm:inline">Search resources...</span>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ color: '#B0B8C9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #5B3FD3, #7C5CFC)', color: '#fff' }}
        >
          U
        </div>
      </div>
    </div>
  );
}
