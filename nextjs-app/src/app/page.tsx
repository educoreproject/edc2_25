import Link from 'next/link';
import { stakeholderTaxonomy } from '@/lib/data/taxonomies';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import { libraryEntries } from '@/lib/data/library-entries';

const useCaseCount = useCaseTaxonomy.reduce(
  (sum, cat) => sum + cat.children.reduce((s, sub) => s + sub.children.length, 0), 0
);

const userStoryCount = useCaseTaxonomy.reduce(
  (sum, cat) => sum + cat.children.reduce(
    (s, sub) => s + sub.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
  ), 0
);

// Cross-cutting standards from the diagram
const OBJECT_MODEL_STANDARDS = [
  'Verifiable Credential', 'CASE / CLR', 'JSON-LD Transcript',
  'TCP', 'EdFi', 'A4L Unity', 'LIF', 'JEDx',
];

const ONTOLOGY_STANDARDS = ['CEDS', 'CTDL'];

// Level definitions
const LEVELS = [
  {
    id: 'topics',
    href: '/topics',
    ordinal: '1',
    label: 'Topic',
    plural: 'Topics',
    color: 'violet',
    dot: 'bg-violet-500',
    ring: 'ring-violet-200',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badgeBg: 'bg-violet-100',
    count: `${useCaseTaxonomy.length}`,
    fields: ['Key Concepts', 'Link to Concepts Doc'],
    description: 'High-level subject areas organizing the entire knowledge base.',
  },
  {
    id: 'drivers',
    href: '/drivers',
    ordinal: '2',
    label: 'Business Driver',
    plural: 'Business Drivers',
    color: 'indigo',
    dot: 'bg-indigo-500',
    ring: 'ring-indigo-200',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    badgeBg: 'bg-indigo-100',
    count: `${stakeholderTaxonomy.length} groups`,
    fields: ['ID', 'Short Name', 'Description', '→ Topic'],
    description: 'Stakeholder groups and the business challenges driving interoperability.',
  },
  {
    id: 'use-cases',
    href: '/use-cases',
    ordinal: '3',
    label: 'Use Case',
    plural: 'Use Cases',
    color: 'sky',
    dot: 'bg-sky-500',
    ring: 'ring-sky-200',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    badgeBg: 'bg-sky-100',
    count: `${useCaseCount}`,
    fields: ['ID', 'Short Name', 'Description', 'Assumptions', '→ Business Driver(s)', '→ User Story(ies)', '→ Object Model', '→ Ontology'],
    description: 'Concrete scenarios linking business needs to data standards and models.',
  },
  {
    id: 'user-stories',
    href: '/use-cases',
    ordinal: '4',
    label: 'User Story',
    plural: 'User Stories',
    color: 'teal',
    dot: 'bg-teal-500',
    ring: 'ring-teal-200',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    badgeBg: 'bg-teal-100',
    count: `${userStoryCount} tracked`,
    fields: ['ID', 'Actor', 'As a … I want to…', '→ Use Case', '→ Object Model/Standard', '→ Ontology'],
    description: '"As a [role], I want to [action]" — the ground-level requirements linking to standards.',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">
            E
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              EDUcore Reference Library
            </h1>
            <p className="text-sm text-gray-400">
              Education data interoperability — standards, use cases, and object models
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Navigate from high-level <strong className="text-violet-700">Topics</strong> down through{' '}
          <strong className="text-indigo-700">Business Drivers</strong> and{' '}
          <strong className="text-sky-700">Use Cases</strong> to individual{' '}
          <strong className="text-teal-700">User Stories</strong> — each linked to the{' '}
          <strong className="text-amber-700">Object Models</strong> and{' '}
          <strong className="text-emerald-700">Ontology</strong> that implement them.
        </p>
      </div>

      {/* The Information Model */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          The Information Model
        </h2>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">

          {/* Left: Hierarchy chain */}
          <div className="space-y-1">
            {LEVELS.map((level, i) => (
              <div key={level.id}>
                <Link
                  href={level.href}
                  className={`group flex items-stretch gap-0 rounded-xl border ${level.border} bg-white hover:shadow-md transition-all overflow-hidden`}
                >
                  {/* Level indicator stripe */}
                  <div className={`w-1.5 shrink-0 ${level.dot.replace('bg-', 'bg-')}`} />

                  {/* Content */}
                  <div className="flex-1 px-5 py-4 flex items-start gap-4">
                    {/* Ordinal */}
                    <div className={`w-7 h-7 rounded-lg ${level.badgeBg} flex items-center justify-center text-xs font-bold ${level.text} shrink-0 mt-0.5`}>
                      {level.ordinal}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${level.text}`}>
                          {level.plural}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${level.badgeBg} ${level.text} font-medium`}>
                          {level.count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">
                        {level.description}
                      </p>
                      {/* Fields */}
                      <div className="flex flex-wrap gap-1">
                        {level.fields.map(f => (
                          <span
                            key={f}
                            className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                              f.startsWith('→')
                                ? `${level.badgeBg} ${level.text} border-transparent`
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`${level.text} opacity-0 group-hover:opacity-100 transition-opacity text-base shrink-0 mt-1`}>
                      →
                    </div>
                  </div>
                </Link>

                {/* Arrow between levels */}
                {i < LEVELS.length - 1 && (
                  <div className="flex items-center gap-2 pl-9 py-1">
                    <div className="w-px h-5 bg-gray-200 ml-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Cross-cutting concerns */}
          <div className="space-y-4">

            {/* Object Model / Standards */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Object Model / Standards
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5">
                {OBJECT_MODEL_STANDARDS.map(s => (
                  <Link
                    key={s}
                    href="/standards"
                    className="text-xs px-2 py-1 bg-white border border-amber-200 rounded-md text-amber-800 hover:border-amber-400 hover:bg-amber-50 transition-colors font-medium"
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3">
                <p className="text-[11px] text-amber-600 leading-relaxed">
                  Cross-referenced from Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* Ontology */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-emerald-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Ontology
                </span>
              </div>
              <div className="px-4 py-3 flex gap-2">
                {ONTOLOGY_STANDARDS.map(s => (
                  <Link
                    key={s}
                    href="/ontology"
                    className="text-xs px-3 py-1.5 bg-white border border-emerald-200 rounded-md text-emerald-800 hover:border-emerald-400 transition-colors font-semibold"
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3">
                <p className="text-[11px] text-emerald-600 leading-relaxed">
                  Shared vocabulary for Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* Connection diagram note */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <span className="font-semibold text-gray-700">How it connects:</span>{' '}
                Every Use Case and User Story links to one or more Object Models and an Ontology node.
                Standards are scored by CEDS domain alignment and surfaced on each Use Case page.
              </p>
            </div>

            {/* Standards count */}
            <Link
              href="/standards"
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                  Standards Library
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{libraryEntries.length} standards documented</div>
              </div>
              <span className="text-gray-300 group-hover:text-amber-500 transition-colors">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick tools row */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/explorer', icon: '💬', label: 'AI Explorer', desc: 'Natural language discovery' },
            { href: '/alignment', icon: '📊', label: 'CEDS Alignment', desc: 'Standards × domain matrix' },
            { href: '/crosswalk', icon: '🔗', label: 'Field Crosswalk', desc: 'Cross-spec field mapping' },
            { href: '/ontology', icon: '🕸️', label: 'Ontology Graph', desc: 'Interactive force graph' },
          ].map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
