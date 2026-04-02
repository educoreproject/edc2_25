'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Hierarchy nav — ordered by level in the data model
const HIERARCHY_NAV = [
  { href: '/topics',    label: 'Topics',           dot: 'bg-violet-500' },
  { href: '/drivers',   label: 'Business Drivers', dot: 'bg-indigo-500' },
  { href: '/use-cases', label: 'Use Cases',         dot: 'bg-sky-500' },
  { href: '/standards', label: 'Standards',         dot: 'bg-amber-500' },
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
    <header className="sticky top-0 z-50 glass border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/educore-logo.png" alt="EDUcore" width={28} height={28} className="rounded" />
            <div className="leading-tight">
              <span className="font-bold text-sm text-gray-900">EDUcore</span>
              <span className="text-xs text-gray-400 ml-1.5 hidden sm:inline">Reference Library</span>
            </div>
          </Link>

          {/* Hierarchy nav — primary path through the data model */}
          <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0">
            {/* Hierarchy chain */}
            <div className="flex items-center gap-0.5 mr-3">
              {HIERARCHY_NAV.map(({ href, label, dot }, i) => (
                <span key={href} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <span className="text-gray-300 text-xs mx-0.5 select-none">›</span>
                  )}
                  <Link
                    href={href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive(href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                    {label}
                  </Link>
                </span>
              ))}
            </div>

            {/* Divider */}
            <span className="w-px h-4 bg-gray-200 mx-2 shrink-0" />

            {/* Tools nav */}
            {TOOLS_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive(href)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
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
