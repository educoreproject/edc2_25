import { fieldMappings, specLabels } from '@/lib/data/field-mappings';

const strengthColors: Record<string, string> = {
  equivalent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  close: 'bg-amber-50 text-amber-700 border-amber-200',
  related: 'bg-gray-100 text-gray-600 border-gray-200',
};

const specKeys = Object.keys(specLabels) as Array<keyof typeof specLabels>;

export default function CrosswalkPage() {
  // Group mappings by entityType for visual sections
  const groups: Record<string, typeof fieldMappings> = {};
  for (const mapping of fieldMappings) {
    const group = mapping.entityType;
    if (!groups[group]) groups[group] = [];
    groups[group].push(mapping);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Field-Level Crosswalk</h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          A concept-by-concept mapping of equivalent fields across five education data
          standards. Each row shows how the same concept is represented in each
          specification, with match strength indicating semantic closeness.
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Match strength</span>
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${strengthColors.equivalent}`}>
          Equivalent
        </span>
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${strengthColors.close}`}>
          Close
        </span>
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${strengthColors.related}`}>
          Related
        </span>
      </div>

      {/* Scrollable table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-10 bg-gray-50 text-left text-xs font-semibold text-gray-600 px-4 py-3 min-w-[160px] border-r border-gray-200">
                  Concept
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 px-3 py-3 min-w-[120px]">
                  Entity Type
                </th>
                {specKeys.map((key) => (
                  <th
                    key={key}
                    className="text-left text-xs font-semibold text-gray-600 px-3 py-3 min-w-[140px]"
                  >
                    {specLabels[key]}
                  </th>
                ))}
                <th className="text-center text-xs font-semibold text-gray-600 px-3 py-3 min-w-[90px]">
                  Strength
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 px-3 py-3 min-w-[160px]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groups).map(([groupName, mappings]) => (
                <>
                  {/* Section header row */}
                  <tr key={`group-${groupName}`} className="bg-indigo-50/60">
                    <td
                      colSpan={specKeys.length + 4}
                      className="sticky left-0 z-10 px-4 py-2 text-xs font-bold text-indigo-700 tracking-wide"
                    >
                      {groupName}
                    </td>
                  </tr>
                  {mappings.map((mapping, idx) => (
                    <tr
                      key={`${groupName}-${mapping.concept}`}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
                    >
                      <td className="sticky left-0 z-10 bg-inherit text-sm font-medium text-gray-900 px-4 py-2.5 border-r border-gray-200">
                        {mapping.concept}
                      </td>
                      <td className="text-xs text-gray-500 px-3 py-2.5 font-mono">
                        {mapping.entityType}
                      </td>
                      {specKeys.map((specKey) => {
                        const m = mapping.mappings[specKey];
                        if (!m) {
                          return (
                            <td key={specKey} className="text-xs text-gray-300 px-3 py-2.5">
                              &mdash;
                            </td>
                          );
                        }
                        return (
                          <td key={specKey} className="px-3 py-2.5">
                            <div className="text-xs font-medium text-gray-800">{m.field}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[180px]" title={m.path}>
                              {m.path}
                            </div>
                          </td>
                        );
                      })}
                      <td className="text-center px-3 py-2.5">
                        <span
                          className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${strengthColors[mapping.matchStrength] ?? strengthColors.related}`}
                        >
                          {mapping.matchStrength}
                        </span>
                      </td>
                      <td className="text-xs text-gray-500 px-3 py-2.5 max-w-[200px]">
                        {mapping.notes}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-gray-500">
        <span>
          <span className="font-semibold text-gray-700">{fieldMappings.length}</span> field
          mappings across{' '}
          <span className="font-semibold text-gray-700">{specKeys.length}</span> specifications
        </span>
        <span>
          <span className="font-semibold text-emerald-600">
            {fieldMappings.filter((m) => m.matchStrength === 'equivalent').length}
          </span>{' '}
          equivalent
        </span>
        <span>
          <span className="font-semibold text-amber-600">
            {fieldMappings.filter((m) => m.matchStrength === 'close').length}
          </span>{' '}
          close
        </span>
        <span>
          <span className="font-semibold text-gray-600">
            {fieldMappings.filter((m) => m.matchStrength === 'related').length}
          </span>{' '}
          related
        </span>
      </div>
    </div>
  );
}
