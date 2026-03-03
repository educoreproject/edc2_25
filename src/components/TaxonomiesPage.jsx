// TaxonomiesPage.jsx — Structured taxonomies for the EDU ecosystem.
// Displays three taxonomies: Stakeholders, Technical Resources & Standards,
// and Use Cases mapped to CEDS RDF.

import { useState, useMemo, useEffect } from 'react';
import {
  stakeholderTaxonomy,
  technicalResourcesTaxonomy,
  useCasesCedsRdf,
  getAllBusinessNeeds,
} from '../data/taxonomies';
import { libraryEntries } from '../data/libraryEntries';
import { cedsAlignmentMatrix, cedsDomains } from '../data/cedsAlignment';
import ExplainerBadge from './ExplainerBadge';

const burdenIcon = { low: '🟢', medium: '🟡', high: '🔴' };
const burdenLabel = { low: 'Low', medium: 'Moderate', high: 'High' };
const burdenOrder = { low: 0, medium: 1, high: 2 };
const rubricLevelColor = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};
const cedsStatusColor = {
  full: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
};

// Build a label lookup for CEDS domain IDs
const cedsDomainLabels = Object.fromEntries(cedsDomains.map(d => [d.id, d.label]));

function computeRoadmap(selectedNeeds) {
  if (selectedNeeds.size === 0) return [];

  // Step 1: Collect relevant CEDS domains from selected needs
  const relevantDomains = new Set();
  const matchedUseCases = new Set();

  for (const key of selectedNeeds.keys()) {
    if (key.startsWith('uc::')) {
      // Use case need — extract use case ID directly
      const ucId = key.split('::')[1];
      const uc = useCasesCedsRdf.find(u => u.id === ucId);
      if (uc) {
        matchedUseCases.add(uc.id);
        uc.cedsDomains.forEach(d => relevantDomains.add(d));
      }
    } else {
      // Stakeholder need — extract stakeholder ID, find matching use cases
      const stakeholderId = key.split('::')[0];
      for (const uc of useCasesCedsRdf) {
        if (uc.stakeholders.includes(stakeholderId)) {
          matchedUseCases.add(uc.id);
          uc.cedsDomains.forEach(d => relevantDomains.add(d));
        }
      }
    }
  }

  if (relevantDomains.size === 0) return [];

  // Step 2: Score each library entry by CEDS alignment to relevant domains
  const scored = libraryEntries.map(entry => {
    const alignment = cedsAlignmentMatrix.find(a => a.entryId === entry.id);
    if (!alignment) return null;

    let fullCount = 0;
    let partialCount = 0;
    const matchedDomains = [];

    for (const domain of relevantDomains) {
      const domainData = alignment.domains[domain];
      if (domainData) {
        if (domainData.status === 'full') {
          fullCount++;
          matchedDomains.push({ domain, status: 'full' });
        } else if (domainData.status === 'partial') {
          partialCount++;
          matchedDomains.push({ domain, status: 'partial' });
        }
      }
    }

    const score = fullCount * 2 + partialCount;
    if (score === 0) return null;

    return { entry, score, fullCount, partialCount, matchedDomains };
  }).filter(Boolean);

  // Step 3: Sort by score desc, then burden asc
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (burdenOrder[a.entry.implementationBurden] || 0) - (burdenOrder[b.entry.implementationBurden] || 0);
  });

  return scored;
}

