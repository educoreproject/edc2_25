import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCaseTaxonomy, useCaseCedsDomains } from '@/lib/data/use-case-taxonomy';
import { getStandardsForDomains, getDomainLabel, getDomainIcon } from '@/lib/data/resolvers';

const colorMap: Record<string, {
  bg: string; border: string; text: string; badge: string; stripe: string;
  driverBg: string; driverBorder: string; driverText: string;
}> = {
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700',  stripe: 'bg-indigo-500',  driverBg: 'bg-indigo-50',  driverBorder: 'border-indigo-200',  driverText: 'text-indigo-700' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700',        stripe: 'bg-sky-500',     driverBg: 'bg-sky-50',     driverBorder: 'border-sky-200',     driverText: 'text-sky-700' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    stripe: 'bg-amber-500',   driverBg: 'bg-amber-50',   driverBorder: 'border-amber-200',   driverText: 'text-amber-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', stripe: 'bg-emerald-500', driverBg: 'bg-emerald-50', driverBorder: 'border-emerald-200', driverText: 'text-emerald-700' },
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

  // Gather all CEDS domains across this topic's use cases
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
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/topics" className="flex items-center gap-1 hover:text-violet-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-violet-600 font-medium">Topics</span>
        </Link>
        <span>›</span>
        <span className={`font-medium ${c.text}`}>{topic.label}</span>
      </div>

      {/* Topic header */}
      <div className={`rounded-xl border ${c.border} overflow-hidden mb-8`}>
        <div className={`h-1.5 ${c.stripe}`} />
        <div className={`${c.bg} px-6 py-5`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 bg-white rounded-xl border ${c.border} flex items-center justify-center text-3xl shrink-0`}>
              {topic.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className={`text-xl font-bold ${c.text}`}>{topic.label}</h1>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                  Level 1 — Topic
                </span>
              </div>
              {topic.subtitle && (
                <p className="text-sm text-gray-600 mb-3">{topic.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                  {topic.children.length} business drivers
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-100 text-sky-700">
                  {totalUseCases} use cases
                </span>
                {totalStories > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700">
                    {totalStories} user stories
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
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Business Drivers
            <span className="font-normal text-gray-300">— Level 2</span>
          </h2>

          <div className="space-y-5">
            {topic.children.map((driver) => {
              const storyCount = driver.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length;
              return (
                <div
                  key={driver.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Driver header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <h3 className="text-sm font-semibold text-gray-900">{driver.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded-full font-medium">
                        {driver.children.length} use case{driver.children.length !== 1 ? 's' : ''}
                      </span>
                      {storyCount > 0 && (
                        <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-medium">
                          {storyCount} user stor{storyCount !== 1 ? 'ies' : 'y'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Use Cases grid */}
                  <div className="p-3 grid sm:grid-cols-2 gap-2">
                    {driver.children.map((uc) => {
                      const hasStory = 'githubIssue' in uc && uc.githubIssue;
                      return (
                        <Link
                          key={uc.id}
                          href={`/use-cases/${uc.id}`}
                          className="group flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:border-sky-200 hover:bg-sky-50 transition-all"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-gray-700 group-hover:text-sky-700 transition-colors leading-snug block">
                              {uc.label}
                            </span>
                            {hasStory && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded font-medium">
                                <span className="w-1 h-1 rounded-full bg-teal-400" />
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

        {/* Sidebar: Cross-cutting concerns */}
        <div className="space-y-5">

          {/* Relevant CEDS Domains */}
          {allDomains.size > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-emerald-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  CEDS Domains
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5">
                {[...allDomains].map(d => (
                  <span
                    key={d}
                    className="text-xs px-2 py-0.5 bg-white border border-emerald-200 rounded-md text-emerald-800 font-medium"
                  >
                    {getDomainIcon(d)} {getDomainLabel(d)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Relevant Standards */}
          {relevantStandards.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Relevant Standards
                </span>
              </div>
              <div className="px-3 py-3 space-y-1.5">
                {relevantStandards.map(s => (
                  <Link
                    key={s.entry.id}
                    href={`/standards/${s.entry.id}`}
                    className="flex items-center justify-between bg-white border border-amber-100 rounded-lg px-3 py-2 hover:border-amber-300 transition-colors group"
                  >
                    <span className="text-xs text-gray-800 group-hover:text-amber-800 font-medium leading-snug">
                      {s.entry.title}
                    </span>
                    <span className="text-amber-400 group-hover:text-amber-600 transition-colors ml-2 shrink-0 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigate deeper */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigate the hierarchy
            </p>
            <div className="space-y-2">
              <Link href="/drivers" className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                All Business Drivers
              </Link>
              <Link href="/use-cases" className="flex items-center gap-2 text-xs text-sky-600 hover:text-sky-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                All Use Cases
              </Link>
              <Link href="/standards" className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Standards Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
