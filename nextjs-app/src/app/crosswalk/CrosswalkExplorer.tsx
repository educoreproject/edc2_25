'use client';

import { useState, useMemo } from 'react';
import { fieldMappings, specLabels } from '@/lib/data/field-mappings';

// ── Derive spec field hierarchies from field-mappings data ──────────────────

type SpecKey = keyof typeof specLabels;
const specKeys = Object.keys(specLabels) as SpecKey[];

interface FieldNode {
  name: string;        // e.g. "identifier"
  path: string;        // e.g. "CFDocument.identifier"
  parent: string;      // e.g. "CFDocument"
  concept: string;     // e.g. "Framework Identifier"
  entityType: string;
}

interface EntityGroup {
  entity: string;
  fields: FieldNode[];
}

function buildSpecHierarchy(specKey: SpecKey): EntityGroup[] {
  const entityMap = new Map<string, FieldNode[]>();

  for (const mapping of fieldMappings) {
    const specMapping = mapping.mappings[specKey];
    if (!specMapping) continue;

    const parts = specMapping.path.split('.');
    const entity = parts[0] || mapping.entityType;
    const field: FieldNode = {
      name: specMapping.field,
      path: specMapping.path,
      parent: entity,
      concept: mapping.concept,
      entityType: mapping.entityType,
    };

    if (!entityMap.has(entity)) entityMap.set(entity, []);
    // Deduplicate by field name within same entity
    const existing = entityMap.get(entity)!;
    if (!existing.some(f => f.name === field.name)) {
      existing.push(field);
    }
  }

  return Array.from(entityMap.entries()).map(([entity, fields]) => ({ entity, fields }));
}

// ── Find existing mappings between two fields ───────────────────────────────

interface MappingSuggestion {
  concept: string;
  sourceField: string;
  targetField: string;
  matchStrength: string;
  notes: string;
  confidence: number;
}

function findMappings(sourceSpec: SpecKey, targetSpec: SpecKey, sourceFieldName: string): MappingSuggestion[] {
  const results: MappingSuggestion[] = [];

  for (const mapping of fieldMappings) {
    const sourceMapping = mapping.mappings[sourceSpec];
    const targetMapping = mapping.mappings[targetSpec];

    if (!sourceMapping || sourceMapping.field !== sourceFieldName) continue;

    if (targetMapping) {
      // Direct existing mapping
      results.push({
        concept: mapping.concept,
        sourceField: sourceMapping.field,
        targetField: targetMapping.field,
        matchStrength: mapping.matchStrength,
        notes: mapping.notes,
        confidence: mapping.matchStrength === 'equivalent' ? 95 : mapping.matchStrength === 'close' ? 75 : 50,
      });
    }
  }

  // If no direct mappings found, suggest based on name similarity
  if (results.length === 0) {
    const targetHierarchy = buildSpecHierarchy(targetSpec);
    const nameLower = sourceFieldName.toLowerCase().replace(/[^a-z]/g, '');

    for (const group of targetHierarchy) {
      for (const field of group.fields) {
        const targetLower = field.name.toLowerCase().replace(/[^a-z]/g, '');
        if (nameLower === targetLower) {
          results.push({
            concept: `${sourceFieldName} → ${field.name}`,
            sourceField: sourceFieldName,
            targetField: field.name,
            matchStrength: 'suggested',
            notes: `Strong semantic similarity – ${sourceFieldName} could represent ${field.name} in educational contexts`,
            confidence: 80,
          });
        } else if (nameLower.includes(targetLower) || targetLower.includes(nameLower)) {
          results.push({
            concept: `${sourceFieldName} → ${field.name}`,
            sourceField: sourceFieldName,
            targetField: field.name,
            matchStrength: 'suggested',
            notes: `Partial name match – ${sourceFieldName} may relate to ${field.name}`,
            confidence: 55,
          });
        }
      }
    }
    // Sort suggestions by confidence
    results.sort((a, b) => b.confidence - a.confidence);
  }

  return results.slice(0, 5);
}

