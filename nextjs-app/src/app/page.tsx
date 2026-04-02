import Link from 'next/link';
import { stakeholderTaxonomy } from '@/lib/data/taxonomies';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import { libraryEntries } from '@/lib/data/library-entries';

const useCaseCount = useCaseTaxonomy.reduce(
  (sum, cat) => sum + cat.children.reduce((s, sub) => s + sub.children.length, 0), 0
);

const userStoryCount = useCaseTaxonomy.reduce(
  (sum, cat) => sum + cat.children.reduce(
    (ss, sub) => ss + sub.children.filter(uc => 'githubIssue' in uc && uc.githubIssue).length, 0
  ), 0
);

const OBJECT_MODEL_STANDARDS = [
  'Verifiable Credential', 'CASE / CLR', 'JSON-LD Transcript',
  'TCP', 'EdFi', 'A4L Unity', 'LIF', 'JEDx',
];

const LEVELS = [
  {
    href: '/topics', ordinal: '1', label: 'Topics', plural: 'Topics',
    count: `${useCaseTaxonomy.length}`,
    fields: ['Key Concepts', 'Link to Concepts Doc'],
    description: 'High-level subject areas organizing the entire knowledge base.',
    bg: '#5B3FD3', bgLight: 'rgba(91,63,211,0.08)', border: 'rgba(91,63,211,0.25)',
    text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.12)',
  },
  {
    href: '/drivers', ordinal: '2', label: 'Business Driver', plural: 'Business Drivers',
    count: `${stakeholderTaxonomy.length} groups`,
    fields: ['ID', 'Short Name', 'Description', '→ Topic'],
    description: 'Stakeholder groups and the business challenges driving interoperability.',
    bg: '#072A6C', bgLight: 'rgba(7,42,108,0.06)', border: 'rgba(7,42,108,0.2)',
    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.1)',
  },
  {
    href: '/use-cases', ordinal: '3', label: 'Use Case', plural: 'Use Cases',
    count: `${useCaseCount}`,
    fields: ['ID', 'Short Name', 'Description', 'Assumptions', '→ Business Driver(s)', '→ User Story(ies)', '→ Object Model', '→ Ontology'],
    description: 'Concrete scenarios linking business needs to data standards and models.',
    bg: '#00B5B8', bgLight: 'rgba(0,181,184,0.07)', border: 'rgba(0,181,184,0.3)',
    text: '#007B7D', badgeBg: 'rgba(0,181,184,0.12)',
  },
  {
    href: '/use-cases', ordinal: '4', label: 'User Story', plural: 'User Stories',
    count: `${userStoryCount} tracked`,
    fields: ['ID', 'Actor', 'As a … I want to…', '→ Use Case', '→ Object Model/Standard', '→ Ontology'],
    description: '"As a [role], I want to [action]" — ground-level requirements linking to standards.',
    bg: '#0D8F92', bgLight: 'rgba(13,143,146,0.07)', border: 'rgba(13,143,146,0.25)',
    text: '#0D6B6E', badgeBg: 'rgba(13,143,146,0.1)',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div
        className="rounded-2xl px-8 py-10 mb-10 relative overflow-hidden"
        style={{ background: '#072A6C' }}
      >
        {/* Teal glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 90% 50%, rgba(0,181,184,0.18) 0%, transparent 70%)'
        }} />
        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(0,181,184,0.15)', border: '1px solid rgba(0,181,184,0.35)', color: '#00B5B8' }}
          >
            Education Data Interoperability
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            EDUcore Reference Library
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Navigate from high-level <strong style={{ color: '#00B5B8' }}>Topics</strong> through{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Business Drivers</strong> and{' '}
            <strong style={{ color: '#00B5B8' }}>Use Cases</strong> to individual{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>User Stories</strong> — each linked to{' '}
            <strong style={{ color: '#FFAB40' }}>Object Models</strong> and <strong style={{ color: '#FFAB40' }}>Ontology</strong> that implement them.
          </p>
        </div>
      </div>

      {/* The Information Model */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'rgba(7,42,108,0.1)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#072A6C' }}>The Information Model</span>
          <div className="h-px flex-1" style={{ background: 'rgba(7,42,108,0.1)' }} />
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">

          {/* Left: Hierarchy chain */}
          <div className="space-y-1">
            {LEVELS.map((level, i) => (
              <div key={level.href + level.ordinal}>
                <Link
                  href={level.href}
                  className="group flex items-stretch rounded-xl overflow-hidden transition-all hover:shadow-brand-hover"
                  style={{ background: '#fff', border: `1.5px solid ${level.border}`, boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}
                >
                  {/* Color stripe */}
                  <div className="w-1.5 shrink-0" style={{ background: level.bg }} />

                  <div className="flex-1 px-5 py-4 flex items-start gap-4">
                    {/* Ordinal badge */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: level.badgeBg, color: level.text }}
                    >
                      {level.ordinal}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold" style={{ color: level.text }}>
                          {level.plural}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: level.badgeBg, color: level.text }}
                        >
                          {level.count}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: '#7A8499' }}>
                        {level.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {level.fields.map(f => (
                          <span
                            key={f}
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono border"
                            style={
                              f.startsWith('→')
                                ? { background: level.badgeBg, color: level.text, borderColor: 'transparent' }
                                : { background: '#F8F9FC', color: '#7A8499', borderColor: '#EEF1F7' }
                            }
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-base shrink-0 mt-1 font-bold"
                      style={{ color: level.bg }}
                    >
                      →
                    </span>
                  </div>
                </Link>

                {i < LEVELS.length - 1 && (
                  <div className="flex items-center pl-8 py-0.5">
                    <div className="w-px h-4 ml-3" style={{ background: '#C4CBDA' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Cross-cutting concerns */}
          <div className="space-y-4">

            {/* Object Model / Standards */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(255,171,64,0.4)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: '#FFAB40' }}
              >
                <span className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Object Model / Standards
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ background: 'rgba(255,171,64,0.06)' }}>
                {OBJECT_MODEL_STANDARDS.map(s => (
                  <Link
                    key={s}
                    href="/standards"
                    className="text-xs px-2 py-1 rounded-md font-semibold transition-colors hover:opacity-80"
                    style={{ background: '#fff', border: '1px solid rgba(255,171,64,0.35)', color: '#B86400' }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3" style={{ background: 'rgba(255,171,64,0.06)' }}>
                <p className="text-[11px]" style={{ color: '#B86400' }}>
                  Cross-referenced from Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* Ontology */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,181,184,0.35)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: '#00B5B8' }}
              >
                <span className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Ontology
                </span>
              </div>
              <div className="px-4 py-3 flex gap-2" style={{ background: 'rgba(0,181,184,0.06)' }}>
                {['CEDS', 'CTDL'].map(s => (
                  <Link
                    key={s}
                    href="/ontology"
                    className="text-xs px-3 py-1.5 rounded-md font-bold transition-colors hover:opacity-80"
                    style={{ background: '#fff', border: '1px solid rgba(0,181,184,0.3)', color: '#007B7D' }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3" style={{ background: 'rgba(0,181,184,0.06)' }}>
                <p className="text-[11px]" style={{ color: '#007B7D' }}>
                  Shared vocabulary for Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* How it connects */}
            <div className="rounded-xl p-4" style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}>
              <p className="text-[11px] leading-relaxed" style={{ color: '#7A8499' }}>
                <span className="font-bold" style={{ color: '#072A6C' }}>How it connects:</span>{' '}
                Every Use Case and User Story links to one or more Object Models and an Ontology node.
                Standards are scored by CEDS domain alignment and surfaced on each Use Case page.
              </p>
            </div>

            {/* Standards library link */}
            <Link
              href="/standards"
              className="group flex items-center justify-between rounded-xl p-4 transition-all hover:shadow-brand-hover"
              style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}
            >
              <div>
                <div className="text-sm font-bold" style={{ color: '#072A6C' }}>Standards Library</div>
                <div className="text-xs mt-0.5" style={{ color: '#7A8499' }}>{libraryEntries.length} standards documented</div>
              </div>
              <span className="font-bold transition-colors" style={{ color: '#FFAB40' }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1" style={{ background: 'rgba(7,42,108,0.1)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#072A6C' }}>Tools</span>
          <div className="h-px flex-1" style={{ background: 'rgba(7,42,108,0.1)' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/explorer', icon: '💬', label: 'AI Explorer', desc: 'Natural language discovery', accent: '#5B3FD3' },
            { href: '/alignment', icon: '📊', label: 'CEDS Alignment', desc: 'Standards × domain matrix', accent: '#072A6C' },
            { href: '/crosswalk', icon: '🔗', label: 'Field Crosswalk', desc: 'Cross-spec field mapping', accent: '#00B5B8' },
            { href: '/ontology', icon: '🕸️', label: 'Ontology Graph', desc: 'Interactive force graph', accent: '#FFAB40' },
          ].map(({ href, icon, label, desc, accent }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl p-4 transition-all hover:shadow-brand-hover"
              style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}
            >
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-sm font-bold mb-0.5 transition-colors" style={{ color: '#072A6C' }}>{label}</div>
              <div className="text-xs" style={{ color: '#7A8499' }}>{desc}</div>
              <div className="mt-2 text-xs font-bold" style={{ color: accent }}>Explore →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
