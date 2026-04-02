import { cedsDomains, cedsAlignmentMatrix } from '@/lib/data/ceds-alignment';
import MetadataBadge from '@/components/MetadataBadge';

const statusColors: Record<string, string> = {
  full: 'bg-emerald-500',
  partial: 'bg-amber-400',
  gap: 'bg-gray-300',
};

const statusTooltip: Record<string, string> = {
  full: 'Full alignment',
  partial: 'Partial alignment',
  gap: 'Gap',
};

export default function AlignmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CEDS Alignment Matrix</h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          How each education data standard aligns with the 13 CEDS (Common Education Data
          Standards) domains. Each cell shows whether a standard has full, partial, or no
          alignment with a given domain.
        </p>
      </div>

      {/* Scrollable matrix */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-10 bg-gray-50 text-left text-xs font-semibold text-gray-600 px-4 py-3 min-w-[180px] border-r border-gray-200">
                  Standard
                </th>
                {cedsDomains.map((domain) => (
                  <th
                    key={domain.id}
                    className="text-center text-[10px] font-semibold text-gray-600 px-1 py-3 min-w-[64px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base leading-none">{domain.icon}</span>
                      <span className="leading-tight">{domain.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cedsAlignmentMatrix.map((entry, idx) => (
                <tr
                  key={entry.entryId}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                >
                  <td className="sticky left-0 z-10 text-sm font-medium text-gray-900 px-4 py-3 border-r border-gray-200 bg-inherit">
                    {entry.entryShortName}
                  </td>
                  {cedsDomains.map((domain) => {
                    const cell = entry.domains[domain.id as keyof typeof entry.domains];
                    const status = cell?.status ?? 'gap';
                    return (
                      <td key={domain.id} className="text-center px-1 py-3">
                        <div className="flex items-center justify-center" title={`${entry.entryShortName} / ${domain.label}: ${statusTooltip[status]}${cell?.notes ? ' — ' + cell.notes : ''}`}>
                          <span
                            className={`inline-block w-6 h-6 rounded-md ${statusColors[status]}`}
                            aria-label={`${statusTooltip[status]}: ${entry.entryShortName} and ${domain.label}`}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Legend</span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-md bg-emerald-500" />
          <span className="text-xs text-gray-600">Full alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-md bg-amber-400" />
          <span className="text-xs text-gray-600">Partial alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-md bg-gray-300" />
          <span className="text-xs text-gray-600">Gap (no alignment)</span>
        </div>
      </div>

      {/* Domain detail cards */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Alignment Details</h2>
        <div className="space-y-4">
          {cedsAlignmentMatrix.map((entry) => (
            <details key={entry.entryId} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold text-gray-900">{entry.entryShortName}</span>
                <span className="ml-3 inline-flex gap-1.5">
                  {(() => {
                    const statuses = cedsDomains.map((d) => entry.domains[d.id as keyof typeof entry.domains]?.status ?? 'gap');
                    const full = statuses.filter((s) => s === 'full').length;
                    const partial = statuses.filter((s) => s === 'partial').length;
                    const gap = statuses.filter((s) => s === 'gap').length;
                    return (
                      <>
                        <MetadataBadge kind="status" value="full" label={`${full} full`} />
                        <MetadataBadge kind="status" value="partial" label={`${partial} partial`} />
                        <MetadataBadge kind="status" value="gap" label={`${gap} gap`} />
                      </>
                    );
                  })()}
                </span>
              </summary>
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {cedsDomains.map((domain) => {
                    const cell = entry.domains[domain.id as keyof typeof entry.domains];
                    if (!cell) return null;
                    return (
                      <div key={domain.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm">{domain.icon}</span>
                          <span className="text-xs font-semibold text-gray-700">{domain.label}</span>
                          <MetadataBadge kind="status" value={cell.status} />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{cell.notes}</p>
                        {cell.cedsElements.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cell.cedsElements.map((el, i) => (
                              <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {el}
                              </span>
                            ))}
                          </div>
                        )}
                        {cell.gapNotes && (
                          <p className="text-[10px] text-red-500 mt-1.5 italic">{cell.gapNotes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
