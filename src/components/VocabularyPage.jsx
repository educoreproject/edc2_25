// VocabularyPage.jsx — Interactive vocabulary map of the EDU ontology.
// Fetches /ontology.jsonld at runtime, renders a force-directed graph of
// Specifications ↔ CEDS Domains (via alignment edges) plus a structured
// reference of all OWL classes and their properties.

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

const EDUCORE = 'https://firsteducore.org/ontology#';

function extractLocalName(uri) {
  if (!uri) return uri;
  if (uri.startsWith(EDUCORE)) return uri.slice(EDUCORE.length);
  const hash = uri.lastIndexOf('#');
  if (hash >= 0) return uri.slice(hash + 1);
  const slash = uri.lastIndexOf('/');
  if (slash >= 0) return uri.slice(slash + 1);
  return uri;
}

function getVal(node, key) {
  return node[key] ?? node[EDUCORE + key] ?? undefined;
}

function getStr(node, key) {
  const v = getVal(node, key);
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (v['@value']) return v['@value'];
  return String(v);
}

function getArr(node, key) {
  const v = getVal(node, key);
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function getRef(node, key) {
  const v = getVal(node, key);
  if (!v) return null;
  if (typeof v === 'string') return v;
  return v['@id'] ?? null;
}

// Parse the JSON-LD graph into structured data for visualisation
function parseOntology(graph) {
  const byId = {};
  for (const node of graph) byId[node['@id']] = node;

  const specs = [];
  const domains = [];
  const alignments = [];
  const domainPrivacyMap = {};   // domainId → privacyRiskLevel
  const piiFieldCount = { total: 0 };

  for (const node of graph) {
    const type = node['@type'];
    if (!type) continue;
    const localType = extractLocalName(type);

    if (localType === 'Specification') {
      specs.push({
        id: node['@id'],
        label: node['dcterms:title'] || node['rdfs:label'] || extractLocalName(node['@id']),
        shortId: extractLocalName(node['@id']).replace('spec/', ''),
        owner: getStr(node, 'owner'),
        category: getStr(node, 'category'),
        burden: getStr(node, 'implementationBurden'),
        pairedWith: getArr(node, 'commonlyPairedWith').map(r => r['@id'] || r),
        tags: getArr(node, 'dcterms:subject'),
        aiSummary: getStr(node, 'aiSummary'),
      });
    } else if (localType === 'CedsDomain') {
      domains.push({
        id: node['@id'],
        label: node['rdfs:label'] || extractLocalName(node['@id']),
        shortId: extractLocalName(node['@id']).replace('ceds-domain/', ''),
        // privacyRisk filled in below after DomainPrivacyProfile pass
      });
    } else if (localType === 'CedsAlignment') {
      alignments.push({
        id: node['@id'],
        spec: getRef(node, 'specification'),
        domain: getRef(node, 'cedsDomain'),
        status: getStr(node, 'alignmentStatus'),
        notes: getStr(node, 'notes'),
        elements: getArr(node, 'cedsElement'),
        privacyRisk: getStr(node, 'alignmentPrivacyRisk'),
      });
    } else if (localType === 'DomainPrivacyProfile') {
      const domainId = node['@id'].replace(EDUCORE + 'domain-privacy/', '');
      domainPrivacyMap[domainId] = getStr(node, 'privacyRiskLevel');
    } else if (localType === 'PIIField') {
      piiFieldCount.total += 1;
    }
  }

  // Attach privacyRisk to domain nodes
  for (const d of domains) {
    d.privacyRisk = domainPrivacyMap[d.shortId] || 'low';
  }

  const highPrivacyDomains = Object.values(domainPrivacyMap).filter(r => r === 'high').length;

  // Hardcoded OWL class reference — 12 classes including new privacy classes.
  const owlClasses = [
    { name: 'Specification', comment: 'A specification or standard in the EDU reference library', properties: ['dcterms:title', 'dcterms:description', 'dcterms:type', 'dcterms:modified', 'category', 'owner', 'governanceBody', 'status', 'version', 'accessLevel', 'implementationBurden', 'aiSummary', 'commonlyPairedWith', 'cedsAlignment'] },
    { name: 'CedsDomain', comment: 'A CEDS ontology domain', properties: ['rdfs:label', 'dcterms:identifier', 'domainPrivacyProfile'] },
    { name: 'CedsAlignment', comment: 'Alignment between a specification and a CEDS domain', properties: ['specification', 'cedsDomain', 'alignmentStatus', 'notes', 'cedsElement', 'alignmentPrivacyRisk', 'piiField'] },
    { name: 'DomainPrivacyProfile', comment: 'Privacy risk profile for a CEDS domain, independent of any specific specification', properties: ['privacyRiskLevel', 'privacyRiskRationale', 'piiCategories', 'applicableRegulation', 'consentRequired', 'transferRisk'] },
    { name: 'PIICategory', comment: 'A controlled vocabulary term for classifying types of personally identifiable information', properties: ['rdfs:label', 'rdfs:comment'] },
    { name: 'PIIField', comment: 'A specific field in a specification data model that carries personally identifiable information', properties: ['fieldPath', 'piiCategory', 'sensitivityLevel', 'ferpaProtected', 'coppaScope', 'mitigationStrategy'] },
    { name: 'PrivacyConsideration', comment: 'Spec-level privacy and data protection assessment', properties: ['level', 'notes', 'dataClassification', 'regulation'] },
    { name: 'BurdenRubric', comment: 'Implementation burden breakdown for a specification', properties: ['timeline', 'engineering', 'infrastructure', 'legal'] },
    { name: 'BurdenDimension', comment: 'A single dimension of implementation burden', properties: ['rdfs:label', 'level', 'note'] },
    { name: 'EquityConsideration', comment: 'Equity and accessibility assessment', properties: ['level', 'notes', 'lifDerived'] },
    { name: 'ReferenceImplementation', comment: 'A reference implementation or tool', properties: ['rdfs:label', 'foaf:page', 'dcterms:description'] },
    { name: 'TechnicalDocLink', comment: 'A link to technical documentation', properties: ['rdfs:label', 'foaf:page'] },
  ];

  return { specs, domains, alignments, owlClasses, byId, highPrivacyDomains, piiFieldCount: piiFieldCount.total };
}

// ─── Force Graph Component ───────────────────────────────────────────
function ForceGraph({ specs, domains, alignments }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 520 });

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDimensions({ width, height: Math.max(420, Math.min(560, width * 0.55)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || specs.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Build nodes
    const nodes = [
      ...specs.map(s => ({ ...s, group: 'spec', radius: 22 })),
      ...domains.map(d => ({ ...d, group: 'domain', radius: 14 })),
    ];
    const nodeById = {};
    nodes.forEach(n => { nodeById[n.id] = n; });

    // Build links: alignment edges
    const links = [];
    for (const a of alignments) {
      if (a.status === 'gap') continue;
      if (nodeById[a.spec] && nodeById[a.domain]) {
        links.push({
          source: a.spec,
          target: a.domain,
          status: a.status,
          notes: a.notes,
          elements: a.elements,
        });
      }
    }

    // Add "commonlyPairedWith" edges between specs
    for (const s of specs) {
      for (const pId of s.pairedWith) {
        if (nodeById[pId] && pId > s.id) {
          links.push({ source: s.id, target: pId, status: 'paired' });
        }
      }
    }

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.status === 'paired' ? 80 : 120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 6))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        if (d.status === 'full') return '#10b981';
        if (d.status === 'partial') return '#f59e0b';
        if (d.status === 'paired') return '#818cf8';
        return '#d1d5db';
      })
      .attr('stroke-width', d => d.status === 'paired' ? 1.5 : 2)
      .attr('stroke-dasharray', d => d.status === 'partial' ? '4,3' : d.status === 'paired' ? '2,4' : 'none')
      .attr('stroke-opacity', 0.7);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'grab')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Circles
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        if (d.group === 'spec') return '#6366f1';
        // Domain: tint by privacy risk level
        if (d.privacyRisk === 'high')   return '#f43f5e'; // rose-500
        if (d.privacyRisk === 'medium') return '#a78bfa'; // violet-400
        return '#0ea5e9'; // sky-500 (low / default)
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Labels
    node.append('text')
      .text(d => d.group === 'spec' ? d.shortId.replace(/-/g, ' ').slice(0, 12) : d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.radius + 14)
      .attr('font-size', d => d.group === 'spec' ? '10px' : '9px')
      .attr('font-weight', d => d.group === 'spec' ? '600' : '500')
      .attr('fill', '#374151')
      .attr('pointer-events', 'none');

    // Tooltip on hover
    node.on('mouseenter', (event, d) => {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 10,
        node: d,
      });
    }).on('mouseleave', () => setTooltip(null));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [specs, domains, alignments, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full rounded-xl border border-gray-200 bg-white"
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg z-10"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <div className="font-semibold">{tooltip.node.label}</div>
          {tooltip.node.group === 'spec' && tooltip.node.owner && (
            <div className="text-gray-300 mt-0.5">{tooltip.node.owner}</div>
          )}
          {tooltip.node.group === 'spec' && tooltip.node.category && (
            <div className="text-gray-400 mt-0.5">{tooltip.node.category}</div>
          )}
          {tooltip.node.group === 'domain' && tooltip.node.privacyRisk && (
            <div className={`mt-1 text-xs font-semibold ${
              tooltip.node.privacyRisk === 'high'   ? 'text-rose-400' :
              tooltip.node.privacyRisk === 'medium' ? 'text-violet-300' :
              'text-sky-300'
            }`}>
              Privacy risk: {tooltip.node.privacyRisk}
            </div>
          )}
          <div className="text-gray-400 mt-0.5 font-mono text-[10px] break-all">{tooltip.node.id}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function VocabularyPage() {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classFilter, setClassFilter] = useState(null);

  useEffect(() => {
    fetch('/ontology.jsonld')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ontology (${r.status})`);
        return r.json();
      })
      .then(data => {
        setGraph(parseOntology(data['@graph'] || []));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Stats
  const stats = useMemo(() => {
    if (!graph) return null;
    const fullCount = graph.alignments.filter(a => a.status === 'full').length;
    const partialCount = graph.alignments.filter(a => a.status === 'partial').length;
    const gapCount = graph.alignments.filter(a => a.status === 'gap').length;
    return {
      specs: graph.specs.length,
      domains: graph.domains.length,
      alignments: graph.alignments.length,
      fullCount,
      partialCount,
      gapCount,
      classes: graph.owlClasses.length,
      highPrivacyDomains: graph.highPrivacyDomains,
      piiFields: graph.piiFieldCount,
    };
  }, [graph]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 mt-3">Loading ontology...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ontology Vocabulary Map</h1>
        <p className="text-gray-500 text-sm mt-1 max-w-3xl leading-relaxed">
          Interactive visualization of the EDU Reference Library ontology. The graph shows how
          specifications connect to CEDS domains via alignment assessments. The reference below
          documents all OWL classes and their properties.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <a
            href="/ontology.jsonld"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            JSON-LD
          </a>
          <a
            href="/ontology.ttl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Turtle
          </a>
          <span className="text-xs text-gray-400 ml-2">
            Namespace: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">https://firsteducore.org/ontology#</code>
          </span>
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-6">
          {[
            { label: 'OWL Classes', value: stats.classes, color: 'text-gray-900' },
            { label: 'Specifications', value: stats.specs, color: 'text-indigo-600' },
            { label: 'CEDS Domains', value: stats.domains, color: 'text-sky-600' },
            { label: 'Alignments', value: stats.alignments, color: 'text-gray-900' },
            { label: 'Full', value: stats.fullCount, color: 'text-emerald-600' },
            { label: 'Partial', value: stats.partialCount, color: 'text-amber-600' },
            { label: 'Gap', value: stats.gapCount, color: 'text-red-500' },
            { label: 'High Privacy', value: stats.highPrivacyDomains, color: 'text-rose-600' },
            { label: 'PII Fields', value: stats.piiFields, color: 'text-violet-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Force Graph */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Specification ↔ CEDS Domain Graph</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Specification
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Domain privacy:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" /> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" /> Low
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-emerald-500 inline-block" /> Full
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-amber-500 inline-block border-t border-dashed border-amber-500" /> Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-indigo-400 inline-block opacity-60" style={{ borderTop: '1.5px dotted' }} /> Paired
            </span>
          </div>
        </div>
        <ForceGraph specs={graph.specs} domains={graph.domains} alignments={graph.alignments} />
        <p className="text-xs text-gray-400 mt-2">Drag nodes to rearrange. Scroll to zoom. Gap alignments are hidden to reduce clutter.</p>
      </div>

      {/* OWL Class Reference */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">OWL Class Reference</h2>
        <p className="text-sm text-gray-500 mb-4">
          All classes defined in the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">educore:</code> namespace.
          Click a class to see its properties.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {graph.owlClasses.map(cls => (
            <button
              key={cls.name}
              onClick={() => setClassFilter(classFilter === cls.name ? null : cls.name)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors
                ${classFilter === cls.name
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              {cls.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {graph.owlClasses
            .filter(cls => !classFilter || cls.name === classFilter)
            .map(cls => (
              <div key={cls.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <code className="text-sm font-semibold text-indigo-600">educore:{cls.name}</code>
                  <span className="text-xs text-gray-400">{cls.comment}</span>
                </div>
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Properties</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.properties.map(prop => {
                      const isExternal = prop.includes(':');
                      return (
                        <span
                          key={prop}
                          className={`text-xs px-2 py-1 rounded-md border font-mono
                            ${isExternal
                              ? 'bg-gray-50 text-gray-600 border-gray-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}
                        >
                          {isExternal ? prop : `educore:${prop}`}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Instance count */}
                {cls.name === 'Specification' && (
                  <div className="px-4 pb-3 text-xs text-gray-400">
                    {graph.specs.length} instance{graph.specs.length !== 1 ? 's' : ''} in ontology
                  </div>
                )}
                {cls.name === 'CedsDomain' && (
                  <div className="px-4 pb-3 text-xs text-gray-400">
                    {graph.domains.length} instance{graph.domains.length !== 1 ? 's' : ''} in ontology
                  </div>
                )}
                {cls.name === 'CedsAlignment' && (
                  <div className="px-4 pb-3 text-xs text-gray-400">
                    {graph.alignments.length} instance{graph.alignments.length !== 1 ? 's' : ''} in ontology
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Namespace Prefixes */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Namespace Prefixes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs font-mono">
          {[
            ['educore:', 'https://firsteducore.org/ontology#'],
            ['owl:', 'http://www.w3.org/2002/07/owl#'],
            ['rdfs:', 'http://www.w3.org/2000/01/rdf-schema#'],
            ['dcterms:', 'http://purl.org/dc/terms/'],
            ['skos:', 'http://www.w3.org/2004/02/skos/core#'],
            ['foaf:', 'http://xmlns.com/foaf/0.1/'],
            ['xsd:', 'http://www.w3.org/2001/XMLSchema#'],
          ].map(([prefix, uri]) => (
            <div key={prefix} className="flex gap-2 py-1">
              <span className="text-indigo-600 font-semibold w-20 flex-shrink-0">{prefix}</span>
              <span className="text-gray-500 truncate">{uri}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
