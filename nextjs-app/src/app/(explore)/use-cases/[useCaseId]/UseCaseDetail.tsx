'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getDomainLabel } from '@/lib/data/resolvers';
import MetadataBadge from '@/components/MetadataBadge';

type Tab = 'overview' | 'tchart' | 'swimlane' | 'standards';

interface UseCaseData {
  label: string;
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  subcategoryId: string;
  subcategoryLabel: string;
  cedsDomains: string[];
}

interface StandardData {
  id: string;
  title: string;
  burden: string;
  score: number;
  fullCount: number;
  partialCount: number;
  matchedDomains: { domain: string; status: string }[];
  index: number;
}

interface SiblingStory {
  id: string;
  label: string;
  githubIssue: number;
}

interface Props {
  useCase: UseCaseData;
  standards: StandardData[];
  ownIssue: number | null;
  tags: string[];
  siblingStories: SiblingStory[];
}

function alignmentPercent(fullCount: number, partialCount: number, totalDomains: number): number {
  if (totalDomains === 0) return 0;
  return Math.round(((fullCount + partialCount * 0.5) / totalDomains) * 100);
}

const TABS: { id: Tab; label: string; badge?: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tchart', label: 'T-Chart' },
  { id: 'swimlane', label: 'Swimlane' },
  { id: 'standards', label: 'Standards Map' },
];

