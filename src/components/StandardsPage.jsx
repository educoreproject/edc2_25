// StandardsPage.jsx — Standards browser organized by domain.

import WireframeBox from './WireframeBox';
import ExplainerBadge from './ExplainerBadge';

export default function StandardsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Standards Browser</h1>
      <p className="text-gray-500 text-sm mb-6">Browse approved standards by domain, status, and alignment to ecosystem priorities.</p>

      <ExplainerBadge icon="📐">
        <strong>Standards page (placeholder):</strong> This section provides a domain-organized view of standards. It differs from the main Library in that it provides curated navigation rather than search-first discovery.
      </ExplainerBadge>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {[
          { domain: 'Skills & Competencies', count: 3, icon: '🎯' },
          { domain: 'Learner Identity & Records', count: 2, icon: '🪪' },
          { domain: 'Privacy & Governance', count: 2, icon: '🔐' },
          { domain: 'Interoperability Protocols', count: 0, icon: '🔌' },
          { domain: 'Assessment Standards', count: 0, icon: '📊' },
          { domain: 'Accessibility', count: 0, icon: '♿' },
        ].map(d => (
          <div key={d.domain} className={`border rounded-xl p-4 bg-white transition-all duration-200
            ${d.count > 0
              ? 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer'
              : 'border-dashed border-gray-200 opacity-70'}`}>
            <div className="text-2xl mb-2">{d.icon}</div>
            <div className="font-semibold text-gray-800 text-sm">{d.domain}</div>
            <div className="text-xs text-gray-400 mt-1">
              {d.count > 0 ? `${d.count} approved standards` : 'No entries yet — submit one'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <WireframeBox label="[ Standards alignment matrix — shows which standards satisfy which DSU requirements ]" height="h-40" />
      </div>
    </div>
  );
}
