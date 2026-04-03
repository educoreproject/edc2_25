import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 px-6" style={{ borderTop: '1px solid rgba(7,42,108,0.05)' }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs" style={{ color: '#7A8499' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold"
            style={{ background: 'rgba(91,63,211,0.1)', color: '#5B3FD3' }}
          >
            E
          </div>
          <span>EDUcore &middot; Reference Library</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/standards" className="hover:underline">Standards</Link>
          <Link href="/ontology" className="hover:underline">Ontology</Link>
          <span>&copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
