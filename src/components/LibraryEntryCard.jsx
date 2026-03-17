// LibraryEntryCard.jsx — Card component for a single library entry.
// Redesigned for Standards Implementers: clear spec overview, implementation pathway,
// cross-spec awareness, and burden transparency in scannable sections.

import { useState, useEffect, useRef } from 'react';
import MetadataBadge from './MetadataBadge';
import ExplainerBadge from './ExplainerBadge';
import { entryTitles } from '../data/libraryEntries';

const burdenIcon = { low: '🟢', medium: '🟡', high: '🔴' };
const concernIcon = { 'low-concern': '🟢', 'medium-concern': '🟡', 'high-concern': '🔴' };
const burdenLabel = { low: 'Low', medium: 'Moderate', high: 'High' };
const concernLabel = { 'low-concern': 'Low', 'medium-concern': 'Moderate', 'high-concern': 'High' };
const rubricLevelColor = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

export default function LibraryEntryCard({
  entry,
  showExplainers = false,
  isSelected = false,
  onNavigateToEntry,
  onClearSelection,
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const cardRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      setExpanded(true);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      onClearSelection?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'connections', label: 'Connections' },
    { id: 'considerations', label: 'Equity & Privacy' },
  ];

  return (
    <div
      ref={cardRef}
      className={`bg-white border rounded-xl transition-all duration-200
        ${expanded
          ? 'border-indigo-200 shadow-md ring-1 ring-indigo-100'
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'}
        ${isSelected ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
    >
      {/* Card header — always visible */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3 className="font-semibold text-gray-900 text-base">{entry.title}</h3>
              <MetadataBadge kind="status" value={entry.status} label={entry.status === 'approved' ? 'Approved' : 'Under Review'} />
              <MetadataBadge kind="access" value={entry.accessLevel} label={entry.accessLevel === 'open' ? 'Open' : 'Restricted'} />
            </div>

            {/* Spec metadata line */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5 flex-wrap">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{entry.type}</span>
              <span className="text-gray-300">|</span>
              <span>{entry.category}</span>
              <span className="text-gray-300">|</span>
              <span>v{entry.version}</span>
              <span className="text-gray-300">|</span>
              <span>{entry.governanceBody || entry.owner}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>
          </div>
        </div>

        {/* Four metadata signals */}
        {showExplainers && (
          <ExplainerBadge icon="🗂️">
            <strong>Quick-scan signals:</strong> These four fields help you triage specifications at a glance — answering: Can I afford this? Do I have the infrastructure? Are there equity concerns? What's the privacy risk?
          </ExplainerBadge>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-xs text-gray-400 font-medium mb-1">Burden</div>
            <MetadataBadge kind="burden" value={entry.implementationBurden}
              label={`${burdenIcon[entry.implementationBurden]} ${burdenLabel[entry.implementationBurden]}`} />
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-xs text-gray-400 font-medium mb-1">Capabilities</div>
            <div className="text-xs text-gray-700 font-medium">{entry.requiredCapabilities.length} required</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-xs text-gray-400 font-medium mb-1">Equity</div>
            <MetadataBadge kind="concern" value={entry.equityConsiderations.level}
              label={`${concernIcon[entry.equityConsiderations.level]} ${concernLabel[entry.equityConsiderations.level]}`} />
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-xs text-gray-400 font-medium mb-1">Privacy</div>
            <MetadataBadge kind="concern" value={entry.privacyConsiderations.level}
              label={`${concernIcon[entry.privacyConsiderations.level]} ${concernLabel[entry.privacyConsiderations.level]}`} />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {entry.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-xs font-medium rounded-lg px-3.5 py-2 transition-colors
              ${expanded
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
          >
            {expanded ? 'Hide details' : 'View full details'}
          </button>
          {entry.accessUrl && entry.accessUrl !== '#' && (
            <a href={entry.accessUrl} target="_blank" rel="noreferrer"
               className="text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3.5 py-2 hover:bg-indigo-50 transition-colors">
              Access resource
            </a>
          )}
        </div>
      </div>

      {/* Expanded detail panel — tabbed */}
      {expanded && (
        <div className="border-t border-gray-100">

          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-slate-50/70 px-5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-medium px-4 py-3 border-b-2 transition-colors -mb-px
                  ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-5">

            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <>
                {/* What implementing this enables */}
                {entry.aiUnlocksSummary && (
                  <section className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-2">What implementing this enables</h4>
                    <p className="text-sm text-indigo-800 leading-relaxed">{entry.aiUnlocksSummary}</p>
                  </section>
                )}

                {/* Spec details grid */}
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Specification Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-medium mb-1">Current Version</div>
                      <div className="text-sm font-medium text-gray-800">v{entry.version}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-medium mb-1">Governance Body</div>
                      <div className="text-sm font-medium text-gray-800">{entry.governanceBody || entry.owner}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-medium mb-1">Openness</div>
                      <MetadataBadge kind="access" value={entry.opennessStatus || entry.accessLevel}
                        label={entry.opennessStatus === 'open' ? 'Open Standard' : entry.opennessStatus === 'restricted' ? 'Restricted' : 'Proprietary'} />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-medium mb-1">Last Updated</div>
                      <div className="text-sm font-medium text-gray-800">{entry.lastUpdated}</div>
                    </div>
                  </div>
                </section>

                {/* Authoritative links */}
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Authoritative Resources</h4>
                  <div className="space-y-1.5">
                    {entry.accessUrl && entry.accessUrl !== '#' && (
                      <a href={entry.accessUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Official specification site
                      </a>
                    )}
                    {entry.authoritativeRepoUrl && (
                      <a href={entry.authoritativeRepoUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Source repository
                      </a>
                    )}
                    {entry.technicalDocLinks?.map(link => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </section>

                {/* AI Discovery Metadata */}
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">AI Discovery Metadata</h4>
                  <div className="bg-gray-900 text-green-300 rounded-xl p-4 font-mono text-xs leading-relaxed shadow-inner">
                    <div className="text-gray-500 mb-1">// Structured for AI/analytics queries</div>
                    <div>{`{`}</div>
                    <div className="pl-4">{`"id": "${entry.id}",`}</div>
                    <div className="pl-4">{`"aiSummary": "${entry.aiSummary}",`}</div>
                    <div className="pl-4">{`"aiTaxonomy": ${JSON.stringify(entry.aiTaxonomy)},`}</div>
                    <div className="pl-4">{`"implementationBurden": "${entry.implementationBurden}",`}</div>
                    <div className="pl-4">{`"dataClassification": "${entry.privacyConsiderations.dataClassification}"`}</div>
                    <div>{`}`}</div>
                  </div>
                </section>
              </>
            )}

            {/* ===== IMPLEMENTATION TAB ===== */}
            {activeTab === 'implementation' && (
              <>
                {/* What this unlocks */}
                {entry.aiUnlocksSummary && (
                  <section className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-2">What this unlocks for your product</h4>
                    <p className="text-sm text-emerald-800 leading-relaxed">{entry.aiUnlocksSummary}</p>
                  </section>
                )}

                {/* Burden rubric */}
                {entry.burdenRubric && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Implementation Burden Breakdown</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      {['engineering', 'infrastructure', 'legal'].map(dim => {
                        const r = entry.burdenRubric[dim];
                        if (!r) return null;
                        return (
                          <div key={dim} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider capitalize">{dim}</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-md border capitalize ${rubricLevelColor[r.level]}`}>
                                {r.level}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{r.note}</p>
                          </div>
                        );
                      })}
                    </div>
                    {entry.burdenRubric.timeline && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="text-xs font-semibold text-gray-600">Estimated timeline: </span>
                          <span className="text-xs text-gray-600">{entry.burdenRubric.timeline}</span>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Required capabilities */}
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Required Capabilities</h4>
                  <div className="space-y-1.5">
                    {entry.requiredCapabilities.map(cap => (
                      <div key={cap} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Implementation guidance */}
                {entry.implementationGuidance && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1.5">Implementation Guidance</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{entry.implementationGuidance}</p>
                  </section>
                )}

                {/* Reference implementations */}
                {entry.referenceImplementations?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Reference Implementations</h4>
                    <div className="space-y-2">
                      {entry.referenceImplementations.map(impl => (
                        <div key={impl.name} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <a href={impl.url} target="_blank" rel="noreferrer"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                              {impl.name}
                            </a>
                            {impl.restricted && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">Restricted access</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{impl.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Sample payloads */}
                {entry.samplePayloads?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Sample Payloads</h4>
                    {entry.samplePayloads.map(sample => (
                      <div key={sample.label} className="mb-3">
                        <div className="text-xs font-medium text-gray-500 mb-1">{sample.label}</div>
                        <pre className="bg-gray-900 text-green-300 rounded-xl p-4 font-mono text-xs leading-relaxed shadow-inner overflow-x-auto">
                          {sample.code}
                        </pre>
                      </div>
                    ))}
                  </section>
                )}

                {/* Known adopters */}
                {entry.knownAdopters?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Known Adopters</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.knownAdopters.map(adopter => (
                        <span key={adopter} className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 font-medium">
                          {adopter}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ===== CONNECTIONS TAB ===== */}
            {activeTab === 'connections' && (
              <>
                {/* Commonly Paired With */}
                {entry.commonlyPairedWith?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Commonly Paired With</h4>
                    <p className="text-xs text-gray-400 mb-3">Specifications that commonly integrate with {entry.title}</p>
                    <div className="space-y-3">
                      {entry.commonlyPairedWith.map(pair => (
                        <div key={pair.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() => onNavigateToEntry?.(pair.id)}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              {entryTitles[pair.id] ?? pair.id}
                            </button>
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{pair.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Cross-spec visual */}
                {entry.commonlyPairedWith?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Integration Map</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                          {/* Center node */}
                          <div className="bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-sm text-center">
                            {entry.title}
                          </div>

                          {/* Connection lines + paired nodes */}
                          <div className="flex flex-wrap items-start justify-center gap-3 w-full">
                            {entry.commonlyPairedWith.map(pair => (
                              <div key={pair.id} className="flex flex-col items-center gap-1">
                                <div className="w-px h-4 bg-indigo-300" />
                                <button
                                  onClick={() => onNavigateToEntry?.(pair.id)}
                                  className="bg-white border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm text-center"
                                >
                                  {entryTitles[pair.id] ?? pair.id}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Compatibility notes */}
                {entry.compatibilityNotes && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1.5">Compatibility & Overlap Notes</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{entry.compatibilityNotes}</p>
                  </section>
                )}

                {/* AI consideration prompt */}
                <section className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">If I implement {entry.title}, what else should I consider?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {entry.commonlyPairedWith?.map(pair => (
                      <li key={pair.id} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span>
                          <strong className="text-gray-700">{entryTitles[pair.id] ?? pair.id}</strong>
                          {' — '}{pair.rationale}
                        </span>
                      </li>
                    ))}
                    {entry.requiredCapabilities?.length > 0 && (
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>
                          <strong className="text-gray-700">Prerequisites:</strong>
                          {' '}{entry.requiredCapabilities.join(', ')}
                        </span>
                      </li>
                    )}
                    {entry.privacyConsiderations?.regulations?.length > 0 && (
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>
                          <strong className="text-gray-700">Regulatory compliance:</strong>
                          {' '}{entry.privacyConsiderations.regulations.join(', ')}
                        </span>
                      </li>
                    )}
                  </ul>
                </section>

                {/* Related resources (legacy) */}
                {entry.relatedResources?.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">All Related Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.relatedResources.map(r => (
                        <button
                          key={r}
                          onClick={() => onNavigateToEntry?.(r)}
                          className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer font-medium"
                          title={`Go to: ${entryTitles[r] ?? r}`}
                        >
                          {entryTitles[r] ?? r}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ===== EQUITY & PRIVACY TAB ===== */}
            {activeTab === 'considerations' && (
              <>
                {/* Equity */}
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">Equity / Accessibility Considerations</h4>
                    <MetadataBadge kind="concern" value={entry.equityConsiderations.level}
                      label={`${concernIcon[entry.equityConsiderations.level]} ${concernLabel[entry.equityConsiderations.level]} concern`} />
                    {entry.equityConsiderations.lifDerived && (
                      <span className="text-xs font-normal bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">LIF-derived</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{entry.equityConsiderations.notes}</p>
                </section>

                {/* Privacy */}
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">Privacy / Security Considerations</h4>
                    <MetadataBadge kind="concern" value={entry.privacyConsiderations.level}
                      label={`${concernIcon[entry.privacyConsiderations.level]} ${concernLabel[entry.privacyConsiderations.level]} concern`} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{entry.privacyConsiderations.notes}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {entry.privacyConsiderations.dataClassification && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 font-medium mb-1">Data Classification</div>
                        <div className="text-sm font-medium text-gray-700">{entry.privacyConsiderations.dataClassification}</div>
                      </div>
                    )}
                    {entry.privacyConsiderations.regulations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 font-medium mb-1">Applicable Regulations</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {entry.privacyConsiderations.regulations.map(r => (
                            <span key={r} className={`text-xs px-2 py-0.5 rounded-lg border ${r.startsWith('NDPA') ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* NDPA v2.2 Provisions */}
                {entry.privacyConsiderations.ndpaProvisions?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">NDPA v2.2 Provisions</h4>
                      <a
                        href="https://files.a4l.org/privacy/NDPA/NDPA_v2-2_STANDARD_WEB.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        View full NDPA
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      Relevant provisions from the SDPC National Data Privacy Agreement (Standard v2.2) applicable to this specification.
                    </p>
                    <div className="space-y-2">
                      {entry.privacyConsiderations.ndpaProvisions.map(provision => (
                        <div key={provision.citation} className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 whitespace-nowrap flex-shrink-0">
                              {provision.citation}
                            </span>
                            <span className="text-xs font-semibold text-indigo-900">{provision.title}</span>
                          </div>
                          <p className="text-xs text-indigo-800/80 leading-relaxed">{provision.summary}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Disclaimer:</strong> These NDPA citations are guidance for implementers, not legal advice.
                        Consult your institution's legal counsel and review the{' '}
                        <a href="https://privacy.a4l.org/national-dpa/" target="_blank" rel="noreferrer" className="underline hover:text-amber-900">
                          SDPC Privacy Registry
                        </a>{' '}
                        for your state's Supplemental Terms (Exhibit G).
                      </p>
                    </div>
                  </section>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
