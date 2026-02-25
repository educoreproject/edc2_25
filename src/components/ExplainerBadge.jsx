// ExplainerBadge.jsx — Persistent callout block that shows design rationale.
// Acts as an always-on wireframe note, equivalent to a sticky note in a Figma file.

export default function ExplainerBadge({ children, icon = '💡' }) {
  return (
    <div className="flex gap-2.5 items-start bg-amber-50/60 border-l-3 border-amber-400 rounded-r-lg px-3.5 py-2.5 text-xs text-amber-800 my-3 leading-relaxed">
      <span className="text-base flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
