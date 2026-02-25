// Annotation.jsx — The "sticky note" callout used throughout this low-fi mockup.
// WHY IT EXISTS: Low-fidelity prototypes need inline rationale so stakeholders
// understand design decisions without a separate deck. These annotations replace
// what would be red-marker notes on a paper sketch.

export default function Annotation({ children, position = 'right' }) {
  const posClasses = {
    right: 'left-full ml-3 top-0',
    bottom: 'top-full mt-3 left-0',
    left: 'right-full mr-3 top-0',
    top: 'bottom-full mb-3 left-0',
  };

  return (
    <span className="relative inline-block group">
      <span className="absolute z-50 hidden group-hover:block w-64 bg-amber-50 border-2 border-amber-300 rounded-lg p-3 shadow-lg text-xs text-amber-900 leading-relaxed pointer-events-none"
            style={{ ...posClasses[position] && {}, ...(position === 'right' ? { left: '100%', marginLeft: '0.75rem', top: 0 } : position === 'bottom' ? { top: '100%', marginTop: '0.75rem', left: 0 } : position === 'left' ? { right: '100%', marginRight: '0.75rem', top: 0 } : { bottom: '100%', marginBottom: '0.75rem', left: 0 }) }}>
        <span className="font-bold text-amber-700 block mb-1">Why this is here:</span>
        {children}
      </span>
    </span>
  );
}
