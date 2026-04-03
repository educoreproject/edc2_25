'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import { stakeholderTaxonomy } from '@/lib/data/taxonomies';

type SearchResult = {
  type: 'topic' | 'driver' | 'use-case';
  id: string;
  label: string;
  parent?: string;
  href: string;
  tags?: string[];
};

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Topics (Level 1 from use case taxonomy)
  for (const topic of useCaseTaxonomy) {
    results.push({
      type: 'topic',
      id: topic.id,
      label: topic.label,
      href: `/topics/${topic.id}`,
      tags: [topic.subtitle ?? ''],
    });

    // Value Drivers (Level 2 from use case taxonomy)
    for (const driver of topic.children) {
      results.push({
        type: 'driver',
        id: driver.id,
        label: driver.label,
        parent: topic.label,
        href: `/topics/${topic.id}`,
      });

      // Use Cases (Level 3)
      for (const uc of driver.children) {
        results.push({
          type: 'use-case',
          id: uc.id,
          label: uc.label,
          parent: driver.label,
          href: `/use-cases/${uc.id}`,
          tags: 'tags' in uc ? (uc as { tags: string[] }).tags : undefined,
        });
      }
    }
  }

  // Stakeholder groups as drivers
  for (const group of stakeholderTaxonomy) {
    results.push({
      type: 'driver',
      id: group.id,
      label: group.label,
      href: `/drivers/${group.id}`,
      tags: group.children.map((c: { label: string }) => c.label),
    });

    // Sub-stakeholders
    for (const child of group.children) {
      const existing = results.find(r => r.id === child.id);
      if (!existing) {
        results.push({
          type: 'driver',
          id: child.id,
          label: child.label,
          parent: group.label,
          href: `/drivers/${group.id}`,
          tags: child.businessNeeds,
        });
      }
    }
  }

  return results;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  topic:     { label: 'Topic',    color: '#5B3FD3', bg: 'rgba(91,63,211,0.08)' },
  driver:    { label: 'Driver',   color: '#072A6C', bg: 'rgba(7,42,108,0.07)' },
  'use-case': { label: 'Use Case', color: '#007B7D', bg: 'rgba(0,181,184,0.08)' },
};

export default function SearchFilter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const index = useMemo(() => buildIndex(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/);
    return index
      .filter((item) => {
        const haystack = [
          item.label,
          item.parent ?? '',
          ...(item.tags ?? []),
        ].join(' ').toLowerCase();
        return terms.every((t) => haystack.includes(t));
      })
      .slice(0, 20);
  }, [query, index]);

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(0); }, [filtered]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
    }
  }, [open]);

  const navigate = (item: SearchResult) => {
    router.push(item.href);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      navigate(filtered[selectedIdx]);
    }
  };

  return (
    <>
      {/* Trigger button in sidebar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left"
        style={{ background: '#F4F5F8', color: '#7A8499' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="flex-1">Search...</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#E8EAF0', color: '#7A8499' }}>
          {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '\u2318' : 'Ctrl'}K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(7,42,108,0.25)', backdropFilter: 'blur(4px)' }} />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
            style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#EEF1F7' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8499" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search topics, drivers, use cases..."
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: '#072A6C' }}
              />
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                style={{ background: '#F4F5F8', color: '#7A8499' }}
                onClick={() => setOpen(false)}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
              {query.trim() && filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm" style={{ color: '#7A8499' }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!query.trim() && (
                <div className="px-4 py-6 text-center text-sm" style={{ color: '#7A8499' }}>
                  Type to search across topics, value drivers, and use cases
                </div>
              )}

              {filtered.map((item, i) => {
                const meta = TYPE_META[item.type];
                const isSelected = i === selectedIdx;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    className="flex items-start gap-3 w-full px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: isSelected ? '#F4F5F8' : 'transparent',
                    }}
                    onMouseEnter={() => setSelectedIdx(i)}
                    onClick={() => navigate(item)}
                  >
                    {/* Type dot */}
                    <span
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: meta.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate" style={{ color: '#072A6C' }}>
                          {item.label}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      {item.parent && (
                        <span className="text-xs truncate block" style={{ color: '#7A8499' }}>
                          {item.parent}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="text-xs mt-1 shrink-0" style={{ color: '#B0B8C9' }}>
                        &crarr;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer hints */}
            {filtered.length > 0 && (
              <div className="flex items-center gap-4 px-4 py-2 border-t text-[10px]" style={{ borderColor: '#EEF1F7', color: '#7A8499' }}>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded" style={{ background: '#F4F5F8' }}>&uarr;&darr;</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded" style={{ background: '#F4F5F8' }}>&crarr;</kbd> open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded" style={{ background: '#F4F5F8' }}>esc</kbd> close
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
