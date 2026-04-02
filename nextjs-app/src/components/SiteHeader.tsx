'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const HIERARCHY_NAV = [
  { href: '/topics',    label: 'Topics',           dot: '#5B3FD3' },
  { href: '/drivers',   label: 'Drivers',          dot: '#072A6C' },
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
    <header
      className="sticky top-0 z-50 glass"
      style={{
        background: 'rgba(7,42,108,0.97)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <Image
              src="/educore-logo.png"
              alt="EDUcore"
              width={28}
              height={28}
              className="rounded transition-transform group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className="font-semibold text-sm text-white tracking-tight">EDUcore</span>
              <span className="text-[11px] ml-1.5 hidden sm:inline font-medium" style={{ color: 'rgba(0,181,184,0.9)' }}>
                Reference Library
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0">
            {/* Hierarchy chain */}
            <div className="flex items-center gap-0.5 mr-3">
              {HIERARCHY_NAV.map(({ href, label, dot }, i) => (
                <span key={href} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <span className="text-[10px] mx-0.5 select-none" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                  )}
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap"
                    style={
                      isActive(href)
                        ? {
                            background: 'rgba(0,181,184,0.15)',
                            color: '#5EEAED',
                            boxShadow: 'inset 0 -2px 0 #00B5B8',
                          }
                        : { color: 'rgba(255,255,255,0.55)' }
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${isActive(href) ? 'pulse-dot' : ''}`}
                      style={{ background: isActive(href) ? dot : 'rgba(255,255,255,0.25)' }}
                    />
                    {label}
                  </Link>
                </span>
              ))}
            </div>

            {/* Divider */}
            <span className="w-px h-4 mx-2 shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Tools nav */}
            {TOOLS_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap"
                style={
                  isActive(href)
                    ? { color: '#5EEAED', background: 'rgba(0,181,184,0.12)' }
                    : { color: 'rgba(255,255,255,0.45)' }
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
