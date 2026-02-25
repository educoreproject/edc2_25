// PartnersPage.jsx — Partner agreements directory.

import WireframeBox from './WireframeBox';
import ExplainerBadge from './ExplainerBadge';

export default function PartnersPage() {
  const partners = [
    { name: 'T3 Innovation Network', type: 'Standards Body', agreement: 'Data Sharing Agreement v2.1', status: 'active' },
    { name: 'HR Open Standards Consortium', type: 'Standards Body', agreement: 'Reference License Agreement', status: 'active' },
    { name: 'US Chamber of Commerce Foundation', type: 'Framework Provider', agreement: 'Content Use Agreement', status: 'active' },
    { name: 'Example State Education Agency', type: 'Implementation Partner', agreement: 'Pilot MOU v1.0', status: 'under-review' },
    { name: 'Community College Consortium', type: 'Implementation Partner', agreement: 'Pending', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner Directory</h1>
      <p className="text-gray-500 text-sm mb-6">Active ecosystem partners, their agreements, and their roles in the EDU library governance structure.</p>

      <ExplainerBadge icon="🤝">
        <strong>Partners page rationale:</strong> The library spec requires "navigation to stakeholders, partner agreements, repositories." Partner relationships require contact/governance context, not just technical metadata.
      </ExplainerBadge>

      <div className="mt-5 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Partner</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Agreement</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {partners.map(p => (
              <tr key={p.name} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{p.name}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{p.type}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">{p.agreement}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium
                    ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                      p.status === 'under-review' ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-100 text-gray-400'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 mr-3 font-medium transition-colors">View agreement</button>
                  <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <WireframeBox label="[ Partner onboarding flow — how new partners apply and execute agreements ]" height="h-32" />
      </div>
    </div>
  );
}
