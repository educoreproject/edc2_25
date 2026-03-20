// ChatPage.jsx — Conversational standards discovery interface.
// Guides the user through role → goal → free chat → standards recipe reveal.
// Uses the Anthropic API directly (same key as LibraryPage).

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = [
  { id: 'k12-admin',      label: 'School / District Admin', icon: '🏫', technical: false,
    hint: 'I manage student data and need systems to talk to each other' },
  { id: 'implementer',    label: 'Developer / Implementer', icon: '💻', technical: true,
    hint: 'I build integrations and need to know which specs and APIs to use' },
  { id: 'vendor',         label: 'EdTech Vendor',           icon: '🏢', technical: true,
    hint: 'My product needs to interoperate with district and credential systems' },
  { id: 'researcher',     label: 'Researcher / Policy',     icon: '📊', technical: false,
    hint: 'I study education data systems, standards, or policy' },
  { id: 'employer',       label: 'Employer / Workforce',    icon: '💼', technical: false,
    hint: 'I want to verify credentials and hire based on demonstrated skills' },
  { id: 'standards-body', label: 'Standards Body',          icon: '⚖️',  technical: true,
    hint: 'I work on education data standards, governance, or alignment' },
];

const GOAL_SUGGESTIONS = {
  'k12-admin':      ['Share student transcripts with receiving schools', 'Issue digital credentials for achievements', 'Connect our SIS to credential platforms', 'Align curriculum to state standards'],
  'implementer':    ['Build an LER wallet or ecosystem role', 'Implement Open Badges issuance', 'Map competency frameworks via CASE', 'Create CEDS-aligned data exports'],
  'vendor':         ['Support CLR or badge export from our LMS', 'Make our platform interoperable with districts', 'Add credential verification to our product'],
  'researcher':     ['Understand the credential standards landscape', 'Map CEDS domains to our research dataset', 'Analyze equity implications of these standards'],
  'employer':       ['Verify digital credentials from job applicants', 'Accept LER-based skills profiles at hiring', 'Map job requirements to credential frameworks'],
  'standards-body': ['Align two competing or overlapping standards', 'Understand adoption and implementation landscape', 'Draft interoperability requirements or profiles'],
};

const SPEC_SUMMARY = `
CASE 1.1 (educore:spec/case-v1): Competency and curriculum framework exchange. Low burden. Best for aligning curriculum, mapping skills hierarchies.
CTDL (educore:spec/ctdl): Rich credential metadata descriptions. Low-medium burden. Best for defining what a credential means, who grants it, how to verify it.
Open Badges 3.0 (educore:spec/open-badges-v3): Portable digital achievement badges built on W3C Verifiable Credentials. Medium burden. Best for issuing stackable achievement records.
CLR 2.0 (educore:spec/clr-v2): Comprehensive Learner Record — aggregate transcript, achievements, competencies in one portable record. Medium-high burden. Best for holistic portfolio portability.
IEEE P1484.2 LER (educore:spec/lrw-competency-framework): Ecosystem architecture standard defining issuer, holder, verifier, wallet, and registry roles. Medium burden. Best for designing an LER ecosystem.`.trim();

// ─── API Helpers ─────────────────────────────────────────────────────────────

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

function chatSystemPrompt(role, goalText) {
  const depth = role.technical
    ? 'Be technically specific — mention field names, schema paths, spec versions, and API patterns when relevant.'
    : 'Use plain language. Avoid acronyms unless you explain them. Focus on the "what" and "why", not implementation details.';

  return `You are an education data interoperability advisor having a discovery conversation.

USER CONTEXT:
- Role: ${role.label}
- Goal: ${goalText}

YOUR BEHAVIOR:
- Keep responses to 2–4 sentences maximum. Be conversational, not listy.
- First 2 exchanges: ask ONE focused clarifying question. Understand their existing tools, data sources, or the specific problem. Do NOT recommend standards yet.
- After 2 exchanges: you may start mentioning relevant standards by name, one at a time.
- ${depth}
- Never produce headers, bullet lists, or structured output — only natural prose.
- After 3+ exchanges feel free to say something like "I think I have a good sense of your situation now."

STANDARDS KNOWLEDGE:
${SPEC_SUMMARY}`;
}

