// SiteHeader.jsx — Global navigation with three-mode UI toggle.
// Modes: classic (full library), usecases (GitHub issues), taxonomy (use case taxonomy), chat (conversational advisor)

const UI_MODES = [
  { id: 'classic',   label: 'Classic Library', icon: '📚', shortLabel: 'Classic' },
  { id: 'usecases',  label: 'Use Cases',        icon: '🎯', shortLabel: 'Use Cases' },
  { id: 'taxonomy',  label: 'Use Case Taxonomy', icon: '🗂️', shortLabel: 'Taxonomy' },
  { id: 'chat',      label: 'Chat Advisor',     icon: '💬', shortLabel: 'Chat' },
];

const CLASSIC_NAV = [
  { id: 'library',    label: 'Library' },
  { id: 'taxonomies', label: 'Needs Explorer' },
  { id: 'standards',  label: 'Standards' },
  { id: 'partners',   label: 'Partners' },
  { id: 'ceds',       label: 'CEDS Alignment' },
  { id: 'vocabulary', label: 'Ontology' },
];

export default function SiteHeader({ uiMode, onSetUiMode, activePage, onNavigate }) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top identity + mode toggle bar */}
        <div className="flex items-center justify-between py-3 gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/educore-logo.png" alt="EDUcore" className="w-9 h-9 object-contain" />
            <div className="hidden sm:block">
              <div className="font-semibold text-gray-900 text-sm leading-tight">Reference Library</div>
              <div className="text-xs text-gray-400">Education Data Unlimited</div>
            </div>
          </div>

          {/* Mode toggle — segmented control */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
            {UI_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => onSetUiMode(mode.id)}
                title={mode.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  uiMode === mode.id
                    ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="text-sm">{mode.icon}</span>
                <span className="hidden sm:inline">{mode.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 text-xs flex-shrink-0">
            <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors hidden sm:flex items-center gap-1.5">
              <span>🔔</span> Alerts
            </button>
            <button className="bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 hover:bg-indigo-700 transition-colors font-medium shadow-sm">
              Sign In
            </button>
          </div>
        </div>

        {/* Sub-navigation: only shown in classic mode */}
        {uiMode === 'classic' && (
          <nav className="flex gap-0.5 -mb-px">
            {CLASSIC_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative
                  ${activePage === item.id
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-900'}`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
            <div className="ml-auto flex items-center pb-2">
              <span className="text-xs text-gray-400">Last updated Feb 25, 2026</span>
            </div>
          </nav>
        )}

        {/* Mode-specific sub-header (use cases / chat) */}
        {uiMode === 'usecases' && (
          <div className="flex items-center gap-2 pb-2.5 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Use Case Explorer</span>
            <span className="text-gray-300">·</span>
            <a
              href="https://github.com/educoreproject/educore_use_cases/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              github.com/educoreproject/educore_use_cases
            </a>
            <span className="ml-auto text-gray-400">Live from GitHub Issues</span>
          </div>
        )}

        {uiMode === 'taxonomy' && (
          <div className="flex items-center gap-2 pb-2.5 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Use Case Taxonomy</span>
            <span className="text-gray-300">·</span>
            <span>Browse and select use cases across education, workforce, and government systems</span>
            <span className="ml-auto">
              <a
                href="https://github.com/educoreproject/educore_use_cases/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                GitHub Issues
              </a>
            </span>
          </div>
        )}

        {uiMode === 'chat' && (
          <div className="flex items-center gap-2 pb-2.5 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Standards Discovery Advisor</span>
            <span className="text-gray-300">·</span>
            <span>Tell me what you need — I'll find the right standards for you</span>
          </div>
        )}
      </div>
    </header>
  );
}
