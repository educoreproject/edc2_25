import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 py-10" style={{ background: '#072A6C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm mb-10">
          <div>
            <div className="font-semibold mb-3 text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Explore</div>
            <div className="space-y-2.5">
              <Link href="/drivers" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Business Drivers</Link>
              <Link href="/use-cases" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Use Cases</Link>
              <Link href="/standards" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Standards</Link>
              <Link href="/explorer" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Data Model Explorer</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3 text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Reference</div>
            <div className="space-y-2.5">
              <Link href="/alignment" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>CEDS Alignment</Link>
              <Link href="/crosswalk" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Field Crosswalk</Link>
              <Link href="/ontology" className="block transition-colors text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Ontology Graph</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3 text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Standards Bodies</div>
            <div className="space-y-2.5">
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>1EdTech Consortium</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Credential Engine</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>T3 Innovation Network</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>CEDS</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3 text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>About</div>
            <div className="space-y-2.5">
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>EDU Mission</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>DSU Principles</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Contact</div>
            </div>
          </div>
        </div>
        <div className="pt-6 flex items-center justify-between text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold"
              style={{ background: 'rgba(0,181,184,0.2)', color: '#5EEAED' }}
            >
              E
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>Education Data Unlimited &middot; Reference Library</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>&copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
