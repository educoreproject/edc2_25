// StandardsPage.jsx — Standards browser organized by domain.
// Includes the AI Interoperability Mapping Assistant and dynamically
// groups library entries by category.

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { libraryEntries } from '../data/libraryEntries';
import {
  stakeholderTaxonomy,
  useCasesCedsRdf,
} from '../data/taxonomies';
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

export default function StandardsPage({ onNavigateToEntry, onActivateNeeds }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showExplainers, setShowExplainers] = useState(true);

  // AI Interoperability Mapper state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiSources, setAiSources] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const grouped = groupByCategory(libraryEntries);
  const categories = Object.keys(grouped);

  // Fetch and condense the ontology for the AI context
  const fetchOntologyContext = async () => {
    const res = await fetch('/ontology.jsonld');
    if (!res.ok) return null;
    const data = await res.json();
    const graph = data['@graph'] || [];

    const BASE = 'https://firsteducore.org/ontology#';
    const getVal = (node, key) => node[key] ?? node[BASE + key] ?? '';
    const getStr = (node, key) => { const v = getVal(node, key); return typeof v === 'string' ? v : v?.['@value'] ?? ''; };
    const getArr = (node, key) => { const v = getVal(node, key); return Array.isArray(v) ? v : v ? [v] : []; };

    const specs = graph.filter(n => n['@type']?.endsWith('Specification')).map(n => ({
      uri: n['@id'],
      title: n['dcterms:title'] || '',
      category: getStr(n, 'category'),
      owner: getStr(n, 'owner'),
      burden: getStr(n, 'implementationBurden'),
      aiSummary: getStr(n, 'aiSummary'),
      compatibilityNotes: getStr(n, 'compatibilityNotes'),
      guidance: getStr(n, 'implementationGuidance'),
      pairedWith: getArr(n, 'commonlyPairedWith').map(r => r['@id'] || r),
      page: n['foaf:page']?.['@id'] || '',
    }));

    const domains = graph.filter(n => n['@type']?.endsWith('CedsDomain')).map(n => ({
      uri: n['@id'],
      label: n['rdfs:label'] || '',
    }));

    const alignments = graph.filter(n => n['@type']?.endsWith('CedsAlignment')).map(n => ({
      uri: n['@id'],
      spec: getVal(n, 'specification')?.['@id'] || '',
      domain: getVal(n, 'cedsDomain')?.['@id'] || '',
      status: getStr(n, 'alignmentStatus'),
      notes: getStr(n, 'notes'),
      elements: getArr(n, 'cedsElement'),
    }));

    return { specs, domains, alignments };
  };

  // Build context about stakeholders and use cases for AI to reference
  const buildStakeholderContext = () => {
    const stakeholders = stakeholderTaxonomy.flatMap(group =>
      group.children.map(child => ({
        id: child.id,
        label: child.label,
        group: group.label,
        needs: child.businessNeeds,
      }))
    );
    const useCases = useCasesCedsRdf.map(uc => ({
      id: uc.id,
      label: uc.label,
      stakeholders: uc.stakeholders,
      businessNeeds: uc.businessNeeds,
      cedsDomains: uc.cedsDomains,
    }));
    return { stakeholders, useCases };
  };

  const handleAiSubmit = async () => {
    if (!aiQuery.trim()) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setAiError('OpenAI API key not configured. Set VITE_OPENAI_API_KEY in your environment.');
      return;
    }

    setAiLoading(true);
    setAiError('');
    setAiResponse('');
    setAiSources([]);

    try {
      const ontology = await fetchOntologyContext();
      const { stakeholders, useCases } = buildStakeholderContext();

      const ontologyContext = ontology
        ? `\n\nYou have access to the EDU Reference Library ontology (JSON-LD at https://firsteducore.org/ontology). Use it to ground your answer.\n\n## Specifications in the ontology:\n${ontology.specs.map(s =>
              `- **${s.title}** (${s.uri})\n  Category: ${s.category} | Owner: ${s.owner} | Burden: ${s.burden}\n  Summary: ${s.aiSummary}\n  Compatibility: ${s.compatibilityNotes}\n  Paired with: ${s.pairedWith.join(', ')}\n  Spec page: ${s.page}`
            ).join('\n')}\n\n## CEDS Domains:\n${ontology.domains.map(d => `- ${d.label} (${d.uri})`).join('\n')}\n\n## CEDS Alignment Triples (spec → domain → status):\n${ontology.alignments.map(a => `- ${a.spec} → ${a.domain} = ${a.status}${a.notes ? ': ' + a.notes : ''}${a.elements.length ? ' [elements: ' + a.elements.join(', ') + ']' : ''}`).join('\n')}`
        : '';

      const stakeholderContext = `\n\n## Available Stakeholders (use these exact IDs):\n${stakeholders.map(s => `- id: "${s.id}" | ${s.label} (${s.group})`).join('\n')}\n\n## Available Use Cases (use these exact IDs):\n${useCases.map(uc => `- id: "${uc.id}" | ${uc.label} | CEDS domains: ${uc.cedsDomains.join(', ')} | stakeholders: ${uc.stakeholders.join(', ')}`).join('\n')}`;

      const systemPrompt = `You are the EDU Reference Library AI assistant. Answer interoperability questions using the ontology data below.

RESPONSE FORMAT RULES:
1. Keep your answer BRIEF — 2-4 short paragraphs maximum. Focus on WHICH specifications are needed and WHY, not detailed implementation steps.
2. For each specification you recommend, mention its implementation burden level (low/medium/high).
3. Include links to the technical specification pages.
4. At the end of your response, include TWO structured sections:

## Ontology Resources Used
List every educore: URI you referenced, one per line, formatted as: \`<URI>\`

## Activated Context
\`\`\`json
{
  "stakeholderIds": ["id1", "id2"],
  "useCaseIds": ["uc-id1", "uc-id2"]
}
\`\`\`
Choose the stakeholder IDs and use case IDs from the lists below that are MOST RELEVANT to the user's question. Select only the ones that directly apply.${ontologyContext}${stakeholderContext}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: aiQuery },
          ],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed (${res.status})`);
      }

      const data = await res.json();
      const fullResponse = data.choices?.[0]?.message?.content || 'No response received.';

      // Parse out the "Ontology Resources Used" section
      const sourceSplit = fullResponse.split(/## Ontology Resources Used/i);
      const mainResponse = sourceSplit[0].trim();
      const afterMain = sourceSplit[1] || '';

      // Split off the "Activated Context" section
      const contextSplit = afterMain.split(/## Activated Context/i);
      const sourcesSection = contextSplit[0] || '';
      const activatedSection = contextSplit[1] || '';

      // Extract ontology URIs
      const uriPattern = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`]+)`?/g;
      const foundUris = [];
      let match;
      while ((match = uriPattern.exec(sourcesSection)) !== null) {
        foundUris.push(match[1]);
      }

      // Enrich URIs with labels from ontology
      const enrichedSources = foundUris.map(uri => {
        if (!ontology) return { uri, label: uri };
        const spec = ontology.specs.find(s => s.uri === uri);
        if (spec) return { uri, label: spec.title, type: 'Specification' };
        const domain = ontology.domains.find(d => d.uri === uri);
        if (domain) return { uri, label: domain.label, type: 'CEDS Domain' };
        const alignment = ontology.alignments.find(a => a.uri === uri);
        if (alignment) return { uri, label: `${alignment.status} alignment`, type: 'CEDS Alignment', status: alignment.status };
        const localName = uri.replace('https://firsteducore.org/ontology#', '');
        return { uri, label: localName, type: 'Resource' };
      });

      setAiResponse(mainResponse);
      setAiSources(enrichedSources);

      // Parse the activated context JSON and auto-activate business needs via App
      const jsonMatch = activatedSection.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const activated = JSON.parse(jsonMatch[1]);
          const sIds = activated.stakeholderIds || [];
          const ucIds = activated.useCaseIds || [];

          if (sIds.length > 0 || ucIds.length > 0) {
            onActivateNeeds?.(sIds, ucIds);
          }
        } catch (_) {
          // JSON parse failed — silently skip auto-activation
        }
      }
    } catch (err) {
      setAiError(err.message || 'An unexpected error occurred.');
    } finally {
      setAiLoading(false);
    }
  };

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

      {/* AI Interoperability Mapper */}
      <div className="mt-5 mb-8 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-200/40 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Interoperability Mapping Assistant</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-3xl">
          Describe your interoperability scenario below — the standards your system uses, the standards you need to
          exchange data with, and any non-standard local fields. Get an AI-generated mapping guide grounded in
          1EdTech, A4L, and IEEE specifications.
        </p>
        <textarea
          value={aiQuery}
          onChange={e => setAiQuery(e.target.value)}
          placeholder="My system adheres to Standard X. I need to send/receive data to/from a system that stores its data in Standard Y. However, my system has non-standard local data fields A, B, C. Generate an executable mapping/translation document."
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-shadow placeholder:text-gray-400 resize-y"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleAiSubmit}
            disabled={aiLoading || !aiQuery.trim()}
            className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating…
              </>
            ) : (
              'Generate Mapping'
            )}
          </button>
          {aiQuery.trim() && !aiLoading && (
            <button
              onClick={() => { setAiQuery(''); setAiResponse(''); setAiError(''); setAiSources([]); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {aiError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {aiError}
          </div>
        )}

        {aiResponse && (
          <div className="mt-4 space-y-3">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm prose prose-sm prose-indigo max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ children, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {aiResponse}
              </ReactMarkdown>
            </div>

            {/* Ontology Sources Panel */}
            {aiSources.length > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.798" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                    Ontology Resources Used ({aiSources.length})
                  </div>
                  <a
                    href="/ontology.jsonld"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[10px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                  >
                    View full JSON-LD
                  </a>
                </div>
                <div className="space-y-1.5">
                  {aiSources.map((source, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-lg border border-indigo-100 px-3 py-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border flex-shrink-0
                        ${source.type === 'Specification' ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                          : source.type === 'CEDS Domain' ? 'bg-sky-50 text-sky-600 border-sky-200'
                          : source.type === 'CEDS Alignment' ? (
                              source.status === 'full' ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : source.status === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-gray-50 text-gray-600 border-gray-200')
                          : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        {source.type}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{source.label}</span>
                      <code className="ml-auto text-[10px] text-gray-400 font-mono truncate max-w-xs hidden sm:block">
                        {source.uri.replace('https://firsteducore.org/ontology#', 'educore:')}
                      </code>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-indigo-400 mt-2">
                  These RDF resources from the EDU ontology were used to ground this response. URIs resolve to <code>ontology.jsonld</code>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
