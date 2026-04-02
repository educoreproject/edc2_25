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

const categoryColorMap: Record<string, {
  bg: string; border: string; text: string; badge: string; stripe: string;
}> = {
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700',  stripe: 'bg-indigo-500' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700',        stripe: 'bg-sky-500' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    stripe: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', stripe: 'bg-emerald-500' },
};

// Derive user stories: sibling use cases with githubIssue, from the same subcategory
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

// If this use case itself has a githubIssue, it IS a user story
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
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/topics" className="flex items-center gap-1 hover:text-violet-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-violet-600 font-medium">Topics</span>
        </Link>
        <span>›</span>
        <Link href={`/topics/${useCase.categoryId}`} className={`flex items-center gap-1 hover:opacity-80 transition-opacity ${c.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.stripe}`} />
          <span className="font-medium">{useCase.categoryLabel}</span>
        </Link>
        <span>›</span>
        <Link href="/use-cases" className="flex items-center gap-1 hover:text-sky-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span className="text-sky-600 font-medium">Use Cases</span>
        </Link>
        <span>›</span>
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{useCase.label}</span>
      </div>

      {/* Use Case header card */}
      <div className="rounded-xl border border-sky-200 overflow-hidden mb-8">
        <div className="h-1.5 bg-sky-500" />
        <div className="bg-sky-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              {/* Category + Subcategory path */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${c.bg} ${c.border} ${c.text}`}>
                  {useCase.categoryIcon} {useCase.categoryLabel}
                </span>
                <span className="text-gray-300 text-xs">›</span>
                <span className="text-xs text-gray-500">{useCase.subcategoryLabel}</span>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-1">{useCase.label}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  Level 3 — Use Case
                </span>
                {ownIssue && (
                  <a
                    href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full hover:bg-teal-100 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
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
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                User Stories
                <span className="font-normal text-gray-300">— Level 4</span>
              </h2>

              <div className="space-y-3">
                {ownIssue && (
                  <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
                    <div className="h-1 bg-teal-400" />
                    <div className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                              This use case is a User Story
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              #{ownIssue}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {useCase.label}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Actor: stakeholder in <em>{useCase.subcategoryLabel}</em>
                          </p>
                          <div className="mt-2 text-xs text-gray-500 italic leading-relaxed">
                            &ldquo;As a stakeholder with a need in <strong>{useCase.subcategoryLabel}</strong>,
                            I want to accomplish: {useCase.label}&rdquo;
                          </div>
                        </div>
                        <a
                          href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs text-teal-600 hover:text-teal-800 transition-colors border border-teal-200 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 font-medium"
                        >
                          View on GitHub →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {siblingStories.length > 0 && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-2 ml-1">
                      Related user stories in <em>{useCase.subcategoryLabel}</em>:
                    </p>
                    <div className="space-y-2">
                      {siblingStories.map(s => (
                        <Link
                          key={s.id}
                          href={`/use-cases/${s.id}`}
                          className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-teal-200 hover:bg-teal-50 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                            <span className="text-xs text-gray-700 group-hover:text-teal-700 transition-colors">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono ml-3 shrink-0">
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
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Object Model / Standards
            </h2>

            {standards.length > 0 ? (
              <div className="space-y-2.5">
                {standards.map((scored, index) => (
                  <Link
                    key={scored.entry.id}
                    href={`/standards/${scored.entry.id}`}
                    className="group flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all"
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-xs font-bold text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">
                          {scored.entry.title}
                        </h3>
                        <MetadataBadge kind="burden" value={scored.entry.implementationBurden} />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span>Alignment score: {scored.score}</span>
                        {scored.fullCount > 0 && (
                          <span className="text-emerald-600 font-medium">{scored.fullCount} full</span>
                        )}
                        {scored.partialCount > 0 && (
                          <span className="text-amber-600 font-medium">{scored.partialCount} partial</span>
                        )}
                      </div>

                      {/* Matched CEDS domains */}
                      <div className="flex flex-wrap gap-1">
                        {scored.matchedDomains.map(md => (
                          <span
                            key={md.domain}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              md.status === 'full'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}
                          >
                            {getDomainIcon(md.domain)} {getDomainLabel(md.domain)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-gray-300 group-hover:text-amber-400 transition-colors shrink-0 mt-1">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-400">No standards mapped to this use case yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Ontology — CEDS Domains */}
          {useCase.cedsDomains.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-emerald-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Ontology — CEDS Domains
                </span>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                {useCase.cedsDomains.map(domainId => (
                  <div
                    key={domainId}
                    className="flex items-center gap-2 bg-white border border-emerald-100 rounded-lg px-3 py-2"
                  >
                    <span className="text-base">{getDomainIcon(domainId)}</span>
                    <span className="text-xs font-medium text-emerald-800">
                      {getDomainLabel(domainId)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3">
                <Link
                  href="/alignment"
                  className="text-[11px] text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  View full CEDS alignment →
                </Link>
              </div>
            </div>
          )}

          {/* Hierarchy context */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Hierarchy
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <Link
                href={`/topics/${useCase.categoryId}`}
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-violet-50 transition-colors group`}
              >
                <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Topic</div>
                  <div className="text-xs font-medium text-gray-700 group-hover:text-violet-700 transition-colors">
                    {useCase.categoryIcon} {useCase.categoryLabel}
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-violet-400 transition-colors text-xs">→</span>
              </Link>

              <div className="flex items-center gap-2 p-2">
                <span className="w-2 h-2 rounded-full bg-indigo-300 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Business Driver</div>
                  <div className="text-xs text-gray-600">{useCase.subcategoryLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-sky-50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Use Case (current)</div>
                  <div className="text-xs font-medium text-sky-700 leading-snug">{useCase.label}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigate */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigate</p>
            <div className="space-y-2">
              <Link href="/use-cases" className="flex items-center gap-2 text-xs text-sky-600 hover:text-sky-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                ← All Use Cases
              </Link>
              <Link href="/standards" className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Standards Library
              </Link>
              <Link href="/ontology" className="flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Ontology Graph
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
