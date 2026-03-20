// App.jsx — Root component for the EDU Working Reference Library.
// Manages page-level routing and the three UI modes:
//   classic   → full library browser with filters, AI mapper, and sub-pages
//   usecases  → GitHub-issues-driven use case browser
//   chat      → conversational standards discovery advisor

import { useState } from 'react';
import SiteHeader from './components/SiteHeader';
import LibraryPage from './components/LibraryPage';
import StandardsPage from './components/StandardsPage';
import PartnersPage from './components/PartnersPage';
import CedsAlignmentPage from './components/CedsAlignmentPage';
import TaxonomiesPage from './components/TaxonomiesPage';
import VocabularyPage from './components/VocabularyPage';
import UseCasesPage from './components/UseCasesPage';
import ChatPage from './components/ChatPage';

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm text-gray-500 mb-8">
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Reference Library</div>
            <div className="space-y-2">
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Browse Standards</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Partner Agreements</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Submit a Resource</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">API Documentation</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Governance</div>
            <div className="space-y-2">
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Review Process</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Metadata Schema</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Openness Policy</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Equity Review Board</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Standards Bodies</div>
            <div className="space-y-2">
              <div className="hover:text-gray-700 cursor-pointer transition-colors">1EdTech Consortium</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Credential Engine</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">T3 Innovation Network</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">CEDS</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">About</div>
            <div className="space-y-2">
              <div className="hover:text-gray-700 cursor-pointer transition-colors">EDU Mission</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">DSU Principles</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Gates Foundation</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Contact</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200/60 pt-5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded flex items-center justify-center text-white text-[8px] font-bold">E</div>
            <span>Education Data Unlimited · Reference Library</span>
          </div>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  // UI mode: which top-level experience is active
  const [uiMode,          setUiMode]          = useState('classic'); // 'classic' | 'usecases' | 'chat'

  // Classic-mode sub-page routing
  const [activePage,      setActivePage]      = useState('library');
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [pendingActivation, setPendingActivation] = useState(null);

  function handleNavigateToEntry(entryId) {
    setSelectedEntryId(entryId);
    setActivePage('library');
    if (uiMode !== 'classic') setUiMode('classic');
  }

  function handleActivateNeeds(stakeholderIds, useCaseIds) {
    setPendingActivation({ stakeholderIds, useCaseIds });
  }

  function handleGoToRoadmap() {
    setActivePage('taxonomies');
  }

  // Switching UI mode resets classic sub-page to library
  function handleSetUiMode(mode) {
    setUiMode(mode);
    if (mode === 'classic') setActivePage('library');
  }

  // Classic sub-pages
  const classicPages = {
    library: (
      <LibraryPage
        selectedEntryId={selectedEntryId}
        onNavigateToEntry={handleNavigateToEntry}
        onClearSelection={() => setSelectedEntryId(null)}
        onActivateNeeds={handleActivateNeeds}
        hasPendingRoadmap={!!pendingActivation}
        onGoToRoadmap={handleGoToRoadmap}
      />
    ),
    standards:  <StandardsPage onNavigateToEntry={handleNavigateToEntry} />,
    partners:   <PartnersPage />,
    ceds:       <CedsAlignmentPage onNavigateToEntry={handleNavigateToEntry} />,
    taxonomies: (
      <TaxonomiesPage
        onNavigateToEntry={handleNavigateToEntry}
        pendingActivation={pendingActivation}
        onClearActivation={() => setPendingActivation(null)}
      />
    ),
    vocabulary: <VocabularyPage />,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader
        uiMode={uiMode}
        onSetUiMode={handleSetUiMode}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="flex-1 bg-slate-50/50">
        {uiMode === 'classic'   && classicPages[activePage]}
        {uiMode === 'usecases'  && <UseCasesPage onNavigateToEntry={handleNavigateToEntry} />}
        {uiMode === 'chat'      && <ChatPage />}
      </main>

      <Footer />
    </div>
  );
}
