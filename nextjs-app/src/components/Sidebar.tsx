'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const MAIN_NAV = [
  {
    href: '/topics',
    label: 'Library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: '/use-cases',
    label: 'Use Cases',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/standards',
    label: 'Standards',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: '/drivers',
    label: 'Drivers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const TOOLS_NAV = [
  {
    href: '/alignment',
    label: 'Alignment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    href: '/crosswalk',
    label: 'Crosswalk',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    href: '/ontology',
    label: 'Ontology',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
      </svg>
    ),
  },
  {
    href: '/explorer',
    label: 'AI Explorer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] shrink-0 h-screen sticky top-0 border-r"
      style={{ background: '#FAFBFD', borderColor: 'rgba(7,42,108,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <Image src="/educore-logo.png" alt="EDUcore" width={28} height={28} className="rounded" />
        <div className="leading-tight">
          <span className="font-bold text-sm" style={{ color: '#072A6C' }}>EDUcore</span>
          <span className="text-[10px] ml-1 font-medium" style={{ color: '#00B5B8' }}>LER</span>
        </div>
      </div>

      {/* User context */}
      <div className="px-5 mb-5">
        <div className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: '#B0B8C9' }}>
          Reference Library
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <div className="text-[10px] uppercase tracking-wider font-semibold px-2 mb-2" style={{ color: '#B0B8C9' }}>
          Explore
        </div>
        {MAIN_NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
            style={
              isActive(href)
                ? { background: 'rgba(91,63,211,0.08)', color: '#5B3FD3' }
                : { color: '#6B7589' }
            }
          >
            <span style={{ color: isActive(href) ? '#5B3FD3' : '#B0B8C9' }}>{icon}</span>
            {label}
          </Link>
        ))}

        <div className="h-px my-3" style={{ background: 'rgba(7,42,108,0.05)' }} />

        <div className="text-[10px] uppercase tracking-wider font-semibold px-2 mb-2" style={{ color: '#B0B8C9' }}>
          Tools
        </div>
        {TOOLS_NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
            style={
              isActive(href)
                ? { background: 'rgba(91,63,211,0.08)', color: '#5B3FD3' }
                : { color: '#6B7589' }
            }
          >
            <span style={{ color: isActive(href) ? '#5B3FD3' : '#B0B8C9' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        <div className="h-px mb-3" style={{ background: 'rgba(7,42,108,0.05)' }} />
        <Link
          href="/explorer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
          style={{ color: '#6B7589' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B0B8C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Support
        </Link>
      </div>
    </aside>
  );
}
