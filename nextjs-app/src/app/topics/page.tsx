import Link from 'next/link';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';

export const metadata = {
  title: 'Topics | EDUcore Reference Library',
  description: 'High-level subject areas organizing use cases, business drivers, and standards.',
};

// Map topic color keys to brand palette
const colorMap: Record<string, { stripe: string; bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  indigo:  { stripe: '#5B3FD3', bg: 'rgba(91,63,211,0.06)',   border: 'rgba(91,63,211,0.25)',  text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.12)',  badgeText: '#5B3FD3' },
  sky:     { stripe: '#00B5B8', bg: 'rgba(0,181,184,0.06)',    border: 'rgba(0,181,184,0.3)',   text: '#007B7D', badgeBg: 'rgba(0,181,184,0.12)',   badgeText: '#007B7D' },
  amber:   { stripe: '#FFAB40', bg: 'rgba(255,171,64,0.06)',   border: 'rgba(255,171,64,0.35)', text: '#B86400', badgeBg: 'rgba(255,171,64,0.15)',  badgeText: '#B86400' },
  emerald: { stripe: '#072A6C', bg: 'rgba(7,42,108,0.05)',     border: 'rgba(7,42,108,0.2)',    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.1)',     badgeText: '#072A6C' },
};

const LEVEL_CHAIN = [
  { label: 'Topics',           color: '#5B3FD3', active: true },
  { label: 'Business Drivers', color: '#072A6C', active: false },
  { label: 'Use Cases',        color: '#00B5B8', active: false },
  { label: 'User Stories',     color: '#0D8F92', active: false },
];

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: '#7A8499' }}>
        <Link href="/" className="hover:underline transition-colors">Home</Link>
        <span>›</span>
        <span className="flex items-center gap-1 font-semibold" style={{ color: '#5B3FD3' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#5B3FD3' }} />
          Topics
        </span>
      </div>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(91,63,211,0.12)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#5B3FD3' }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Topics</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,63,211,0.12)', color: '#5B3FD3' }}>
              Level 1
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#7A8499' }}>
            High-level subject areas that organize the entire knowledge base. Each topic contains
            Business Drivers which map to Use Cases and, ultimately, to standards and ontology elements.
          </p>
        </div>
      </div>

      {/* Level chain */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {LEVEL_CHAIN.map(({ label, color, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span style={{ color: '#C4CBDA' }}>›</span>}
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold"
              style={active
                ? { background: '#5B3FD3', color: '#fff' }
                : { color: '#7A8499' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#fff' : color }} />
              {label}
            </span>
          </span>
        ))}
      </div>

      {/* Topic cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {useCaseTaxonomy.map((topic) => {
          const c = colorMap[topic.color] || colorMap.indigo;
          const driverCount = topic.children.length;
          const useCaseCount = topic.children.reduce((s, sub) => s + sub.children.length, 0);
          const storyCount = topic.children.reduce(
            (s, sub) => s + sub.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
          );

          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="group flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-brand-hover"
              style={{ background: '#fff', border: `1.5px solid ${c.border}`, boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}
            >
              {/* Top color stripe */}
              <div className="h-1.5" style={{ background: c.stripe }} />

              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  >
                    {topic.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-bold leading-tight" style={{ color: c.text, fontFamily: 'var(--font-display)' }}>
                      {topic.label}
                    </h2>
                    {topic.subtitle && (
                      <p className="text-xs mt-0.5 leading-snug" style={{ color: '#7A8499' }}>
                        {topic.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Counts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: c.badgeBg, color: c.badgeText }}>
                    {driverCount} business driver{driverCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,181,184,0.1)', color: '#007B7D' }}>
                    {useCaseCount} use case{useCaseCount !== 1 ? 's' : ''}
                  </span>
                  {storyCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(13,143,146,0.1)', color: '#0D6B6E' }}>
                      {storyCount} user stor{storyCount !== 1 ? 'ies' : 'y'}
                    </span>
                  )}
                </div>

                {/* Business drivers */}
                <div className="mt-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7A8499' }}>
                    Business Drivers
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.children.map((driver) => (
                      <span
                        key={driver.id}
                        className="text-xs px-2 py-0.5 rounded-md font-medium"
                        style={{ background: '#F8F9FC', border: '1px solid #EEF1F7', color: '#7A8499' }}
                      >
                        {driver.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="px-6 py-3 flex items-center justify-between border-t"
                style={{ background: c.bg, borderColor: c.border }}
              >
                <span className="text-xs font-bold" style={{ color: c.text }}>Explore topic</span>
                <span className="font-bold text-sm transition-transform group-hover:translate-x-0.5" style={{ color: c.stripe }}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
