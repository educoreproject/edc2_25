import Link from 'next/link';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';

export const metadata = {
  title: 'Use Cases | EDUcore Reference Library',
  description: 'Concrete scenarios linking business needs to data standards and ontology elements.',
};

const colorMap: Record<string, {
  bg: string; border: string; text: string; badge: string; dot: string;
  useCaseBg: string; useCaseBorder: string; useCaseHover: string;
}> = {
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-400',  useCaseBg: 'bg-white', useCaseBorder: 'border-gray-100', useCaseHover: 'hover:border-sky-300 hover:bg-sky-50' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700',        dot: 'bg-sky-400',     useCaseBg: 'bg-white', useCaseBorder: 'border-gray-100', useCaseHover: 'hover:border-sky-300 hover:bg-sky-50' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-400',   useCaseBg: 'bg-white', useCaseBorder: 'border-gray-100', useCaseHover: 'hover:border-sky-300 hover:bg-sky-50' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400', useCaseBg: 'bg-white', useCaseBorder: 'border-gray-100', useCaseHover: 'hover:border-sky-300 hover:bg-sky-50' },
};

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
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/topics" className="flex items-center gap-1 hover:text-violet-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-violet-600 font-medium">Topics</span>
        </Link>
        <span>›</span>
        <Link href="/drivers" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-indigo-600 font-medium">Business Drivers</span>
        </Link>
        <span>›</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span className="text-sky-600 font-medium">Use Cases</span>
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Use Cases</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
              Level 3
            </span>
            <span className="text-xs text-gray-400">{totalUseCases} total · {totalStories} with User Stories</span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Concrete scenarios organized by Topic and Business Driver. Each use case links to
            applicable standards, CEDS domains, and individual User Stories.
          </p>
        </div>
      </div>

      {/* Hierarchy indicator */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {[
          { label: 'Topics', color: 'bg-violet-500', href: '/topics', active: false },
          { label: 'Business Drivers', color: 'bg-indigo-500', href: '/drivers', active: false },
          { label: 'Use Cases', color: 'bg-sky-500', href: '/use-cases', active: true },
          { label: 'User Stories', color: 'bg-teal-500', href: '/use-cases', active: false },
        ].map(({ label, color, href, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span className="text-gray-300">›</span>}
            <Link
              href={href}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full font-medium transition-colors ${
                active ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : color}`} />
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
            <section key={topic.id} className={`rounded-xl border ${c.border} overflow-hidden`}>
              {/* Topic header */}
              <Link
                href={`/topics/${topic.id}`}
                className={`flex items-center gap-3 px-5 py-4 ${c.bg} hover:opacity-90 transition-opacity border-b ${c.border}`}
              >
                <span className="text-xl">{topic.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${c.text}`}>{topic.label}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${c.badge}`}>
                      Topic
                    </span>
                    <span className="text-xs text-gray-400">
                      {topic.children.length} drivers · {topicUseCaseCount} use cases
                      {topicStoryCount > 0 && ` · ${topicStoryCount} user stories`}
                    </span>
                  </div>
                  {topic.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{topic.subtitle}</p>
                  )}
                </div>
                <span className={`${c.text} opacity-50 text-xs`}>↗ topic</span>
              </Link>

              {/* Business Drivers with Use Cases */}
              <div className="bg-white divide-y divide-gray-50">
                {topic.children.map((driver) => {
                  const driverStoryCount = driver.children.filter(
                    uc => 'githubIssue' in uc && uc.githubIssue
                  ).length;

                  return (
                    <div key={driver.id} className="px-5 py-4">
                      {/* Driver row */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-300 shrink-0" />
                        <span className="text-xs font-semibold text-gray-700">{driver.label}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">
                          Business Driver
                        </span>
                        {driverStoryCount > 0 && (
                          <span className="text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full">
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
                              className={`group flex items-start gap-2 rounded-lg border px-3 py-2.5 transition-all ${c.useCaseBorder} ${c.useCaseBg} ${c.useCaseHover}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-gray-700 group-hover:text-sky-700 transition-colors leading-snug block">
                                  {uc.label}
                                </span>
                                {hasStory && (
                                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded font-medium">
                                    <span className="w-1 h-1 rounded-full bg-teal-400" />
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
