// WireframeBox.jsx — Placeholder block for sections not yet designed.
// The dashed border is the standard convention for "this will be designed later."

export default function WireframeBox({ label, className = '', height = 'h-32', children }) {
  return (
    <div className={`border border-dashed border-gray-300 rounded-xl ${height} flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 text-xs font-mono ${className}`}>
      {children || (
        <span className="text-center px-4">{label}</span>
      )}
    </div>
  );
}
