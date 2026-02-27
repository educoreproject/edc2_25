// CedsAlignmentPage.jsx — CEDS ontology vocabulary match-up view.
// Shows how library standards map to CEDS domains.

import { useState } from 'react';
import { cedsDomains, cedsAlignmentMatrix, getDomainSummary } from '../data/cedsAlignment';
import ExplainerBadge from './ExplainerBadge';

// Lookup from CEDS element notation to canonical ontology URI
const cedsElementUri = {
  // Credentials
  Credential: 'C200087', CredentialDefinition: 'C200087', CredentialAward: 'C200079',
  CredentialType: 'C000071', CredentialDefinitionVerificationType: 'C001753',
  PersonCredential: 'C200280',
  // Competencies
  CompetencyDefinition: 'C200065', CompetencyFramework: 'C200067', CompetencySet: 'C200068',
  // Workforce
  WorkforceEmploymentQuarterlyData: 'C200373', StandardOccupationalClassification: 'P000730',
  WorkforceProgramParticipation: 'C200375',
  // K-12
  K12StudentAcademicRecord: 'C200210', CourseSection: 'C200074',
  K12StudentEnrollment: 'C200219', GradeLevel: 'C002175',
  // Postsecondary
  PersonDegreeOrCertificate: 'C200281', PostsecondaryStudentAcademicRecord: 'C200336',
  PostsecondaryProgram: 'C200331', PostsecondaryInstitution: 'C200329',
  // CTE
  ProgramParticipationCareerAndTechnical: 'C200318', CareerCluster: 'C001288',
  CareerAndTechnicalEducationInstructorIndustryCertification: 'C001318',
  CareerAndTechnicalEducationConcentrator: 'C000037',
  // Assessments
  AssessmentResult: 'C200047', AssessmentPerformanceLevel: 'C200038',
  Assessment: 'C200010', AssessmentItem: 'C200023',
  // Data Governance
  PersonIdentification: 'C200291', Authorization: 'C200055', AuthorizationDocument: 'C200056',
  // Equity
  PersonLanguage: 'C200293', PersonDisability: 'C200285',
  EconomicDisadvantageStatus: 'C000086', EnglishLearnerStatus: 'C000180',
  // Other
  PersonProgramParticipation: 'C200309', LearningResource: 'C200229',
  ImplementationStatus: 'C000851', OrganizationIdentificationSystem: 'C000827',
};

function cedsElementHref(elementName) {
  const code = cedsElementUri[elementName];
  if (code) return `http://ceds.ed.gov/terms#${code}`;
  return null;
}

const statusConfig = {
  full:    { bg: 'bg-emerald-50',  border: 'border-emerald-300', text: 'text-emerald-700', dot: '🟢', label: 'Full overlap'    },
  partial: { bg: 'bg-amber-50',    border: 'border-amber-300',   text: 'text-amber-700',   dot: '🟡', label: 'Partial overlap' },
  gap:     { bg: 'bg-red-50',      border: 'border-red-200',     text: 'text-red-600',     dot: '🔴', label: 'Gap'             },
};

function MatrixCell({ data, onClick, isActive }) {
  if (!data) return <td className="border border-gray-100 p-1 bg-gray-50/50" />;
  const cfg = statusConfig[data.status];
  return (
    <td
      onClick={onClick}
      className={`border border-gray-100 p-1.5 text-center cursor-pointer transition-all
        ${cfg.bg} ${isActive ? 'ring-2 ring-inset ring-indigo-500' : 'hover:opacity-75'}`}
      title={data.notes}
    >
      <span className="text-base leading-none select-none">{cfg.dot}</span>
    </td>
  );
}

