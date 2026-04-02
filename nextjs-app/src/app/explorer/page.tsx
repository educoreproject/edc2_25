'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ─── Constants ──────────────────────────────────────────────────────────────

const ROLES = [
  { id: 'k12-admin', label: 'School / District Admin', icon: '🏫', technical: false, hint: 'I manage student data and need systems to talk to each other' },
  { id: 'implementer', label: 'Developer / Implementer', icon: '💻', technical: true, hint: 'I build integrations and need to know which specs and APIs to use' },
  { id: 'vendor', label: 'EdTech Vendor', icon: '🏢', technical: true, hint: 'My product needs to interoperate with district and credential systems' },
  { id: 'researcher', label: 'Researcher / Policy', icon: '📊', technical: false, hint: 'I study education data systems, standards, or policy' },
  { id: 'employer', label: 'Employer / Workforce', icon: '💼', technical: false, hint: 'I want to verify credentials and hire based on demonstrated skills' },
  { id: 'standards-body', label: 'Standards Body', icon: '⚖️', technical: true, hint: 'I work on education data standards, governance, or alignment' },
];

const GOAL_SUGGESTIONS: Record<string, string[]> = {
  'k12-admin': ['Share student transcripts with receiving schools', 'Issue digital credentials for achievements', 'Connect our SIS to credential platforms', 'Align curriculum to state standards'],
  'implementer': ['Build an LER wallet or ecosystem role', 'Implement Open Badges issuance', 'Map competency frameworks via CASE', 'Create CEDS-aligned data exports'],
  'vendor': ['Support CLR or badge export from our LMS', 'Make our platform interoperable with districts', 'Add credential verification to our product'],
  'researcher': ['Understand the credential standards landscape', 'Map CEDS domains to our research dataset', 'Analyze equity implications of these standards'],
  'employer': ['Verify digital credentials from job applicants', 'Accept LER-based skills profiles at hiring', 'Map job requirements to credential frameworks'],
  'standards-body': ['Align two competing or overlapping standards', 'Understand adoption and implementation landscape', 'Draft interoperability requirements or profiles'],
};

const SPEC_SUMMARY = `CASE 1.1 (educore:spec/case-v1): Competency and curriculum framework exchange. Low burden.
CTDL (educore:spec/ctdl): Rich credential metadata descriptions. Low-medium burden.
Open Badges 3.0 (educore:spec/open-badges-v3): Portable digital achievement badges built on W3C VCs. Medium burden.
CLR 2.0 (educore:spec/clr-v2): Comprehensive Learner Record. Medium-high burden.
IEEE P1484.2 LER (educore:spec/lrw-competency-framework): Ecosystem architecture standard. Medium burden.`;

type Role = (typeof ROLES)[number];
type Message = { id: number; role: 'user' | 'assistant'; content: string };

// ─── API helper ─────────────────────────────────────────────────────────────

async function callChat(messages: { role: string; content: string }[], systemPrompt: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.text;
}

function chatSystemPrompt(role: Role, goalText: string): string {
  const depth = role.technical
    ? 'Be technically specific — mention field names, schema paths, spec versions, and API patterns when relevant.'
    : 'Use plain language. Avoid acronyms unless you explain them. Focus on the "what" and "why", not implementation details.';

  return `You are an education data interoperability advisor having a discovery conversation.

USER CONTEXT:
- Role: ${role.label}
- Goal: ${goalText}

YOUR BEHAVIOR:
- Keep responses to 2–4 sentences maximum. Be conversational, not listy.
- First 2 exchanges: ask ONE focused clarifying question. Do NOT recommend standards yet.
- After 2 exchanges: you may start mentioning relevant standards by name, one at a time.
- ${depth}
- Never produce headers, bullet lists, or structured output — only natural prose.
- After 3+ exchanges feel free to say "I think I have a good sense of your situation now."

STANDARDS KNOWLEDGE:
${SPEC_SUMMARY}`;
}

