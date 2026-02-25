// PddPage.jsx — Product Description Document page.
// The PDD is the governing document that explains WHAT is being built,
// WHY it's being built, and for WHOM.

import ExplainerBadge from './ExplainerBadge';
import MetadataBadge from './MetadataBadge';
import WireframeBox from './WireframeBox';

const pddEntry = {
  version: '0.1 — DRAFT',
  status: 'under-review',
  lastUpdated: '2026-02-25',
  owner: 'Education Data Unlimited (EDU)',
  accessLevel: 'open',
  implementationBurden: 'low',
  equityConsiderations: { level: 'low-concern' },
  privacyConsiderations: { level: 'low-concern' },
};

export default function PddPage({ showExplainers = true }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* PDD Header */}
      <div className="mb-2 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Product Description Document</span>
        <MetadataBadge kind="status" value="under-review" label="⏳ Draft v0.1" />
        <MetadataBadge kind="access" value="open" label="🔓 Open" />
        <span className="text-xs text-gray-400">Last updated {pddEntry.lastUpdated}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">EDU Working Reference Library</h1>
      <p className="text-gray-500 text-sm mb-6">{pddEntry.owner}</p>

      {showExplainers && (
        <ExplainerBadge icon="📄">
          <strong>PDD page rationale:</strong> A Product Description Document defines the what, why, and who before implementation begins. Including it in the library itself means stakeholders can discover the library's governing rationale the same way they discover any other resource.
        </ExplainerBadge>
      )}

      <div className="flex gap-6">
        {/* Main PDD content */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* Section 1: Purpose */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">1</div>
              <h2 className="text-lg font-bold text-gray-800">Purpose & Primary Use Case</h2>
            </div>
            {showExplainers && (
              <ExplainerBadge icon="🎯">
                <strong>Why a "purpose" section leads:</strong> Stakeholders need to immediately understand why this thing exists before they can evaluate whether it serves their needs.
              </ExplainerBadge>
            )}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="bg-indigo-50/70 border-l-3 border-indigo-500 rounded-r-lg p-4">
                <div className="text-sm font-semibold text-indigo-900 mb-1">Primary Use Case</div>
                <p className="text-sm text-indigo-800/80 leading-relaxed">
                  EDU will publish and maintain a <strong>Working Reference Library</strong> that serves as the shared
                  "source of truth" for the ecosystem — establishing context and providing navigation to stakeholders,
                  partner agreements, repositories, and other essential resources.
                </p>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                The primary deliverable is a <strong>living, AI-driven website</strong> that functions as a
                standards and project library, enabling stakeholders to find, access, and apply approved
                Gates Foundation and standards-based resources intelligently.
              </p>

              <p className="text-sm text-gray-600 leading-relaxed">
                Consistent with <strong>DSU principles</strong> and the Gates Foundation's emphasis on scalable
                public benefit, EDU will ensure referenced materials are open and accessible, or clearly labeled
                when restrictions apply.
              </p>
            </div>
          </section>

          {/* Section 2: Stakeholders */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">2</div>
              <h2 className="text-lg font-bold text-gray-800">Stakeholders</h2>
            </div>
            {showExplainers && (
              <ExplainerBadge icon="👥">
                <strong>Why explicit stakeholder mapping:</strong> The library serves multiple distinct audiences with different needs. Explicit mapping prevents designing for only the loudest voice.
              </ExplainerBadge>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🏫', role: 'Implementers & Developers', need: 'Quickly identify what standards exist, understand adoption burden, and access technical resources to integrate without duplicating work.' },
                { icon: '🤝', role: 'Partner Organizations', need: 'Discover active partner agreements, understand participation requirements, and navigate governance structures.' },
                { icon: '📊', role: 'Policy & Program Officers', need: 'Verify that adopted standards align with Gates Foundation priorities and DSU principles; monitor ecosystem adoption.' },
                { icon: '🤖', role: 'AI & Analytics Systems', need: 'Query structured metadata programmatically to surface relevant resources, identify gaps, and generate adoption recommendations.' },
                { icon: '🎓', role: 'Learner Advocates', need: 'Verify that standards include equity and accessibility considerations and that learner data is protected.' },
                { icon: '🔬', role: 'Researchers', need: 'Discover the landscape of standards in use, access versioned history, and identify areas for new standards development.' },
              ].map(s => (
                <div key={s.role} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl mb-1.5">{s.icon}</div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{s.role}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.need}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Core Requirements */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">3</div>
              <h2 className="text-lg font-bold text-gray-800">Core Requirements</h2>
            </div>
            {showExplainers && (
              <ExplainerBadge icon="✅">
                <strong>Why requirements are listed here:</strong> This section converts the use case narrative into verifiable statements. Each requirement maps to a feature in the library UI.
              </ExplainerBadge>
            )}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs w-10">#</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs">Requirement</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs w-28">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'R1', req: 'Library entries must be searchable and filterable by both human stakeholders and AI/analytics systems.', priority: 'Must-have' },
                    { id: 'R2', req: 'Each entry must carry an "access level" indicator (open or restricted) per Gates Foundation openness policy.', priority: 'Must-have' },
                    { id: 'R3', req: 'Each entry must include an "implementation burden level" (low / medium / high) with rationale.', priority: 'Must-have' },
                    { id: 'R4', req: 'Each entry must list "required capabilities" so implementers can assess prerequisites before adoption.', priority: 'Must-have' },
                    { id: 'R5', req: 'Each entry must include "equity/accessibility considerations," with LIF-derived flag where applicable.', priority: 'Must-have' },
                    { id: 'R6', req: 'Each entry must include "privacy/security considerations" including applicable regulations.', priority: 'Must-have' },
                    { id: 'R7', req: 'The library must expose a structured machine-readable API (JSON/JSON-LD) for AI discovery.', priority: 'Must-have' },
                    { id: 'R8', req: 'The library must be versioned and include a changelog — it is a "living document."', priority: 'Must-have' },
                    { id: 'R9', req: 'Stakeholders must be able to submit resources for review via a governed intake process.', priority: 'Should-have' },
                    { id: 'R10', req: 'The library should surface related resources and suggest adoption sequences.', priority: 'Should-have' },
                    { id: 'R11', req: 'A stakeholder-type filter should allow personalized views (e.g., "show me what a developer needs").', priority: 'Nice-to-have' },
                  ].map((r, i) => (
                    <tr key={r.id} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/30' : ''} hover:bg-gray-50/60 transition-colors`}>
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                      <td className="px-5 py-3 text-gray-600">{r.req}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium
                          ${r.priority === 'Must-have' ? 'bg-red-50 text-red-600' :
                            r.priority === 'Should-have' ? 'bg-amber-50 text-amber-600' :
                            'bg-gray-100 text-gray-500'}`}>
                          {r.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Metadata Schema */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">4</div>
              <h2 className="text-lg font-bold text-gray-800">Library Entry Metadata Schema</h2>
            </div>
            {showExplainers && (
              <ExplainerBadge icon="🗄️">
                <strong>Why document the schema here:</strong> The metadata schema is itself a governance artifact. Publishing it ensures that partners contributing entries know exactly what fields are required.
              </ExplainerBadge>
            )}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
              {[
                { field: 'implementationBurden', type: 'enum: low | medium | high', purpose: 'Allows implementers to triage resources by adoption effort. Gates Foundation partners range from well-resourced districts to under-resourced community orgs.', required: true },
                { field: 'requiredCapabilities', type: 'array of strings', purpose: 'Prevents organizations from committing to a standard they cannot support. Lists the minimum technical, legal, or organizational capabilities required.', required: true },
                { field: 'equityConsiderations', type: 'object { level, notes, lifDerived }', purpose: 'Surfaces accessibility, language, and device equity issues. The LIF-derived flag indicates considerations drawn from the Learner Impact Framework.', required: true },
                { field: 'privacyConsiderations', type: 'object { level, notes, dataClassification, regulations }', purpose: 'Flags FERPA, COPPA, GDPR, and state privacy law implications. Prevents partners from unknowingly creating compliance risk.', required: true },
                { field: 'aiTaxonomy', type: 'array of strings', purpose: 'Structured taxonomy terms for AI/analytics discovery. Allows language-model-based systems to find resources without exact-match search.', required: true },
                { field: 'aiSummary', type: 'string (1–2 sentences)', purpose: 'A machine-optimized description for AI consumption. Enables RAG systems to accurately surface resources.', required: true },
                { field: 'accessLevel', type: 'enum: open | restricted', purpose: 'Gates Foundation openness policy requires explicit labeling. Open resources require no access request.', required: true },
              ].map(f => (
                <div key={f.field} className="rounded-lg p-3.5 bg-slate-50/80 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{f.field}</code>
                    <code className="text-xs text-gray-400">{f.type}</code>
                    {f.required && <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-medium">required</span>}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Success Criteria */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">5</div>
              <h2 className="text-lg font-bold text-gray-800">Success Criteria</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="space-y-3">
                {[
                  { metric: 'Time-to-discovery', target: 'A stakeholder can find a relevant standard in ≤ 3 search/filter interactions' },
                  { metric: 'Metadata completeness', target: '100% of approved entries carry all 6 required metadata fields' },
                  { metric: 'AI discoverability', target: 'AI query API returns relevant results for 90%+ of test prompts in evaluation set' },
                  { metric: 'Duplicate effort reduction', target: 'Partner survey shows measurable reduction in "built the same thing twice" incidents after 6 months' },
                  { metric: 'Equity review coverage', target: 'All entries with medium/high equity concern have been reviewed by a DEI-subject-matter-expert' },
                  { metric: 'Openness compliance', target: '100% of entries are labeled as open or restricted; no unlabeled entries in production' },
                ].map(c => (
                  <div key={c.metric} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{c.metric}: </span>
                      <span className="text-sm text-gray-500">{c.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Constraints */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">6</div>
              <h2 className="text-lg font-bold text-gray-800">Constraints & Out of Scope</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 shadow-sm">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2.5">⚠️ Constraints</div>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> All referenced materials must be open-access or clearly labeled as restricted per Gates Foundation policy</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> The library does not host documents — it references and annotates them</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> AI/ML systems consuming library metadata may not be trained on learner PII data</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> Entries must pass a review process before appearing as "approved"</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2.5">🚫 Out of Scope (v1)</div>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> Direct learner-facing features (learners access via partner systems, not this library directly)</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> Real-time compliance monitoring of partner implementations</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> Hosting or managing actual standards documents</li>
                  <li className="flex gap-2"><span className="text-indigo-400">›</span> Replacing existing standards bodies — the library curates and contextualizes, it does not create new standards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Version history placeholder */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">7</div>
              <h2 className="text-lg font-bold text-gray-800">Changelog</h2>
            </div>
            <WireframeBox label="[ Version history table — populated as document evolves ]" height="h-20" />
          </section>

        </div>

        {/* Sidebar: PDD metadata card */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Document Metadata</div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-gray-400 mb-1">Status</div>
                <MetadataBadge kind="status" value="under-review" label="⏳ Draft" />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Version</div>
                <span className="font-mono text-gray-600">{pddEntry.version}</span>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Owner</div>
                <span className="text-gray-600">{pddEntry.owner}</span>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Access</div>
                <MetadataBadge kind="access" value="open" label="🔓 Open" />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Impl. Burden</div>
                <MetadataBadge kind="burden" value="low" label="🟢 Low" />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Equity</div>
                <MetadataBadge kind="concern" value="low-concern" label="🟢 Low concern" />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Privacy</div>
                <MetadataBadge kind="concern" value="low-concern" label="🟢 Low concern" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Actions</div>
              <button className="w-full text-left text-xs border border-gray-200 rounded-lg px-3 py-2 mb-1.5 hover:bg-gray-50 text-gray-600 transition-colors">📥 Download PDF</button>
              <button className="w-full text-left text-xs border border-gray-200 rounded-lg px-3 py-2 mb-1.5 hover:bg-gray-50 text-gray-600 transition-colors">💬 Leave feedback</button>
              <button className="w-full text-left text-xs border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors">🔔 Watch for updates</button>
            </div>
          </div>

          {showExplainers && (
            <div className="mt-3">
              <ExplainerBadge icon="📋">
                <strong>Document metadata sidebar:</strong> The PDD carries the same metadata fields as library entries — it's a first-class library citizen. The sidebar stays visible as you scroll.
              </ExplainerBadge>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
