// StandardsPage.jsx — Standards browser organized by domain.
// Dynamically groups library entries by category, only showing
// categories that contain at least one standard.

import { useState } from 'react';
import { libraryEntries } from '../data/libraryEntries';
import ExplainerBadge from './ExplainerBadge';

const burdenIcon = { low: '🟢', medium: '🟡', high: '🔴' };
const burdenLabel = { low: 'Low', medium: 'Moderate', high: 'High' };

// Icons per category
const categoryIcons = {
  'Learner Records': '🪪',
  'Competency Frameworks': '🎯',
  'Credential Transparency': '🔍',
  'Digital Credentials': '🏅',
};

// Group entries by category
function groupByCategory(entries) {
  const groups = {};
  for (const entry of entries) {
    if (!groups[entry.category]) {
      groups[entry.category] = [];
    }
    groups[entry.category].push(entry);
  }
  return groups;
}

export default function StandardsPage({ onNavigateToEntry }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showExplainers, setShowExplainers] = useState(true);

  const grouped = groupByCategory(libraryEntries);
  const categories = Object.keys(grouped);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Standards Browser</h1>
          <p className="text-gray-500 text-sm">Browse approved standards by domain. Click a category to see the standards within it.</p>
        </div>
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

      {showExplainers && (
        <ExplainerBadge icon="📐">
          <strong>Standards page:</strong> This section provides a domain-organized view of standards.
          It differs from the main Library in that it groups standards by category for curated navigation rather than search-first discovery.
        </ExplainerBadge>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {categories.map(category => {
          const entries = grouped[category];
          const isExpanded = expandedCategory === category;
          const icon = categoryIcons[category] || '📋';

          return (
            <div key={category} className="flex flex-col">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className={`border rounded-xl p-4 bg-white transition-all duration-200 text-left
                  ${isExpanded
                    ? 'border-indigo-200 shadow-md ring-1 ring-indigo-100'
                    : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{category}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {entries.length} standard{entries.length !== 1 ? 's' : ''}
                </div>
                <span className="text-xs text-gray-400 mt-2 inline-block">
                  {isExpanded ? '▼ Collapse' : '▶ View standards'}
                </span>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {entries.map(entry => (
                    <div
                      key={entry.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{entry.title}</h3>
                        <span className="text-xs font-medium whitespace-nowrap">
                          {burdenIcon[entry.implementationBurden]} {burdenLabel[entry.implementationBurden]}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{entry.description}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span>v{entry.version}</span>
                        <span className="text-gray-300">|</span>
                        <span>{entry.governanceBody || entry.owner}</span>
                        <span className="text-gray-300">|</span>
                        <span className={entry.accessLevel === 'open'
                          ? 'text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100'
                          : 'text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200'
                        }>
                          {entry.accessLevel === 'open' ? 'Open' : 'Restricted'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {entry.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                            #{tag}
                          </span>
                        ))}
                        {entry.tags.length > 4 && (
                          <span className="text-xs text-gray-400">+{entry.tags.length - 4} more</span>
                        )}
                      </div>

                      <button
                        onClick={() => onNavigateToEntry?.(entry.id)}
                        className="text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                      >
                        View full details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
