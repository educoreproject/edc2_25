import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm text-gray-500 mb-8">
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Explore</div>
            <div className="space-y-2">
              <Link href="/drivers" className="block hover:text-gray-700 transition-colors">Business Drivers</Link>
              <Link href="/use-cases" className="block hover:text-gray-700 transition-colors">Use Cases</Link>
              <Link href="/standards" className="block hover:text-gray-700 transition-colors">Standards</Link>
              <Link href="/explorer" className="block hover:text-gray-700 transition-colors">Data Model Explorer</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Reference</div>
            <div className="space-y-2">
              <Link href="/alignment" className="block hover:text-gray-700 transition-colors">CEDS Alignment</Link>
              <Link href="/crosswalk" className="block hover:text-gray-700 transition-colors">Field Crosswalk</Link>
              <Link href="/ontology" className="block hover:text-gray-700 transition-colors">Ontology Graph</Link>
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
              <div className="hover:text-gray-700 cursor-pointer transition-colors">Contact</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200/60 pt-5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded flex items-center justify-center text-white text-[8px] font-bold">E</div>
            <span>Education Data Unlimited &middot; Reference Library</span>
          </div>
          <span>&copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