// ── Overview Tab ────────────────────────────────────────────────────────────
function OverviewView({ useCase, ownIssue, tags, siblingStories }: Omit<Props, 'standards'>) {
  return (
    <div>
      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#F4F5F8' }}>
        <div className="p-8 sm:p-10 flex items-start gap-8">
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-5"
              style={{ background: 'rgba(91,63,211,0.1)', color: '#5B3FD3' }}
            >
              Systematic Framework
            </span>

            <h2 className="text-2xl font-bold leading-tight mb-4" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
              {useCase.label}
            </h2>

            <p className="text-[15px] leading-relaxed mb-6 max-w-lg" style={{ color: '#6B7589' }}>
              Use case under <strong style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</strong>{' '}
              within the {useCase.categoryLabel} topic, linking stakeholder needs to interoperable ecosystem nodes.
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(7,42,108,0.05)', color: '#6B7589', border: '1px solid rgba(7,42,108,0.08)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {ownIssue && (
                <a href={`https://github.com/educoreproject/educore_use_cases/issues/${ownIssue}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: '#072A6C', color: '#fff' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  View on GitHub
                </a>
              )}
              <Link href="/standards" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#5B3FD3' }}>
                Documentation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex w-44 h-32 rounded-xl shrink-0 items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #072A6C 0%, #0a3a8f 50%, #00B5B8 100%)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Actor + CEDS domains row */}
      <div className="grid sm:grid-cols-[1fr_1.2fr] gap-6 mb-8">
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(91,63,211,0.08)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B3FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold" style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</div>
              <div className="text-xs" style={{ color: '#B0B8C9' }}>Primary Actor</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#8892A8' }}>
            Responsible for initiating and managing use cases in this domain.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F4F5F8' }}>
            <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #5B3FD3, #7C5CFC)' }} />
            <span className="text-xs font-medium" style={{ color: '#6B7589' }}>{useCase.categoryLabel}</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: '#B0B8C9' }}>CEDS Domains</div>
          <div className="grid grid-cols-3 gap-3">
            {useCase.cedsDomains.slice(0, 6).map(domainId => (
              <div key={domainId} className="rounded-xl p-4 text-center" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
                <div className="w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-2.5" style={{ background: 'rgba(0,181,184,0.08)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5B8" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: '#072A6C' }}>{getDomainLabel(domainId)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related stories */}
      {siblingStories.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: '#B0B8C9' }}>Related User Stories</div>
          <div className="space-y-2">
            {siblingStories.map(s => (
              <Link key={s.id} href={`/use-cases/${s.id}`}
                className="flex items-center justify-between rounded-xl px-5 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-brand-hover"
                style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
                <span className="text-sm font-medium" style={{ color: '#4B5563' }}>{s.label}</span>
                <span className="text-xs font-mono shrink-0 ml-3" style={{ color: '#B0B8C9' }}>#{s.githubIssue}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── T-Chart Tab ─────────────────────────────────────────────────────────────
function TChartView({ useCase, siblingStories }: { useCase: UseCaseData; siblingStories: SiblingStory[] }) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: '#072A6C' }}>T-Chart</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8892A8' }}>
          T-shaped view showing the use case within the topic context (vertical) and implementation specifics (horizontal).
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left stem of T — vertical hierarchy */}
        <div className="flex flex-col items-center gap-0 shrink-0" style={{ width: 200 }}>
          <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-t-xl w-full text-center text-white"
            style={{ background: '#1e293b' }}>
            Topic
          </div>
          <div className="text-sm font-semibold px-3 py-3 w-full text-center min-h-[60px] flex items-center justify-center text-white"
            style={{ background: '#334155' }}>
            {useCase.categoryLabel}
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 w-full text-center text-white"
            style={{ background: '#1d4ed8' }}>
            Business Driver
          </div>
          <div className="text-sm px-3 py-3 w-full text-center min-h-[60px] flex items-center justify-center text-white"
            style={{ background: '#2563eb' }}>
            {useCase.subcategoryLabel}
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 w-full text-center text-white"
            style={{ background: '#5B3FD3' }}>
            Use Case
          </div>
          <div className="text-sm px-3 py-3 w-full text-center min-h-[60px] flex items-center justify-center text-white rounded-b-xl"
            style={{ background: '#7C5CFC' }}>
            {useCase.label}
          </div>

          {/* Vertical connector */}
          <div className="w-0.5 flex-1 my-0" style={{ minHeight: 40, background: '#DEE2EC' }} />
        </div>

        {/* Right horizontal bar — implementation details */}
        <div className="flex-1 min-w-0">

          {/* User Stories */}
          {siblingStories.length > 0 && (
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#059669' }}>
                User Stories — Executable Units
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {siblingStories.map(s => (
                  <Link key={s.id} href={`/use-cases/${s.id}`}
                    className="rounded-xl p-3 transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-white"
                        style={{ background: '#059669' }}>
                        #{s.githubIssue}
                      </span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: '#4B5563' }}>{s.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CEDS Domains */}
          {useCase.cedsDomains.length > 0 && (
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#5B3FD3' }}>
                Data Domains
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {useCase.cedsDomains.map(domainId => (
                  <div key={domainId} className="rounded-lg px-3 py-2"
                    style={{ background: 'rgba(91,63,211,0.04)', border: '1px solid rgba(91,63,211,0.12)' }}>
                    <div className="text-xs font-bold" style={{ color: '#072A6C' }}>{getDomainLabel(domainId)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hierarchy context */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#B86400' }}>
              Hierarchy Context
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-xs" style={{ color: '#4B5563' }}>
                <span className="mt-0.5 shrink-0" style={{ color: '#B86400' }}>&#9656;</span>
                <span><strong>Topic:</strong> {useCase.categoryLabel}</span>
              </li>
              <li className="flex items-start gap-2 text-xs" style={{ color: '#4B5563' }}>
                <span className="mt-0.5 shrink-0" style={{ color: '#B86400' }}>&#9656;</span>
                <span><strong>Driver:</strong> {useCase.subcategoryLabel}</span>
              </li>
              <li className="flex items-start gap-2 text-xs" style={{ color: '#4B5563' }}>
                <span className="mt-0.5 shrink-0" style={{ color: '#B86400' }}>&#9656;</span>
                <span><strong>Domains:</strong> {useCase.cedsDomains.map(d => getDomainLabel(d)).join(', ')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Swimlane Tab ────────────────────────────────────────────────────────────
function SwimlaneView({ useCase, siblingStories }: { useCase: UseCaseData; siblingStories: SiblingStory[] }) {
  // Build actors from the hierarchy context + CEDS domains
  const actors = [
    { name: useCase.subcategoryLabel, desc: 'Primary actor driving this use case' },
    { name: 'System', desc: 'Automated processing and validation' },
    { name: 'Verifier', desc: 'Credential verification and trust' },
  ];

  // Build steps from the use case context
  const steps: { actorIdx: number; action: string; dataIn?: string; dataOut?: string }[] = [
    { actorIdx: 0, action: `Initiate ${useCase.label}`, dataIn: 'Request or trigger event' },
    { actorIdx: 1, action: 'Validate inputs against CEDS domains', dataOut: useCase.cedsDomains.slice(0, 2).map(d => getDomainLabel(d)).join(', ') },
    { actorIdx: 0, action: 'Provide required credentials and documentation', dataIn: 'Source documents' },
    { actorIdx: 1, action: 'Process and map to interoperability standards', dataIn: 'Raw data', dataOut: 'Structured records' },
    { actorIdx: 2, action: 'Verify credential authenticity and claims', dataIn: 'Structured records', dataOut: 'Verification result' },
    { actorIdx: 1, action: 'Update records and generate output', dataOut: 'Final LER / credential artifact' },
    { actorIdx: 0, action: 'Receive and review results' },
  ];

  const LANE_COLORS = [
    { bg: 'rgba(29,78,216,0.05)', border: 'rgba(29,78,216,0.15)', header: '#1d4ed8' },
    { bg: 'rgba(91,63,211,0.05)', border: 'rgba(91,63,211,0.15)', header: '#5B3FD3' },
    { bg: 'rgba(5,150,105,0.05)', border: 'rgba(5,150,105,0.15)', header: '#059669' },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: '#072A6C' }}>Swimlane Diagram</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8892A8' }}>
          Process-oriented view — who does what, with what data.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {actors.map((a, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: LANE_COLORS[i % LANE_COLORS.length].header }} />
            <span style={{ color: '#072A6C' }}>{a.name}</span>
            <span className="font-normal" style={{ color: '#B0B8C9' }}>— {a.desc}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(7,42,108,0.08)' }}>
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 40 }} />
            {actors.map((_, i) => (
              <col key={i} style={{ width: `${Math.floor(100 / actors.length)}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="text-[10px] font-bold uppercase px-2 py-2.5 text-center text-white" style={{ background: '#1e293b' }}>
                #
              </th>
              {actors.map((a, i) => (
                <th key={i} className="text-xs font-bold px-3 py-2.5 text-white"
                  style={{ background: LANE_COLORS[i % LANE_COLORS.length].header }}>
                  {a.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((step, si) => (
              <tr key={si} style={{ background: si % 2 === 0 ? '#fff' : '#FAFBFD' }}>
                <td className="text-center text-[10px] font-bold px-1 py-3" style={{ color: '#B0B8C9', borderRight: '1px solid rgba(7,42,108,0.06)' }}>
                  {si + 1}
                </td>
                {actors.map((_, ai) => {
                  const isActive = ai === step.actorIdx;
                  const lane = LANE_COLORS[ai % LANE_COLORS.length];
                  return (
                    <td key={ai} className="px-3 py-3 align-top"
                      style={{
                        borderRight: ai < actors.length - 1 ? '1px solid rgba(7,42,108,0.04)' : undefined,
                        background: isActive ? lane.bg : undefined,
                        borderLeft: isActive ? `2px solid ${lane.header}` : undefined,
                      }}>
                      {isActive && (
                        <div>
                          <div className="text-sm font-semibold leading-snug" style={{ color: '#072A6C' }}>
                            {step.action}
                          </div>
                          {step.dataIn && (
                            <div className="mt-1.5 flex items-start gap-1 text-[11px]">
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                                style={{ background: 'rgba(29,78,216,0.1)', color: '#1d4ed8' }}>
                                IN
                              </span>
                              <span style={{ color: '#6B7589' }}>{step.dataIn}</span>
                            </div>
                          )}
                          {step.dataOut && (
                            <div className="mt-1 flex items-start gap-1 text-[11px]">
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                                style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                                OUT
                              </span>
                              <span style={{ color: '#6B7589' }}>{step.dataOut}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Connected stories */}
      {siblingStories.length > 0 && (
        <div className="mt-6">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#B0B8C9' }}>
            Connected User Stories
          </div>
          <div className="flex flex-wrap gap-2">
            {siblingStories.map(s => (
              <Link key={s.id} href={`/use-cases/${s.id}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:shadow-brand-hover"
                style={{ background: 'rgba(5,150,105,0.06)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>
                #{s.githubIssue} {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Standards Map Tab ───────────────────────────────────────────────────────
function StandardsMapView({ standards, useCase }: { standards: StandardData[]; useCase: UseCaseData }) {
  const totalDomains = useCase.cedsDomains.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold" style={{ color: '#072A6C' }}>Standards &amp; Data Mappings</h2>
        <Link href="/standards" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B3FD3' }}>
          View All Specs
        </Link>
      </div>
      <p className="text-xs mb-6" style={{ color: '#8892A8' }}>
        How this use case&apos;s data domains map to interoperability standards.
      </p>

      {/* Standards coverage chips */}
      {standards.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {standards.map(s => (
            <span key={s.id} className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(91,63,211,0.07)', color: '#5B3FD3', border: '1px solid rgba(91,63,211,0.15)' }}>
              {s.title}
            </span>
          ))}
        </div>
      )}

      {standards.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {standards.map((scored) => {
            const pct = alignmentPercent(scored.fullCount, scored.partialCount, totalDomains);
            return (
              <Link key={scored.id} href={`/standards/${scored.id}`}
                className="group block rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-brand-hover relative overflow-hidden"
                style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#072A6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>

                <div className="text-5xl font-bold leading-none mb-4"
                  style={{ color: '#072A6C', fontFamily: 'var(--font-display)', opacity: 0.07 }}>
                  {String(scored.index + 1).padStart(2, '0')}
                </div>

                <h3 className="text-base font-bold leading-snug mb-3" style={{ color: '#072A6C' }}>{scored.title}</h3>

                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {scored.matchedDomains.slice(0, 2).map(md => (
                    <span key={md.domain} className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                      style={md.status === 'full'
                        ? { background: 'rgba(5,150,105,0.07)', color: '#059669' }
                        : { background: 'rgba(255,171,64,0.08)', color: '#B86400' }}>
                      {getDomainLabel(md.domain)}
                    </span>
                  ))}
                  <MetadataBadge kind="burden" value={scored.burden} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#B0B8C9' }}>
                      Integration Progress
                    </span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: '#072A6C' }}>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(7,42,108,0.05)' }}>
                    <div className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 80 ? '#059669' : pct >= 50 ? '#5B3FD3' : '#B0B8C9',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl p-10 text-center" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <p className="text-sm" style={{ color: '#8892A8' }}>No standards mapped to this use case yet.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function UseCaseDetail({ useCase, standards, ownIssue, tags, siblingStories }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 animate-fade-up">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-6 flex-wrap" style={{ color: '#B0B8C9' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>&gt;</span>
        <Link href="/topics" className="hover:underline">Topics</Link>
        <span>&gt;</span>
        <Link href={`/topics/${useCase.categoryId}`} className="hover:underline">{useCase.categoryLabel}</Link>
        <span>&gt;</span>
        <Link href="/use-cases" className="hover:underline">Use Cases</Link>
        <span>&gt;</span>
        <span className="font-semibold" style={{ color: '#072A6C' }}>{useCase.subcategoryLabel}</span>
      </nav>

      {/* Title */}
      {ownIssue && (
        <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: '#B0B8C9' }}>
          User Story #{ownIssue}
        </div>
      )}
      <h1 className="text-3xl font-bold leading-tight mb-6" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>
        {useCase.label}
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto pb-px" style={{ borderColor: 'rgba(7,42,108,0.08)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-t-lg transition-colors"
            style={
              activeTab === tab.id
                ? { background: '#fff', border: '1px solid rgba(7,42,108,0.08)', borderBottom: '1px solid #fff', color: '#5B3FD3', marginBottom: -1 }
                : { color: '#B0B8C9', border: '1px solid transparent' }
            }
          >
            {tab.label}
            {tab.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
        {activeTab === 'overview' && (
          <OverviewView useCase={useCase} ownIssue={ownIssue} tags={tags} siblingStories={siblingStories} />
        )}
        {activeTab === 'tchart' && (
          <TChartView useCase={useCase} siblingStories={siblingStories} />
        )}
        {activeTab === 'swimlane' && (
          <SwimlaneView useCase={useCase} siblingStories={siblingStories} />
        )}
        {activeTab === 'standards' && (
          <StandardsMapView standards={standards} useCase={useCase} />
        )}
      </div>
    </div>
  );
}
