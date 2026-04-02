import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getStandardById,
  getUseCasesForStandard,
} from '@/lib/data/resolvers';
import MetadataBadge from '@/components/MetadataBadge';

export default async function StandardDetailPage({
  params,
}: {
  params: Promise<{ standardId: string }>;
}) {
  const { standardId } = await params;
  const standard = getStandardById(standardId);
  if (!standard) return notFound();

  const useCases = getUseCasesForStandard(standardId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/standards" className="text-indigo-600 hover:text-indigo-800 transition-colors">
          Standards
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{standard.title}</span>
      </nav>

      {/* Title block */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <MetadataBadge kind="burden" value={standard.implementationBurden} label={`${standard.implementationBurden} burden`} />
          <MetadataBadge kind="access" value={standard.accessLevel} />
          <MetadataBadge kind="status" value={standard.status} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {standard.title}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
          {standard.description}
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Owner" value={standard.owner} />
        <StatCard label="Governance" value={standard.governanceBody || 'N/A'} />
        <StatCard label="Version" value={standard.version || 'N/A'} />
        <StatCard label="Last Updated" value={standard.lastUpdated || 'N/A'} />
      </div>

      {/* Explore Objects CTA */}
      <Link
        href={`/standards/${standardId}/objects`}
        className="group flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-10 hover:bg-indigo-100 transition-colors"
      >
        <div>
          <div className="text-sm font-semibold text-indigo-900">Explore CEDS Data Objects</div>
          <div className="text-xs text-indigo-600 mt-1">
            View all CEDS elements aligned to this standard
          </div>
        </div>
        <span className="text-indigo-400 group-hover:text-indigo-700 transition-colors text-lg">
          &rarr;
        </span>
      </Link>

      {/* ── Section: Overview ── */}
      <Section title="Overview">
        {standard.aiUnlocksSummary && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
            <div className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1">
              What This Standard Unlocks
            </div>
            <p className="text-sm text-violet-900 leading-relaxed">
              {standard.aiUnlocksSummary}
            </p>
          </div>
        )}

        {standard.tags && standard.tags.length > 0 && (
          <div className="mb-4">
            <Label text="Tags" />
            <div className="flex flex-wrap gap-1.5 mt-1">
              {standard.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {standard.aiSummary && (
          <div>
            <Label text="AI Summary" />
            <p className="text-sm text-gray-600 leading-relaxed">{standard.aiSummary}</p>
          </div>
        )}

        {standard.compatibilityNotes && (
          <div className="mt-4">
            <Label text="Compatibility Notes" />
            <p className="text-sm text-gray-600 leading-relaxed">{standard.compatibilityNotes}</p>
          </div>
        )}

        {standard.knownAdopters && standard.knownAdopters.length > 0 && (
          <div className="mt-4">
            <Label text="Known Adopters" />
            <div className="flex flex-wrap gap-1.5 mt-1">
              {standard.knownAdopters.map((adopter) => (
                <span
                  key={adopter}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                >
                  {adopter}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Section: Implementation ── */}
      <Section title="Implementation">
        {/* Burden Rubric */}
        {standard.burdenRubric && (
          <div className="mb-6">
            <Label text="Implementation Burden Rubric" />
            <div className="grid gap-3 mt-2">
              {Object.entries(standard.burdenRubric).map(([dimension, info]) => (
                <div
                  key={dimension}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700 capitalize">
                      {dimension}
                    </span>
                    <MetadataBadge
                      kind="burden"
                      value={(info as { level: string; note: string }).level === 'moderate' ? 'medium' : (info as { level: string; note: string }).level}
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {(info as { level: string; note: string }).note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {standard.implementationBurdenRationale && (
          <div className="mb-4">
            <Label text="Burden Rationale" />
            <p className="text-sm text-gray-600 leading-relaxed">
              {standard.implementationBurdenRationale}
            </p>
          </div>
        )}

        {/* Required Capabilities */}
        {standard.requiredCapabilities && standard.requiredCapabilities.length > 0 && (
          <div className="mb-4">
            <Label text="Required Capabilities" />
            <ul className="mt-1 space-y-1">
              {standard.requiredCapabilities.map((cap, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">&#x2022;</span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Implementation Guidance */}
        {standard.implementationGuidance && (
          <div className="mb-4">
            <Label text="Implementation Guidance" />
            <p className="text-sm text-gray-600 leading-relaxed">
              {standard.implementationGuidance}
            </p>
          </div>
        )}

        {/* Reference Implementations */}
        {standard.referenceImplementations && standard.referenceImplementations.length > 0 && (
          <div className="mb-4">
            <Label text="Reference Implementations" />
            <div className="space-y-2 mt-1">
              {standard.referenceImplementations.map((ref, i) => (
                <a
                  key={i}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors"
                >
                  <div className="text-sm font-medium text-indigo-700">{ref.name}</div>
                  {ref.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{ref.description}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Sample Payloads */}
        {standard.samplePayloads && standard.samplePayloads.length > 0 && (
          <div>
            <Label text="Sample Payloads" />
            <div className="space-y-3 mt-2">
              {standard.samplePayloads.map((payload, i) => (
                <div key={i}>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {payload.label}
                  </div>
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                    <code>{payload.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Section: Connections ── */}
      <Section title="Connections">
        {/* Commonly Paired With */}
        {standard.commonlyPairedWith && standard.commonlyPairedWith.length > 0 && (
          <div className="mb-6">
            <Label text="Commonly Paired With" />
            <div className="grid gap-3 mt-2 sm:grid-cols-2">
              {standard.commonlyPairedWith.map((pair) => (
                <Link
                  key={pair.id}
                  href={`/standards/${pair.id}`}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                    {pair.id}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {pair.rationale}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Use Cases */}
        {useCases.length > 0 && (
          <div>
            <Label text={`Related Use Cases (${useCases.length})`} />
            <div className="grid gap-2 mt-2 sm:grid-cols-2">
              {useCases.slice(0, 12).map((uc) => (
                <Link
                  key={uc.id}
                  href={`/use-cases/${uc.id}`}
                  className="group flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-indigo-300 transition-colors"
                >
                  {uc.icon && <span className="text-base shrink-0">{uc.icon}</span>}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors truncate">
                      {uc.label}
                    </div>
                    <div className="text-xs text-gray-400">{uc.source}</div>
                  </div>
                </Link>
              ))}
            </div>
            {useCases.length > 12 && (
              <p className="text-xs text-gray-400 mt-2">
                + {useCases.length - 12} more use cases
              </p>
            )}
          </div>
        )}

        {/* Technical Doc Links */}
        {standard.technicalDocLinks && standard.technicalDocLinks.length > 0 && (
          <div className="mt-6">
            <Label text="Documentation Links" />
            <div className="flex flex-wrap gap-2 mt-1">
              {standard.technicalDocLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Section: Equity & Privacy ── */}
      <Section title="Equity & Privacy">
        {/* Equity Considerations */}
        {standard.equityConsiderations && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Label text="Equity Considerations" />
              <MetadataBadge kind="concern" value={standard.equityConsiderations.level} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {standard.equityConsiderations.notes}
            </p>
          </div>
        )}

        {/* Privacy Considerations */}
        {standard.privacyConsiderations && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Label text="Privacy Considerations" />
              <MetadataBadge kind="concern" value={standard.privacyConsiderations.level} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {standard.privacyConsiderations.notes}
            </p>

            {standard.privacyConsiderations.regulations &&
              standard.privacyConsiderations.regulations.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500">Applicable Regulations: </span>
                  <span className="text-xs text-gray-600">
                    {standard.privacyConsiderations.regulations.join(', ')}
                  </span>
                </div>
              )}
          </div>
        )}

        {/* NDPA Provisions */}
        {standard.privacyConsiderations?.ndpaProvisions &&
          standard.privacyConsiderations.ndpaProvisions.length > 0 && (
            <div>
              <Label text="NDPA Provisions" />
              <div className="space-y-3 mt-2">
                {standard.privacyConsiderations.ndpaProvisions.map((provision, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
                        {provision.citation}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {provision.title}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          {provision.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </Section>
    </div>
  );
}

/* ── Helper components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {text}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-800 truncate">{value}</div>
    </div>
  );
}