function recipeSystemPrompt(role, goalText, conversation) {
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

Generate a "Standards Recipe" using EXACTLY this markdown structure (no extra sections):

## Your Standards Recipe

**Primary Standard:** [name] \`[educore URI]\`
**Why it fits your situation:** [2 sentences specific to this user's stated context, not generic]
**Implementation burden:** [low/medium/high] — [one sentence reason]

**Also consider:** [other relevant standard(s), or "Start with the primary — keep it simple for now"]

---

**CEDS domains involved:** [comma-separated, e.g. credentials, k12, assessments]
**Privacy note:** [one sentence about the key privacy or consent consideration]

**Your next 3 steps:**
1. [Concrete, role-appropriate first step]
2. [Concrete second step]
3. [Concrete third step]`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoleCard({ role, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(role)}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
      }`}
    >
      <div className="text-2xl mb-2">{role.icon}</div>
      <div className="font-semibold text-sm text-gray-900">{role.label}</div>
      <div className="text-xs text-gray-500 mt-1 leading-snug">{role.hint}</div>
    </button>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
        }`}
      >
        {isUser ? (
          msg.content
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold ml-2 flex-shrink-0 mt-0.5">
          Me
        </div>
      )}
    </div>
  );
}

function RecipePanel({ recipe, role, onWantsSkill, wantsSkill, onReset }) {
  return (
    <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-4">
        <div className="text-xs text-indigo-200 font-semibold uppercase tracking-wide mb-0.5">Personalized for {role.label}</div>
        <div className="text-white font-bold text-base">Your Data Standards Recipe</div>
      </div>

      {/* Recipe content */}
      <div className="px-5 py-4 text-sm">
        {recipe ? (
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="font-bold text-gray-900 text-base mb-3 mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="font-semibold text-gray-800 text-sm mb-2 mt-3">{children}</h3>,
              p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              hr: () => <hr className="border-gray-100 my-3" />,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 text-gray-700 mb-3">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              code: ({ children }) => (
                <code className="text-[11px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">{children}</code>
              ),
            }}
          >
            {recipe}
          </ReactMarkdown>
        ) : (
          <div className="py-6 text-center">
            <div className="inline-block w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-2" />
            <div className="text-gray-500 text-xs">Generating your recipe…</div>
          </div>
        )}
      </div>

      {/* Skill question */}
      {recipe && wantsSkill === null && (
        <div className="border-t border-gray-100 px-5 py-4 bg-slate-50">
          <div className="text-xs font-semibold text-gray-700 mb-3">
            {role.technical
              ? 'Would you like a ready-to-use Claude Skill for implementing this?'
              : 'Would you like a plain-language guide to share with your team?'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onWantsSkill(true)}
              className="flex-1 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {role.technical ? 'Yes — Download Claude Skill' : 'Yes — Get Plain-Language Guide'}
            </button>
            <button
              onClick={() => onWantsSkill(false)}
              className="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {wantsSkill === true && (
        <div className="border-t border-gray-100 px-5 py-4 bg-emerald-50">
          <div className="text-xs font-semibold text-emerald-800 mb-1">
            {role.technical ? 'Your Claude Skill is ready.' : 'Your guide is ready.'}
          </div>
          <div className="text-xs text-emerald-700">
            {role.technical
              ? 'Use the Library view to search for your recommended standard and click "Download Skill" on the AI mapper result.'
              : 'Switch to the Use Cases view to find examples matching your situation, or browse the Library for plain-language spec summaries.'}
          </div>
        </div>
      )}

      {wantsSkill === false && (
        <div className="border-t border-gray-100 px-5 py-4">
          <button onClick={onReset} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            Start a new conversation →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatPage() {
  // Phase state machine
  const [phase,            setPhase]            = useState('role');   // role | goal | chat | recipe
  const [selectedRole,     setSelectedRole]      = useState(null);
  const [goalText,         setGoalText]          = useState('');
  const [goalInput,        setGoalInput]         = useState('');

  // Chat state
  const [messages,         setMessages]          = useState([]);
  const [input,            setInput]             = useState('');
  const [loading,          setLoading]           = useState(false);
  const [error,            setError]             = useState('');
  const [userTurns,        setUserTurns]         = useState(0);

  // Recipe state
  const [showRecipePrompt, setShowRecipePrompt]  = useState(false);
  const [showRecipe,       setShowRecipe]        = useState(false);
  const [recipe,           setRecipe]            = useState(null);
  const [recipeLoading,    setRecipeLoading]     = useState(false);
  const [wantsSkill,       setWantsSkill]        = useState(null);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showRecipePrompt]);

  // Kick off first AI message when entering chat phase
  useEffect(() => {
    if (phase === 'chat' && messages.length === 0) {
      const opener = `Hi! I understand you're a ${selectedRole.label} and you want to: ${goalText}. Let me ask a quick clarifying question to make sure I point you in the right direction — what systems or tools are you currently working with, if any?`;
      setMessages([{ id: 0, role: 'assistant', content: opener }]);
    }
  }, [phase]);

  // Show recipe prompt after 2 user turns
  useEffect(() => {
    if (userTurns >= 2 && !showRecipePrompt && !showRecipe) {
      setShowRecipePrompt(true);
    }
  }, [userTurns]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setUserTurns(t => t + 1);
    setLoading(true);
    setError('');

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(apiMessages, chatSystemPrompt(selectedRole, goalText));
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function generateRecipe() {
    setShowRecipePrompt(false);
    setShowRecipe(true);
    setRecipeLoading(true);
    setRecipe(null);

    try {
      // The recipe system prompt embeds the full conversation text, so we only
      // need a single user trigger message — avoids the "must end with user" error.
      const apiMessages = [{ role: 'user', content: 'Please generate my personalized standards recipe now.' }];
      const text = await callClaude(apiMessages, recipeSystemPrompt(selectedRole, goalText, messages));
      setRecipe(text);
    } catch (err) {
      setRecipe(`*Could not generate recipe: ${err.message}*`);
    } finally {
      setRecipeLoading(false);
    }
  }

  function reset() {
    setPhase('role'); setSelectedRole(null); setGoalText(''); setGoalInput('');
    setMessages([]); setInput(''); setUserTurns(0);
    setShowRecipePrompt(false); setShowRecipe(false); setRecipe(null);
    setWantsSkill(null); setError('');
  }

  // ── Phase: Role Selection ───────────────────────────────────────────────────
  if (phase === 'role') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-md">
            💬
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Find Your Data Standards</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            I'll help you identify the right interoperability standards for your situation through a short conversation. First — what describes you best?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROLES.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selectedRole?.id === role.id}
              onSelect={r => { setSelectedRole(r); setPhase('goal'); }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Phase: Goal Input ───────────────────────────────────────────────────────
  if (phase === 'goal') {
    const suggestions = GOAL_SUGGESTIONS[selectedRole.id] || [];
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => setPhase('role')} className="text-xs text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors">
          ← Change role
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
          placeholder="Describe what you're trying to do…"
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
                    goalInput === s
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
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
          onClick={() => {
            setGoalText(goalInput.trim());
            setPhase('chat');
          }}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start conversation →
        </button>
      </div>
    );
  }

  // ── Phase: Chat (+ optional Recipe panel) ──────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">

      {/* Left: chat column */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Context pill */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">← Start over</button>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1.5 text-xs">
            <span>{selectedRole.icon}</span>
            <span className="font-medium text-indigo-700">{selectedRole.label}</span>
            <span className="text-indigo-400">·</span>
            <span className="text-indigo-600 truncate max-w-[200px]">{goalText}</span>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[400px] max-h-[520px]">
          {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}

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

          {/* Recipe prompt banner */}
          {showRecipePrompt && !showRecipe && (
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl px-5 py-4 mb-4">
              <div className="font-semibold text-indigo-900 text-sm mb-1">
                I think I have a good picture of your situation.
              </div>
              <div className="text-xs text-indigo-700 mb-3 leading-relaxed">
                Ready to see your personalized data standards recipe? I'll match your context to the right specs, explain why they fit, and give you concrete next steps.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateRecipe}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Show me my standards recipe →
                </button>
                <button
                  onClick={() => setShowRecipePrompt(false)}
                  className="text-xs text-indigo-500 px-3 py-2 hover:text-indigo-700 transition-colors"
                >
                  Keep chatting
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        {!showRecipe && (
          <div className="mt-4 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Reply here… (Enter to send, Shift+Enter for new line)"
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
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              ← Start a new conversation
            </button>
          </div>
        )}
      </div>

      {/* Right: recipe panel (appears after user requests it) */}
      {showRecipe && (
        <div className="lg:w-[400px] flex-shrink-0">
          <RecipePanel
            recipe={recipeLoading ? null : recipe}
            role={selectedRole}
            wantsSkill={wantsSkill}
            onWantsSkill={setWantsSkill}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
