'use client';

import Link from 'next/link';

/*
 * Ecosystem Map — a visual grid inspired by the sector × driver matrix.
 * Each column is a sector; cells within it are clickable driver cards.
 * Data is hand-curated to match the reference graphic's layout while
 * linking into the existing stakeholder taxonomy routes.
 */

type Cell = {
  label: string;
  href: string;
};

type Column = {
  title: string;
  color: string;       // header gradient start
  colorEnd: string;    // header gradient end
  bg: string;          // column background
  cells: Cell[];
};

const COLUMNS: Column[] = [
  {
    title: 'Education',
    color: '#FDE68A', colorEnd: '#FEF3C7', bg: 'rgba(253,230,138,0.12)',
    cells: [
      { label: 'Adult Education', href: '/drivers/education-institutions' },
      { label: 'Workforce Training', href: '/drivers/education-institutions' },
      { label: 'Postsecondary', href: '/drivers/education-institutions' },
      { label: 'K\u201312', href: '/drivers/education-institutions' },
      { label: 'Pre-K', href: '/drivers/education-institutions' },
    ],
  },
  {
    title: 'Education Technology Vendors',
    color: '#D9F99D', colorEnd: '#ECFCCB', bg: 'rgba(217,249,157,0.12)',
    cells: [
      { label: 'EdTech Vendors', href: '/drivers/technology-providers' },
      { label: 'LMS & SIS Providers', href: '/drivers/technology-providers' },
      { label: 'Credentialing & Wallet Platforms', href: '/drivers/technology-providers' },
    ],
  },
  {
    title: 'Military',
    color: '#FED7AA', colorEnd: '#FFEDD5', bg: 'rgba(254,215,170,0.10)',
    cells: [
      { label: 'Transition to Civilian Life', href: '/use-cases/military-skill-translation' },
      { label: 'ELD / TLD', href: '/use-cases/military-skill-translation' },
      { label: 'KSATs', href: '/use-cases/military-skill-translation' },
    ],
  },
  {
    title: 'Workforce',
    color: '#FECACA', colorEnd: '#FEE2E2', bg: 'rgba(254,202,202,0.10)',
    cells: [
      { label: 'Fed & State Compliance Reporting', href: '/use-cases/edfacts-general' },
      { label: 'Position & Skills Matching', href: '/use-cases/passive-candidate-discovery' },
      { label: 'Payroll & Taxes', href: '/drivers/workforce-employers' },
    ],
  },
  {
    title: 'Government',
    color: '#C7D2FE', colorEnd: '#E0E7FF', bg: 'rgba(199,210,254,0.12)',
    cells: [
      { label: 'Fed & State Compliance Reporting', href: '/use-cases/edfacts-general' },
      { label: 'Regulations & Policy', href: '/drivers/government-policy' },
      { label: 'Support to States & Local', href: '/drivers/government-policy' },
    ],
  },
  {
    title: 'Health',
    color: '#E9D5FF', colorEnd: '#F3E8FF', bg: 'rgba(233,213,255,0.10)',
    cells: [
      { label: 'Clinical Data & Med Portals', href: '/topics/health-care' },
      { label: 'Continuing Ed & Certifications', href: '/use-cases/stackable-credentials' },
      { label: 'Workforce Training & Development', href: '/use-cases/workforce-training' },
      { label: 'Child Health (Vaccines & Allergies)', href: '/topics/health-care' },
    ],
  },
  {
    title: 'Learning & Employment Records',
    color: '#A5F3FC', colorEnd: '#CFFAFE', bg: 'rgba(165,243,252,0.10)',
    cells: [
      { label: 'Wallets', href: '/use-cases/digital-wallet-storage' },
      { label: 'Employment Records', href: '/use-cases/employer-skill-recognition' },
      { label: 'Learning Records', href: '/use-cases/ler-issuing-general' },
    ],
  },
  {
    title: 'Big Tech / Hyperscalers',
    color: '#DDD6FE', colorEnd: '#EDE9FE', bg: 'rgba(221,214,254,0.10)',
    cells: [
      { label: 'Wallets', href: '/use-cases/digital-wallets-vc' },
      { label: 'Employment Records', href: '/use-cases/resume-to-ler' },
      { label: 'Learning Records', href: '/use-cases/ler-issuing-general' },
    ],
  },
];

export default function EcosystemMap() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex min-w-full" style={{ gap: 0 }}>
        {/* Row label */}
        <div className="shrink-0 flex flex-col justify-center pr-3" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          <span
            className="text-xs font-bold uppercase tracking-widest rotate-180"
            style={{ color: '#072A6C', letterSpacing: '0.15em' }}
          >
            Ecosystem Map
          </span>
        </div>

        {/* Columns */}
        <div className="flex gap-1.5 flex-1">
          {COLUMNS.map((col) => (
            <div
              key={col.title}
              className="flex-1 min-w-[130px] flex flex-col rounded-xl overflow-hidden"
              style={{ background: col.bg, border: '1px solid rgba(7,42,108,0.05)' }}
            >
              {/* Header */}
              <div
                className="px-2.5 py-3 text-center"
                style={{ background: `linear-gradient(180deg, ${col.color}, ${col.colorEnd})` }}
              >
                <span
                  className="text-[11px] font-bold leading-tight block"
                  style={{ color: '#1E293B' }}
                >
                  {col.title}
                </span>
              </div>

              {/* Cells */}
              <div className="flex-1 flex flex-col gap-1.5 p-1.5">
                {col.cells.map((cell) => (
                  <Link
                    key={cell.label}
                    href={cell.href}
                    className="group flex items-center justify-center text-center rounded-lg px-2 py-2.5 text-[11px] leading-tight font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: '#fff',
                      color: '#374151',
                      border: '1px solid rgba(7,42,108,0.06)',
                      minHeight: 42,
                    }}
                  >
                    <span className="group-hover:text-[#072A6C] transition-colors">
                      {cell.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
