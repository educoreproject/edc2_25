// LibraryPage.jsx — The main working reference library interface.
// WHY IT EXISTS: This is the primary deliverable surface described in the PDD —
// "a living, AI-driven website that functions as a standards and project library,
// enabling stakeholders to find, access, and apply approved resources intelligently."

import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { libraryEntries, categoryFilters, burdenFilters, allCapabilities, equityLevelFilters, privacyLevelFilters } from '../data/libraryEntries';
import {
  stakeholderTaxonomy,
  useCasesCedsRdf,
} from '../data/taxonomies';
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

export default function LibraryPage({ selectedEntryId = null, onNavigateToEntry, onClearSelection, onActivateNeeds }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [burden, setBurden] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');
  const [capabilityFilter, setCapabilityFilter] = useState([]);
  const [equityFilter, setEquityFilter] = useState('All');
  const [privacyFilter, setPrivacyFilter] = useState('All');
  const [showExplainers, setShowExplainers] = useState(true);

  const [sortBy, setSortBy] = useState('relevant');

  // AI Interoperability Mapper state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiSources, setAiSources] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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
      console.group('%c[EDU AI] Interoperability Mapping Request', 'color: #4f46e5; font-weight: bold');
      console.log('%cUser query:', 'font-weight: bold', aiQuery);

      console.log('%c[1/4] Fetching ontology (ontology.jsonld)…', 'color: #6366f1');
      const ontology = await fetchOntologyContext();
      if (ontology) {
        console.log('%c[1/4] Ontology loaded:', 'color: #16a34a',
          `${ontology.specs.length} specs, ${ontology.domains.length} CEDS domains, ${ontology.alignments.length} alignment triples`);
        console.table(ontology.specs.map(s => ({ title: s.title, uri: s.uri, burden: s.burden, category: s.category })));
        console.table(ontology.domains.map(d => ({ label: d.label, uri: d.uri })));
      } else {
        console.warn('%c[1/4] Ontology fetch failed — proceeding without RDF context', 'color: #dc2626');
      }

      console.log('%c[2/4] Building stakeholder & use case context…', 'color: #6366f1');
      const { stakeholders, useCases } = buildStakeholderContext();
      console.log(`  ${stakeholders.length} stakeholders, ${useCases.length} use cases`);

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

      console.log('%c[3/4] System prompt assembled', 'color: #6366f1', `(${systemPrompt.length} chars)`);
      console.groupCollapsed('Full system prompt');
      console.log(systemPrompt);
      console.groupEnd();

      console.log('%c[4/4] Sending to OpenAI (gpt-4o)…', 'color: #6366f1');

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

      console.log('%cResponse received', 'color: #16a34a; font-weight: bold',
        `(${data.usage?.total_tokens || '?'} tokens)`);
      console.groupCollapsed('Full AI response (raw)');
      console.log(fullResponse);
      console.groupEnd();

      const sourceSplit = fullResponse.split(/## Ontology Resources Used/i);
      const mainResponse = sourceSplit[0].trim();
      const afterMain = sourceSplit[1] || '';

      const contextSplit = afterMain.split(/## Activated Context/i);
      const sourcesSection = contextSplit[0] || '';
      const activatedSection = contextSplit[1] || '';

      // Match full URIs or educore: shorthand
      const fullUriPattern = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g;
      const shortPattern = /`?educore:([^\s`<>)]+)`?/g;
      const foundUris = [];
      let match;
      while ((match = fullUriPattern.exec(sourcesSection)) !== null) {
        foundUris.push(match[1]);
      }
      while ((match = shortPattern.exec(sourcesSection)) !== null) {
        const expanded = `https://firsteducore.org/ontology#${match[1]}`;
        if (!foundUris.includes(expanded)) foundUris.push(expanded);
      }

      // If no URIs found in the sources section, scan the main response too
      if (foundUris.length === 0) {
        const fullScan = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g;
        const shortScan = /`?educore:([^\s`<>)]+)`?/g;
        while ((match = fullScan.exec(fullResponse)) !== null) {
          if (!foundUris.includes(match[1])) foundUris.push(match[1]);
        }
        while ((match = shortScan.exec(fullResponse)) !== null) {
          const expanded = `https://firsteducore.org/ontology#${match[1]}`;
          if (!foundUris.includes(expanded)) foundUris.push(expanded);
        }
      }

      // Last resort: match spec names from ontology against the main response text
      if (foundUris.length === 0 && ontology) {
        for (const spec of ontology.specs) {
          if (mainResponse.includes(spec.title)) {
            foundUris.push(spec.uri);
          }
        }
        for (const domain of ontology.domains) {
          if (mainResponse.includes(domain.label)) {
            foundUris.push(domain.uri);
          }
        }
      }

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

      console.log('%cOntology URIs extracted:', 'color: #6366f1; font-weight: bold', foundUris.length);
      if (foundUris.length > 0) {
        console.table(enrichedSources.map(s => ({ type: s.type, label: s.label, uri: s.uri.replace('https://firsteducore.org/ontology#', 'educore:') })));
      } else {
        console.warn('No ontology URIs found in response — sources panel will be empty');
      }

      setAiResponse(mainResponse);
      setAiSources(enrichedSources);

      const jsonMatch = activatedSection.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const activated = JSON.parse(jsonMatch[1]);
          const sIds = activated.stakeholderIds || [];
          const ucIds = activated.useCaseIds || [];

          console.log('%cActivated context:', 'color: #6366f1; font-weight: bold',
            { stakeholderIds: sIds, useCaseIds: ucIds });

          if (sIds.length > 0 || ucIds.length > 0) {
            onActivateNeeds?.(sIds, ucIds);
          }
        } catch (_) {
          console.warn('Failed to parse activated context JSON');
        }
      }

      console.groupEnd(); // close [EDU AI] group
    } catch (err) {
      console.error('%c[EDU AI] Error:', 'color: #dc2626', err.message);
      console.groupEnd();
      setAiError(err.message || 'An unexpected error occurred.');
    } finally {
      setAiLoading(false);
    }
  };

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
          {/* AI Interoperability Mapper */}
          <div className="mb-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-200/40 rounded-xl p-5">
            <h2 className="text-base font-bold text-gray-900 mb-1">Interoperability Mapping Assistant</h2>
            <p className="text-xs text-gray-500 mb-3 max-w-2xl">
              Describe your interoperability scenario — the standards your system uses, the standards you need to
              exchange data with, and any non-standard local fields.
            </p>
            <textarea
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              placeholder="My system adheres to Standard X. I need to send/receive data to/from a system that stores its data in Standard Y. However, my system has non-standard local data fields A, B, C. Generate an executable mapping/translation document."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-shadow placeholder:text-gray-400 resize-y"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={handleAiSubmit}
                disabled={aiLoading || !aiQuery.trim()}
                className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-2 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {aiError}
              </div>
            )}

            {aiResponse && (
              <div className="mt-3 space-y-3">
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
