import Link from 'next/link';
import { stakeholderTaxonomy, useCasesCedsRdf } from '@/lib/data/taxonomies';

export const metadata = {
  title: 'Business Drivers | EDUcore Reference Library',
  description: 'Stakeholder groups and the business challenges driving education data interoperability.',
};

export default function DriversPage() {
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
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-indigo-600 font-medium">Business Drivers</span>
        </span>
      </div>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Business Drivers</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Level 2
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Stakeholder groups and the business challenges they face in education data interoperability.
            Each group links down to specific Use Cases and up to Topics.
          </p>
        </div>
      </div>

      {/* Hierarchy chain indicator */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {[
          { label: 'Topics', color: 'bg-violet-500', href: '/topics', active: false },
          { label: 'Business Drivers', color: 'bg-indigo-500', href: '/drivers', active: true },
          { label: 'Use Cases', color: 'bg-sky-500', href: '/use-cases', active: false },
          { label: 'User Stories', color: 'bg-teal-500', href: '/use-cases', active: false },
        ].map(({ label, color, href, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span className="text-gray-300">›</span>}
            <Link
              href={href}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full font-medium transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : color}`} />
              {label}
            </Link>
          </span>
        ))}
      </div>

      {/* Driver groups */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stakeholderTaxonomy.map((group) => {
          // Count how many use cases are related to this group's stakeholders
          const stakeholderIds = group.children.map(c => c.id);
          const relatedUseCases = useCasesCedsRdf.filter(uc =>
            uc.stakeholders.some(s => stakeholderIds.includes(s))
          );
          const allNeeds = group.children.flatMap(c => c.businessNeeds);
          const previewNeeds = allNeeds.slice(0, 3);

          return (
            <Link
              key={group.id}
              href={`/drivers/${group.id}`}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col"
            >
              {/* Indigo stripe */}
              <div className="h-1 bg-indigo-500" />

              <div className="p-5 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors shrink-0">
                    {group.icon}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                      {group.children.length} stakeholder{group.children.length !== 1 ? 's' : ''}
                    </span>
                    {relatedUseCases.length > 0 && (
                      <span className="text-xs text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full font-medium">
                        {relatedUseCases.length} use case{relatedUseCases.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                  {group.label}
                </h2>
                <p className="text-xs text-gray-400 mb-4 leading-snug">
                  {group.children.map(c => c.label).join(' · ')}
                </p>

                {/* Business needs preview */}
                <div className="mt-auto">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Top Business Needs
                  </p>
                  <ul className="space-y-1.5">
                    {previewNeeds.map((need, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5 leading-snug">
                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                        <span className="line-clamp-2">{need}</span>
                      </li>
                    ))}
                    {allNeeds.length > 3 && (
                      <li className="text-xs text-gray-400 pl-3">
                        +{allNeeds.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  View stakeholders &amp; use cases
                </span>
                <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
