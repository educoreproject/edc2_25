const palettes: Record<string, Record<string, string>> = {
  burden: {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  },
  status: {
    full: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partial: 'bg-amber-50 text-amber-700 border-amber-200',
    gap: 'bg-red-50 text-red-700 border-red-200',
  },
  concern: {
    'low-concern': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'medium-concern': 'bg-amber-50 text-amber-700 border-amber-200',
    'high-concern': 'bg-red-50 text-red-700 border-red-200',
  },
  access: {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    restricted: 'bg-amber-50 text-amber-700 border-amber-200',
    closed: 'bg-red-50 text-red-700 border-red-200',
  },
};

const icons: Record<string, Record<string, string>> = {
  burden: { low: '🟢', medium: '🟡', high: '🔴' },
  status: { full: '🟢', partial: '🟡', gap: '🔴' },
};

export default function MetadataBadge({
  kind,
  value,
  label,
}: {
  kind: string;
  value: string;
  label?: string;
}) {
  const palette = palettes[kind]?.[value] || 'bg-gray-50 text-gray-600 border-gray-200';
  const icon = icons[kind]?.[value];
  const displayLabel = label || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${palette}`}>
      {icon && <span className="text-[10px]">{icon}</span>}
      {displayLabel}
    </span>
  );
}
