import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getStandardById,
  getObjectDetail,
  getDomainIcon,
} from '@/lib/data/resolvers';
import { specLabels } from '@/lib/data/field-mappings';
import MetadataBadge from '@/components/MetadataBadge';

export default async function ObjectDetailPage({
  params,
}: {
  params: Promise<{ standardId: string; objectId: string }>;
}) {
  const { standardId, objectId: rawObjectId } = await params;
  const objectId = decodeURIComponent(rawObjectId);

  const standard = getStandardById(standardId);
  if (!standard) return notFound();

  const detail = getObjectDetail(standardId, objectId);
  if (!detail) return notFound();

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
          className="text-indigo-600 hover:text-indigo-800 transition-colors truncate max-w-[160px]"
        >
          {standard.title}
        </Link>
        <span>/</span>
        <Link
          href={`/standards/${standardId}/objects`}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Objects
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{objectId}</span>
      </nav>

      {/* Title block */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {detail.element}
        </h1>
        {detail.rdfDetail && (
          <div className="space-y-2">
            {detail.rdfDetail.uri && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">RDF URI</span>
                <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono break-all">
                  {detail.rdfDetail.uri}
                </code>
              </div>
            )}
            {detail.rdfDetail.description && (
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                {detail.rdfDetail.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Appearances ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Domain Appearances
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          This element appears in {detail.appearances.length} CEDS domain{detail.appearances.length !== 1 ? 's' : ''} for this standard.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">
                  Domain
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.appearances.map((a, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {getDomainIcon(a.domain)} {a.domainLabel}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <MetadataBadge kind="status" value={a.status} />
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-gray-500">{a.notes}</span>
                    {a.gapNotes && (
                      <span className="text-xs text-red-500 block mt-0.5">
                        Gap: {a.gapNotes}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Other Standards ── */}
      {detail.otherStandards.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Other Standards Referencing This Element
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.otherStandards.map((other, i) => (
              <Link
                key={i}
                href={`/standards/${other.standardId}/objects/${encodeURIComponent(objectId)}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {other.standardName}
                  </span>
                  <span className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0">
                    &rarr;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MetadataBadge kind="status" value={other.status} />
                  <span className="text-xs text-gray-400">
                    {getDomainIcon(other.domain)} {other.domain}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Field Mappings ── */}
      {detail.relatedMappings.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Related Field Mappings (Crosswalk)
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Cross-specification field mappings that relate to this element.
          </p>

          <div className="space-y-4">
            {detail.relatedMappings.map((mapping, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {mapping.concept}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {mapping.entityType}
                    </span>
                  </div>
                  <StrengthBadge strength={mapping.matchStrength} />
                </div>

                {/* Mapping table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left font-semibold text-gray-500 uppercase tracking-wide py-1.5 pr-3">
                          Spec
                        </th>
                        <th className="text-left font-semibold text-gray-500 uppercase tracking-wide py-1.5 pr-3">
                          Field
                        </th>
                        <th className="text-left font-semibold text-gray-500 uppercase tracking-wide py-1.5">
                          Path
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(mapping.mappings).map(([specKey, specMapping]) => {
                        if (!specMapping) return null;
                        const m = specMapping as { field: string; path: string };
                        return (
                          <tr key={specKey} className="border-b border-gray-50">
                            <td className="py-1.5 pr-3 font-medium text-gray-700 whitespace-nowrap">
                              {(specLabels as Record<string, string>)[specKey] || specKey}
                            </td>
                            <td className="py-1.5 pr-3 text-gray-600 font-mono">
                              {m.field}
                            </td>
                            <td className="py-1.5 text-gray-400 font-mono">
                              {m.path}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {mapping.notes && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {mapping.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Helper component ── */

function StrengthBadge({ strength }: { strength: string }) {
  const colors: Record<string, string> = {
    equivalent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    close: 'bg-amber-50 text-amber-700 border-amber-200',
    related: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
        colors[strength] || 'bg-gray-50 text-gray-600 border-gray-200'
      }`}
    >
      {strength}
    </span>
  );
}
