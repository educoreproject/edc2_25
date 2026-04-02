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
    bg: '#5B3FD3', bgLight: 'rgba(91,63,211,0.08)', border: 'rgba(91,63,211,0.15)',
    text: '#5B3FD3', badgeBg: 'rgba(91,63,211,0.08)',
  },
  {
    href: '/drivers', ordinal: '2', label: 'Business Driver', plural: 'Business Drivers',
    count: `${stakeholderTaxonomy.length} groups`,
    fields: ['ID', 'Short Name', 'Description', '\u2192 Topic'],
    description: 'Stakeholder groups and the business challenges driving interoperability.',
    bg: '#072A6C', bgLight: 'rgba(7,42,108,0.05)', border: 'rgba(7,42,108,0.12)',
    text: '#072A6C', badgeBg: 'rgba(7,42,108,0.07)',
  },
  {
    href: '/use-cases', ordinal: '3', label: 'Use Case', plural: 'Use Cases',
    count: `${useCaseCount}`,
    fields: ['ID', 'Short Name', 'Description', 'Assumptions', '\u2192 Business Driver(s)', '\u2192 User Story(ies)', '\u2192 Object Model', '\u2192 Ontology'],
    description: 'Concrete scenarios linking business needs to data standards and models.',
    bg: '#00B5B8', bgLight: 'rgba(0,181,184,0.05)', border: 'rgba(0,181,184,0.18)',
    text: '#007B7D', badgeBg: 'rgba(0,181,184,0.08)',
  },
  {
    href: '/use-cases', ordinal: '4', label: 'User Story', plural: 'User Stories',
    count: `${userStoryCount} tracked`,
    fields: ['ID', 'Actor', 'As a \u2026 I want to\u2026', '\u2192 Use Case', '\u2192 Object Model/Standard', '\u2192 Ontology'],
    description: '"As a [role], I want to [action]" \u2014 ground-level requirements linking to standards.',
    bg: '#0D8F92', bgLight: 'rgba(13,143,146,0.05)', border: 'rgba(13,143,146,0.15)',
    text: '#0D6B6E', badgeBg: 'rgba(13,143,146,0.07)',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">

      {/* Hero */}
      <div className="hero-gradient rounded-2xl px-8 py-12 mb-10 relative overflow-hidden">
        {/* Teal glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 85% 50%, rgba(0,181,184,0.15) 0%, transparent 70%)'
        }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,181,184,0.12)', border: '1px solid rgba(0,181,184,0.25)', color: '#5EEAED' }}
          >
            Education Data Interoperability
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            EDUcore Reference Library
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Navigate from high-level <strong style={{ color: '#5EEAED' }}>Topics</strong> through{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Business Drivers</strong> and{' '}
            <strong style={{ color: '#5EEAED' }}>Use Cases</strong> to individual{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>User Stories</strong> &mdash; each linked to{' '}
            <strong style={{ color: '#FFAB40' }}>Object Models</strong> and <strong style={{ color: '#FFAB40' }}>Ontology</strong> that implement them.
          </p>
        </div>
      </div>

      {/* The Information Model */}
      <section className="mb-14">
        <div className="section-divider mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#072A6C' }}>The Information Model</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">

          {/* Left: Hierarchy chain */}
          <div className="space-y-2 stagger-children">
            {LEVELS.map((level, i) => (
              <div key={level.href + level.ordinal}>
                <Link
                  href={level.href}
                  className="card group flex items-stretch overflow-hidden"
                  style={{ border: `1px solid ${level.border}` }}
                >
                  {/* Color stripe */}
                  <div className="w-1 shrink-0 rounded-l-2xl" style={{ background: level.bg }} />

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
                        <span className="text-sm font-semibold" style={{ color: level.text }}>
                          {level.plural}
                        </span>
                        <span
                          className="badge"
                          style={{ background: level.badgeBg, color: level.text }}
                        >
                          {level.count}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: '#8892A8' }}>
                        {level.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {level.fields.map(f => (
                          <span
                            key={f}
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={
                              f.startsWith('\u2192')
                                ? { background: level.badgeBg, color: level.text }
                                : { background: '#F4F5F8', color: '#8892A8' }
                            }
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span
                      className="opacity-0 group-hover:opacity-100 transition-all text-base shrink-0 mt-1 font-semibold translate-x-0 group-hover:translate-x-1"
                      style={{ color: level.bg }}
                    >
                      &rarr;
                    </span>
                  </div>
                </Link>

                {i < LEVELS.length - 1 && (
                  <div className="flex items-center pl-8 py-0.5">
                    <div className="w-px h-4 ml-3" style={{ background: '#DEE2EC' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Cross-cutting concerns */}
          <div className="space-y-4">

            {/* Object Model / Standards */}
            <div className="card overflow-hidden" style={{ border: '1px solid rgba(255,171,64,0.25)' }}>
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #FFAB40, #FF9100)' }}
              >
                <span className="w-2 h-2 rounded-full bg-white/50 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white">
                  Object Model / Standards
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ background: 'rgba(255,171,64,0.04)' }}>
                {OBJECT_MODEL_STANDARDS.map(s => (
                  <Link
                    key={s}
                    href="/standards"
                    className="text-xs px-2 py-1 rounded-md font-medium transition-colors hover:bg-amber-50"
                    style={{ background: '#fff', border: '1px solid rgba(255,171,64,0.25)', color: '#B86400' }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3" style={{ background: 'rgba(255,171,64,0.04)' }}>
                <p className="text-[11px]" style={{ color: '#C07800' }}>
                  Cross-referenced from Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* Ontology */}
            <div className="card overflow-hidden" style={{ border: '1px solid rgba(0,181,184,0.2)' }}>
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #00B5B8, #009DA0)' }}
              >
                <span className="w-2 h-2 rounded-full bg-white/50 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white">
                  Ontology
                </span>
              </div>
              <div className="px-4 py-3 flex gap-2" style={{ background: 'rgba(0,181,184,0.04)' }}>
                {['CEDS', 'CTDL'].map(s => (
                  <Link
                    key={s}
                    href="/ontology"
                    className="text-xs px-3 py-1.5 rounded-md font-semibold transition-colors hover:bg-teal-50"
                    style={{ background: '#fff', border: '1px solid rgba(0,181,184,0.2)', color: '#007B7D' }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-3" style={{ background: 'rgba(0,181,184,0.04)' }}>
                <p className="text-[11px]" style={{ color: '#007B7D' }}>
                  Shared vocabulary for Use Cases and User Stories
                </p>
              </div>
            </div>

            {/* How it connects */}
            <div className="card p-4" style={{ border: '1px solid rgba(7,42,108,0.06)' }}>
              <p className="text-[11px] leading-relaxed" style={{ color: '#8892A8' }}>
                <span className="font-semibold" style={{ color: '#072A6C' }}>How it connects:</span>{' '}
                Every Use Case and User Story links to one or more Object Models and an Ontology node.
                Standards are scored by CEDS domain alignment and surfaced on each Use Case page.
              </p>
            </div>

            {/* Standards library link */}
            <Link
              href="/standards"
              className="card group flex items-center justify-between p-4"
              style={{ border: '1px solid rgba(7,42,108,0.06)' }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: '#072A6C' }}>Standards Library</div>
                <div className="text-xs mt-0.5" style={{ color: '#8892A8' }}>{libraryEntries.length} standards documented</div>
              </div>
              <span className="font-semibold transition-all group-hover:translate-x-1" style={{ color: '#FFAB40' }}>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="section-divider mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#072A6C' }}>Tools</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
          {[
            { href: '/explorer', icon: '💬', label: 'AI Explorer', desc: 'Natural language discovery', accent: '#5B3FD3' },
            { href: '/alignment', icon: '📊', label: 'CEDS Alignment', desc: 'Standards x domain matrix', accent: '#072A6C' },
            { href: '/crosswalk', icon: '🔗', label: 'Field Crosswalk', desc: 'Cross-spec field mapping', accent: '#00B5B8' },
            { href: '/ontology', icon: '🕸️', label: 'Ontology Graph', desc: 'Interactive force graph', accent: '#FFAB40' },
          ].map(({ href, icon, label, desc, accent }) => (
            <Link
              key={href}
              href={href}
              className="card group p-5"
              style={{ border: '1px solid rgba(7,42,108,0.06)' }}
            >
              <div className="text-xl mb-3">{icon}</div>
              <div className="text-sm font-semibold mb-0.5 transition-colors" style={{ color: '#072A6C' }}>{label}</div>
              <div className="text-xs" style={{ color: '#8892A8' }}>{desc}</div>
              <div className="mt-3 text-xs font-semibold transition-all group-hover:translate-x-1 inline-block" style={{ color: accent }}>Explore &rarr;</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
