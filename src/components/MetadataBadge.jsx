// MetadataBadge.jsx — Renders a single metadata field as a labeled pill/chip.
// Each badge type has a distinct color for pre-attentive scanning.

const configs = {
  burden: {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    medium: 'bg-amber-50 text-amber-700 border-amber-200/60',
    high: 'bg-red-50 text-red-700 border-red-200/60',
  },
  concern: {
    'low-concern': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'medium-concern': 'bg-amber-50 text-amber-700 border-amber-200/60',
    'high-concern': 'bg-red-50 text-red-700 border-red-200/60',
  },
  access: {
    open: 'bg-sky-50 text-sky-700 border-sky-200/60',
    restricted: 'bg-gray-100 text-gray-600 border-gray-200/60',
  },
  status: {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'under-review': 'bg-amber-50 text-amber-700 border-amber-200/60',
    deprecated: 'bg-gray-100 text-gray-500 border-gray-200/60',
  },
  type: {
    default: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  },
  privacy: {
    'high-concern':   'bg-rose-50 text-rose-700 border-rose-200/60',
    'medium-concern': 'bg-violet-50 text-violet-700 border-violet-200/60',
    'low-concern':    'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  },
  pii: {
    DirectIdentifier:    'bg-rose-100 text-rose-800 border-rose-300/60',
    EducationalRecord:   'bg-orange-50 text-orange-700 border-orange-200/60',
    BiographicData:      'bg-amber-50 text-amber-700 border-amber-200/60',
    BehavioralData:      'bg-amber-50 text-amber-700 border-amber-200/60',
    AssessmentResult:    'bg-orange-50 text-orange-700 border-orange-200/60',
    CredentialMetadata:  'bg-violet-50 text-violet-700 border-violet-200/60',
    InstitutionalHistory:'bg-violet-50 text-violet-700 border-violet-200/60',
    public:              'bg-gray-50 text-gray-500 border-gray-200/60',
  },
};

export default function MetadataBadge({ kind, value, label }) {
  const palette = configs[kind]?.[value] || configs.type.default;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${palette}`}>
      {label || value}
    </span>
  );
}
