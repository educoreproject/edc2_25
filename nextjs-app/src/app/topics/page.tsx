import Link from 'next/link';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';

export const metadata = {
  title: 'Topics | EDUcore Reference Library',
  description: 'High-level subject areas organizing use cases, business drivers, and standards.',
};

const colorMap: Record<string, {
  bg: string; border: string; text: string; badge: string; stripe: string; hover: string;
}> = {
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700',  stripe: 'bg-indigo-500',  hover: 'hover:border-indigo-300' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700',        stripe: 'bg-sky-500',     hover: 'hover:border-sky-300' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    stripe: 'bg-amber-500',   hover: 'hover:border-amber-300' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', stripe: 'bg-emerald-500', hover: 'hover:border-emerald-300' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  stripe: 'bg-violet-500',  hover: 'hover:border-violet-300' },
};

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Page header */}
      <div className="mb-10">
        {/* Hierarchy breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="text-violet-600 font-medium">Topics</span>
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Level 1
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              High-level subject areas that organize the entire knowledge base. Each topic contains
              Business Drivers (subcategories) which map to Use Cases and, ultimately, to standards
              and ontology elements.
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchy indicator */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {[
          { label: 'Topics', color: 'bg-violet-500', active: true },
          { label: 'Business Drivers', color: 'bg-indigo-500', active: false },
          { label: 'Use Cases', color: 'bg-sky-500', active: false },
          { label: 'User Stories', color: 'bg-teal-500', active: false },
        ].map(({ label, color, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span className="text-gray-300">›</span>}
            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full font-medium ${
              active ? 'bg-gray-900 text-white' : 'text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : color}`} />
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
              className={`group relative flex flex-col bg-white border ${c.border} rounded-xl overflow-hidden ${c.hover} hover:shadow-lg transition-all`}
            >
              {/* Color stripe */}
              <div className={`h-1.5 w-full ${c.stripe}`} />

              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h2 className={`text-base font-bold ${c.text} leading-tight`}>
                      {topic.label}
                    </h2>
                    {topic.subtitle && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                        {topic.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Counts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                    {driverCount} business driver{driverCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-100 text-sky-700">
                    {useCaseCount} use case{useCaseCount !== 1 ? 's' : ''}
                  </span>
                  {storyCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700">
                      {storyCount} user stor{storyCount !== 1 ? 'ies' : 'y'}
                    </span>
                  )}
                </div>

                {/* Business drivers preview */}
                <div className="mt-auto">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Business Drivers
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.children.map((driver) => (
                      <span
                        key={driver.id}
                        className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                      >
                        {driver.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`px-6 py-3 border-t ${c.border} ${c.bg} flex items-center justify-between`}>
                <span className={`text-xs font-medium ${c.text}`}>Explore topic</span>
                <span className={`${c.text} opacity-50 group-hover:opacity-100 transition-opacity`}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
