'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const HIERARCHY_NAV = [
  { href: '/topics',    label: 'Topics',           dot: '#5B3FD3' },
  { href: '/drivers',   label: 'Business Drivers', dot: '#072A6C' },
  { href: '/use-cases', label: 'Use Cases',         dot: '#00B5B8' },
  { href: '/standards', label: 'Standards',         dot: '#FFAB40' },
];

const TOOLS_NAV = [
  { href: '/alignment', label: 'Alignment' },
  { href: '/crosswalk', label: 'Crosswalk' },
  { href: '/ontology',  label: 'Ontology' },
  { href: '/explorer',  label: 'AI Explorer' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: '#072A6C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/educore-logo.png" alt="EDUcore" width={28} height={28} className="rounded" />
            <div className="leading-tight">
              <span className="font-bold text-sm text-white">EDUcore</span>
              <span className="text-xs ml-1.5 hidden sm:inline" style={{ color: '#00B5B8' }}>Reference Library</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0">
            {/* Hierarchy chain */}
            <div className="flex items-center gap-0.5 mr-3">
              {HIERARCHY_NAV.map(({ href, label, dot }, i) => (
                <span key={href} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <span className="text-xs mx-0.5 select-none" style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
                  )}
                  <Link
                    href={href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      isActive(href)
                        ? 'text-white'
                        : 'hover:text-white'
                    }`}
                    style={
                      isActive(href)
                        ? { background: 'rgba(0,181,184,0.2)', color: '#00B5B8', borderBottom: '2px solid #00B5B8' }
                        : { color: 'rgba(255,255,255,0.65)' }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: isActive(href) ? dot : 'rgba(255,255,255,0.35)' }}
                    />
                    {label}
                  </Link>
                </span>
              ))}
            </div>

            {/* Divider */}
            <span className="w-px h-4 mx-2 shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />

            {/* Tools nav */}
            {TOOLS_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                style={
                  isActive(href)
                    ? { color: '#00B5B8', background: 'rgba(0,181,184,0.12)' }
                    : { color: 'rgba(255,255,255,0.5)' }
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
