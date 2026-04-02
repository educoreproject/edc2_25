import Link from 'next/link';
import { stakeholderTaxonomy, useCasesCedsRdf } from '@/lib/data/taxonomies';

export const metadata = {
  title: 'Business Drivers | EDUcore Reference Library',
  description: 'Stakeholder groups and the business challenges driving education data interoperability.',
};

const LEVEL_CHAIN = [
  { label: 'Topics',           color: '#5B3FD3', href: '/topics',    active: false },
  { label: 'Business Drivers', color: '#072A6C', href: '/drivers',   active: true  },
  { label: 'Use Cases',        color: '#00B5B8', href: '/use-cases', active: false },
  { label: 'User Stories',     color: '#0D8F92', href: '/use-cases', active: false },
];

export default function DriversPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: '#8892A8' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/topics" className="hover:underline font-medium" style={{ color: '#5B3FD3' }}>Topics</Link>
        <span>/</span>
        <span className="flex items-center gap-1.5 font-medium" style={{ color: '#072A6C' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#072A6C' }} />
          Business Drivers
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(7,42,108,0.07)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#072A6C' }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Business Drivers</h1>
            <span className="badge" style={{ background: 'rgba(7,42,108,0.07)', color: '#072A6C' }}>
              Level 2
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#8892A8' }}>
            Stakeholder groups and the business challenges they face. Each links down to Use Cases and up to Topics.
          </p>
        </div>
      </div>

      {/* Level chain */}
      <div className="flex items-center gap-2 mb-8 text-xs overflow-x-auto pb-1">
        {LEVEL_CHAIN.map(({ label, color, href, active }, i) => (
          <span key={label} className="flex items-center gap-2 shrink-0">
            {i > 0 && <span style={{ color: '#DEE2EC' }}>/</span>}
            <Link
              href={href}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors"
              style={active
                ? { background: '#072A6C', color: '#fff' }
                : { color: '#8892A8' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#00B5B8' : color }} />
              {label}
            </Link>
          </span>
        ))}
      </div>

      {/* Driver cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {stakeholderTaxonomy.map((group) => {
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
              className="card group flex flex-col overflow-hidden"
              style={{ border: '1px solid rgba(7,42,108,0.08)' }}
            >
              <div className="h-1" style={{ background: 'linear-gradient(135deg, #072A6C, #0a3a8f)' }} />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: 'rgba(7,42,108,0.05)', border: '1px solid rgba(7,42,108,0.08)' }}
                  >
                    {group.icon}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="badge" style={{ background: 'rgba(7,42,108,0.07)', color: '#072A6C' }}>
                      {group.children.length} stakeholder{group.children.length !== 1 ? 's' : ''}
                    </span>
                    {relatedUseCases.length > 0 && (
                      <span className="badge" style={{ background: 'rgba(0,181,184,0.07)', color: '#007B7D' }}>
                        {relatedUseCases.length} use case{relatedUseCases.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-sm font-bold mb-1 transition-colors" style={{ color: '#072A6C' }}>
                  {group.label}
                </h2>
                <p className="text-xs mb-4 leading-snug" style={{ color: '#8892A8' }}>
                  {group.children.map(c => c.label).join(' · ')}
                </p>

                <div className="mt-auto">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#B0B8C9' }}>Top Business Needs</p>
                  <ul className="space-y-1.5">
                    {previewNeeds.map((need, i) => (
                      <li key={i} className="text-xs flex items-start gap-1.5 leading-snug" style={{ color: '#8892A8' }}>
                        <span className="mt-0.5 shrink-0" style={{ color: '#00B5B8' }}>&#8226;</span>
                        <span className="line-clamp-2">{need}</span>
                      </li>
                    ))}
                    {allNeeds.length > 3 && (
                      <li className="text-xs pl-3" style={{ color: '#B0B8C9' }}>+{allNeeds.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>

              <div
                className="px-5 py-3 flex items-center justify-between border-t"
                style={{ background: 'rgba(7,42,108,0.03)', borderColor: 'rgba(7,42,108,0.06)' }}
              >
                <span className="text-xs font-semibold" style={{ color: '#072A6C' }}>View stakeholders &amp; use cases</span>
                <span className="font-semibold transition-transform group-hover:translate-x-1" style={{ color: '#00B5B8' }}>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
