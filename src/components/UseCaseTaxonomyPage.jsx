// UseCaseTaxonomyPage.jsx — Interactive use case taxonomy browser.
// Displays use cases organized into top-level categories with collapsible
// subcategories, checkable items, and GitHub issue integration.

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useCaseTaxonomy, useCaseCedsDomains } from '../data/useCaseTaxonomy';
import { libraryEntries } from '../data/libraryEntries';
import { cedsAlignmentMatrix, cedsDomains } from '../data/cedsAlignment';

const GITHUB_REPO = 'educoreproject/educore_use_cases';

// Tailwind color maps keyed by the category `color` field
const colorMap = {
  indigo: {
    activeBg: 'bg-indigo-50',
    activeBorder: 'border-indigo-400',
    activeText: 'text-indigo-700',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-200',
    checkAccent: 'accent-indigo-600',
    headerBg: 'bg-indigo-50/60',
    headerBorder: 'border-indigo-200',
    headerText: 'text-indigo-800',
    pill: 'bg-indigo-100 text-indigo-700',
  },
  emerald: {
    activeBg: 'bg-emerald-50',
    activeBorder: 'border-emerald-400',
    activeText: 'text-emerald-700',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-200',
    checkAccent: 'accent-emerald-600',
    headerBg: 'bg-emerald-50/60',
    headerBorder: 'border-emerald-200',
    headerText: 'text-emerald-800',
    pill: 'bg-emerald-100 text-emerald-700',
  },
  amber: {
    activeBg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
    activeText: 'text-amber-700',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-200',
    checkAccent: 'accent-amber-600',
    headerBg: 'bg-amber-50/60',
    headerBorder: 'border-amber-200',
    headerText: 'text-amber-800',
    pill: 'bg-amber-100 text-amber-700',
  },
  sky: {
    activeBg: 'bg-sky-50',
    activeBorder: 'border-sky-400',
    activeText: 'text-sky-700',
    gradientFrom: 'from-sky-500',
    gradientTo: 'to-sky-600',
    badge: 'bg-sky-100 text-sky-700',
    ring: 'ring-sky-200',
    checkAccent: 'accent-sky-600',
    headerBg: 'bg-sky-50/60',
    headerBorder: 'border-sky-200',
    headerText: 'text-sky-800',
    pill: 'bg-sky-100 text-sky-700',
  },
  rose: {
    activeBg: 'bg-rose-50',
    activeBorder: 'border-rose-400',
    activeText: 'text-rose-700',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-200',
    checkAccent: 'accent-rose-600',
    headerBg: 'bg-rose-50/60',
    headerBorder: 'border-rose-200',
    headerText: 'text-rose-800',
    pill: 'bg-rose-100 text-rose-700',
  },
  violet: {
    activeBg: 'bg-violet-50',
    activeBorder: 'border-violet-400',
    activeText: 'text-violet-700',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-violet-600',
    badge: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-200',
    checkAccent: 'accent-violet-600',
    headerBg: 'bg-violet-50/60',
    headerBorder: 'border-violet-200',
    headerText: 'text-violet-800',
    pill: 'bg-violet-100 text-violet-700',
  },
};

// Fallback if an unknown color is used
const defaultColors = colorMap.indigo;

function getColors(color) {
  return colorMap[color] || defaultColors;
}

// Count all leaf use cases within a category
function countUseCases(category) {
  let count = 0;
  for (const sub of category.children || []) {
    count += (sub.children || []).length;
  }
  return count;
}

// Collect all leaf use case IDs within a category
function collectUseCaseIds(category) {
  const ids = [];
  for (const sub of category.children || []) {
    for (const uc of sub.children || []) {
      ids.push(uc.id);
    }
  }
  return ids;
}

// Collect all leaf use case IDs within a subcategory
function collectSubcategoryIds(subcategory) {
  return (subcategory.children || []).map(uc => uc.id);
}