// ── Strength colors ─────────────────────────────────────────────────────────

const strengthStyle: Record<string, { bg: string; text: string; border: string }> = {
  equivalent: { bg: 'rgba(5,150,105,0.08)', text: '#059669', border: 'rgba(5,150,105,0.2)' },
  close:      { bg: 'rgba(255,171,64,0.08)', text: '#B86400', border: 'rgba(255,171,64,0.2)' },
  related:    { bg: 'rgba(7,42,108,0.05)', text: '#5A6478', border: 'rgba(7,42,108,0.1)' },
  suggested:  { bg: 'rgba(91,63,211,0.08)', text: '#5B3FD3', border: 'rgba(91,63,211,0.2)' },
};

// ── Components ──────────────────────────────────────────────────────────────

function SpecSelector({ label, value, onChange }: { label: string; value: SpecKey; onChange: (v: SpecKey) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#5A6478' }}>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SpecKey)}
        className="text-sm font-semibold rounded-lg px-3 py-2 appearance-none cursor-pointer"
        style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.1)', color: '#072A6C' }}
      >
        {specKeys.map(key => (
          <option key={key} value={key}>{specLabels[key]}</option>
        ))}
      </select>
    </div>
  );
}

function FieldTree({
  hierarchy,
  search,
  selectedField,
  onFieldClick,
  side,
  highlightedFields,
}: {
  hierarchy: EntityGroup[];
  search: string;
  selectedField: string | null;
  onFieldClick: (field: FieldNode) => void;
  side: 'source' | 'target';
  highlightedFields: Set<string>;
}) {
  const filtered = useMemo(() => {
    if (!search) return hierarchy;
    const q = search.toLowerCase();
    return hierarchy
      .map(group => ({
        ...group,
        fields: group.fields.filter(f =>
          f.name.toLowerCase().includes(q) || f.concept.toLowerCase().includes(q)
        ),
      }))
      .filter(group => group.fields.length > 0);
  }, [hierarchy, search]);

  return (
    <div className="space-y-1">
      {filtered.map(group => (
        <div key={group.entity}>
          {/* Entity header */}
          <div className="flex items-center gap-2 px-3 py-2 mt-2 first:mt-0">
            <span className="w-3 h-3 rounded" style={{ background: side === 'source' ? '#00B5B8' : '#5B3FD3' }} />
            <span className="text-sm font-bold" style={{ color: '#072A6C' }}>{group.entity}</span>
          </div>

          {/* Fields */}
          {group.fields.map(field => {
            const isSelected = selectedField === field.name;
            const isHighlighted = highlightedFields.has(field.name);
            return (
              <button
                key={`${group.entity}-${field.name}`}
                onClick={() => onFieldClick(field)}
                className="w-full flex items-center gap-2.5 px-3 py-2 ml-4 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? (side === 'source' ? 'rgba(0,181,184,0.1)' : 'rgba(91,63,211,0.08)')
                    : isHighlighted ? 'rgba(91,63,211,0.04)' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${side === 'source' ? '#00B5B8' : '#5B3FD3'}` : '3px solid transparent',
                }}
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{
                    background: isHighlighted ? '#5B3FD3'
                      : isSelected ? (side === 'source' ? '#00B5B8' : '#5B3FD3')
                      : '#C4CBDA',
                  }}
                />
                <span className="text-sm" style={{ color: isSelected || isHighlighted ? '#072A6C' : '#5A6478' }}>
                  {field.name}
                </span>
                {/* Connection dot */}
                <span className="ml-auto w-2 h-2 rounded-full shrink-0" style={{
                  background: isHighlighted ? 'rgba(91,63,211,0.4)' : 'rgba(7,42,108,0.08)',
                }} />
              </button>
            );
          })}
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="px-4 py-8 text-center text-sm" style={{ color: '#7A8499' }}>
          No fields match your search.
        </div>
      )}
    </div>
  );
}

function MappingPopover({ suggestions, onClose }: { suggestions: MappingSuggestion[]; onClose: () => void }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-80 rounded-xl shadow-lg"
      style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.1)' }}>
      <div className="p-4 space-y-3">
        {suggestions.map((s, i) => {
          const style = strengthStyle[s.matchStrength] || strengthStyle.related;
          return (
            <div key={i} className="rounded-lg p-3" style={{ background: '#FAFBFD', border: '1px solid rgba(7,42,108,0.06)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                  {s.confidence}%
                </span>
                <span className="text-sm font-semibold" style={{ color: '#072A6C' }}>
                  {s.sourceField} → {s.targetField}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: '#5A6478' }}>
                {s.notes}
              </p>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}
                  onClick={onClose}
                  title="Accept mapping">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
                <button className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                  onClick={onClose}
                  title="Reject mapping">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onClose} className="w-full text-center text-xs font-medium py-2 border-t"
        style={{ color: '#7A8499', borderColor: 'rgba(7,42,108,0.06)' }}>
        Dismiss
      </button>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function CrosswalkExplorer() {
  const [sourceSpec, setSourceSpec] = useState<SpecKey>('clr-2.0');
  const [targetSpec, setTargetSpec] = useState<SpecKey>('case-1.1');
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [selectedSourceField, setSelectedSourceField] = useState<FieldNode | null>(null);
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);

  const sourceHierarchy = useMemo(() => buildSpecHierarchy(sourceSpec), [sourceSpec]);
  const targetHierarchy = useMemo(() => buildSpecHierarchy(targetSpec), [targetSpec]);

  // Compute which target fields are highlighted (have mappings to selected source field)
  const highlightedTargetFields = useMemo(() => {
    const set = new Set<string>();
    if (!selectedSourceField) return set;
    for (const s of suggestions) {
      set.add(s.targetField);
    }
    return set;
  }, [selectedSourceField, suggestions]);

  // Count existing mappings between source and target
  const mappingStats = useMemo(() => {
    let existing = 0;
    let sourceOnly = 0;
    let targetOnly = 0;

    for (const mapping of fieldMappings) {
      const hasSource = !!mapping.mappings[sourceSpec];
      const hasTarget = !!mapping.mappings[targetSpec];
      if (hasSource && hasTarget) existing++;
      else if (hasSource) sourceOnly++;
      else if (hasTarget) targetOnly++;
    }
    return { existing, sourceOnly, targetOnly };
  }, [sourceSpec, targetSpec]);

  function handleSourceFieldClick(field: FieldNode) {
    if (selectedSourceField?.name === field.name) {
      setSelectedSourceField(null);
      setSuggestions([]);
    } else {
      setSelectedSourceField(field);
      const results = findMappings(sourceSpec, targetSpec, field.name);
      setSuggestions(results);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 animate-fade-up">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
          Field-Level Crosswalk
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#5A6478' }}>
          Select a source and target specification to explore field-level mappings.
          Click any source field to see existing or suggested mappings.
        </p>
      </div>

      {/* Spec selectors + mapping title bar */}
      <div className="rounded-xl p-4 mb-4" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SpecSelector label="Source Data Model" value={sourceSpec} onChange={(v) => { setSourceSpec(v); setSelectedSourceField(null); setSuggestions([]); }} />
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: '#072A6C' }}>
              {specLabels[sourceSpec]} → {specLabels[targetSpec]}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#7A8499' }}>
              {mappingStats.existing} mapped · {mappingStats.sourceOnly} source-only · {mappingStats.targetOnly} target-only
            </div>
          </div>
          <SpecSelector label="Target Data Model" value={targetSpec} onChange={(v) => { setTargetSpec(v); setSelectedSourceField(null); setSuggestions([]); }} />
        </div>
      </div>

      {/* Two-panel field explorer */}
      <div className="grid grid-cols-2 gap-4">

        {/* Source panel */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(7,42,108,0.06)' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className="flex-1 text-sm rounded-lg px-3 py-1.5"
              style={{ background: '#F4F5F8', border: '1px solid rgba(7,42,108,0.06)', color: '#072A6C' }}
            />
            {sourceSearch && (
              <button onClick={() => setSourceSearch('')} className="text-xs font-semibold" style={{ color: '#7A8499' }}>
                &times;
              </button>
            )}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
            <FieldTree
              hierarchy={sourceHierarchy}
              search={sourceSearch}
              selectedField={selectedSourceField?.name || null}
              onFieldClick={handleSourceFieldClick}
              side="source"
              highlightedFields={new Set()}
            />
          </div>
        </div>

        {/* Target panel */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(7,42,108,0.06)' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={targetSearch}
              onChange={(e) => setTargetSearch(e.target.value)}
              className="flex-1 text-sm rounded-lg px-3 py-1.5"
              style={{ background: '#F4F5F8', border: '1px solid rgba(7,42,108,0.06)', color: '#072A6C' }}
            />
            {targetSearch && (
              <button onClick={() => setTargetSearch('')} className="text-xs font-semibold" style={{ color: '#7A8499' }}>
                &times;
              </button>
            )}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
            <FieldTree
              hierarchy={targetHierarchy}
              search={targetSearch}
              selectedField={null}
              onFieldClick={() => {}}
              side="target"
              highlightedFields={highlightedTargetFields}
            />
          </div>
        </div>
      </div>

      {/* Mapping suggestions panel */}
      {selectedSourceField && suggestions.length > 0 && (
        <div className="mt-4 rounded-xl p-5" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-bold" style={{ color: '#072A6C' }}>
              Mappings for <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,181,184,0.1)', color: '#007B7D' }}>{selectedSourceField.name}</code>
            </span>
            <span className="text-xs" style={{ color: '#7A8499' }}>{suggestions.length} result{suggestions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((s, i) => {
              const style = strengthStyle[s.matchStrength] || strengthStyle.related;
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: '#FAFBFD', border: '1px solid rgba(7,42,108,0.06)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                      {s.confidence}%
                    </span>
                    <span className="text-sm font-semibold" style={{ color: '#072A6C' }}>
                      {s.sourceField} → {s.targetField}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#5A6478' }}>
                    {s.notes}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}
                      title="Accept">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </button>
                    <button className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                      title="Reject">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: style.text }}>
                      {s.matchStrength}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedSourceField && suggestions.length === 0 && (
        <div className="mt-4 rounded-xl p-6 text-center" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <p className="text-sm" style={{ color: '#7A8499' }}>
            No existing mappings or suggestions found for <strong style={{ color: '#072A6C' }}>{selectedSourceField.name}</strong> in {specLabels[targetSpec]}.
          </p>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs" style={{ color: '#5A6478' }}>
        <span>
          <span className="font-semibold" style={{ color: '#072A6C' }}>{fieldMappings.length}</span> field
          mappings across{' '}
          <span className="font-semibold" style={{ color: '#072A6C' }}>{specKeys.length}</span> specifications
        </span>
        <span>
          <span className="font-semibold" style={{ color: '#059669' }}>
            {fieldMappings.filter(m => m.matchStrength === 'equivalent').length}
          </span>{' '}equivalent
        </span>
        <span>
          <span className="font-semibold" style={{ color: '#B86400' }}>
            {fieldMappings.filter(m => m.matchStrength === 'close').length}
          </span>{' '}close
        </span>
        <span>
          <span className="font-semibold" style={{ color: '#5A6478' }}>
            {fieldMappings.filter(m => m.matchStrength === 'related').length}
          </span>{' '}related
        </span>
      </div>
    </div>
  );
}
