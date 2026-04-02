import Link from 'next/link';
import { getStandardsByCategory } from '@/lib/data/resolvers';
import MetadataBadge from '@/components/MetadataBadge';

export default function StandardsPage() {
  const grouped = getStandardsByCategory();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          &larr; Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          Standards Library
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Browse education data interoperability standards grouped by category.
          Select a standard to explore its implementation details, data objects,
          and connections.
        </p>
      </div>

      {/* Categories */}
      {Object.entries(grouped).map(([category, entries]) => (
        <section key={category} className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {category}
            <span className="text-sm font-normal text-gray-400">
              ({entries.length})
            </span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/standards/${entry.id}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {entry.title}
                  </h3>
                  <span className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0">
                    &rarr;
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {entry.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <MetadataBadge
                    kind="burden"
                    value={entry.implementationBurden}
                    label={`${entry.implementationBurden} burden`}
                  />
                  <MetadataBadge
                    kind="access"
                    value={entry.accessLevel}
                  />
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  {entry.owner}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
