// UseCasesPage.jsx — Use-case-first view of the reference library.
// Pulls live issues from github.com/educoreproject/educore_use_cases
// and maps each issue to relevant standards from libraryEntries.
// Clicking a use case opens a two-pane split: chat (left) + data flow diagram (right).

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { libraryEntries } from '../data/libraryEntries';

// ─── Spec matching ────────────────────────────────────────────────────────────

const SPEC_PATTERNS = [
  { id: 'case-v1',                  label: 'CASE 1.1',         regex: /\b(case|competency framework|curriculum alignment|cfitem|cfdocument|case v1)\b/i },
  { id: 'ctdl',                     label: 'CTDL',             regex: /\b(ctdl|credential engine|credential definition|credential description|ctdl-asn)\b/i },
  { id: 'open-badges-v3',           label: 'Open Badges 3.0',  regex: /\b(badge|open badge|ob3|achievement badge|digital badge)\b/i },
  { id: 'clr-v2',                   label: 'CLR 2.0',          regex: /\b(clr|comprehensive learner record|learner record|transcript portability)\b/i },
  { id: 'lrw-competency-framework', label: 'IEEE LER',         regex: /\b(ler|ieee|learning employment record|wallet|verifiable credential|vc|did|lrw)\b/i },
];

function matchIssueToSpecs(issue) {
  const text = `${issue.title} ${issue.body || ''} ${(issue.labels || []).map(l => l.name).join(' ')}`;
  return SPEC_PATTERNS.filter(p => p.regex.test(text)).map(p => p.id);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LABEL_PALETTES = [
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-sky-50 text-sky-700 border-sky-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-teal-50 text-teal-700 border-teal-200',
];

function labelPalette(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return LABEL_PALETTES[h % LABEL_PALETTES.length];
}

function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function stripMarkdown(text) {
  return (text || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

const BURDEN_COLORS = {
  low:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high:   'bg-red-50 text-red-700 border-red-200',
};

const SPEC_COLORS = {
  'case-v1':                  { fill: '#EEF2FF', stroke: '#6366F1', text: '#4338CA' },
  'ctdl':                     { fill: '#F0FDFA', stroke: '#14B8A6', text: '#0F766E' },
  'open-badges-v3':           { fill: '#FFF7ED', stroke: '#F97316', text: '#C2410C' },
  'clr-v2':                   { fill: '#FDF4FF', stroke: '#A855F7', text: '#7E22CE' },
  'lrw-competency-framework': { fill: '#F0F9FF', stroke: '#0EA5E9', text: '#0369A1' },
};

function shortSpecName(entry) {
  return entry.title.split(/[:(]/)[0].trim().split(' ').slice(0, 3).join(' ');
}

// ─── API helper ───────────────────────────────────────────────────────────────

const SPEC_SUMMARY = `
CASE 1.1 (educore:spec/case-v1): Competency and curriculum framework exchange. Low burden. Best for aligning curriculum, mapping skills hierarchies.
CTDL (educore:spec/ctdl): Rich credential metadata descriptions. Low-medium burden. Best for defining what a credential means, who grants it, how to verify it.
Open Badges 3.0 (educore:spec/open-badges-v3): Portable digital achievement badges built on W3C Verifiable Credentials. Medium burden. Best for issuing stackable achievement records.
CLR 2.0 (educore:spec/clr-v2): Comprehensive Learner Record — aggregate transcript, achievements, competencies in one portable record. Medium-high burden. Best for holistic portfolio portability.
IEEE P1484.2 LER (educore:spec/lrw-competency-framework): Ecosystem architecture standard defining issuer, holder, verifier, wallet, and registry roles. Medium burden. Best for designing an LER ecosystem.`.trim();

async function callClaude(messages, systemPrompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('No API key — set VITE_ANTHROPIC_API_KEY');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1024, system: systemPrompt, messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

function useCaseSystemPrompt(issue, entries) {
  const specBlock = entries.map(e =>
    `- ${shortSpecName(e)} (${e.id}): ${e.aiSummary} Burden: ${e.implementationBurden}. Guidance: ${e.implementationGuidance}`
  ).join('\n');

  const pairings = entries.flatMap(e =>
    (e.commonlyPairedWith || [])
      .filter(p => entries.some(m => m.id === p.id))
      .map(p => `  ${shortSpecName(e)} ↔ ${shortSpecName(libraryEntries.find(x => x.id === p.id) || e)}: ${p.rationale}`)
  );

  return `You are an education data interoperability advisor helping a user understand a specific use case.

USE CASE:
Title: ${issue.title}
Description: ${stripMarkdown(issue.body || '').slice(0, 1000)}
Labels: ${(issue.labels || []).map(l => l.name).join(', ') || 'none'}

MATCHED STANDARDS:
${specBlock || 'No standards auto-matched.'}

${pairings.length > 0 ? `HOW THESE STANDARDS CONNECT:\n${pairings.join('\n')}` : ''}

ALL AVAILABLE STANDARDS:
${SPEC_SUMMARY}

YOUR BEHAVIOR:
- You are having a focused conversation about THIS specific use case.
- Keep responses to 2-4 sentences. Be conversational, not listy.
- On the first message, briefly explain which standards apply and why, then ask ONE clarifying question about their specific situation (existing systems, constraints, timeline).
- After that, answer questions directly and practically. Reference specific spec features, field names, or implementation steps when helpful.
- If the user's question reveals they need a standard that wasn't auto-matched, mention it.
- Never produce long bullet lists — keep it natural and focused.`;
}

// ─── Data Flow Diagram (SVG) ─────────────────────────────────────────────────

function DataFlowDiagram({ entries, issueTitle }) {
  const svgW = 520;
  const nodeH = 44;
  const nodeW = 150;

  // Layout: use case at top center, matched specs in a row below, arrows between paired specs
  const useCaseY = 20;
  const specY = 110;
  const pairY = specY + nodeH + 50;

  // Position specs evenly
  const specCount = entries.length || 1;
  const totalSpecW = specCount * nodeW + (specCount - 1) * 24;
  const specStartX = (svgW - totalSpecW) / 2;

  const specPositions = entries.map((e, i) => ({
    entry: e,
    x: specStartX + i * (nodeW + 24),
    y: specY,
    cx: specStartX + i * (nodeW + 24) + nodeW / 2,
    cy: specY + nodeH / 2,
  }));

  // Find pairings between matched specs
  const pairings = [];
  const seen = new Set();
  for (const sp of specPositions) {
    for (const pair of (sp.entry.commonlyPairedWith || [])) {
      const target = specPositions.find(s => s.entry.id === pair.id);
      if (!target) continue;
      const key = [sp.entry.id, target.entry.id].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pairings.push({ from: sp, to: target, rationale: pair.rationale });
    }
  }

  // Compute SVG height
  const svgH = pairings.length > 0
    ? pairY + 20 + pairings.length * 22
    : specY + nodeH + 40;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 400 }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#94A3B8" />
        </marker>
        <marker id="arrow-indigo" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#818CF8" />
        </marker>
      </defs>

      {/* Use case node */}
      <rect x={(svgW - 240) / 2} y={useCaseY} width={240} height={40} rx={10}
        fill="#EEF2FF" stroke="#6366F1" strokeWidth={2} />
      <text x={svgW / 2} y={useCaseY + 24} textAnchor="middle" fontSize={11} fontWeight={600} fill="#4338CA">
        {issueTitle.length > 34 ? issueTitle.slice(0, 32) + '...' : issueTitle}
      </text>

      {/* Arrows from use case to each spec */}
      {specPositions.map((sp, i) => (
        <line key={`uc-${i}`}
          x1={svgW / 2} y1={useCaseY + 40}
          x2={sp.cx} y2={sp.y}
          stroke="#C7D2FE" strokeWidth={1.5} markerEnd="url(#arrow)" />
      ))}

      {/* Spec nodes */}
      {specPositions.map((sp, i) => {
        const colors = SPEC_COLORS[sp.entry.id] || { fill: '#F8FAFC', stroke: '#94A3B8', text: '#334155' };
        return (
          <g key={sp.entry.id}>
            <rect x={sp.x} y={sp.y} width={nodeW} height={nodeH} rx={8}
              fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
            <text x={sp.cx} y={sp.y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={colors.text}>
              {shortSpecName(sp.entry)}
            </text>
            <text x={sp.cx} y={sp.y + 32} textAnchor="middle" fontSize={9} fill="#64748B">
              {sp.entry.implementationBurden} burden
            </text>
          </g>
        );
      })}

      {/* Pairing arrows between specs */}
      {pairings.map((p, i) => {
        const y = specY + nodeH;
        const midY = y + 18 + i * 22;
        return (
          <g key={i}>
            <path
              d={`M ${p.from.cx} ${y} Q ${p.from.cx} ${midY} ${(p.from.cx + p.to.cx) / 2} ${midY} Q ${p.to.cx} ${midY} ${p.to.cx} ${y}`}
              fill="none" stroke="#818CF8" strokeWidth={1.2} strokeDasharray="4 3"
              markerEnd="url(#arrow-indigo)" />
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(8, ${svgH - 18})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#C7D2FE" strokeWidth={1.5} markerEnd="url(#arrow)" />
        <text x={24} y={4} fontSize={8} fill="#94A3B8">addresses</text>
        <line x1={80} y1={0} x2={98} y2={0} stroke="#818CF8" strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={104} y={4} fontSize={8} fill="#94A3B8">commonly paired</text>
      </g>
    </svg>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-bold mr-2 flex-shrink-0 mt-0.5">
          AI
        </div>
      )}
      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-600 text-white rounded-br-md'
          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
      }`}>
        {isUser ? msg.content : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              code: ({ children }) => <code className="text-[11px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-mono">{children}</code>,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

// ─── Spec detail card (right pane) ───────────────────────────────────────────

function SpecCard({ entry, onNavigateToEntry }) {
  const [showPayload, setShowPayload] = useState(false);
  const burden = entry.implementationBurden || 'medium';
  const payload = entry.samplePayloads?.[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <button
          onClick={() => onNavigateToEntry(entry.id)}
          className="font-semibold text-gray-900 text-xs hover:text-indigo-700 transition-colors text-left"
        >
          {shortSpecName(entry)}
          <span className="text-[10px] text-indigo-500 ml-1">→ Library</span>
        </button>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 ${BURDEN_COLORS[burden]}`}>
          {burden}
        </span>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{entry.aiSummary}</p>
      {entry.implementationGuidance && (
        <div className="mb-2">
          <div className="text-[9px] font-semibold text-indigo-600 uppercase tracking-wide mb-0.5">Quick-start</div>
          <p className="text-[11px] text-gray-600 leading-relaxed">{entry.implementationGuidance}</p>
        </div>
      )}
      {payload && (
        <div>
          <button onClick={() => setShowPayload(v => !v)} className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium">
            {showPayload ? 'Hide' : 'Show'} sample payload
          </button>
          {showPayload && (
            <pre className="mt-1.5 bg-gray-900 text-gray-100 text-[9px] leading-relaxed rounded-lg p-2.5 overflow-x-auto max-h-36">
              <code>{payload.code}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Two-pane explorer ───────────────────────────────────────────────────────

function UseCaseExplorer({ issue, entries, onBack, onNavigateToEntry }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const systemPrompt = useMemo(
    () => useCaseSystemPrompt(issue, entries),
    [issue, entries]
  );

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-send opening message on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const opener = await callClaude(
          [{ role: 'user', content: `I'm looking at this use case: "${issue.title}". What standards should I consider and what should I know to get started?` }],
          systemPrompt
        );
        if (!cancelled) {
          setMessages([
            { id: 1, role: 'user', content: `I'm looking at this use case: "${issue.title}". What standards should I consider?` },
            { id: 2, role: 'assistant', content: opener },
          ]);
        }
      } catch (err) {
        if (!cancelled) {
          setMessages([
            { id: 1, role: 'user', content: `I'm looking at this use case: "${issue.title}". What standards should I consider?` },
            { id: 2, role: 'assistant', content: `Here's what I can tell you based on the matched standards:\n\n${entries.map(e => `**${shortSpecName(e)}** — ${e.aiSummary}`).join('\n\n')}\n\nWhat specific aspect would you like to explore?` },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(apiMessages, systemPrompt);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, systemPrompt]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
          ← All use cases
        </button>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1.5 text-xs min-w-0">
          <span className="font-medium text-indigo-700 truncate">{issue.title}</span>
          <span className="text-indigo-400">·</span>
          <span className="text-indigo-500 flex-shrink-0">{entries.length} spec{entries.length !== 1 ? 's' : ''}</span>
        </div>
        {issue.labels?.length > 0 && (
          <div className="hidden sm:flex gap-1.5 flex-shrink-0">
            {issue.labels.slice(0, 3).map(lbl => (
              <span key={lbl.id} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${labelPalette(lbl.name)}`}>
                {lbl.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Two-pane split */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[520px]">

        {/* LEFT: Chat pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-bold">AI</div>
            <div>
              <div className="text-xs font-semibold text-gray-800">Standards Advisor</div>
              <div className="text-[10px] text-gray-400">Ask clarifying questions about this use case</div>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-[300px] max-h-[460px]">
            {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}

            {loading && messages.length === 0 && (
              <div className="flex justify-center py-10">
                <div className="text-center">
                  <div className="inline-block w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-2" />
                  <div className="text-xs text-gray-400">Analyzing use case...</div>
                </div>
              </div>
            )}

            {loading && messages.length > 0 && (
              <div className="flex justify-start mb-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-bold mr-2 flex-shrink-0">AI</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700 mb-3">{error}</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about this use case... (Enter to send)"
              rows={2}
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>

        {/* RIGHT: Data flow + spec cards */}
        <div className="lg:w-[440px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto max-h-[600px]">

          {/* Data flow diagram */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-gray-100 px-4 py-2.5">
              <div className="text-xs font-semibold text-gray-700">Data Flow</div>
              <div className="text-[10px] text-gray-400">How these standards connect for this use case</div>
            </div>
            <div className="px-4 py-3">
              {entries.length > 0 ? (
                <DataFlowDiagram entries={entries} issueTitle={issue.title} />
              ) : (
                <div className="py-6 text-center text-xs text-gray-400">
                  No standards auto-matched — ask the advisor for recommendations
                </div>
              )}
            </div>
          </div>

          {/* Spec detail cards */}
          {entries.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                Matched Standards ({entries.length})
              </div>
              <div className="flex flex-col gap-2.5">
                {entries.map(entry => (
                  <SpecCard key={entry.id} entry={entry} onNavigateToEntry={onNavigateToEntry} />
                ))}
              </div>
            </div>
          )}

          {/* Pairing explanations */}
          {entries.length > 1 && (() => {
            const pairings = [];
            const seen = new Set();
            for (const e of entries) {
              for (const p of (e.commonlyPairedWith || [])) {
                const target = entries.find(m => m.id === p.id);
                if (!target) continue;
                const key = [e.id, target.id].sort().join('|');
                if (seen.has(key)) continue;
                seen.add(key);
                pairings.push({ from: e, to: target, rationale: p.rationale });
              }
            }
            if (pairings.length === 0) return null;
            return (
              <div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                  How They Connect
                </div>
                <div className="flex flex-col gap-2">
                  {pairings.map((p, i) => (
                    <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                      <div className="text-[10px] font-semibold text-indigo-700 mb-0.5">
                        {shortSpecName(p.from)} + {shortSpecName(p.to)}
                      </div>
                      <div className="text-[10px] text-indigo-600 leading-relaxed">{p.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* GitHub link */}
          <div className="text-center pb-2">
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 hover:underline font-medium">
              View original use case on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Issue card (grid view) ──────────────────────────────────────────────────

function IssueCard({ issue, onClick }) {
  const specIds = useMemo(() => matchIssueToSpecs(issue), [issue]);
  const entries = useMemo(() => libraryEntries.filter(e => specIds.includes(e.id)), [specIds]);
  const preview = stripMarkdown(issue.body).slice(0, 200);
  const commentCount = issue.comments ?? 0;

  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-300 transition-all text-left group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">#{issue.number}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Open issue" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">{timeAgo(issue.created_at)}</span>
          <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Explore →
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
        {issue.title}
      </h3>

      {/* Preview */}
      {preview && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{preview}</p>
      )}

      {/* Labels */}
      {issue.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {issue.labels.map(lbl => (
            <span key={lbl.id} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${labelPalette(lbl.name)}`}>
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      {/* Matched standards pills */}
      {entries.length > 0 && (
        <div className="border-t border-gray-100 pt-3 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {entries.map(entry => {
              const colors = SPEC_COLORS[entry.id] || { fill: '#F8FAFC', stroke: '#94A3B8', text: '#334155' };
              return (
                <span key={entry.id}
                  className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                  style={{ backgroundColor: colors.fill, borderColor: colors.stroke, color: colors.text }}
                >
                  {shortSpecName(entry)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1 mt-auto">
        {issue.user?.avatar_url && (
          <img src={issue.user.avatar_url} alt="" className="w-5 h-5 rounded-full border border-gray-200" />
        )}
        <span className="text-[10px] text-gray-400">{issue.user?.login}</span>
        {commentCount > 0 && (
          <span className="text-[10px] text-gray-400">· {commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
        )}
      </div>
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function UseCasesPage({ onNavigateToEntry }) {
  const [issues,      setIssues]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [specFilter,  setSpecFilter]  = useState('');
  const [sort,        setSort]        = useState('newest');
  const [activeIssue, setActiveIssue] = useState(null); // issue object when in explorer mode

  useEffect(() => {
    fetch('https://api.github.com/repos/educoreproject/educore_use_cases/issues?state=open&per_page=100&sort=created&direction=desc')
      .then(r => {
        if (!r.ok) throw new Error(`GitHub API error (${r.status} ${r.statusText})`);
        return r.json();
      })
      .then(data => { setIssues(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const allLabels = useMemo(() => {
    const seen = new Set();
    const out  = [];
    for (const iss of issues) {
      for (const lbl of (iss.labels || [])) {
        if (!seen.has(lbl.name)) { seen.add(lbl.name); out.push(lbl); }
      }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [issues]);

  const filtered = useMemo(() => {
    let list = issues.filter(iss => {
      const text = `${iss.title} ${iss.body || ''}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (labelFilter && !(iss.labels || []).some(l => l.name === labelFilter)) return false;
      if (specFilter && !matchIssueToSpecs(iss).includes(specFilter)) return false;
      return true;
    });
    if (sort === 'comments') list = [...list].sort((a, b) => (b.comments ?? 0) - (a.comments ?? 0));
    if (sort === 'matched')  list = [...list].sort((a, b) => matchIssueToSpecs(b).length - matchIssueToSpecs(a).length);
    return list;
  }, [issues, search, labelFilter, specFilter, sort]);

  const hasFilters = search || labelFilter || specFilter;
  const specCoverage = useMemo(() => {
    const counts = {};
    for (const p of SPEC_PATTERNS) counts[p.id] = issues.filter(i => matchIssueToSpecs(i).includes(p.id)).length;
    return counts;
  }, [issues]);

  // ── Explorer mode ──────────────────────────────────────────────────────────
  if (activeIssue) {
    const specIds = matchIssueToSpecs(activeIssue);
    const entries = libraryEntries.filter(e => specIds.includes(e.id));
    return (
      <UseCaseExplorer
        issue={activeIssue}
        entries={entries}
        onBack={() => setActiveIssue(null)}
        onNavigateToEntry={onNavigateToEntry}
      />
    );
  }

  // ── Grid mode ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2">
          Community Use Cases
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Real-World Use Cases</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
          Click any use case to explore it — you'll see which standards apply, how they connect, and can ask clarifying questions.
          <a
            href="https://github.com/educoreproject/educore_use_cases/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-indigo-600 hover:underline font-medium"
          >
            Submit a use case →
          </a>
        </p>
      </div>

      {/* Spec coverage pills */}
      {!loading && !error && issues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {SPEC_PATTERNS.map(p => (
            <button
              key={p.id}
              onClick={() => setSpecFilter(prev => prev === p.id ? '' : p.id)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                specFilter === p.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {p.label}
              <span className={`ml-1.5 ${specFilter === p.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                {specCoverage[p.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          type="search"
          placeholder="Search use cases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
        <select
          value={labelFilter}
          onChange={e => setLabelFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All labels</option>
          {allLabels.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="newest">Newest first</option>
          <option value="comments">Most discussed</option>
          <option value="matched">Most standards matched</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setLabelFilter(''); setSpecFilter(''); }}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Clear filters
          </button>
        )}
        {!loading && (
          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {issues.length} use case{issues.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading use cases from GitHub...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 max-w-lg">
          <div className="font-semibold mb-1">Could not load use cases</div>
          {error}
          <div className="mt-2 text-xs text-red-500">
            GitHub's unauthenticated API allows 60 requests/hour. Try again in a moment or{' '}
            <a href="https://github.com/educoreproject/educore_use_cases/issues" target="_blank" rel="noopener noreferrer" className="underline">view on GitHub</a>.
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          {hasFilters ? 'No use cases match your filters.' : 'No open use cases yet. Be the first to submit one!'}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setActiveIssue(issue)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
