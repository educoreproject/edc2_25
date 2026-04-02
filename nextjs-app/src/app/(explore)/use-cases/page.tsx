import Link from 'next/link';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';

export const metadata = {
  title: 'Use Cases | EDUcore Reference Library',
  description: 'Concrete scenarios linking business needs to data standards and ontology elements.',
};

const colorMap: Record<string, { stripe: string; bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  indigo:  { stripe: '#5B3FD3', bg: 'rgba(91,63,211,0.06)',  border: 'rgba(91,63,211,0.25)',  text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.12)',  badgeText: '#5B3FD3' },
  sky:     { stripe: '#00B5B8', bg: 'rgba(0,181,184,0.06)',   border: 'rgba(0,181,184,0.3)',   text: '#007B7D', badgeBg: 'rgba(0,181,184,0.12)',   badgeText: '#007B7D' },
  amber:   { stripe: '#FFAB40', bg: 'rgba(255,171,64,0.06)',  border: 'rgba(255,171,64,0.35)', text: '#B86400', badgeBg: 'rgba(255,171,64,0.15)',  badgeText: '#B86400' },
  emerald: { stripe: '#072A6C', bg: 'rgba(7,42,108,0.05)',    border: 'rgba(7,42,108,0.2)',    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.1)',     badgeText: '#072A6C' },
};

const LEVEL_CHAIN = [
  { label: 'Topics',           color: '#5B3FD3', href: '/topics',    active: false },
  { label: 'Business Drivers', color: '#072A6C', href: '/drivers',   active: false },
  { label: 'Use Cases',        color: '#00B5B8', href: '/use-cases', active: true  },
  { label: 'User Stories',     color: '#0D8F92', href: '/use-cases', active: false },
];

export default function UseCasesPage() {
  const totalUseCases = useCaseTaxonomy.reduce(
    (s, cat) => s + cat.children.reduce((ss, sub) => ss + sub.children.length, 0), 0
  );
  const totalStories = useCaseTaxonomy.reduce(
    (s, cat) => s + cat.children.reduce(
      (ss, sub) => ss + sub.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
    ), 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ color: '#7A8499' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>›</span>
        <Link href="/topics" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#5B3FD3' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#5B3FD3' }} />
          Topics
        </Link>
        <span>›</span>
        <Link href="/drivers" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#072A6C' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#072A6C' }} />
          Business Drivers
        </Link>
        <span>›</span>
        <span className="flex items-center gap-1 font-semibold" style={{ color: '#007B7D' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#00B5B8' }} />
          Use Cases
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,181,184,0.1)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#00B5B8' }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Use Cases</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,181,184,0.12)', color: '#007B7D' }}>
              Level 3
            </span>
            <span className="text-xs" style={{ color: '#7A8499' }}>{totalUseCases} total · {totalStories} with User Stories</span>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#7A8499' }}>
            Concrete scenarios organized by Topic and Business Driver. Each use case links to
            applicable standards, CEDS domains, and individual User Stories.
          </p>
        </div>
      </div>

      {/* Level chain */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {LEVEL_CHAIN.map(({ label, color, href, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span style={{ color: '#C4CBDA' }}>›</span>}
            <Link
              href={href}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition-colors"
              style={active
                ? { background: '#00B5B8', color: '#fff' }
                : { color: '#7A8499' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#fff' : color }} />
              {label}
            </Link>
          </span>
        ))}
      </div>

      {/* Topic → Driver → Use Cases tree */}
      <div className="space-y-8">
        {useCaseTaxonomy.map((topic) => {
          const c = colorMap[topic.color] || colorMap.indigo;
          const topicUseCaseCount = topic.children.reduce((s, sub) => s + sub.children.length, 0);
          const topicStoryCount = topic.children.reduce(
            (s, sub) => s + sub.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
          );

          return (
            <section key={topic.id} className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              {/* Topic header */}
              <Link
                href={`/topics/${topic.id}`}
                className="flex items-center gap-3 px-5 py-4 transition-opacity hover:opacity-90"
                style={{ background: c.bg, borderBottom: `1px solid ${c.border}` }}
              >
                <span className="text-xl">{topic.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: c.text, fontFamily: 'var(--font-display)' }}>{topic.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: c.badgeBg, color: c.badgeText }}>
                      Topic
                    </span>
                    <span className="text-xs" style={{ color: '#7A8499' }}>
                      {topic.children.length} drivers · {topicUseCaseCount} use cases
                      {topicStoryCount > 0 && ` · ${topicStoryCount} user stories`}
                    </span>
                  </div>
                  {topic.subtitle && (
                    <p className="text-xs mt-0.5" style={{ color: '#7A8499' }}>{topic.subtitle}</p>
                  )}
                </div>
                <span className="text-xs font-semibold" style={{ color: c.text, opacity: 0.6 }}>↗ topic</span>
              </Link>

              {/* Business Drivers with Use Cases */}
              <div style={{ background: '#fff' }}>
                {topic.children.map((driver, driverIdx) => {
                  const driverStoryCount = driver.children.filter(
                    uc => 'githubIssue' in uc && uc.githubIssue
                  ).length;

                  return (
                    <div
                      key={driver.id}
                      className="px-5 py-4"
                      style={driverIdx > 0 ? { borderTop: '1px solid #F8F9FC' } : {}}
                    >
                      {/* Driver row */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#072A6C' }} />
                        <span className="text-xs font-bold" style={{ color: '#072A6C' }}>{driver.label}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'rgba(7,42,108,0.08)', color: '#072A6C' }}>
                          Business Driver
                        </span>
                        {driverStoryCount > 0 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(13,143,146,0.1)', color: '#0D6B6E' }}>
                            {driverStoryCount} user stor{driverStoryCount !== 1 ? 'ies' : 'y'}
                          </span>
                        )}
                      </div>

                      {/* Use Case cards */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                        {driver.children.map((uc) => {
                          const hasStory = 'githubIssue' in uc && uc.githubIssue;
                          return (
                            <Link
                              key={uc.id}
                              href={`/use-cases/${uc.id}`}
                              className="group flex items-start gap-2 rounded-lg px-3 py-2.5 transition-all"
                              style={{ border: '1px solid #EEF1F7', background: '#F8F9FC' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#00B5B8' }} />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs leading-snug block" style={{ color: '#7A8499' }}>
                                  {uc.label}
                                </span>
                                {hasStory && (
                                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: '#0D6B6E', background: 'rgba(13,143,146,0.1)', border: '1px solid rgba(13,143,146,0.2)' }}>
                                    <span className="w-1 h-1 rounded-full" style={{ background: '#0D8F92' }} />
                                    #{(uc as { githubIssue: number }).githubIssue}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
