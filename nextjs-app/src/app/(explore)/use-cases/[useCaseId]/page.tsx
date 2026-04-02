import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getUseCaseById,
  getStandardsForUseCase,
  getDomainLabel,
  getDomainIcon,
} from '@/lib/data/resolvers';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import MetadataBadge from '@/components/MetadataBadge';

const categoryColorMap: Record<string, { stripe: string; bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  indigo:  { stripe: '#5B3FD3', bg: 'rgba(91,63,211,0.06)',  border: 'rgba(91,63,211,0.25)',  text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.12)',  badgeText: '#5B3FD3' },
  sky:     { stripe: '#00B5B8', bg: 'rgba(0,181,184,0.06)',   border: 'rgba(0,181,184,0.3)',   text: '#007B7D', badgeBg: 'rgba(0,181,184,0.12)',   badgeText: '#007B7D' },
  amber:   { stripe: '#FFAB40', bg: 'rgba(255,171,64,0.06)',  border: 'rgba(255,171,64,0.35)', text: '#B86400', badgeBg: 'rgba(255,171,64,0.15)',  badgeText: '#B86400' },
  emerald: { stripe: '#072A6C', bg: 'rgba(7,42,108,0.05)',    border: 'rgba(7,42,108,0.2)',    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.1)',     badgeText: '#072A6C' },
};

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

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ useCaseId: string }>;
}) {
  const { useCaseId } = await params;
  const useCase = getUseCaseById(useCaseId);
  if (!useCase) notFound();

  const standards = getStandardsForUseCase(useCaseId);
  const c = categoryColorMap[useCase.categoryColor] || categoryColorMap.indigo;
  const siblingStories = getSiblingUserStories(useCaseId, useCase.subcategoryId, useCase.categoryId);
  const ownIssue = getOwnGithubIssue(useCaseId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Full hierarchy breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ color: '#7A8499' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>›</span>
        <Link href="/topics" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#5B3FD3' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#5B3FD3' }} />
          Topics
        </Link>
        <span>›</span>
        <Link href={`/topics/${useCase.categoryId}`} className="hover:underline font-semibold flex items-center gap-1" style={{ color: c.text }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.stripe }} />
          {useCase.categoryLabel}
        </Link>
        <span>›</span>
        <Link href="/use-cases" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#007B7D' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#00B5B8' }} />
          Use Cases
        </Link>
        <span>›</span>
        <span className="font-semibold truncate max-w-[200px]" style={{ color: '#072A6C' }}>{useCase.label}</span>
      </div>

      {/* Use Case header card */}
      <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1.5px solid rgba(0,181,184,0.35)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
        <div className="h-1.5" style={{ background: '#00B5B8' }} />
        <div className="px-6 py-5" style={{ background: 'rgba(0,181,184,0.05)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: c.badgeBg, color: c.badgeText, border: `1px solid ${c.border}` }}>
                  {useCase.categoryIcon} {useCase.categoryLabel}
                </span>
                <span style={{ color: '#C4CBDA' }}>›</span>
                <span className="text-xs" style={{ color: '#7A8499' }}>{useCase.subcategoryLabel}</span>
              </div>

              <h1 className="text-xl font-bold mb-1" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>{useCase.label}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,181,184,0.12)', color: '#007B7D' }}>
                  Level 3 — Use Case
                </span>
                {ownIssue && (
                  <a
                    href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full transition-colors hover:opacity-80"
                    style={{ color: '#0D6B6E', background: 'rgba(13,143,146,0.1)', border: '1px solid rgba(13,143,146,0.3)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0D8F92' }} />
                    User Story #{ownIssue}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">

        {/* Main column */}
        <div className="space-y-8">

          {/* User Stories section */}
          {(ownIssue || siblingStories.length > 0) && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#C4CBDA' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#0D8F92' }} />
                User Stories
                <span style={{ fontWeight: 400 }}>— Level 4</span>
              </p>

              <div className="space-y-3">
                {ownIssue && (
                  <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(13,143,146,0.3)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
                    <div className="h-1" style={{ background: '#0D8F92' }} />
                    <div className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#0D6B6E', background: 'rgba(13,143,146,0.1)', border: '1px solid rgba(13,143,146,0.25)' }}>
                              This use case is a User Story
                            </span>
                            <span className="text-xs font-mono" style={{ color: '#C4CBDA' }}>
                              #{ownIssue}
                            </span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: '#072A6C' }}>
                            {useCase.label}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#7A8499' }}>
                            Actor: stakeholder in <em>{useCase.subcategoryLabel}</em>
                          </p>
                          <div className="mt-2 text-xs italic leading-relaxed" style={{ color: '#7A8499' }}>
                            &ldquo;As a stakeholder with a need in <strong style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</strong>,
                            I want to accomplish: {useCase.label}&rdquo;
                          </div>
                        </div>
                        <a
                          href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-80"
                          style={{ color: '#0D6B6E', border: '1px solid rgba(13,143,146,0.3)', background: 'rgba(13,143,146,0.08)' }}
                        >
                          View on GitHub →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {siblingStories.length > 0 && (
                  <div>
                    <p className="text-[11px] mb-2 ml-1" style={{ color: '#7A8499' }}>
                      Related user stories in <em>{useCase.subcategoryLabel}</em>:
                    </p>
                    <div className="space-y-2">
                      {siblingStories.map(s => (
                        <Link
                          key={s.id}
                          href={`/use-cases/${s.id}`}
                          className="group flex items-center justify-between rounded-lg px-4 py-3 transition-all"
                          style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#0D8F92' }} />
                            <span className="text-xs" style={{ color: '#7A8499' }}>
                              {s.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono ml-3 shrink-0" style={{ color: '#C4CBDA' }}>
                            #{(s as unknown as { githubIssue: number }).githubIssue}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Applicable Standards — Object Model */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#C4CBDA' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#FFAB40' }} />
              Object Model / Standards
            </p>

            {standards.length > 0 ? (
              <div className="space-y-2.5">
                {standards.map((scored, index) => (
                  <Link
                    key={scored.entry.id}
                    href={`/standards/${scored.entry.id}`}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all hover:shadow-brand-hover"
                    style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(255,171,64,0.1)', color: '#B86400' }}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-semibold" style={{ color: '#072A6C' }}>
                          {scored.entry.title}
                        </h3>
                        <MetadataBadge kind="burden" value={scored.entry.implementationBurden} />
                      </div>

                      <div className="flex items-center gap-3 text-xs mb-2" style={{ color: '#7A8499' }}>
                        <span>Alignment score: {scored.score}</span>
                        {scored.fullCount > 0 && (
                          <span className="font-semibold" style={{ color: '#059669' }}>{scored.fullCount} full</span>
                        )}
                        {scored.partialCount > 0 && (
                          <span className="font-semibold" style={{ color: '#B86400' }}>{scored.partialCount} partial</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {scored.matchedDomains.map(md => (
                          <span
                            key={md.domain}
                            className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={md.status === 'full'
                              ? { background: 'rgba(5,150,105,0.08)', color: '#059669', border: '1px solid rgba(5,150,105,0.2)' }
                              : { background: 'rgba(255,171,64,0.1)', color: '#B86400', border: '1px solid rgba(255,171,64,0.3)' }
                            }
                          >
                            {getDomainIcon(md.domain)} {getDomainLabel(md.domain)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="shrink-0 mt-1 font-bold" style={{ color: '#FFAB40' }}>→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-6 text-center" style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}>
                <p className="text-sm" style={{ color: '#7A8499' }}>No standards mapped to this use case yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Ontology — CEDS Domains */}
          {useCase.cedsDomains.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,181,184,0.35)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#00B5B8' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.6)' }} />
                <span className="text-xs font-bold uppercase tracking-wide text-white">Ontology — CEDS Domains</span>
              </div>
              <div className="px-4 py-3 space-y-1.5" style={{ background: 'rgba(0,181,184,0.06)' }}>
                {useCase.cedsDomains.map(domainId => (
                  <div
                    key={domainId}
                    className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: '#fff', border: '1px solid rgba(0,181,184,0.25)' }}
                  >
                    <span className="text-base">{getDomainIcon(domainId)}</span>
                    <span className="text-xs font-semibold" style={{ color: '#007B7D' }}>
                      {getDomainLabel(domainId)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3" style={{ background: 'rgba(0,181,184,0.06)' }}>
                <Link
                  href="/alignment"
                  className="text-[11px] font-semibold hover:underline"
                  style={{ color: '#007B7D' }}
                >
                  View full CEDS alignment →
                </Link>
              </div>
            </div>
          )}

          {/* Hierarchy context */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #EEF1F7' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C4CBDA' }}>
                Hierarchy
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <Link
                href={`/topics/${useCase.categoryId}`}
                className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:opacity-80 group"
                style={{ background: 'rgba(91,63,211,0.05)' }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#5B3FD3' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C4CBDA' }}>Topic</div>
                  <div className="text-xs font-semibold" style={{ color: '#5B3FD3' }}>
                    {useCase.categoryIcon} {useCase.categoryLabel}
                  </div>
                </div>
                <span className="font-bold" style={{ color: '#5B3FD3' }}>→</span>
              </Link>

              <div className="flex items-center gap-2 p-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#072A6C' }} />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C4CBDA' }}>Business Driver</div>
                  <div className="text-xs font-semibold" style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(0,181,184,0.07)' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#00B5B8' }} />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C4CBDA' }}>Use Case (current)</div>
                  <div className="text-xs font-semibold leading-snug" style={{ color: '#007B7D' }}>{useCase.label}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigate */}
          <div className="rounded-xl p-4" style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C4CBDA' }}>Navigate</p>
            <div className="space-y-2">
              <Link href="/use-cases" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#007B7D' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00B5B8' }} />
                ← All Use Cases
              </Link>
              <Link href="/standards" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#B86400' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#FFAB40' }} />
                Standards Library
              </Link>
              <Link href="/ontology" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#007B7D' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00B5B8' }} />
                Ontology Graph
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