function RoadmapCard({ item, onNavigateToEntry }) {
  const { entry, matchedDomains, fullCount, partialCount } = item;
  const [showCapabilities, setShowCapabilities] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{entry.title}</h4>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200 whitespace-nowrap flex-shrink-0">
              {entry.category}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-medium">
              {burdenIcon[entry.implementationBurden]} {burdenLabel[entry.implementationBurden]} burden
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* CEDS domain alignment for matched domains */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CEDS Alignment</div>
          <div className="flex flex-wrap gap-1.5">
            {matchedDomains.map(({ domain, status }) => (
              <span
                key={domain}
                className={`text-xs px-2 py-0.5 rounded-md border font-medium ${cedsStatusColor[status]}`}
              >
                {cedsDomainLabels[domain] || domain} ({status})
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {fullCount} full + {partialCount} partial alignment{fullCount + partialCount !== 1 ? 's' : ''} with your needs
          </div>
        </div>

        {/* Burden rubric summary */}
        {entry.burdenRubric && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Burden Breakdown</div>
            <div className="grid grid-cols-3 gap-2">
              {['engineering', 'infrastructure', 'legal'].map(dim => {
                const r = entry.burdenRubric[dim];
                if (!r) return null;
                return (
                  <div key={dim} className="bg-gray-50 rounded-lg px-2.5 py-2">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider capitalize">{dim}</div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border capitalize inline-block mt-0.5 ${rubricLevelColor[r.level]}`}>
                      {r.level}
                    </span>
                  </div>
                );
              })}
            </div>
            {entry.burdenRubric.timeline && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                <span>Timeline:</span>
                <span className="font-medium text-gray-700">{entry.burdenRubric.timeline}</span>
              </div>
            )}
          </div>
        )}

        {/* Required capabilities (collapsible) */}
        {entry.requiredCapabilities?.length > 0 && (
          <div>
            <button
              onClick={() => setShowCapabilities(!showCapabilities)}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              <span>{showCapabilities ? '▼' : '▶'}</span>
              Required Capabilities ({entry.requiredCapabilities.length})
            </button>
            {showCapabilities && (
              <div className="mt-1.5 space-y-1">
                {entry.requiredCapabilities.map(cap => (
                  <div key={cap} className="text-xs text-gray-600 bg-gray-50 rounded px-2.5 py-1.5 flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-px">-</span>
                    {cap}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action */}
        <button
          onClick={() => onNavigateToEntry?.(entry.id)}
          className="text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          View in Library
        </button>
      </div>
    </div>
  );
}

function StakeholderCard({ group, searchQuery, selectedNeeds, onToggleNeed }) {
  const [expanded, setExpanded] = useState(null);

  const hasMatch = (child) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      child.label.toLowerCase().includes(q) ||
      child.businessNeeds.some(n => n.toLowerCase().includes(q))
    );
  };

  const visibleChildren = group.children.filter(hasMatch);
  if (searchQuery && visibleChildren.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xl">{group.icon}</span>
        <span className="font-semibold text-gray-800 text-sm">{group.label}</span>
        <span className="ml-auto text-xs text-gray-400">{visibleChildren.length} sub-groups</span>
      </div>
      <div className="divide-y divide-gray-50">
        {visibleChildren.map(child => {
          const isExpanded = expanded === child.id;
          return (
            <div key={child.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : child.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50/60 flex items-center gap-2 transition-colors"
              >
                <span className="text-xs text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                <span className="text-sm font-medium text-gray-700">{child.label}</span>
                <span className="ml-auto text-xs text-gray-400">{child.businessNeeds.length} needs</span>
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 space-y-1.5">
                  {child.businessNeeds.map((need, i) => {
                    const needKey = `${child.id}::${i}`;
                    const isSelected = selectedNeeds.has(needKey);
                    const isHighlighted = searchQuery && need.toLowerCase().includes(searchQuery.toLowerCase());
                    return (
                      <button
                        key={i}
                        onClick={() => onToggleNeed(needKey, need, child.label)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2
                          ${isSelected
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : isHighlighted
                              ? 'bg-amber-50/50 border-amber-200 text-gray-700'
                              : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors
                          ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                          {isSelected && '✓'}
                        </span>
                        {need}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TechResourceCard({ group }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xl">{group.icon}</span>
        <span className="font-semibold text-gray-800 text-sm">{group.label}</span>
      </div>
      <div className="divide-y divide-gray-50">
        {group.children.map(resource => (
          <div key={resource.id} className="px-4 py-3 hover:bg-gray-50/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-800">{resource.label}</div>
                <p className="text-xs text-gray-400 mt-0.5">{resource.description}</p>
              </div>
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0 border border-gray-100">
                {resource.scope}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({ useCase, searchQuery, selectedNeeds, onToggleNeed }) {
  const [expanded, setExpanded] = useState(false);

  const isHighlighted = searchQuery && (
    useCase.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    useCase.businessNeeds.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (searchQuery && !isHighlighted) return null;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${isHighlighted ? 'border-amber-200' : 'border-gray-200'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 hover:bg-gray-50/40 flex items-center gap-3 transition-colors"
      >
        <span className="text-xl">{useCase.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800">{useCase.label}</div>
          <p className="text-xs text-gray-400 mt-0.5">{useCase.description}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {useCase.cedsDomains.map(d => (
            <span key={d} className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md border border-sky-100">
              {d}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-2">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Business Needs</div>
            <div className="space-y-1.5">
              {useCase.businessNeeds.map((need, i) => {
                const needKey = `uc::${useCase.id}::${i}`;
                const isSelected = selectedNeeds.has(needKey);
                return (
                  <button
                    key={i}
                    onClick={() => onToggleNeed(needKey, need, useCase.label)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2
                      ${isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors
                      ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                      {isSelected && '✓'}
                    </span>
                    {need}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CEDS RDF Elements</div>
            <div className="bg-gray-50/50 rounded-lg border border-gray-100 divide-y divide-gray-50">
              {useCase.cedsRdfElements.map(el => (
                <div key={el.element} className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{el.element}</code>
                    <a
                      href={el.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:text-indigo-600 font-mono truncate transition-colors"
                    >
                      {el.uri}
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{el.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Related Standards</div>
            <div className="flex flex-wrap gap-1.5">
              {useCase.relatedStandards.map(std => (
                <span key={std} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaxonomiesPage({ onNavigateToEntry, pendingActivation, onClearActivation }) {
  const [activeTab, setActiveTab] = useState('stakeholders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState(new Map());
  const [showExplainers, setShowExplainers] = useState(true);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Auto-select business needs by stakeholder IDs and use case IDs
  const autoSelectNeeds = (stakeholderIds, useCaseIds) => {
    const next = new Map();

    for (const sId of stakeholderIds) {
      for (const group of stakeholderTaxonomy) {
        const child = group.children.find(c => c.id === sId);
        if (child) {
          child.businessNeeds.forEach((need, i) => {
            const key = `${child.id}::${i}`;
            next.set(key, { need, source: child.label });
          });
        }
      }
    }

    for (const ucId of useCaseIds) {
      const uc = useCasesCedsRdf.find(u => u.id === ucId);
      if (uc) {
        uc.businessNeeds.forEach((need, i) => {
          const key = `uc::${uc.id}::${i}`;
          next.set(key, { need, source: uc.label });
        });
      }
    }

    return next;
  };

  // Handle pending activation from the AI on the Standards page
  useEffect(() => {
    if (pendingActivation) {
      const { stakeholderIds, useCaseIds } = pendingActivation;
      const autoSelected = autoSelectNeeds(stakeholderIds, useCaseIds);
      setSelectedNeeds(autoSelected);
      setShowRoadmap(true);
      onClearActivation?.();
    }
  }, [pendingActivation]);

  const allNeeds = useMemo(() => getAllBusinessNeeds(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allNeeds.filter(n => n.need.toLowerCase().includes(q));
  }, [searchQuery, allNeeds]);

  // Only compute roadmap when user has explicitly requested it
  const roadmap = useMemo(
    () => (showRoadmap ? computeRoadmap(selectedNeeds) : []),
    [selectedNeeds, showRoadmap],
  );

  const toggleNeed = (key, need, source) => {
    setSelectedNeeds(prev => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, { need, source });
      }
      return next;
    });
    // Hide roadmap when selections change so user can keep picking
    setShowRoadmap(false);
  };

  const tabs = [
    { id: 'stakeholders', label: 'Stakeholders', icon: '👥' },
    { id: 'resources', label: 'Technical Resources & Standards', icon: '📐' },
    { id: 'usecases', label: 'Use Cases (CEDS RDF)', icon: '🗺️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Ecosystem Taxonomies</h1>
          <button
            onClick={() => setShowExplainers(!showExplainers)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
              ${showExplainers
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {showExplainers ? '💡 Explainers ON' : '💡 Explainers OFF'}
          </button>
        </div>
        <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">
          Structured taxonomies for stakeholders, shared technical resources, and use cases mapped to CEDS RDF.
          Business needs are searchable and selectable across all taxonomy views.
        </p>
      </div>

      {showExplainers && (
        <ExplainerBadge icon="🏗️">
          <strong>Taxonomy page rationale:</strong> Taxonomies provide the structural backbone for the EDU ecosystem.
          The searchable business needs allow stakeholders to self-identify and discover relevant resources.
        </ExplainerBadge>
      )}

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search business needs across all taxonomies…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-shadow placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-xs text-gray-400">
            {searchResults.length} business need{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Selected needs + Implementation Roadmap */}
      {selectedNeeds.size > 0 && (
        <div className="mb-5 space-y-4">
          {/* Selected needs chips + Create Roadmap button */}
          <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Selected Business Needs ({selectedNeeds.size})
              </div>
              <button
                onClick={() => { setSelectedNeeds(new Map()); setShowRoadmap(false); }}
                className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selectedNeeds.entries()).map(([key, { need, source }]) => (
                <button
                  key={key}
                  onClick={() => toggleNeed(key, need, source)}
                  className="text-xs bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-50 flex items-center gap-1 transition-colors shadow-sm"
                >
                  {need}
                  <span className="text-indigo-300 ml-1">×</span>
                </button>
              ))}
            </div>

            {/* Create Roadmap CTA */}
            {!showRoadmap && (
              <button
                onClick={() => setShowRoadmap(true)}
                className="mt-3 bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                Create My Roadmap
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>

          {/* Implementation Roadmap — only shown after user clicks Create */}
          {showRoadmap && roadmap.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-200/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">Your Implementation Roadmap</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                    {roadmap.length} standard{roadmap.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => setShowRoadmap(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hide roadmap
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Based on your selected business needs, these standards are most relevant — ranked by alignment strength and implementation burden.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {roadmap.map(item => (
                  <RoadmapCard
                    key={item.entry.id}
                    item={item}
                    onNavigateToEntry={onNavigateToEntry}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-0.5 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'stakeholders' && (
        <div>
          {showExplainers && (
            <ExplainerBadge icon="👥">
              <strong>Stakeholders taxonomy:</strong> Each stakeholder group has specific business needs. Click any stakeholder to expand and view/select their needs. Selected needs persist across tabs.
            </ExplainerBadge>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {stakeholderTaxonomy.map(group => (
              <StakeholderCard
                key={group.id}
                group={group}
                searchQuery={searchQuery}
                selectedNeeds={selectedNeeds}
                onToggleNeed={toggleNeed}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div>
          {showExplainers && (
            <ExplainerBadge icon="📐">
              <strong>Technical resources taxonomy:</strong> A catalog of the shared standards, schemas, identity
              frameworks, and governance instruments that underpin the EDU ecosystem.
            </ExplainerBadge>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {technicalResourcesTaxonomy.map(group => (
              <TechResourceCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'usecases' && (
        <div>
          {showExplainers && (
            <ExplainerBadge icon="🗺️">
              <strong>Use cases mapped to CEDS RDF:</strong> Each use case maps to specific CEDS data elements via
              their RDF URIs, enabling semantic interoperability.
            </ExplainerBadge>
          )}
          <div className="space-y-3 mt-4">
            {useCasesCedsRdf.map(uc => (
              <UseCaseCard
                key={uc.id}
                useCase={uc}
                searchQuery={searchQuery}
                selectedNeeds={selectedNeeds}
                onToggleNeed={toggleNeed}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
