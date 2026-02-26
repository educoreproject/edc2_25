// LibraryPage.jsx — The main working reference library interface.
// WHY IT EXISTS: This is the primary deliverable surface described in the PDD —
// "a living, AI-driven website that functions as a standards and project library,
// enabling stakeholders to find, access, and apply approved resources intelligently."

import { useState, useEffect, useMemo } from 'react';
import { libraryEntries, categoryFilters, burdenFilters, allCapabilities, equityLevelFilters, privacyLevelFilters } from '../data/libraryEntries';
import LibraryEntryCard from './LibraryEntryCard';
import ExplainerBadge from './ExplainerBadge';
import WireframeBox from './WireframeBox';

const concernLabel = {
  'low-concern': 'Low',
  'medium-concern': 'Moderate',
  'high-concern': 'High',
};
const concernIcon = {
  'low-concern': '🟢',
  'medium-concern': '🟡',
  'high-concern': '🔴',
};

export default function LibraryPage({ selectedEntryId = null, onNavigateToEntry, onClearSelection }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [burden, setBurden] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');
  const [capabilityFilter, setCapabilityFilter] = useState([]);
  const [equityFilter, setEquityFilter] = useState('All');
  const [privacyFilter, setPrivacyFilter] = useState('All');
  const [showExplainers, setShowExplainers] = useState(true);

  const [sortBy, setSortBy] = useState('relevant');

  useEffect(() => {
    if (selectedEntryId) {
      setQuery('');
      setCategory('All');
      setBurden('All');
      setAccessFilter('All');
      setCapabilityFilter([]);
      setEquityFilter('All');
      setPrivacyFilter('All');
    }
  }, [selectedEntryId]);

  const toggleCapability = (cap) => {
    setCapabilityFilter(prev =>
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  };

  const hasActiveFilters = category !== 'All' || burden !== 'All' || accessFilter !== 'All' ||
    capabilityFilter.length > 0 || equityFilter !== 'All' || privacyFilter !== 'All' || query;

  const resetAll = () => {
    setBurden('All');
    setAccessFilter('All');
    setCategory('All');
    setQuery('');
    setCapabilityFilter([]);
    setEquityFilter('All');
    setPrivacyFilter('All');
  };

  const filtered = useMemo(() => {
    let results = libraryEntries.filter(e => {
      const q = query.toLowerCase();
      const matchQuery = !query ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.includes(q)) ||
        e.aiTaxonomy.some(t => t.includes(q)) ||
        e.requiredCapabilities.some(c => c.toLowerCase().includes(q));
      const matchCat = category === 'All' || e.category === category;
      const matchBurden = burden === 'All' || e.implementationBurden === burden;
      const matchAccess = accessFilter === 'All' || e.accessLevel === accessFilter;
      const matchCaps = capabilityFilter.length === 0 ||
        capabilityFilter.every(cap => e.requiredCapabilities.includes(cap));
      const matchEquity = equityFilter === 'All' || e.equityConsiderations.level === equityFilter;
      const matchPrivacy = privacyFilter === 'All' || e.privacyConsiderations.level === privacyFilter;
      return matchQuery && matchCat && matchBurden && matchAccess && matchCaps && matchEquity && matchPrivacy;
    });

    if (sortBy === 'updated') {
      results = [...results].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else if (sortBy === 'burden-asc') {
      const order = { low: 0, medium: 1, high: 2 };
      results = [...results].sort((a, b) => order[a.implementationBurden] - order[b.implementationBurden]);
    }

    return results;
  }, [query, category, burden, accessFilter, capabilityFilter, equityFilter, privacyFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Standards & Specifications Library</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplainers(!showExplainers)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                ${showExplainers
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {showExplainers ? 'Explainers ON' : 'Explainers OFF'}
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">
          Search, filter, and evaluate specifications for your product roadmap.
          Each entry includes implementation burden, required capabilities, and cross-spec dependencies.
          <span className="ml-2 text-gray-400">{libraryEntries.length} specifications</span>
        </p>
      </div>

      {showExplainers && (
        <ExplainerBadge icon="🏗️">
          <strong>For Standards Implementers:</strong> Use the filters on the left to narrow by use case, implementation burden, required capabilities, and equity/privacy considerations. Expand any specification to see implementation pathways, sample payloads, known adopters, and cross-spec dependencies.
        </ExplainerBadge>
      )}

      {/* AI Mode Panel */}
      {aiMode && (
        <div className="mb-6 bg-gray-900 rounded-xl p-5 text-green-300 font-mono text-xs shadow-lg">
          <div className="text-gray-500 text-xs mb-2">// AI Discovery Mode — structured query interface</div>
          <div className="text-green-400 font-bold mb-3">GET /api/library/search</div>
          <div className="bg-gray-800/80 rounded-lg p-4 mb-3">
            <div>{`{`}</div>
            <div className="pl-4">{`"query": "${query || '*'}",`}</div>
            <div className="pl-4">{`"filters": {`}</div>
            <div className="pl-8">{`"category": "${category}",`}</div>
            <div className="pl-8">{`"implementationBurden": "${burden}",`}</div>
            <div className="pl-8">{`"accessLevel": "${accessFilter}",`}</div>
            <div className="pl-8">{`"requiredCapabilities": ${JSON.stringify(capabilityFilter)},`}</div>
            <div className="pl-8">{`"equityLevel": "${equityFilter}",`}</div>
            <div className="pl-8">{`"privacyLevel": "${privacyFilter}"`}</div>
            <div className="pl-4">{`},`}</div>
            <div className="pl-4">{`"fields": ["id", "aiSummary", "aiUnlocksSummary", "aiTaxonomy", "implementationBurden", "burdenRubric", "commonlyPairedWith"]`}</div>
            <div>{`}`}</div>
          </div>
          <div className="text-gray-400">→ Returning {filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-60 flex-shrink-0">

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-medium text-indigo-600">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                <button onClick={resetAll}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Clear all
                </button>
              </div>
            )}

            {/* Use Case Category */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Use Case</div>
              {categoryFilters.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${category === c
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Implementation Burden */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Implementation Burden</div>
              {burdenFilters.map(b => (
                <button key={b} onClick={() => setBurden(b)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 capitalize transition-colors
                    ${burden === b
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {b === 'low' ? '🟢 ' : b === 'medium' ? '🟡 ' : b === 'high' ? '🔴 ' : ''}{b === 'low' ? 'Low' : b === 'medium' ? 'Moderate' : b === 'high' ? 'High' : b}
                </button>
              ))}
            </div>

            {/* Access Level */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Access Level</div>
              {['All', 'open', 'restricted'].map(a => (
                <button key={a} onClick={() => setAccessFilter(a)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 capitalize transition-colors
                    ${accessFilter === a
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {a === 'open' ? 'Open' : a === 'restricted' ? 'Restricted' : a}
                </button>
              ))}
            </div>

            {/* Required Capabilities */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Capabilities</div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {allCapabilities.map(cap => (
                  <label key={cap}
                    className={`flex items-start gap-2 text-sm px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors
                      ${capabilityFilter.includes(cap)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={capabilityFilter.includes(cap)}
                      onChange={() => toggleCapability(cap)}
                      className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs leading-snug">{cap}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equity Considerations */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Equity / Accessibility</div>
              {equityLevelFilters.map(level => (
                <button key={level} onClick={() => setEquityFilter(level)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${equityFilter === level
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {level === 'All' ? 'All' : `${concernIcon[level]} ${concernLabel[level]}`}
                </button>
              ))}
            </div>

            {/* Privacy Considerations */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Privacy / Security</div>
              {privacyLevelFilters.map(level => (
                <button key={level} onClick={() => setPrivacyFilter(level)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${privacyFilter === level
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {level === 'All' ? 'All' : `${concernIcon[level]} ${concernLabel[level]}`}
                </button>
              ))}
            </div>

            {/* Quick Filters */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Filters</div>
              <button onClick={() => { setBurden('low'); setAccessFilter('open'); setCapabilityFilter([]); setEquityFilter('All'); setPrivacyFilter('All'); }}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 transition-colors mb-1.5 font-medium">
                Easy wins (low burden + open)
              </button>
              <button onClick={() => { setBurden('All'); setAccessFilter('All'); setPrivacyFilter('low-concern'); setEquityFilter('low-concern'); setCapabilityFilter([]); }}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-sky-200 text-sky-700 bg-sky-50/50 hover:bg-sky-50 transition-colors mb-1.5 font-medium">
                Low risk (low equity + privacy concern)
              </button>
              <button onClick={resetAll}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                Reset all filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main list */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="mb-5">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, capability, use case, or describe what you need..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-shadow placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Results count + sort */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {filtered.length} of {libraryEntries.length} specifications
              {query && <span className="ml-1">matching "<strong className="text-gray-700">{query}</strong>"</span>}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="relevant">Sort: Most relevant</option>
              <option value="updated">Sort: Recently updated</option>
              <option value="burden-asc">Sort: Burden (low → high)</option>
            </select>
          </div>

          {/* Entry cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 shadow-sm">
                <div className="text-3xl mb-3">
                  <svg className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="font-medium text-gray-600">No specifications match your filters</div>
                <div className="text-sm mt-1">Try adjusting your search or filter criteria</div>
                <button onClick={resetAll} className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              filtered.map((entry, i) => (
                <LibraryEntryCard
                  key={entry.id}
                  entry={entry}
                  showExplainers={showExplainers && i === 0}
                  isSelected={entry.id === selectedEntryId}
                  onNavigateToEntry={onNavigateToEntry}
                  onClearSelection={onClearSelection}
                />
              ))
            )}
          </div>

          {/* Submit a resource */}
          <div className="mt-8 border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-1">Don't see what you need?</div>
            <div className="text-xs text-gray-400 mb-4">Submit a specification for review or request an alignment assessment</div>
            <div className="flex justify-center gap-3">
              <button className="text-xs border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium">Submit a specification</button>
              <button className="text-xs bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors font-medium shadow-sm">Request review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