function recipeSystemPrompt(role: Role, goalText: string, conversation: Message[]): string {
  const convoText = conversation
    .map(m => `${m.role === 'user' ? role.label : 'Advisor'}: ${m.content}`)
    .join('\n\n');

  return `You are an education data interoperability advisor. Generate a concise personalized standards recipe.

USER CONTEXT:
- Role: ${role.label}
- Goal: ${goalText}

CONVERSATION SO FAR:
${convoText}

THE FIVE STANDARDS YOU CAN RECOMMEND:
${SPEC_SUMMARY}

Generate a "Standards Recipe" using EXACTLY this markdown structure:

## Your Standards Recipe

**Primary Standard:** [name] \`[educore URI]\`
**Why it fits:** [2 sentences specific to this user]
**Implementation burden:** [low/medium/high] — [reason]

**Also consider:** [other standard(s)]

---

**CEDS domains involved:** [comma-separated]
**Privacy note:** [one sentence]

**Your next 3 steps:**
1. [Step]
2. [Step]
3. [Step]

After the recipe, add:

## Explore Further
Suggest 2-3 specific links using this format:
- [Use Case: label](/use-cases/use-case-id) — why it's relevant
- [Standard: label](/standards/standard-id) — why to explore it`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const [phase, setPhase] = useState<'role' | 'goal' | 'chat' | 'recipe'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [goalText, setGoalText] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userTurns, setUserTurns] = useState(0);
  const [showRecipePrompt, setShowRecipePrompt] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showRecipePrompt]);

  useEffect(() => {
    if (phase === 'chat' && messages.length === 0 && selectedRole) {
      setMessages([{
        id: 0,
        role: 'assistant',
        content: `Hi! I understand you're a ${selectedRole.label} and you want to: ${goalText}. Let me ask a quick clarifying question — what systems or tools are you currently working with, if any?`,
      }]);
    }
  }, [phase, messages.length, selectedRole, goalText]);

  useEffect(() => {
    if (userTurns >= 2 && !showRecipePrompt && !showRecipe) {
      setShowRecipePrompt(true);
    }
  }, [userTurns, showRecipePrompt, showRecipe]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !selectedRole) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setUserTurns(t => t + 1);
    setLoading(true);
    setError('');

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callChat(apiMessages, chatSystemPrompt(selectedRole, goalText));
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function generateRecipe() {
    if (!selectedRole) return;
    setShowRecipePrompt(false);
    setShowRecipe(true);
    setRecipe(null);

    try {
      const apiMessages = [{ role: 'user', content: 'Please generate my personalized standards recipe now.' }];
      const text = await callChat(apiMessages, recipeSystemPrompt(selectedRole, goalText, messages));
      setRecipe(text);
    } catch (err) {
      setRecipe(`*Could not generate recipe: ${err instanceof Error ? err.message : 'Unknown error'}*`);
    }
  }

  function reset() {
    setPhase('role');
    setSelectedRole(null);
    setGoalText('');
    setGoalInput('');
    setMessages([]);
    setInput('');
    setUserTurns(0);
    setShowRecipePrompt(false);
    setShowRecipe(false);
    setRecipe(null);
    setError('');
  }

  // ── Role Selection ─────────────────────────────────────────────────────────
  if (phase === 'role') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-md">
            💬
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Model Explorer</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            I&apos;ll help you identify the right interoperability standards for your situation through a short conversation. First — what describes you best?
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => { setSelectedRole(role); setPhase('goal'); }}
              className="p-4 rounded-xl border-2 border-gray-200 bg-white text-left hover:border-indigo-300 hover:bg-indigo-50/40 transition-all"
            >
              <div className="text-2xl mb-2">{role.icon}</div>
              <div className="font-semibold text-sm text-gray-900">{role.label}</div>
              <div className="text-xs text-gray-500 mt-1 leading-snug">{role.hint}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Goal Input ─────────────────────────────────────────────────────────────
  if (phase === 'goal' && selectedRole) {
    const suggestions = GOAL_SUGGESTIONS[selectedRole.id] || [];
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => setPhase('role')} className="text-xs text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors">
          &larr; Change role
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selectedRole.icon}</span>
            <div>
              <div className="font-bold text-gray-900">{selectedRole.label}</div>
              <div className="text-xs text-gray-400">{selectedRole.hint}</div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">What are you trying to accomplish?</h2>
          <p className="text-sm text-gray-500 mt-1">Be as specific as you like — the more context, the better the recommendation.</p>
        </div>
        <textarea
          value={goalInput}
          onChange={e => setGoalInput(e.target.value)}
          placeholder="Describe what you're trying to do..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
          autoFocus
        />
        {suggestions.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Or pick a common goal:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setGoalInput(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    goalInput === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          disabled={!goalInput.trim()}
          onClick={() => { setGoalText(goalInput.trim()); setPhase('chat'); }}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start conversation &rarr;
        </button>
      </div>
    );
  }

  // ── Chat + Recipe ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
      {/* Chat column */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">&larr; Start over</button>
          {selectedRole && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1.5 text-xs">
              <span>{selectedRole.icon}</span>
              <span className="font-medium text-indigo-700">{selectedRole.label}</span>
              <span className="text-indigo-400">&middot;</span>
              <span className="text-indigo-600 truncate max-w-[200px]">{goalText}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 min-h-[400px] max-h-[520px]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">AI</div>
              )}
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold ml-2 flex-shrink-0 mt-0.5">Me</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">AI</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 mb-4">{error}</div>
          )}

          {showRecipePrompt && !showRecipe && (
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl px-5 py-4 mb-4">
              <div className="font-semibold text-indigo-900 text-sm mb-1">I think I have a good picture of your situation.</div>
              <div className="text-xs text-indigo-700 mb-3 leading-relaxed">
                Ready to see your personalized data standards recipe?
              </div>
              <div className="flex gap-2">
                <button onClick={generateRecipe} className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Show me my standards recipe &rarr;
                </button>
                <button onClick={() => setShowRecipePrompt(false)} className="text-xs text-indigo-500 px-3 py-2 hover:text-indigo-700 transition-colors">
                  Keep chatting
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {!showRecipe && (
          <div className="mt-4 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Reply here... (Enter to send)"
              rows={2}
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold flex-shrink-0"
            >
              Send
            </button>
          </div>
        )}

        {showRecipe && (
          <div className="mt-4 text-center">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">&larr; Start a new conversation</button>
          </div>
        )}
      </div>

      {/* Recipe panel */}
      {showRecipe && selectedRole && (
        <div className="lg:w-[420px] flex-shrink-0">
          <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-4">
              <div className="text-xs text-indigo-200 font-semibold uppercase tracking-wide mb-0.5">Personalized for {selectedRole.label}</div>
              <div className="text-white font-bold text-base">Your Data Standards Recipe</div>
            </div>
            <div className="px-5 py-4 text-sm">
              {recipe ? (
                <div className="prose prose-sm max-w-none">
                  {recipe.split('\n').map((line, i) => {
                    // Parse internal links like [text](/path)
                    const linkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g;
                    if (linkRegex.test(line)) {
                      const parts = line.split(linkRegex);
                      return (
                        <p key={i} className="mb-2 text-gray-700 leading-relaxed">
                          {parts.map((part, j) => {
                            if (j % 3 === 1) {
                              const href = `/${parts[j + 1]}`;
                              return <Link key={j} href={href} className="text-indigo-600 hover:text-indigo-800 font-medium">{part}</Link>;
                            }
                            if (j % 3 === 2) return null;
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    }
                    if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-gray-900 text-base mb-2 mt-3">{line.replace('## ', '')}</h3>;
                    if (line.startsWith('**')) return <p key={i} className="mb-2 text-gray-700 leading-relaxed font-medium">{line.replace(/\*\*/g, '')}</p>;
                    if (line.startsWith('- ')) return <p key={i} className="mb-1 text-gray-600 pl-3 text-xs leading-relaxed">{line}</p>;
                    if (line.match(/^\d+\./)) return <p key={i} className="mb-1 text-gray-700 leading-relaxed">{line}</p>;
                    if (line === '---') return <hr key={i} className="border-gray-100 my-3" />;
                    if (line.trim()) return <p key={i} className="mb-2 text-gray-700 leading-relaxed">{line}</p>;
                    return null;
                  })}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-2" />
                  <div className="text-gray-500 text-xs">Generating your recipe...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
