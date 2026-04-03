import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getUseCaseById,
  getStandardsForUseCase,
  getDomainLabel,
} from '@/lib/data/resolvers';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import MetadataBadge from '@/components/MetadataBadge';

function getSiblingUserStories(useCaseId: string, subcategoryId: string, categoryId: string) {
  for (const cat of useCaseTaxonomy) {
    if (cat.id !== categoryId) continue;
    for (const sub of cat.children) {
      if (sub.id !== subcategoryId) continue;
      return sub.children.filter(
        uc => 'githubIssue' in uc && uc.githubIssue && uc.id !== useCaseId
      );
    }
  }
  return [];
}

function getOwnGithubIssue(useCaseId: string): number | null {
  for (const cat of useCaseTaxonomy) {
    for (const sub of cat.children) {
      for (const uc of sub.children) {
        if (uc.id === useCaseId && 'githubIssue' in uc && uc.githubIssue) {
          return (uc as { githubIssue: number }).githubIssue;
        }
      }
    }
  }
  return null;
}

function getOwnTags(useCaseId: string): string[] {
  for (const cat of useCaseTaxonomy) {
    for (const sub of cat.children) {
      for (const uc of sub.children) {
        if (uc.id === useCaseId && 'tags' in uc) {
          return (uc as { tags: string[] }).tags;
        }
      }
    }
  }
  return [];
}

