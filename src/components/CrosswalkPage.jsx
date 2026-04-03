// CrosswalkPage.jsx — Visual field-level crosswalk between two education standards.
// Displays source and target schema fields side-by-side with SVG connector lines.

import { useState, useRef, useEffect, useCallback } from 'react';
import { specLabels, fieldMappings } from '../data/fieldMappings';

const SPEC_KEYS = Object.keys(specLabels);

const STRENGTH_CONFIG = {
  equivalent: { lineColor: '#6366f1', dash: 'none',    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Equivalent' },
  close:      { lineColor: '#8b5cf6', dash: '6,4',     badge: 'bg-violet-100 text-violet-700 border-violet-200', label: 'Close' },
  related:    { lineColor: '#94a3b8', dash: '4,4',     badge: 'bg-slate-100  text-slate-600  border-slate-200',  label: 'Related' },
};

const ENTITY_COLORS = {
  'CFDocument → CompetencyFramework':    'bg-blue-500',
  'CFItem → CompetencyDefinition':       'bg-emerald-500',
  'CFAssociation → ResourceAssociation': 'bg-amber-500',
  'Format-Specific':                     'bg-slate-400',
  'OB3/CLR Extension':                   'bg-rose-500',
};

function conceptKey(concept) {
  return concept.replace(/[^a-zA-Z0-9]/g, '_');
}

function groupByEntity(specKey) {
  const groups = new Map();
  fieldMappings.forEach(m => {
    if (!m.mappings[specKey]) return;
    if (!groups.has(m.entityType)) groups.set(m.entityType, []);
    groups.get(m.entityType).push(m);
  });
  return groups;
}

function FieldRow({ mapping, specKey, hovered, onHover }) {
  const f = mapping.mappings[specKey];
  const isHovered = hovered === mapping.concept;
  return (
    <div
      data-concept={conceptKey(mapping.concept)}
      onMouseEnter={() => onHover(mapping.concept)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-default ${
        isHovered ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
      }`}
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        isHovered ? 'bg-indigo-500' : 'bg-slate-300'
      }`} />
      <div className="min-w-0">
        <div className="text-xs font-mono text-slate-700 truncate">{f.field}</div>
        <div className="text-[10px] text-slate-400 truncate">{mapping.concept}</div>
      </div>
    </div>
  );
}

function EntityGroup({ label, mappings, specKey, hovered, onHover }) {
  const color = ENTITY_COLORS[label] || 'bg-slate-400';
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
        <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color}`} />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</span>
      </div>
      <div className="space-y-0.5">
        {mappings.map(m => (
          <FieldRow
            key={m.concept}
            mapping={m}
            specKey={specKey}
            hovered={hovered}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}

export default function CrosswalkPage() {
  const [sourceSpec, setSourceSpec] = useState(SPEC_KEYS[0]);
  const [targetSpec, setTargetSpec] = useState(SPEC_KEYS[1]);
  const [hovered, setHovered]       = useState(null);
  const [tooltip, setTooltip]       = useState(null); // { x, y, mapping }
  const [lines, setLines]           = useState([]);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');

  const containerRef  = useRef(null);
  const leftPanelRef  = useRef(null);
  const rightPanelRef = useRef(null);
  const svgRef        = useRef(null);

  // Swap source and target
  function swapSpecs() {
    setSourceSpec(targetSpec);
    setTargetSpec(sourceSpec);
  }

  // Shared mappings (exist in both specs)
  const sharedMappings = fieldMappings.filter(
    m => m.mappings[sourceSpec] && m.mappings[targetSpec]
  );

  // Compute SVG connector lines based on current scroll/positions
  const computeLines = useCallback(() => {
    if (!containerRef.current || !leftPanelRef.current || !rightPanelRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    sharedMappings.forEach(m => {
      const key = conceptKey(m.concept);
      const leftEl  = leftPanelRef.current?.querySelector(`[data-concept="${key}"]`);
      const rightEl = rightPanelRef.current?.querySelector(`[data-concept="${key}"]`);
      if (!leftEl || !rightEl) return;

      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();

      const panelTop    = containerRect.top;
      const panelBottom = containerRect.bottom;

      const lMid = lRect.top + lRect.height / 2;
      const rMid = rRect.top + rRect.height / 2;

      // Skip if both endpoints are outside visible area
      const lVisible = lMid > panelTop && lMid < panelBottom;
      const rVisible = rMid > panelTop && rMid < panelBottom;
      if (!lVisible && !rVisible) return;

      const x1 = lRect.right - containerRect.left;
      const y1 = lMid - containerRect.top;
      const x2 = rRect.left  - containerRect.left;
      const y2 = rMid - containerRect.top;

      newLines.push({ concept: m.concept, x1, y1, x2, y2, strength: m.matchStrength, mapping: m });
    });

    setLines(newLines);
  }, [sharedMappings]);

  // Recompute on layout changes
  useEffect(() => {
    computeLines();
    const ro = new ResizeObserver(computeLines);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeLines]);

  // Recompute on panel scroll
  useEffect(() => {
    const left  = leftPanelRef.current;
    const right = rightPanelRef.current;
    left?.addEventListener('scroll',  computeLines, { passive: true });
    right?.addEventListener('scroll', computeLines, { passive: true });
    window.addEventListener('scroll', computeLines, { passive: true });
    return () => {
      left?.removeEventListener('scroll',  computeLines);
      right?.removeEventListener('scroll', computeLines);
      window.removeEventListener('scroll', computeLines);
    };
  }, [computeLines]);

  // Tooltip positioning when hovered line changes
  useEffect(() => {
    if (!hovered) { setTooltip(null); return; }
    const line = lines.find(l => l.concept === hovered);
    if (!line) { setTooltip(null); return; }
    const cx = (line.x1 + line.x2) / 2;
    const cy = (line.y1 + line.y2) / 2;
    setTooltip({ x: cx, y: cy, mapping: line.mapping });
  }, [hovered, lines]);

  const sourceGroups = groupByEntity(sourceSpec);
  const targetGroups = groupByEntity(targetSpec);

  const filterGroups = (groups, search) => {
    if (!search) return groups;
    const q = search.toLowerCase();
    const filtered = new Map();
    groups.forEach((mappings, label) => {
      const hits = mappings.filter(
        m => m.concept.toLowerCase().includes(q) ||
             m.mappings[sourceSpec]?.field.toLowerCase().includes(q) ||
             m.mappings[targetSpec]?.field.toLowerCase().includes(q)
      );
      if (hits.length > 0) filtered.set(label, hits);
    });
    return filtered;
  };

  const filteredSourceGroups = filterGroups(sourceGroups, searchLeft);
  const filteredTargetGroups = filterGroups(targetGroups, searchRight);

  const sharedCount = sharedMappings.length;
  const sourceOnly  = fieldMappings.filter(m => m.mappings[sourceSpec] && !m.mappings[targetSpec]).length;
  const targetOnly  = fieldMappings.filter(m => !m.mappings[sourceSpec] && m.mappings[targetSpec]).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Schema Crosswalk</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Select two standards to explore field-level mappings between their data models.
        </p>
      </div>

      {/* Spec selector bar */}
      <div className="flex items-center gap-3 mb-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Source selector */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Source Schema:</span>
          <select
            value={sourceSpec}
            onChange={e => setSourceSpec(e.target.value)}
            className="flex-1 text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            {SPEC_KEYS.map(k => (
              <option key={k} value={k} disabled={k === targetSpec}>{specLabels[k]}</option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <button
          onClick={swapSpecs}
          className="flex-shrink-0 p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          title="Swap source and target"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Target selector */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Target Schema:</span>
          <select
            value={targetSpec}
            onChange={e => setTargetSpec(e.target.value)}
            className="flex-1 text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            {SPEC_KEYS.map(k => (
              <option key={k} value={k} disabled={k === sourceSpec}>{specLabels[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mapping summary bar */}
      <div className="flex items-center gap-4 mb-5 text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
          <span className="font-semibold">{sharedCount}</span>
          <span className="text-indigo-500">shared fields</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
          <span className="font-semibold">{sourceOnly}</span>
          <span className="text-slate-400">source only</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
          <span className="font-semibold">{targetOnly}</span>
          <span className="text-slate-400">target only</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {Object.entries(STRENGTH_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg width="24" height="8">
                <line x1="0" y1="4" x2="24" y2="4"
                  stroke={v.lineColor} strokeWidth="2"
                  strokeDasharray={v.dash === 'none' ? undefined : v.dash}
                />
              </svg>
              {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main 3-column crosswalk view */}
      <div
        ref={containerRef}
        className="relative flex gap-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
        style={{ minHeight: 600 }}
      >
        {/* Left panel — source schema */}
        <div className="w-[38%] border-r border-slate-100 flex flex-col">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="text-sm font-semibold text-slate-800 truncate">{specLabels[sourceSpec]}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {[...sourceGroups.values()].flat().length} fields
            </div>
          </div>
          {/* Search */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fields…"
                value={searchLeft}
                onChange={e => setSearchLeft(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
              />
              {searchLeft && (
                <button onClick={() => setSearchLeft('')} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Fields */}
          <div ref={leftPanelRef} className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 560 }}>
            {filteredSourceGroups.size === 0 ? (
              <div className="text-xs text-slate-400 text-center py-8">No fields match your search.</div>
            ) : (
              [...filteredSourceGroups.entries()].map(([label, mappings]) => (
                <EntityGroup
                  key={label}
                  label={label}
                  mappings={mappings}
                  specKey={sourceSpec}
                  hovered={hovered}
                  onHover={setHovered}
                />
              ))
            )}
          </div>
        </div>

        {/* Center — SVG connection lines */}
        <div className="w-[24%] relative bg-slate-50/30 flex flex-col items-center">
          {/* Center label */}
          <div className="px-2 py-3 border-b border-slate-100 w-full text-center bg-slate-50/80">
            <div className="text-xs font-semibold text-slate-500 truncate">
              {specLabels[sourceSpec].split(' ')[0]}
              <span className="mx-1 text-slate-300">→</span>
              {specLabels[targetSpec].split(' ')[0]}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {sharedCount} connections
            </div>
          </div>

          {/* SVG for lines — spans the panels height */}
          <div className="absolute inset-0 top-[60px] pointer-events-none overflow-hidden">
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {Object.entries(STRENGTH_CONFIG).map(([k, v]) => (
                  <marker key={k} id={`dot-${k}`} markerWidth="6" markerHeight="6" refX="3" refY="3">
                    <circle cx="3" cy="3" r="2.5" fill={v.lineColor} />
                  </marker>
                ))}
              </defs>
              {lines.map(line => {
                const cfg = STRENGTH_CONFIG[line.strength] || STRENGTH_CONFIG.related;
                const isActive = hovered === line.concept;
                const containerRect = containerRef.current?.getBoundingClientRect();
                const centerRect = svgRef.current?.parentElement?.getBoundingClientRect();
                if (!containerRect || !centerRect) return null;

                // Adjust x coords: SVG is inside center column, need relative coords
                const offsetX = centerRect.left - containerRect.left;
                const x1adj = line.x1 - offsetX;
                const x2adj = line.x2 - offsetX;
                const cp1x = Math.max(0, x1adj) + Math.abs(x2adj - x1adj) * 0.4;
                const cp2x = x2adj - Math.abs(x2adj - x1adj) * 0.4;

                return (
                  <path
                    key={line.concept}
                    d={`M ${x1adj} ${line.y1} C ${cp1x} ${line.y1}, ${cp2x} ${line.y2}, ${x2adj} ${line.y2}`}
                    stroke={cfg.lineColor}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={cfg.dash === 'none' ? undefined : cfg.dash}
                    fill="none"
                    opacity={hovered && !isActive ? 0.2 : isActive ? 1 : 0.55}
                    markerStart={`url(#dot-${line.strength})`}
                    markerEnd={`url(#dot-${line.strength})`}
                  />
                );
              })}
            </svg>
          </div>

          {/* Hover tooltip */}
          {tooltip && hovered && (
            <div
              className="absolute z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-56 text-xs"
              style={{
                top: Math.min(tooltip.y - 60, 400),
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                  STRENGTH_CONFIG[tooltip.mapping.matchStrength]?.badge || 'bg-slate-100 text-slate-600'
                }`}>
                  {tooltip.mapping.matchStrength}
                </span>
                <span className="font-semibold text-slate-700 truncate">{tooltip.mapping.concept}</span>
              </div>
              <div className="flex items-center gap-1 mb-1.5 text-slate-600 font-mono text-[10px]">
                <span className="bg-indigo-50 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                  {tooltip.mapping.mappings[sourceSpec]?.field}
                </span>
                <span className="text-slate-400 flex-shrink-0">→</span>
                <span className="bg-violet-50 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                  {tooltip.mapping.mappings[targetSpec]?.field}
                </span>
              </div>
              <div className="text-slate-500 leading-relaxed">{tooltip.mapping.notes}</div>
            </div>
          )}
        </div>

        {/* Right panel — target schema */}
        <div className="w-[38%] border-l border-slate-100 flex flex-col">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="text-sm font-semibold text-slate-800 truncate">{specLabels[targetSpec]}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {[...targetGroups.values()].flat().length} fields
            </div>
          </div>
          {/* Search */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fields…"
                value={searchRight}
                onChange={e => setSearchRight(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
              />
              {searchRight && (
                <button onClick={() => setSearchRight('')} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Fields */}
          <div ref={rightPanelRef} className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 560 }}>
            {filteredTargetGroups.size === 0 ? (
              <div className="text-xs text-slate-400 text-center py-8">No fields match your search.</div>
            ) : (
              [...filteredTargetGroups.entries()].map(([label, mappings]) => (
                <EntityGroup
                  key={label}
                  label={label}
                  mappings={mappings}
                  specKey={targetSpec}
                  hovered={hovered}
                  onHover={setHovered}
                />
              ))
            )}
          </div>
        </div>

        {/* Full-container SVG overlay for lines that cross from left → right panels */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%', top: 0, left: 0, overflow: 'visible', zIndex: 10 }}
        >
          <defs>
            {Object.entries(STRENGTH_CONFIG).map(([k, v]) => (
              <marker key={`main-${k}`} id={`main-dot-${k}`} markerWidth="6" markerHeight="6" refX="3" refY="3">
                <circle cx="3" cy="3" r="2.5" fill={v.lineColor} />
              </marker>
            ))}
          </defs>
          {lines.map(line => {
            const cfg   = STRENGTH_CONFIG[line.strength] || STRENGTH_CONFIG.related;
            const isActive = hovered === line.concept;
            const cx    = (line.x1 + line.x2) / 2;
            return (
              <path
                key={line.concept}
                d={`M ${line.x1} ${line.y1} C ${cx} ${line.y1}, ${cx} ${line.y2}, ${line.x2} ${line.y2}`}
                stroke={cfg.lineColor}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={cfg.dash === 'none' ? undefined : cfg.dash}
                fill="none"
                opacity={hovered && !isActive ? 0.15 : isActive ? 1 : 0.5}
                markerStart={`url(#main-dot-${line.strength})`}
                markerEnd={`url(#main-dot-${line.strength})`}
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(line.concept)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Unmapped fields section */}
      {(sourceOnly > 0 || targetOnly > 0) && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {sourceOnly > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                {specLabels[sourceSpec]} only
                <span className="ml-2 text-xs font-normal text-slate-400">({sourceOnly} fields not in target)</span>
              </div>
              <div className="space-y-1">
                {fieldMappings
                  .filter(m => m.mappings[sourceSpec] && !m.mappings[targetSpec])
                  .map(m => (
                    <div key={m.concept} className="flex items-center gap-2 text-xs text-slate-600 px-2 py-1 rounded hover:bg-slate-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      <span className="font-mono text-slate-700">{m.mappings[sourceSpec].field}</span>
                      <span className="text-slate-400 truncate">{m.concept}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {targetOnly > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                {specLabels[targetSpec]} only
                <span className="ml-2 text-xs font-normal text-slate-400">({targetOnly} fields not in source)</span>
              </div>
              <div className="space-y-1">
                {fieldMappings
                  .filter(m => !m.mappings[sourceSpec] && m.mappings[targetSpec])
                  .map(m => (
                    <div key={m.concept} className="flex items-center gap-2 text-xs text-slate-600 px-2 py-1 rounded hover:bg-slate-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      <span className="font-mono text-slate-700">{m.mappings[targetSpec].field}</span>
                      <span className="text-slate-400 truncate">{m.concept}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
