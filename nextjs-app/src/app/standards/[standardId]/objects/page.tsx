import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getStandardById,
  getObjectsForStandard,
  getDomainIcon,
} from '@/lib/data/resolvers';
import MetadataBadge from '@/components/MetadataBadge';

const statusColor: Record<string, string> = {
  full: 'bg-emerald-50 border-emerald-200',
  partial: 'bg-amber-50 border-amber-200',
  gap: 'bg-red-50 border-red-200',
};

export default async function ObjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ standardId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { standardId } = await params;
  const resolvedSearchParams = await searchParams;
  const standard = getStandardById(standardId);
  if (!standard) return notFound();

  const allObjects = getObjectsForStandard(standardId);

  // Domain filter
  const domainFilter =
    typeof resolvedSearchParams.domain === 'string'
      ? resolvedSearchParams.domain
      : undefined;

  const objects = domainFilter
    ? allObjects.filter((obj) => obj.domain === domainFilter)
    : allObjects;

  // Collect unique domains for filter chips
  const domains = Array.from(
    new Map(allObjects.map((o) => [o.domain, o.domainLabel])).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link
          href="/standards"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Standards
        </Link>
        <span>/</span>
        <Link
          href={`/standards/${standardId}`}
          className="text-indigo-600 hover:text-indigo-800 transition-colors truncate max-w-[200px]"
        >
          {standard.title}
        </Link>
        <span>/</span>
        <span className="text-gray-600">Objects</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          CEDS Data Objects
        </h1>
        <p className="text-sm text-gray-500">
          {allObjects.length} CEDS elements aligned to{' '}
          <span className="font-medium text-gray-700">{standard.title}</span>
          {domainFilter && (
            <span>
              {' '}filtered by{' '}
              <span className="font-medium text-gray-700">
                {domains.find(([id]) => id === domainFilter)?.[1] || domainFilter}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Domain filter chips */}
      {domains.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/standards/${standardId}/objects`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !domainFilter
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            All ({allObjects.length})
          </Link>
          {domains.map(([domainId, domainLabel]) => {
            const count = allObjects.filter((o) => o.domain === domainId).length;
            const icon = getDomainIcon(domainId);
            return (
              <Link
                key={domainId}
                href={`/standards/${standardId}/objects?domain=${domainId}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  domainFilter === domainId
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {icon && <span className="mr-1">{icon}</span>}
                {domainLabel} ({count})
              </Link>
            );
          })}
        </div>
      )}

      {/* Objects grid */}
      {objects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No CEDS elements found for this filter.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {objects.map((obj) => (
            <Link
              key={`${obj.domain}-${obj.element}`}
              href={`/standards/${standardId}/objects/${encodeURIComponent(obj.element)}`}
              className={`group border rounded-xl p-4 hover:shadow-md transition-all ${
                statusColor[obj.status] || 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                  {obj.element}
                </h3>
                <span className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0">
                  &rarr;
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">
                  {getDomainIcon(obj.domain)} {obj.domainLabel}
                </span>
              </div>

              <MetadataBadge kind="status" value={obj.status} />

              {obj.notes && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {obj.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
