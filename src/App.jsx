// App.jsx — Root component for the EDU Working Reference Library.
// Wires together the page-level router and shared header/footer.

import { useState } from 'react';
import SiteHeader from './components/SiteHeader';
import LibraryPage from './components/LibraryPage';
import PddPage from './components/PddPage';
import StandardsPage from './components/StandardsPage';
import PartnersPage from './components/PartnersPage';
import CedsAlignmentPage from './components/CedsAlignmentPage';
import TaxonomiesPage from './components/TaxonomiesPage';

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
              <div className="hover:text-gray-700 cursor-pointer transition-colors">HR Open Standards</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">T3 Innovation Network</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">W3C Credentials CG</div>
              <div className="hover:text-gray-700 cursor-pointer transition-colors">IMS Global</div>
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
  const [activePage, setActivePage] = useState('library');
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const handleNavigateToEntry = (entryId) => {
    setSelectedEntryId(entryId);
    setActivePage('library');
  };

  const pages = {
    library: (
      <LibraryPage
        selectedEntryId={selectedEntryId}
        onNavigateToEntry={handleNavigateToEntry}
        onClearSelection={() => setSelectedEntryId(null)}
      />
    ),
    pdd: <PddPage showExplainers={true} />,
    standards: <StandardsPage />,
    partners: <PartnersPage />,
    ceds: <CedsAlignmentPage onNavigateToEntry={handleNavigateToEntry} />,
    taxonomies: <TaxonomiesPage />,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 bg-slate-50/50">
        {pages[activePage]}
      </main>

      <Footer />
    </div>
  );
}
