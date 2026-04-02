'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

/* ---------- Types ---------- */
interface OntologyNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'spec' | 'domain';
  meta: Record<string, unknown>;
}

interface OntologyLink extends d3.SimulationLinkDatum<OntologyNode> {
  status: 'full' | 'partial' | 'gap';
  notes?: string;
}

interface Stats {
  specs: number;
  domains: number;
  alignments: number;
  full: number;
  partial: number;
  gap: number;
}

/* ---------- Helpers ---------- */
function resolveLabel(node: Record<string, unknown>): string {
  const title = node['dcterms:title'];
  const label = node['rdfs:label'];
  const raw = title ?? label ?? node['@id'] ?? '?';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && raw !== null && '@value' in (raw as Record<string, unknown>)) {
    return String((raw as Record<string, unknown>)['@value']);
  }
  return String(raw);
}

function typeContains(node: Record<string, unknown>, keyword: string): boolean {
  const t = node['@type'];
  if (typeof t === 'string') return t.toLowerCase().includes(keyword.toLowerCase());
  if (Array.isArray(t)) return t.some((v) => typeof v === 'string' && v.toLowerCase().includes(keyword.toLowerCase()));
  return false;
}

/* ---------- Component ---------- */
export default function OntologyPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const simulationRef = useRef<d3.Simulation<OntologyNode, OntologyLink> | null>(null);

  const buildGraph = useCallback(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const rect = wrapperRef.current.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    fetch('/ontology.jsonld')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ontology: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const graph = data['@graph'] ?? [];

        const specNodes: OntologyNode[] = [];
        const domainNodes: OntologyNode[] = [];
        const links: OntologyLink[] = [];
        const nodeMap = new Map<string, OntologyNode>();

        // Parse nodes
        for (const item of graph) {
          const id = item['@id'] as string;
          if (!id) continue;

          if (typeContains(item, 'specification')) {
            const node: OntologyNode = { id, label: resolveLabel(item), type: 'spec', meta: item };
            specNodes.push(node);
            nodeMap.set(id, node);
          } else if (typeContains(item, 'cedsdomain')) {
            const node: OntologyNode = { id, label: resolveLabel(item), type: 'domain', meta: item };
            domainNodes.push(node);
            nodeMap.set(id, node);
          }
        }

        // Parse alignment edges
        for (const item of graph) {
          if (!typeContains(item, 'cedsalignment')) continue;

          const specRef = item['educore:specification'] ?? item['specification'];
          const domainRef = item['educore:cedsDomain'] ?? item['cedsDomain'];
          const status = (item['educore:alignmentStatus'] ?? item['alignmentStatus'] ?? 'gap') as string;
          const notes = (item['educore:notes'] ?? item['notes'] ?? '') as string;

          const specId = typeof specRef === 'object' && specRef !== null ? (specRef as Record<string, unknown>)['@id'] : specRef;
          const domainId = typeof domainRef === 'object' && domainRef !== null ? (domainRef as Record<string, unknown>)['@id'] : domainRef;

          if (typeof specId === 'string' && typeof domainId === 'string' && nodeMap.has(specId) && nodeMap.has(domainId)) {
            links.push({
              source: specId,
              target: domainId,
              status: status as 'full' | 'partial' | 'gap',
              notes,
            });
          }
        }

        const allNodes = [...specNodes, ...domainNodes];

        setStats({
          specs: specNodes.length,
          domains: domainNodes.length,
          alignments: links.length,
          full: links.filter((l) => l.status === 'full').length,
          partial: links.filter((l) => l.status === 'partial').length,
          gap: links.filter((l) => l.status === 'gap').length,
        });

        // Build simulation
        const simulation = d3
          .forceSimulation<OntologyNode>(allNodes)
          .force(
            'link',
            d3
              .forceLink<OntologyNode, OntologyLink>(links)
              .id((d) => d.id)
              .distance(120)
          )
          .force('charge', d3.forceManyBody().strength(-300))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collide', d3.forceCollide().radius((d) => ((d as OntologyNode).type === 'spec' ? 32 : 22)));

        simulationRef.current = simulation;

        // Zoom
        const g = svg.append('g');
        svg.call(
          d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.2, 4])
            .on('zoom', (event) => {
              g.attr('transform', event.transform);
            })
        );

        // Edge color
        const edgeColor = (status: string) => {
          if (status === 'full') return '#10b981';
          if (status === 'partial') return '#f59e0b';
          return '#d1d5db';
        };

        // Links
        const link = g
          .append('g')
          .selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('stroke', (d) => edgeColor(d.status))
          .attr('stroke-width', (d) => (d.status === 'gap' ? 1 : 2))
          .attr('stroke-dasharray', (d) => (d.status === 'gap' ? '4,4' : 'none'))
          .attr('stroke-opacity', (d) => (d.status === 'gap' ? 0.4 : 0.7));

        // Nodes
        const node = g
          .append('g')
          .selectAll<SVGGElement, OntologyNode>('g')
          .data(allNodes)
          .enter()
          .append('g')
          .attr('cursor', 'grab')
          .call(
            d3
              .drag<SVGGElement, OntologyNode>()
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

        node
          .append('circle')
          .attr('r', (d) => (d.type === 'spec' ? 22 : 14))
          .attr('fill', (d) => (d.type === 'spec' ? '#6366f1' : '#38bdf8'))
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);

        node
          .append('text')
          .text((d) => {
            const label = d.label;
            return label.length > 16 ? label.slice(0, 14) + '...' : label;
          })
          .attr('text-anchor', 'middle')
          .attr('dy', (d) => (d.type === 'spec' ? 36 : 26))
          .attr('font-size', (d) => (d.type === 'spec' ? 11 : 9))
          .attr('font-weight', (d) => (d.type === 'spec' ? 600 : 400))
          .attr('fill', '#374151');

        // Tooltip
        const tooltip = d3
          .select(wrapperRef.current)
          .append('div')
          .attr('class', 'absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-[240px] leading-relaxed hidden z-50');

        node
          .on('mouseover', (event, d) => {
            const typeLabel = d.type === 'spec' ? 'Specification' : 'CEDS Domain';
            tooltip
              .classed('hidden', false)
              .html(`<strong>${d.label}</strong><br/><span class="text-gray-300">${typeLabel}</span><br/><span class="text-gray-400 text-[10px]">${d.id}</span>`);
          })
          .on('mousemove', (event) => {
            const wrapperRect = wrapperRef.current!.getBoundingClientRect();
            tooltip
              .style('left', `${event.clientX - wrapperRect.left + 14}px`)
              .style('top', `${event.clientY - wrapperRect.top - 10}px`);
          })
          .on('mouseout', () => {
            tooltip.classed('hidden', true);
          });

        link
          .on('mouseover', (event, d) => {
            const src = typeof d.source === 'object' ? (d.source as OntologyNode).label : d.source;
            const tgt = typeof d.target === 'object' ? (d.target as OntologyNode).label : d.target;
            tooltip
              .classed('hidden', false)
              .html(`<strong>${src}</strong> &rarr; <strong>${tgt}</strong><br/><span class="text-gray-300">Status: ${d.status}</span>${d.notes ? `<br/><span class="text-gray-400">${d.notes}</span>` : ''}`);
          })
          .on('mousemove', (event) => {
            const wrapperRect = wrapperRef.current!.getBoundingClientRect();
            tooltip
              .style('left', `${event.clientX - wrapperRect.left + 14}px`)
              .style('top', `${event.clientY - wrapperRect.top - 10}px`);
          })
          .on('mouseout', () => {
            tooltip.classed('hidden', true);
          });

        // Tick
        simulation.on('tick', () => {
          link
            .attr('x1', (d) => (d.source as OntologyNode).x ?? 0)
            .attr('y1', (d) => (d.source as OntologyNode).y ?? 0)
            .attr('x2', (d) => (d.target as OntologyNode).x ?? 0)
            .attr('y2', (d) => (d.target as OntologyNode).y ?? 0);

          node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('Ontology fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    buildGraph();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      // Remove old tooltip divs from wrapper
      wrapper.querySelectorAll(':scope > div').forEach((el) => el.remove());
      buildGraph();
    });

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [buildGraph]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ontology Graph</h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          Interactive force-directed visualization of the EDUcore ontology. Specification
          nodes (indigo) connect to CEDS Domain nodes (sky blue) through alignment edges.
          Drag nodes, scroll to zoom, and hover for details.
        </p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-md font-medium">
            {stats.specs} Specifications
          </span>
          <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md font-medium">
            {stats.domains} CEDS Domains
          </span>
          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md font-medium">
            {stats.alignments} Alignments
          </span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
            {stats.full} Full
          </span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
            {stats.partial} Partial
          </span>
          <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-md font-medium">
            {stats.gap} Gap
          </span>
        </div>
      )}

      {/* Graph container */}
      <div
        ref={wrapperRef}
        className="relative bg-white border border-gray-200 rounded-xl overflow-hidden"
        style={{ height: 'calc(100vh - 320px)', minHeight: '500px' }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading ontology graph...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="text-center max-w-sm">
              <p className="text-sm font-medium text-red-600 mb-1">Failed to load ontology</p>
              <p className="text-xs text-gray-500">{error}</p>
              <p className="text-xs text-gray-400 mt-2">
                Make sure <code className="bg-gray-100 px-1 py-0.5 rounded">/public/ontology.jsonld</code> exists.
              </p>
            </div>
          </div>
        )}
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-gray-500">
        <span className="font-semibold text-gray-500 uppercase tracking-wide">Legend</span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-indigo-500" />
          <span>Specification</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-sky-400" />
          <span>CEDS Domain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-emerald-500" />
          <span>Full</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-amber-400" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 border-t border-dashed border-gray-400" />
          <span>Gap</span>
        </div>
      </div>
    </div>
  );
}
