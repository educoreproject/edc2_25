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
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/topics" className="flex items-center gap-1 hover:text-violet-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-violet-600 font-medium">Topics</span>
        </Link>
        <span>›</span>
        <Link href="/drivers" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-indigo-600 font-medium">Business Drivers</span>
        </Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{group.label}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl border border-indigo-200 overflow-hidden mb-8">
        <div className="h-1.5 bg-indigo-500" />
        <div className="bg-indigo-50 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white rounded-xl border border-indigo-200 flex items-center justify-center text-3xl shrink-0">
              {group.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl font-bold text-indigo-700">{group.label}</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Level 2 — Business Driver
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                  {group.children.length} stakeholder{group.children.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                  {allNeeds.length} business needs
                </span>
                {useCases.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-100 text-sky-700">
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
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Stakeholders &amp; Business Needs
          </h2>

          <div className="space-y-4">
            {group.children.map((stakeholder) => (
              <div
                key={stakeholder.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-300" />
                  <h3 className="text-sm font-semibold text-gray-900">{stakeholder.label}</h3>
                  <span className="text-xs text-gray-400 ml-auto">
                    {stakeholder.businessNeeds.length} needs
                  </span>
                </div>
                <ul className="px-5 py-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {stakeholder.businessNeeds.map((need, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2 leading-snug">
                      <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Related Use Cases */}
        <div className="space-y-5">
          {useCases.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Related Use Cases
                <span className="font-normal text-gray-300">— Level 3</span>
              </h2>

              <div className="space-y-2">
                {useCases.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/use-cases/${uc.id}`}
                    className="group flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-lg shrink-0 mt-0.5">{uc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {uc.label}
                      </h3>
                      {uc.description && (
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-snug">
                          {uc.description}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-300 group-hover:text-sky-400 transition-colors shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigate up */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Navigate
            </p>
            <div className="space-y-2">
              <Link href="/topics" className="flex items-center gap-2 text-xs text-violet-600 hover:text-violet-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                ↑ All Topics
              </Link>
              <Link href="/drivers" className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                ← All Business Drivers
              </Link>
              <Link href="/use-cases" className="flex items-center gap-2 text-xs text-sky-600 hover:text-sky-800 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                ↓ All Use Cases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