function AlignmentDetail({ entryRow, domain, onClose }) {
  if (!entryRow || !domain) return null;
  const data = entryRow.domains[domain.id];
  const cfg = statusConfig[data.status];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative border border-gray-200"
           onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg transition-colors">✕</button>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{domain.icon}</span>
            <span className="font-bold text-gray-900">{domain.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              {cfg.dot} {cfg.label}
            </span>
          </div>
          <div className="text-sm text-gray-400">{entryRow.entryShortName}</div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alignment notes</div>
          <p className="text-sm text-gray-600 leading-relaxed">{data.notes}</p>
        </div>

        {data.cedsElements?.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Matching CEDS elements / entities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.cedsElements.map(el => {
                const href = cedsElementHref(el);
                return href ? (
                  <a key={el}
                     href={href}
                     target="_blank" rel="noreferrer"
                     className="text-xs font-mono bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-lg hover:bg-indigo-100 transition-colors"
                     title={href}>
                    {el} ↗
                  </a>
                ) : (
                  <span key={el} className="text-xs font-mono bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-lg">
                    {el}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {data.gapNotes && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Gap detail</div>
            <p className="text-xs text-red-600 leading-relaxed">{data.gapNotes}</p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
          Source: <a href="https://ceds.ed.gov" target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">ceds.ed.gov</a>
          {' · '}
          <a href="https://github.com/CEDStandards/CEDS-Elements" target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">
            CEDS-Elements GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function DomainSummaryBar({ summary }) {
  const pct = (n) => Math.round((n / summary.total) * 100);
  return (
    <div className="flex h-2.5 rounded-full overflow-hidden w-24 bg-gray-100">
      <div className="bg-emerald-400" style={{ width: `${pct(summary.full)}%` }}    title={`${summary.full} full`} />
      <div className="bg-amber-300"   style={{ width: `${pct(summary.partial)}%` }} title={`${summary.partial} partial`} />
      <div className="bg-red-200"     style={{ width: `${pct(summary.gap)}%` }}     title={`${summary.gap} gap`} />
    </div>
  );
}

export default function CedsAlignmentPage({ onNavigateToEntry }) {
  const [activeCell, setActiveCell] = useState(null);
  const [viewMode, setViewMode] = useState('matrix');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  const domainSummaries = getDomainSummary();

  const handleCellClick = (entryIdx, domainId) => {
    const same = activeCell?.entryIdx === entryIdx && activeCell?.domainId === domainId;
    setActiveCell(same ? null : { entryIdx, domainId });
  };

  const activeEntry  = activeCell ? cedsAlignmentMatrix[activeCell.entryIdx] : null;
  const activeDomain = activeCell ? cedsDomains.find(d => d.id === activeCell.domainId) : null;

  const gapsByDomain = cedsDomains.map(domain => ({
    domain,
    gaps: cedsAlignmentMatrix.filter(e => e.domains[domain.id]?.status === 'gap'),
  })).filter(g => g.gaps.length > 0);

  const ecosystemGapDomains = domainSummaries.filter(d => d.gap === cedsAlignmentMatrix.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">CEDS Alignment</span>
            <a href="https://ceds.ed.gov" target="_blank" rel="noreferrer"
               className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">↗ ceds.ed.gov</a>
            <a href="https://github.com/CEDStandards/CEDS-Elements" target="_blank" rel="noreferrer"
               className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">↗ GitHub</a>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CEDS Vocabulary Match-Up</h1>
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            How each library standard maps to the 13 CEDS ontology domains. Click any cell for detail on
            overlapping elements and gaps.
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {[
            { id: 'matrix', label: '🔲 Matrix'       },
            { id: 'gaps',   label: '🔴 Gap Analysis' },
            { id: 'domain', label: '📊 By Domain'    },
          ].map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                ${viewMode === v.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <ExplainerBadge icon="🗺️">
        <strong>Why CEDS alignment matters:</strong> State longitudinal data systems (SLDS) and federal reporting
        speak CEDS natively. Gaps = work needed to extend or bridge these standards.
      </ExplainerBadge>

      <div className="flex items-center gap-4 text-xs my-4">
        {Object.entries(statusConfig).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <span>{v.dot}</span>
            <span className="text-gray-500">{v.label}</span>
          </div>
        ))}
        <span className="text-gray-300 ml-2">Click any cell for detail</span>
      </div>

      {/* Matrix view */}
      {viewMode === 'matrix' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="text-xs border-collapse min-w-full">
            <thead>
              <tr>
                <th className="border-b border-r border-gray-100 bg-white p-2.5 text-left text-gray-500 font-semibold min-w-44 sticky left-0 z-10">
                  Standard ↓ &nbsp;/&nbsp; CEDS Domain →
                </th>
                {cedsDomains.map(domain => (
                  <th key={domain.id}
                    className="border-b border-r border-gray-100 bg-white p-2 text-center font-semibold text-gray-600 min-w-20">
                    <div className="text-base">{domain.icon}</div>
                    <div className="leading-tight mt-0.5" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 72, fontSize: 10 }}>
                      {domain.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cedsAlignmentMatrix.map((row, entryIdx) => (
                <tr key={row.entryId} className="hover:bg-gray-50/50">
                  <td className="border-b border-r border-gray-100 bg-white p-2.5 sticky left-0 z-10">
                    <button
                      onClick={() => onNavigateToEntry?.(row.entryId)}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 text-left text-xs leading-tight transition-colors"
                    >
                      {row.entryShortName}
                    </button>
                    <div className="mt-1.5">
                      {(() => {
                        const statuses = cedsDomains.map(d => row.domains[d.id]?.status ?? 'gap');
                        const full    = statuses.filter(s => s === 'full').length;
                        const partial = statuses.filter(s => s === 'partial').length;
                        const gap     = statuses.filter(s => s === 'gap').length;
                        const total   = statuses.length;
                        const pct     = n => Math.round((n / total) * 100);
                        return (
                          <div className="flex h-1.5 rounded-full overflow-hidden w-full bg-gray-100" title={`${full} full · ${partial} partial · ${gap} gap`}>
                            <div className="bg-emerald-400" style={{ width: `${pct(full)}%` }} />
                            <div className="bg-amber-300"   style={{ width: `${pct(partial)}%` }} />
                            <div className="bg-red-200"     style={{ width: `${pct(gap)}%` }} />
                          </div>
                        );
                      })()}
                    </div>
                  </td>
                  {cedsDomains.map(domain => (
                    <MatrixCell
                      key={domain.id}
                      data={row.domains[domain.id]}
                      onClick={() => handleCellClick(entryIdx, domain.id)}
                      isActive={activeCell?.entryIdx === entryIdx && activeCell?.domainId === domain.id}
                    />
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50/80 font-semibold">
                <td className="border-t border-r border-gray-100 p-2.5 text-xs text-gray-500 sticky left-0 bg-gray-50/80">
                  Domain coverage
                </td>
                {domainSummaries.map(s => (
                  <td key={s.domainId} className="border-t border-r border-gray-100 p-1.5 text-center">
                    <DomainSummaryBar summary={s} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Gap Analysis view */}
      {viewMode === 'gaps' && (
        <div className="space-y-6">
          {ecosystemGapDomains.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-red-700 mb-2">
                🚨 Ecosystem-wide gaps — no library standard covers these CEDS domains
              </h2>
              <p className="text-sm text-red-600 mb-3">
                These CEDS domains have <strong>zero</strong> coverage across all {cedsAlignmentMatrix.length} library entries.
              </p>
              <div className="flex flex-wrap gap-2">
                {ecosystemGapDomains.map(d => {
                  const domain = cedsDomains.find(dom => dom.id === d.domainId);
                  return (
                    <span key={d.domainId}
                      className="flex items-center gap-1 bg-white border border-red-200 text-red-600 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm">
                      {domain.icon} {domain.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <h2 className="text-base font-bold text-gray-800">Gaps by CEDS Domain</h2>
          <div className="grid grid-cols-1 gap-4">
            {gapsByDomain.map(({ domain, gaps }) => (
              <div key={domain.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{domain.icon}</span>
                    <span className="font-bold text-gray-800">{domain.label}</span>
                  </div>
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-medium">
                    {gaps.length} of {cedsAlignmentMatrix.length} not covered
                  </span>
                </div>
                <div className="space-y-2">
                  {gaps.map(entry => (
                    <div key={entry.entryId} className="flex items-start gap-3 bg-red-50/50 rounded-lg p-3 border border-red-100/50">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">🔴</span>
                      <div className="flex-1">
                        <button
                          onClick={() => onNavigateToEntry?.(entry.entryId)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                          {entry.entryShortName}
                        </button>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {entry.domains[domain.id]?.notes}
                        </p>
                        {entry.domains[domain.id]?.gapNotes && (
                          <p className="text-xs text-red-500 mt-1 italic">
                            {entry.domains[domain.id].gapNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Domain view */}
      {viewMode === 'domain' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setSelectedDomainFilter('all')}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${selectedDomainFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              All domains
            </button>
            {cedsDomains.map(d => (
              <button key={d.id} onClick={() => setSelectedDomainFilter(d.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${selectedDomainFilter === d.id ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>

          {cedsDomains
            .filter(d => selectedDomainFilter === 'all' || d.id === selectedDomainFilter)
            .map(domain => {
              const summary = domainSummaries.find(s => s.domainId === domain.id);
              return (
                <div key={domain.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{domain.icon}</span>
                      <span className="font-bold text-gray-800">{domain.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600">{summary.full} full</span>
                      <span className="text-amber-600">{summary.partial} partial</span>
                      <span className="text-red-500">{summary.gap} gap</span>
                      <DomainSummaryBar summary={summary} />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cedsAlignmentMatrix.map(entry => {
                      const data = entry.domains[domain.id];
                      const cfg  = statusConfig[data.status];
                      return (
                        <div key={entry.entryId} className={`flex items-start gap-3 p-3.5 ${cfg.bg}`}>
                          <span className="text-base flex-shrink-0 mt-0.5">{cfg.dot}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <button
                                onClick={() => onNavigateToEntry?.(entry.entryId)}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                {entry.entryShortName}
                              </button>
                              <span className={`text-xs px-1.5 py-0.5 rounded-md border font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{data.notes}</p>
                            {data.cedsElements?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {data.cedsElements.map(el => {
                                  const href = cedsElementHref(el);
                                  return href ? (
                                    <a key={el} href={href} target="_blank" rel="noreferrer"
                                       className="text-xs font-mono bg-white border border-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded hover:bg-indigo-50 transition-colors"
                                       title={href}>
                                      {el} ↗
                                    </a>
                                  ) : (
                                    <span key={el} className="text-xs font-mono bg-white border border-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                      {el}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Detail drawer */}
      {activeCell && (
        <AlignmentDetail
          entryRow={activeEntry}
          domain={activeDomain}
          onClose={() => setActiveCell(null)}
        />
      )}

      {/* Source footer */}
      <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
        <div>
          <strong className="text-gray-500">CEDS sources:</strong>{' '}
          <a href="https://ceds.ed.gov/desHome.aspx" target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700 transition-colors">
            ceds.ed.gov — CEDS Ontology (v11, 13 domains)
          </a>
          {' · '}
          <a href="https://github.com/CEDStandards/CEDS-Elements" target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700 transition-colors">
            CEDStandards/CEDS-Elements on GitHub
          </a>
          {' · '}
          <a href="https://github.com/CEDStandards/CEDS-Ontology" target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700 transition-colors">
            CEDStandards/CEDS-Ontology (OWL)
          </a>
        </div>
        <div className="text-gray-300">
          Alignment assessments are editorial judgements based on published CEDS element definitions and library standard specifications.
        </div>
      </div>
    </div>
  );
}
