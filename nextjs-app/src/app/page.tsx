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

const STATS = [
  { label: 'Topics', value: useCaseTaxonomy.length, color: '#5B3FD3', href: '/topics' },
  { label: 'Value Drivers', value: stakeholderTaxonomy.length, color: '#072A6C', href: '/drivers' },
  { label: 'Use Cases', value: useCaseCount, color: '#00B5B8', href: '/use-cases' },
  { label: 'Standards', value: libraryEntries.length, color: '#FFAB40', href: '/standards' },
  { label: 'User Stories', value: userStoryCount, color: '#0D8F92', href: '/use-cases' },
];

const TOOLS = [
  { href: '/explorer', label: 'AI Explorer', desc: 'Natural language discovery across the entire reference library.', icon: '💬' },
  { href: '/alignment', label: 'CEDS Alignment', desc: 'Standards mapped against CEDS domain coverage.', icon: '📊' },
  { href: '/crosswalk', label: 'Field Crosswalk', desc: 'Cross-spec field mapping and equivalence table.', icon: '🔗' },
  { href: '/ontology', label: 'Ontology Graph', desc: 'Interactive force-directed graph of the ontology.', icon: '🕸️' },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 animate-fade-up">

      {/* Hero */}
      <div className="hero-gradient rounded-2xl px-8 sm:px-10 py-10 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-xl">
          <span
            className="inline-block text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,181,184,0.12)', border: '1px solid rgba(0,181,184,0.25)', color: '#5EEAED' }}
          >
            Education Data Interoperability
          </span>
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            EDUcore Reference Library
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Navigate from Topics through Value Drivers and Use Cases to individual User Stories
            — each linked to Object Models and Ontology that implement them.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3 mb-10">
        {STATS.map(({ label, value, color, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-brand-hover"
            style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#7A8499' }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick access — Topics */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Topics</h2>
          <Link href="/topics" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B3FD3' }}>View All &rarr;</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {useCaseTaxonomy.map((topic) => {
            const ucCount = topic.children.reduce((s, sub) => s + sub.children.length, 0);
            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="group flex items-start gap-4 rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-brand-hover"
                style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
              >
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold mb-0.5" style={{ color: '#072A6C' }}>{topic.label}</div>
                  <p className="text-xs leading-snug mb-2" style={{ color: '#5A6478' }}>{topic.subtitle}</p>
                  <div className="flex gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(91,63,211,0.06)', color: '#5B3FD3' }}>
                      {topic.children.length} drivers
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,181,184,0.06)', color: '#007B7D' }}>
                      {ucCount} use cases
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Tools</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map(({ href, label, desc, icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-brand-hover"
              style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}
            >
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-sm font-bold mb-0.5" style={{ color: '#072A6C' }}>{label}</div>
                <p className="text-xs leading-snug" style={{ color: '#5A6478' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
