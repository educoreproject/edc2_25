// SiteHeader.jsx — Global navigation for the EDU Working Reference Library.
// WHY IT EXISTS: The library is a "source of truth" for multiple stakeholder
// types (implementers, partners, AI/analytics systems). The header must surface
// the top-level navigation zones instantly so any stakeholder can orient
// themselves in under 5 seconds — a core usability goal for public benefit sites.

export default function SiteHeader({ activePage, onNavigate }) {
  const navItems = [
    { id: 'library',   label: 'Library' },
    { id: 'pdd',       label: 'Product Description' },
    { id: 'standards', label: 'Standards' },
    { id: 'partners',  label: 'Partners' },
    { id: 'ceds',      label: 'CEDS Alignment' },
    { id: 'taxonomies', label: 'Taxonomies' },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top identity bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
              EDU
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm leading-tight">Reference Library</div>
              <div className="text-xs text-gray-400">Education Data Unlimited</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1.5">
              <span>🤖</span> AI Query
            </button>
            <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1.5">
              <span>🔔</span> Alerts
            </button>
            <button className="bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 hover:bg-indigo-700 transition-colors font-medium shadow-sm">
              Sign In
            </button>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="flex gap-0.5 -mb-px">
          {navItems.map(item => (
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
      </div>
    </header>
  );
}
