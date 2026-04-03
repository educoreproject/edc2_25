import Link from 'next/link';
import { getStandardsByCategory } from '@/lib/data/resolvers';
import MetadataBadge from '@/components/MetadataBadge';

export default function StandardsPage() {
  const grouped = getStandardsByCategory();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-up">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs font-medium transition-colors hover:underline"
          style={{ color: '#5A6478' }}
        >
          &larr; Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
          Standards Library
        </h1>
        <p className="text-sm max-w-2xl leading-relaxed" style={{ color: '#5A6478' }}>
          Browse education data interoperability standards grouped by category.
          Select a standard to explore its implementation details, data objects,
          and connections.
        </p>
      </div>

      {/* Categories */}
      {Object.entries(grouped).map(([category, entries]) => (
        <section key={category} className="mb-12">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: '#072A6C' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFAB40' }} />
            {category}
            <span className="text-xs font-normal" style={{ color: '#7A8499' }}>
              ({entries.length})
            </span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/standards/${entry.id}`}
                className="card group p-5"
                style={{ border: '1px solid rgba(7,42,108,0.08)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-semibold leading-snug transition-colors group-hover:text-[#072A6C]" style={{ color: '#1E293B' }}>
                    {entry.title}
                  </h3>
                  <span className="transition-all group-hover:translate-x-0.5 shrink-0" style={{ color: '#7A8499' }}>
                    &rarr;
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: '#5A6478' }}>
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

                <div className="mt-3 text-xs" style={{ color: '#7A8499' }}>
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
