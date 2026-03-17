// UseCasesPage.jsx — Use-case-first view of the reference library.
// Pulls live issues from github.com/INFERable-app/educore_use_cases
// and maps each issue to relevant standards from libraryEntries.

import { useState, useEffect, useMemo } from 'react';
import { libraryEntries } from '../data/libraryEntries';

// Heuristic: match issue text against spec keywords
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

function IssueCard({ issue, onNavigateToEntry }) {
  const specIds   = useMemo(() => matchIssueToSpecs(issue), [issue]);
  const entries   = useMemo(() => libraryEntries.filter(e => specIds.includes(e.id)), [specIds]);
  const preview   = stripMarkdown(issue.body).slice(0, 220);
  const commentCount = issue.comments ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 transition-all">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">#{issue.number}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Open issue" />
        </div>
        <span className="text-[10px] text-gray-400">{timeAgo(issue.created_at)}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{issue.title}</h3>

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

      {/* Matched standards */}
      {entries.length > 0 && (
        <div className="border-t border-gray-100 pt-3 mt-auto">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Related Standards</div>
          <div className="flex flex-wrap gap-1.5">
            {entries.map(entry => (
              <button
                key={entry.id}
                onClick={() => onNavigateToEntry(entry.id)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors font-medium"
              >
                {entry.title.split(/[:(]/)[0].trim().split(' ').slice(0, 4).join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-2">
          {issue.user?.avatar_url && (
            <img src={issue.user.avatar_url} alt="" className="w-5 h-5 rounded-full border border-gray-200" />
          )}
          <span className="text-[10px] text-gray-400">{issue.user?.login}</span>
          {commentCount > 0 && (
            <span className="text-[10px] text-gray-400">· {commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-indigo-600 hover:underline font-medium"
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}

export default function UseCasesPage({ onNavigateToEntry }) {
  const [issues,      setIssues]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [specFilter,  setSpecFilter]  = useState('');
  const [sort,        setSort]        = useState('newest'); // newest | comments | matched

  useEffect(() => {
    fetch('https://api.github.com/repos/INFERable-app/educore_use_cases/issues?state=open&per_page=100&sort=created&direction=desc')
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2">
          <span>🎯</span> Community Use Cases
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Real-World Use Cases</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
          Implementation scenarios submitted by the community — each linked to the interoperability standards that address it.
          <a
            href="https://github.com/INFERable-app/educore_use_cases/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-indigo-600 hover:underline font-medium"
          >
            Submit a use case →
          </a>
        </p>
      </div>

      {/* Spec coverage pills (only when data loaded) */}
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
          placeholder="Search use cases…"
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
          <p className="text-sm text-gray-500">Loading use cases from GitHub…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 max-w-lg">
          <div className="font-semibold mb-1">Could not load use cases</div>
          {error}
          <div className="mt-2 text-xs text-red-500">
            GitHub's unauthenticated API allows 60 requests/hour. Try again in a moment or{' '}
            <a href="https://github.com/INFERable-app/educore_use_cases/issues" target="_blank" rel="noopener noreferrer" className="underline">view on GitHub</a>.
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
            <IssueCard key={issue.id} issue={issue} onNavigateToEntry={onNavigateToEntry} />
          ))}
        </div>
      )}
    </div>
  );
}
