import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDriverById, getUseCasesForDriver } from '@/lib/data/resolvers';

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const { driverId } = await params;
  const group = getDriverById(driverId);
  if (!group) notFound();

  const useCases = getUseCasesForDriver(driverId);
  const allNeeds = group.children.flatMap(c => c.businessNeeds);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ color: '#7A8499' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>›</span>
        <Link href="/topics" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#5B3FD3' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#5B3FD3' }} />
          Topics
        </Link>
        <span>›</span>
        <Link href="/drivers" className="hover:underline font-semibold flex items-center gap-1" style={{ color: '#072A6C' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#072A6C' }} />
          Business Drivers
        </Link>
        <span>›</span>
        <span className="font-semibold" style={{ color: '#072A6C' }}>{group.label}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1.5px solid rgba(7,42,108,0.25)', boxShadow: '0 2px 8px rgba(7,42,108,0.06)' }}>
        <div className="h-1.5" style={{ background: '#072A6C' }} />
        <div className="px-6 py-5" style={{ background: 'rgba(7,42,108,0.05)' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: '#fff', border: '1.5px solid rgba(7,42,108,0.2)' }}>
              {group.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>{group.label}</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(7,42,108,0.1)', color: '#072A6C' }}>
                  Level 2 — Business Driver
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(7,42,108,0.1)', color: '#072A6C' }}>
                  {group.children.length} stakeholder{group.children.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#F8F9FC', color: '#7A8499', border: '1px solid #EEF1F7' }}>
                  {allNeeds.length} business needs
                </span>
                {useCases.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,181,184,0.12)', color: '#007B7D' }}>
                    {useCases.length} related use case{useCases.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">

        {/* Main: Stakeholders + Needs */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#C4CBDA' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#072A6C' }} />
            Stakeholders &amp; Business Needs
          </p>

          <div className="space-y-4">
            {group.children.map((stakeholder) => (
              <div
                key={stakeholder.id}
                className="rounded-xl overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}
              >
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid #EEF1F7' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#072A6C' }} />
                  <h3 className="text-sm font-bold" style={{ color: '#072A6C' }}>{stakeholder.label}</h3>
                  <span className="ml-auto text-xs font-semibold" style={{ color: '#C4CBDA' }}>
                    {stakeholder.businessNeeds.length} needs
                  </span>
                </div>
                <ul className="px-5 py-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {stakeholder.businessNeeds.map((need, i) => (
                    <li key={i} className="text-xs flex items-start gap-2 leading-snug" style={{ color: '#7A8499' }}>
                      <span className="mt-0.5 shrink-0" style={{ color: '#00B5B8' }}>•</span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {useCases.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#C4CBDA' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#00B5B8' }} />
                Related Use Cases
                <span style={{ fontWeight: 400 }}>— Level 3</span>
              </p>

              <div className="space-y-2">
                {useCases.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/use-cases/${uc.id}`}
                    className="group flex items-start gap-3 rounded-xl p-4 transition-all hover:shadow-brand-hover"
                    style={{ background: '#fff', border: '1.5px solid #EEF1F7', boxShadow: '0 2px 8px rgba(7,42,108,0.04)' }}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{uc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold leading-snug" style={{ color: '#072A6C' }}>
                        {uc.label}
                      </h3>
                      {uc.description && (
                        <p className="text-[11px] mt-1 line-clamp-2 leading-snug" style={{ color: '#7A8499' }}>
                          {uc.description}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-bold" style={{ color: '#00B5B8' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl p-4" style={{ background: '#fff', border: '1.5px solid #EEF1F7' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C4CBDA' }}>Navigate</p>
            <div className="space-y-2">
              <Link href="/topics" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#5B3FD3' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#5B3FD3' }} />
                ↑ All Topics
              </Link>
              <Link href="/drivers" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#072A6C' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#072A6C' }} />
                ← All Business Drivers
              </Link>
              <Link href="/use-cases" className="flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: '#007B7D' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00B5B8' }} />
                ↓ All Use Cases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
