// TaxonomiesPage.jsx — Structured taxonomies for the EDU ecosystem.
// Displays three taxonomies: Stakeholders, Technical Resources & Standards,
// and Use Cases mapped to CEDS RDF.

import { useState, useMemo } from 'react';
import {
  stakeholderTaxonomy,
  technicalResourcesTaxonomy,
  useCasesCedsRdf,
  getAllBusinessNeeds,
} from '../data/taxonomies';
import ExplainerBadge from './ExplainerBadge';

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

export default function TaxonomiesPage() {
  const [activeTab, setActiveTab] = useState('stakeholders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState(new Map());
  const [showExplainers, setShowExplainers] = useState(true);

  const allNeeds = useMemo(() => getAllBusinessNeeds(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allNeeds.filter(n => n.need.toLowerCase().includes(q));
  }, [searchQuery, allNeeds]);

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

      {/* Selected needs summary */}
      {selectedNeeds.size > 0 && (
        <div className="mb-5 bg-indigo-50/50 border border-indigo-200/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              Selected Business Needs ({selectedNeeds.size})
            </div>
            <button
              onClick={() => setSelectedNeeds(new Map())}
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