function alignmentPercent(fullCount: number, partialCount: number, totalDomains: number): number {
  if (totalDomains === 0) return 0;
  return Math.round(((fullCount + partialCount * 0.5) / totalDomains) * 100);
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ useCaseId: string }>;
}) {
  const { useCaseId } = await params;
  const useCase = getUseCaseById(useCaseId);
  if (!useCase) notFound();

  const standards = getStandardsForUseCase(useCaseId);
  const siblingStories = getSiblingUserStories(useCaseId, useCase.subcategoryId, useCase.categoryId);
  const ownIssue = getOwnGithubIssue(useCaseId);
  const tags = getOwnTags(useCaseId);

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 animate-fade-up">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-8 flex-wrap" style={{ color: '#B0B8C9' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>&gt;</span>
        <Link href="/topics" className="hover:underline">Topics</Link>
        <span>&gt;</span>
        <Link href={`/topics/${useCase.categoryId}`} className="hover:underline">{useCase.categoryLabel}</Link>
        <span>&gt;</span>
        <Link href="/use-cases" className="hover:underline">Use Cases</Link>
        <span>&gt;</span>
        <span className="font-semibold" style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</span>
      </nav>

      {/* ═══ Hero Card ═══ */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#F4F5F8' }}>
        <div className="p-8 sm:p-10 flex items-start gap-8">
          <div className="flex-1 min-w-0">
            {/* Category pill */}
            <span
              className="inline-block text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-5"
              style={{ background: 'rgba(91,63,211,0.1)', color: '#5B3FD3' }}
            >
              Systematic Framework
            </span>

            <h1 className="text-3xl font-bold leading-tight mb-4" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
              {useCase.label}
            </h1>

            <p className="text-[15px] leading-relaxed mb-8 max-w-lg" style={{ color: '#6B7589' }}>
              Our systematic use case under <strong style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</strong>{' '}
              ensures that digital credentials are interoperable, verifiable across disparate systems,
              and fully linked to stakeholder needs.
            </p>

            {/* Buttons row */}
            <div className="flex items-center gap-4 flex-wrap">
              {ownIssue ? (
                <a
                  href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: '#072A6C', color: '#fff' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  View on GitHub
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-3 rounded-xl"
                  style={{ background: '#072A6C', color: '#fff', opacity: 0.5 }}
                >
                  No GitHub Issue
                </span>
              )}
              <Link
                href="/standards"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: '#5B3FD3' }}
              >
                Documentation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(7,42,108,0.06)', color: '#6B7589' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hero image placeholder */}
          <div
            className="hidden sm:flex w-44 h-32 rounded-xl shrink-0 items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #072A6C 0%, #0a3a8f 50%, #00B5B8 100%)',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </div>

      {/* ═══ Actor + Stakeholders Row ═══ */}
      <div className="grid sm:grid-cols-[1fr_1.2fr] gap-6 mb-12">

        {/* Primary Actor card */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(91,63,211,0.08)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B3FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold" style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#8892A8' }}>
            The central authority responsible for initiating and managing use cases in this domain.
          </p>
          {/* Avatar pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: '#F4F5F8' }}
          >
            <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #5B3FD3, #7C5CFC)' }} />
            <span className="text-xs font-medium" style={{ color: '#6B7589' }}>{useCase.categoryLabel}</span>
          </div>
        </div>

        {/* Ecosystem Stakeholders */}
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: '#B0B8C9' }}>
            CEDS Domains
          </div>
          <div className="grid grid-cols-3 gap-3">
            {useCase.cedsDomains.slice(0, 6).map(domainId => (
              <div
                key={domainId}
                className="rounded-xl p-4 text-center"
                style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
              >
                <div className="w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-2.5" style={{ background: 'rgba(0,181,184,0.08)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: '#072A6C' }}>
                  {getDomainLabel(domainId)}
                </div>
                <p className="text-[10px] leading-snug" style={{ color: '#B0B8C9' }}>
                  Data domain mapped to this use case.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Related User Stories ═══ */}
      {siblingStories.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
              Related User Stories
            </h2>
            <span className="text-xs font-medium" style={{ color: '#B0B8C9' }}>
              {siblingStories.length} found
            </span>
          </div>
          <div className="space-y-2">
            {siblingStories.map(s => (
              <Link
                key={s.id}
                href={`/use-cases/${s.id}`}
                className="flex items-center justify-between rounded-xl px-5 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-brand-hover"
                style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
              >
                <span className="text-sm font-medium" style={{ color: '#4B5563' }}>{s.label}</span>
                <span className="text-xs font-mono shrink-0 ml-3" style={{ color: '#B0B8C9' }}>
                  #{(s as unknown as { githubIssue: number }).githubIssue}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Aligned Standards ═══ */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
            Aligned Standards
          </h2>
          <Link
            href="/standards"
            className="text-xs font-semibold uppercase tracking-wider transition-colors hover:underline"
            style={{ color: '#5B3FD3' }}
          >
            View All Specs
          </Link>
        </div>
        <p className="text-sm mb-6" style={{ color: '#8892A8' }}>
          Standards ensuring interoperability across the EDUcore ecosystem.
        </p>

        {standards.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {standards.map((scored, index) => {
              const totalDomains = useCase.cedsDomains.length;
              const pct = alignmentPercent(scored.fullCount, scored.partialCount, totalDomains);

              return (
                <Link
                  key={scored.entry.id}
                  href={`/standards/${scored.entry.id}`}
                  className="group block rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-brand-hover relative overflow-hidden"
                  style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
                >
                  {/* External link icon */}
                  <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#072A6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>

                  {/* Large faded number */}
                  <div
                    className="text-5xl font-bold leading-none mb-4"
                    style={{ color: '#072A6C', fontFamily: 'var(--font-display)', opacity: 0.07 }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold leading-snug mb-3" style={{ color: '#072A6C' }}>
                    {scored.entry.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {scored.matchedDomains.slice(0, 2).map(md => (
                      <span
                        key={md.domain}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                        style={md.status === 'full'
                          ? { background: 'rgba(5,150,105,0.07)', color: '#059669' }
                          : { background: 'rgba(255,171,64,0.08)', color: '#B86400' }
                        }
                      >
                        {getDomainLabel(md.domain)}
                      </span>
                    ))}
                    <MetadataBadge kind="burden" value={scored.entry.implementationBurden} />
                  </div>

                  {/* Integration Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#B0B8C9' }}>
                        Integration Progress
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: '#072A6C' }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(7,42,108,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 80 ? '#059669' : pct >= 50 ? '#5B3FD3' : '#B0B8C9',
                          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
            <p className="text-sm" style={{ color: '#8892A8' }}>No standards mapped to this use case yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