// Chevron icon component
function ChevronIcon({ expanded, className = '' }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// GitHub icon
function GitHubIcon({ className = '' }) {
  return (
    <svg className={`w-3.5 h-3.5 ${className}`} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// ─── Roadmap computation (mirrors TaxonomiesPage pattern) ───────────────────

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
const cedsDomainLabels = Object.fromEntries(cedsDomains.map(d => [d.id, d.label]));

function computeRoadmapFromUseCases(selectedIds) {
  if (selectedIds.size === 0) return [];

  // Collect relevant CEDS domains from selected use cases
  const relevantDomains = new Set();
  for (const ucId of selectedIds) {
    const domains = useCaseCedsDomains[ucId];
    if (domains) domains.forEach(d => relevantDomains.add(d));
  }
  if (relevantDomains.size === 0) return [];

  // Score each library entry by CEDS alignment
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
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CEDS Alignment</div>
          <div className="flex flex-wrap gap-1.5">
            {matchedDomains.map(({ domain, status }) => (
              <span key={domain} className={`text-xs px-2 py-0.5 rounded-md border font-medium ${cedsStatusColor[status]}`}>
                {cedsDomainLabels[domain] || domain} ({status})
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {fullCount} full + {partialCount} partial alignment{fullCount + partialCount !== 1 ? 's' : ''} with your selected use cases
          </div>
        </div>

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

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UseCaseTaxonomyPage({ onExploreUseCases, onNavigateToEntry }) {
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());
  const [selectedUseCases, setSelectedUseCases] = useState(new Set());
  const [githubIssues, setGithubIssues] = useState({});
  const [githubLoading, setGithubLoading] = useState(true);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const treeRef = useRef(null);
  const roadmapRef = useRef(null);

  // Fetch GitHub issues on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchIssues() {
      try {
        const resp = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/issues?state=all&per_page=100`,
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
        const issues = await resp.json();
        if (cancelled) return;
        const map = {};
        for (const issue of issues) {
          map[issue.number] = {
            title: issue.title,
            url: issue.html_url,
            state: issue.state,
            labels: issue.labels.map(l => ({ name: l.name, color: l.color })),
          };
        }
        setGithubIssues(map);
      } catch (err) {
        console.log('%c[UseCaseTaxonomy] GitHub fetch failed:', 'color: #e11d48', err.message);
      } finally {
        if (!cancelled) setGithubLoading(false);
      }
    }
    fetchIssues();
    return () => { cancelled = true; };
  }, []);

  // Count selected use cases per category
  const selectedPerCategory = useMemo(() => {
    const counts = {};
    for (const cat of useCaseTaxonomy) {
      const catIds = collectUseCaseIds(cat);
      counts[cat.id] = catIds.filter(id => selectedUseCases.has(id)).length;
    }
    return counts;
  }, [selectedUseCases]);

  // Toggle category
  const toggleCategory = useCallback((catId) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
        // Auto-expand all subcategories when opening a category
        const cat = useCaseTaxonomy.find(c => c.id === catId);
        if (cat) {
          setExpandedSubcategories(prevExp => {
            const nextExp = new Set(prevExp);
            for (const sub of cat.children || []) {
              nextExp.add(sub.id);
            }
            return nextExp;
          });
        }
      }
      return next;
    });
  }, []);

  // Toggle subcategory expansion
  const toggleSubcategory = useCallback((subId) => {
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(subId)) next.delete(subId);
      else next.add(subId);
      return next;
    });
  }, []);

  // Toggle a single use case (hide roadmap on change)
  const toggleUseCase = useCallback((ucId) => {
    setShowRoadmap(false);
    setSelectedUseCases(prev => {
      const next = new Set(prev);
      if (next.has(ucId)) next.delete(ucId);
      else next.add(ucId);
      return next;
    });
  }, []);

  // Select all in a subcategory
  const selectAllInSubcategory = useCallback((subcategory) => {
    setShowRoadmap(false);
    const ids = collectSubcategoryIds(subcategory);
    setSelectedUseCases(prev => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  // Clear all in a subcategory
  const clearSubcategory = useCallback((subcategory) => {
    setShowRoadmap(false);
    const ids = collectSubcategoryIds(subcategory);
    setSelectedUseCases(prev => {
      const next = new Set(prev);
      for (const id of ids) next.delete(id);
      return next;
    });
  }, []);

  // Clear all selections
  const clearAll = useCallback(() => {
    setShowRoadmap(false);
    setSelectedUseCases(new Set());
  }, []);

  // Compute roadmap from selected use cases
  const roadmap = useMemo(
    () => computeRoadmapFromUseCases(selectedUseCases),
    [selectedUseCases]
  );

  // Collect the CEDS domains touched by the selection for the summary
  const selectedDomains = useMemo(() => {
    const domains = new Set();
    for (const ucId of selectedUseCases) {
      const d = useCaseCedsDomains[ucId];
      if (d) d.forEach(dd => domains.add(dd));
    }
    return domains;
  }, [selectedUseCases]);

  // Handle explore button — show roadmap inline and scroll to it
  const handleExplore = useCallback(() => {
    setShowRoadmap(true);
    setTimeout(() => roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  // Active categories data
  const visibleCategories = useMemo(() => {
    return useCaseTaxonomy.filter(cat => activeCategories.has(cat.id));
  }, [activeCategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
      {/* Page Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Use Case Taxonomy
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
          Explore use cases across education, workforce, and government systems.
          Select categories to discover relevant standards and implementation paths.
        </p>
      </div>

      {/* Category Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {useCaseTaxonomy.map(cat => {
          const isActive = activeCategories.has(cat.id);
          const colors = getColors(cat.color);
          const totalCount = countUseCases(cat);
          const selectedCount = selectedPerCategory[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`group relative text-left rounded-xl border-2 p-5 transition-all duration-200 cursor-pointer
                ${isActive
                  ? `${colors.activeBg} ${colors.activeBorder} shadow-md ring-2 ${colors.ring}`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              aria-pressed={isActive}
            >
              {/* Gradient overlay when active */}
              {isActive && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} opacity-[0.04]`} />
              )}

              <div className="relative">
                {/* Icon + count badge row */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedCount > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {selectedCount} selected
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isActive ? colors.badge : 'bg-gray-100 text-gray-500'
                    }`}>
                      {totalCount}
                    </span>
                  </div>
                </div>

                {/* Label */}
                <h3 className={`font-semibold text-sm leading-snug mb-1 ${
                  isActive ? colors.activeText : 'text-gray-800'
                }`}>
                  {cat.label}
                </h3>

                {/* Subtitle */}
                <p className={`text-xs leading-relaxed ${
                  isActive ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {cat.subtitle}
                </p>

                {/* Active indicator */}
                <div className={`mt-3 flex items-center gap-1 text-xs font-medium transition-colors ${
                  isActive ? colors.activeText : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  <ChevronIcon expanded={isActive} className={isActive ? colors.activeText : ''} />
                  <span>{isActive ? 'Collapse' : 'Expand use cases'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Use Case Tree */}
      {visibleCategories.length > 0 && (
        <div ref={treeRef} className="space-y-6">
          {visibleCategories.map(cat => {
            const colors = getColors(cat.color);
            return (
              <div key={cat.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Category tree header */}
                <div className={`px-5 py-3 border-b ${colors.headerBorder} ${colors.headerBg} flex items-center gap-3`}>
                  <span className="text-xl" role="img" aria-hidden="true">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className={`font-semibold text-sm ${colors.headerText}`}>{cat.label}</h2>
                    <p className="text-xs text-gray-500 truncate">{cat.subtitle}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {countUseCases(cat)} use cases
                  </span>
                </div>

                {/* Subcategories */}
                <div className="divide-y divide-gray-100">
                  {(cat.children || []).map(sub => {
                    const isExpanded = expandedSubcategories.has(sub.id);
                    const subIds = collectSubcategoryIds(sub);
                    const allSelected = subIds.length > 0 && subIds.every(id => selectedUseCases.has(id));
                    const someSelected = subIds.some(id => selectedUseCases.has(id));
                    const selectedInSub = subIds.filter(id => selectedUseCases.has(id)).length;

                    return (
                      <div key={sub.id}>
                        {/* Subcategory header */}
                        <button
                          onClick={() => toggleSubcategory(sub.id)}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
                          aria-expanded={isExpanded}
                        >
                          <ChevronIcon expanded={isExpanded} className="text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-sm text-gray-700 flex-1">{sub.label}</span>
                          <div className="flex items-center gap-2">
                            {selectedInSub > 0 && (
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${colors.pill}`}>
                                {selectedInSub}/{subIds.length}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {subIds.length} item{subIds.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </button>

                        {/* Expanded use case list */}
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          {/* Select all / Clear row */}
                          <div className="px-5 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); selectAllInSubcategory(sub); }}
                              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                                allSelected
                                  ? 'text-gray-400 cursor-default'
                                  : `${colors.activeText} hover:underline cursor-pointer`
                              }`}
                              disabled={allSelected}
                            >
                              Select All
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); clearSubcategory(sub); }}
                              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                                !someSelected
                                  ? 'text-gray-400 cursor-default'
                                  : 'text-gray-600 hover:text-gray-800 hover:underline cursor-pointer'
                              }`}
                              disabled={!someSelected}
                            >
                              Clear
                            </button>
                          </div>

                          {/* Individual use cases */}
                          <ul className="pb-2" role="list">
                            {(sub.children || []).map(uc => {
                              const isSelected = selectedUseCases.has(uc.id);
                              const ghIssue = uc.githubIssue ? githubIssues[uc.githubIssue] : null;

                              return (
                                <li key={uc.id} className="group">
                                  <div
                                    className={`flex items-start gap-3 px-5 py-2.5 transition-colors cursor-pointer ${
                                      isSelected ? `${colors.activeBg}` : 'hover:bg-gray-50/60'
                                    }`}
                                    onClick={() => toggleUseCase(uc.id)}
                                    role="checkbox"
                                    aria-checked={isSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        toggleUseCase(uc.id);
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleUseCase(uc.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      className={`mt-0.5 rounded border-gray-300 ${colors.checkAccent} cursor-pointer flex-shrink-0`}
                                      tabIndex={-1}
                                      aria-hidden="true"
                                    />

                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm leading-snug ${
                                        isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'
                                      }`}>
                                        {uc.label}
                                      </span>

                                      {/* Tags */}
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {uc.tag && (
                                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${colors.pill}`}>
                                            {uc.tag}
                                          </span>
                                        )}

                                        {/* GitHub issue link */}
                                        {uc.githubIssue && (
                                          <a
                                            href={ghIssue?.url || `https://github.com/${GITHUB_REPO}/issues/${uc.githubIssue}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors"
                                            title={ghIssue ? `#${uc.githubIssue}: ${ghIssue.title}` : `Issue #${uc.githubIssue}`}
                                          >
                                            <GitHubIcon className="text-gray-400 group-hover:text-gray-500" />
                                            <span>#{uc.githubIssue}</span>
                                            {ghIssue && (
                                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                                                ghIssue.state === 'open' ? 'bg-emerald-400' : 'bg-violet-400'
                                              }`} />
                                            )}
                                          </a>
                                        )}

                                        {/* GitHub issue labels */}
                                        {ghIssue?.labels?.map(label => (
                                          <span
                                            key={label.name}
                                            className="text-[10px] px-1.5 py-0.5 rounded-full border"
                                            style={{
                                              backgroundColor: `#${label.color}20`,
                                              borderColor: `#${label.color}40`,
                                              color: `#${label.color}`,
                                            }}
                                          >
                                            {label.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
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

      {/* ─── Standards Roadmap ──────────────────────────────────────────── */}
      {showRoadmap && roadmap.length > 0 && (
        <div ref={roadmapRef} className="mt-10 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Recommended Standards
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {roadmap.length} specification{roadmap.length !== 1 ? 's' : ''} ranked by alignment
              to your {selectedUseCases.size} selected use case{selectedUseCases.size !== 1 ? 's' : ''} across{' '}
              {selectedDomains.size} CEDS domain{selectedDomains.size !== 1 ? 's' : ''}.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[...selectedDomains].map(d => (
                <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium">
                  {cedsDomainLabels[d] || d}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roadmap.map(item => (
              <RoadmapCard key={item.entry.id} item={item} onNavigateToEntry={onNavigateToEntry} />
            ))}
          </div>
        </div>
      )}

      {showRoadmap && roadmap.length === 0 && (
        <div ref={roadmapRef} className="mt-10 text-center py-12 scroll-mt-24">
          <div className="text-3xl mb-2">📭</div>
          <h3 className="text-sm font-semibold text-gray-700">No matching standards found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            The selected use cases don't have CEDS domain mappings that align with current library entries.
            Try selecting different or additional use cases.
          </p>
        </div>
      )}

      {/* Empty state when no categories selected */}
      {visibleCategories.length === 0 && !showRoadmap && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">
            <span role="img" aria-hidden="true">&#x1F50D;</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Select a category to get started</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Click one or more categories above to browse their use cases.
            You can select individual use cases to explore matching standards.
          </p>
        </div>
      )}

      {/* Fixed Bottom Summary Bar */}
      {selectedUseCases.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="glass border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {selectedUseCases.size}
                </span>
                <span className="text-sm text-gray-700">
                  use case{selectedUseCases.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <button
                onClick={handleExplore}
                className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                Explore Standards
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
