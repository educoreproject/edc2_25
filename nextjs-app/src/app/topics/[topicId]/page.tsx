import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCaseTaxonomy, useCaseCedsDomains } from '@/lib/data/use-case-taxonomy';
import { getStandardsForDomains, getDomainLabel, getDomainIcon } from '@/lib/data/resolvers';

const colorMap: Record<string, {
  stripe: string; bg: string; border: string; text: string;
  badgeBg: string; badgeText: string;
}> = {
  indigo:  { stripe: '#5B3FD3', bg: 'rgba(91,63,211,0.06)',  border: 'rgba(91,63,211,0.25)',  text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.12)',  badgeText: '#5B3FD3' },
  sky:     { stripe: '#00B5B8', bg: 'rgba(0,181,184,0.06)',   border: 'rgba(0,181,184,0.3)',   text: '#007B7D', badgeBg: 'rgba(0,181,184,0.12)',   badgeText: '#007B7D' },
  amber:   { stripe: '#FFAB40', bg: 'rgba(255,171,64,0.06)',  border: 'rgba(255,171,64,0.35)', text: '#B86400', badgeBg: 'rgba(255,171,64,0.15)',  badgeText: '#B86400' },
  emerald: { stripe: '#072A6C', bg: 'rgba(7,42,108,0.05)',    border: 'rgba(7,42,108,0.2)',    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.1)',     badgeText: '#072A6C' },
};

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = useCaseTaxonomy.find(t => t.id === topicId);
  if (!topic) notFound();

  const c = colorMap[topic.color] || colorMap.indigo;

  const allDomains = new Set<string>();
  for (const driver of topic.children) {
    for (const uc of driver.children) {
      const domains = useCaseCedsDomains[uc.id] || [];
      domains.forEach(d => allDomains.add(d));
    }
  }

  const relevantStandards = getStandardsForDomains([...allDomains]).slice(0, 5);

  const totalUseCases = topic.children.reduce((s, d) => s + d.children.length, 0);
  const totalStories = topic.children.reduce(
    (s, d) => s + d.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: '#7A8499' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>›</span>
        <Link href="/topics" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#5B3FD3' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#5B3FD3' }} />
          Topics
        </Link>
        <span>›</span>
        <span className="font-semibold" style={{ color: c.text }}>{topic.label}</span>
      </div>

      {/* Topic header */}
      <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
        <div className="h-1.5" style={{ background: c.stripe }} />
        <div className="px-6 py-5" style={{ background: c.bg }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: '#fff', border: `1.5px solid ${c.border}` }}>
              {topic.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl font-bold" style={{ color: c.text, fontFamily: 'var(--font-display)' }}>{topic.label}</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: c.badgeBg, color: c.badgeText }}>
                  Level 1 — Topic
                </span>
              </div>
              {topic.subtitle && (
                <p className="text-sm mb-3" style={{ color: '#7A8499' }}>{topic.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: c.badgeBg, color: c.badgeText }}>
                  {topic.children.length} business driver{topic.children.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,181,184,0.12)', color: '#007B7D' }}>
                  {totalUseCases} use cases
                </span>
                {totalStories > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(13,143,146,0.1)', color: '#0D6B6E' }}>
                    {totalStories} user stor{totalStories !== 1 ? 'ies' : 'y'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">

        {/* Main: Business Drivers with Use Cases */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#C4CBDA' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#072A6C' }} />
            Business Drivers
            <span style={{ color: '#C4CBDA', fontWeight: 400 }}>— Level 2</span>
          </p>

          <div className="space-y-5">
            {topic.children.map((driver) => {
              const storyCount = driver.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length;
              return (
                <div
                  key={driver.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}
                >
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #EEF1F7' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: '#072A6C' }} />
                      <h3 className="text-sm font-bold" style={{ color: '#072A6C' }}>{driver.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,181,184,0.1)', color: '#007B7D' }}>
                        {driver.children.length} use case{driver.children.length !== 1 ? 's' : ''}
                      </span>
                      {storyCount > 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(13,143,146,0.1)', color: '#0D6B6E' }}>
                          {storyCount} user stor{storyCount !== 1 ? 'ies' : 'y'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 grid sm:grid-cols-2 gap-2">
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
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: '#0D6B6E', background: 'rgba(13,143,146,0.1)', border: '1px solid rgba(13,143,146,0.2)' }}>
                                <span className="w-1 h-1 rounded-full" style={{ background: '#0D8F92' }} />
                                User Story #{(uc as { githubIssue: number }).githubIssue}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {allDomains.size > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,181,184,0.35)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#00B5B8' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.6)' }} />
                <span className="text-xs font-bold uppercase tracking-wide text-white">CEDS Domains</span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ background: 'rgba(0,181,184,0.06)' }}>
                {[...allDomains].map(d => (
                  <span
                    key={d}
                    className="text-xs px-2 py-0.5 rounded-md font-semibold"
                    style={{ background: '#fff', border: '1px solid rgba(0,181,184,0.3)', color: '#007B7D' }}
                  >
                    {getDomainIcon(d)} {getDomainLabel(d)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {relevantStandards.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(255,171,64,0.4)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#FFAB40' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.6)' }} />
                <span className="text-xs font-bold uppercase tracking-wide text-white">Relevant Standards</span>
              </div>
              <div className="px-3 py-3 space-y-1.5" style={{ background: 'rgba(255,171,64,0.06)' }}>
                {relevantStandards.map(s => (
                  <Link
                    key={s.entry.id}
                    href={`/standards/${s.entry.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors group"
                    style={{ background: '#fff', border: '1px solid rgba(255,171,64,0.35)' }}
                  >
                    <span className="text-xs font-semibold leading-snug" style={{ color: '#072A6C' }}>
                      {s.entry.title}
                    </span>
                    <span className="ml-2 shrink-0 font-bold" style={{ color: '#FFAB40' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl p-4" style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C4CBDA' }}>Navigate</p>
            <div className="space-y-2">
              <Link href="/drivers" className="flex items-center gap-2 text-xs font-semibold transition-colors hover:underline" style={{ color: '#072A6C' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#072A6C' }} />
                All Business Drivers
              </Link>
              <Link href="/use-cases" className="flex items-center gap-2 text-xs font-semibold transition-colors hover:underline" style={{ color: '#007B7D' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00B5B8' }} />
                All Use Cases
              </Link>
              <Link href="/standards" className="flex items-center gap-2 text-xs font-semibold transition-colors hover:underline" style={{ color: '#B86400' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#FFAB40' }} />
                Standards Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
