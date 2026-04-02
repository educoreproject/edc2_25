// useCaseTaxonomy.js — Hierarchical use case taxonomy for the EDU Reference Library.
// Maps use cases to GitHub issues at educoreproject/educore_use_cases.

export const useCaseTaxonomy = [
  {
    id: 'all-learning-counts',
    label: 'All Learning Counts',
    subtitle: 'Every learning experience, skill, and credential recognized and portable.',
    icon: '🎓',
    color: 'indigo',
    children: [
      {
        id: 'ler-issuing',
        label: 'LER Issuing',
        children: [
          { id: 'ler-issuing-general', label: 'LER Issuing', githubIssue: 2 },
          { id: 'k12-after-school', label: 'K12 After School Program Recognition' },
          { id: 'slds-issuance', label: 'Education Records Issuance from SLDS', githubIssue: 6 },
          { id: 'workforce-training', label: 'Workforce Training Recognition', githubIssue: 4 },
          { id: 'military-transition', label: 'Military Transition to Civilian Life' },
          { id: 'employment-records', label: 'Employment Records' },
          { id: 'volunteer-records', label: 'Volunteer Service Records' },
          { id: 'vaccination-records', label: 'Health Care: Self-Sovereign Vaccination Records' },
          { id: 'allergy-records', label: 'Health Care: Allergy & Medical Alert Records' },
          { id: 'health-worker-recognition', label: 'Health Care: Health Worker Learning & Development Recognition' },
        ],
      },
      {
        id: 'ler-verifying',
        label: 'LER Verifying',
        children: [
          { id: 'ler-verification-general', label: 'LER Verification', githubIssue: 3 },
          { id: 'program-qualification', label: 'Program Qualification (using verifiable employment and volunteer records)', githubIssue: 7 },
          { id: 'community-college-app', label: 'Community College Application' },
          { id: 'job-application', label: 'Job Application' },
          { id: 'endorsement-trust', label: 'Endorsement and Progressive Trust of Credentials' },
        ],
      },
    ],
  },
  {
    id: 'ai-empowered-learning',
    label: 'AI-Empowered Learning',
    subtitle: 'Helping learning happen for every learner in any context.',
    icon: '🤖',
    color: 'sky',
    children: [
      {
        id: 'ai-learning-general',
        label: 'AI-Empowered Lifelong Learning',
        children: [
          { id: 'ai-lifelong-learning', label: 'AI-Empowered Lifelong Learning (general)', githubIssue: 14 },
          { id: 'ai-early-learning', label: 'Early Learning' },
          { id: 'ai-k12', label: 'K12' },
          { id: 'ai-postsecondary', label: 'Postsecondary' },
          { id: 'ai-workforce', label: 'Workforce', tag: 'tagged by industry if applicable' },
        ],
      },
      {
        id: 'ai-specialized',
        label: 'Specialized AI Learning',
        children: [
          { id: 'career-navigation', label: 'Career Navigation & Advising', githubIssue: 15 },
          { id: 'health-worker-learning', label: 'Health Care: Health Worker Learning & Development Optimization' },
          { id: 'advanced-manufacturing', label: 'Advanced Manufacturing' },
          { id: 'military-learning', label: 'Military: Learning, Development, & Training Optimization' },
          { id: 'ai-ed-research', label: 'AI-Empowered Education Research & Evaluation', githubIssue: 11 },
        ],
      },
    ],
  },
  {
    id: 'government-administrative',
    label: 'Government & Administrative',
    subtitle: 'Education and workforce systems administration and optimization.',
    icon: '🏛️',
    color: 'amber',
    children: [
      {
        id: 'compliance-reporting',
        label: 'State & Federal Compliance Reporting',
        children: [
          { id: 'compliance-general', label: 'State & Federal Compliance Reporting' },
          { id: 'edfacts-fs002', label: 'edFACTS FS002 — Child Count', githubIssue: 5 },
          { id: 'edfacts-general', label: 'Federal K-12 EDFacts Reporting', githubIssue: 1 },
        ],
      },
      {
        id: 'sedm-use-cases',
        label: 'SEDM Use Cases',
        children: [
          { id: 'sedm-general', label: 'SEDM Use Cases (general)' },
        ],
      },
      {
        id: 'jedx-use-cases',
        label: 'JEDx Use Cases',
        children: [
          { id: 'jedx-general', label: 'JEDx Use Cases (general)' },
        ],
      },
      {
        id: 'ndp-use-cases',
        label: 'NDP Use Cases',
        children: [
          { id: 'ndp-general', label: 'NDP Use Cases (general)' },
        ],
      },
      {
        id: 'operations-decision',
        label: 'Operations & Decision Support',
        children: [
          { id: 'school-ops', label: 'School Operations Data' },
          { id: 'eval-what-works', label: 'Evaluation of What Works' },
          { id: 'decision-policy', label: 'Decision Support: Policy' },
          { id: 'decision-programs', label: 'Decision Support: Programs' },
          { id: 'decision-practices', label: 'Decision Support: Practices' },
          { id: 'support-state-gov', label: 'Support State Government Functions' },
          { id: 'support-local-gov', label: 'Support Local Government Functions' },
          { id: 'structured-fed-data', label: 'Structured Federal Government Data to Inform AI', githubIssue: 10 },
        ],
      },
    ],
  },
  {
    id: 'health-care',
    label: 'Health Care',
    subtitle: 'Clinical research enclaves and health-related learning and credentialing.',
    icon: '🏥',
    color: 'emerald',
    children: [
      {
        id: 'clinical-research',
        label: 'Clinical Research Enclaves',
        children: [
          { id: 'clinical-research-general', label: 'Clinical Research Enclaves' },
        ],
      },
      {
        id: 'health-credentials',
        label: 'Health Worker Credentials & Records',
        description: 'See also: related use cases under All Learning Counts and AI-Empowered Learning.',
        children: [
          { id: 'health-vaccination-records', label: 'Self-Sovereign Vaccination Records', relatedId: 'vaccination-records' },
          { id: 'health-allergy-records', label: 'Allergy & Medical Alert Records', relatedId: 'allergy-records' },
          { id: 'health-worker-dev', label: 'Health Worker Learning & Development', relatedId: 'health-worker-recognition' },
        ],
      },
    ],
  },
];

// ─── Use Case → CEDS Domain Mapping ─────────────────────────────────────────
// Maps each leaf use case ID to the CEDS domains it touches.

export const useCaseCedsDomains: Record<string, string[]> = {
  // All Learning Counts → LER Issuing
  'ler-issuing-general':        ['credentials'],
  'k12-after-school':           ['k12', 'credentials'],
  'slds-issuance':              ['k12', 'postsecondary', 'credentials'],
  'workforce-training':         ['workforce', 'credentials'],
  'military-transition':        ['workforce', 'credentials', 'competencies'],
  'employment-records':         ['workforce'],
  'volunteer-records':          ['workforce', 'credentials'],
  'vaccination-records':        ['credentials'],
  'allergy-records':            ['credentials'],
  'health-worker-recognition':  ['credentials', 'competencies', 'workforce'],

  // All Learning Counts → LER Verifying
  'ler-verification-general':   ['credentials', 'authN'],
  'program-qualification':      ['credentials', 'workforce'],
  'community-college-app':      ['postsecondary', 'credentials'],
  'job-application':            ['workforce', 'credentials', 'competencies'],
  'endorsement-trust':          ['credentials', 'authN'],

  // AI-Empowered Learning → General
  'ai-lifelong-learning':       ['competencies', 'learningResources'],
  'ai-early-learning':          ['earlyLearning', 'learningResources', 'competencies'],
  'ai-k12':                     ['k12', 'learningResources', 'competencies', 'assessments'],
  'ai-postsecondary':           ['postsecondary', 'learningResources', 'competencies'],
  'ai-workforce':               ['workforce', 'competencies', 'learningResources'],

  // AI-Empowered Learning → Specialized
  'career-navigation':          ['workforce', 'competencies', 'credentials'],
  'health-worker-learning':     ['workforce', 'competencies', 'learningResources'],
  'advanced-manufacturing':     ['workforce', 'cte', 'competencies'],
  'military-learning':          ['workforce', 'competencies', 'learningResources'],
  'ai-ed-research':             ['assessments', 'learningResources', 'implVars'],

  // Government & Administrative → Compliance
  'compliance-general':         ['k12', 'implVars'],
  'edfacts-fs002':              ['k12', 'implVars'],
  'edfacts-general':            ['k12', 'implVars'],

  // Government & Administrative → SEDM / JEDx / NDP
  'sedm-general':               ['k12', 'postsecondary', 'implVars'],
  'jedx-general':               ['workforce', 'implVars'],
  'ndp-general':                ['k12', 'postsecondary', 'implVars'],

  // Government & Administrative → Operations
  'school-ops':                 ['k12', 'facilities', 'implVars'],
  'eval-what-works':            ['assessments', 'implVars'],
  'decision-policy':            ['implVars'],
  'decision-programs':          ['implVars'],
  'decision-practices':         ['implVars'],
  'support-state-gov':          ['k12', 'postsecondary', 'implVars'],
  'support-local-gov':          ['k12', 'implVars'],
  'structured-fed-data':        ['implVars', 'k12', 'postsecondary', 'workforce'],

  // Health Care
  'clinical-research-general':  ['implVars'],
  'health-vaccination-records': ['credentials'],
  'health-allergy-records':     ['credentials'],
  'health-worker-dev':          ['credentials', 'competencies', 'workforce'],
};

// Helper: flatten all leaf use cases
export function getAllUseCases() {
  const cases: Array<Record<string, string | number | undefined>> = [];
  useCaseTaxonomy.forEach(cat => {
    cat.children.forEach(sub => {
      sub.children.forEach(uc => {
        cases.push({ ...uc, categoryId: cat.id, subcategoryId: sub.id });
      });
    });
  });
  return cases;
}

// Helper: count use cases per category
export function countUseCases(categoryId: string) {
  const cat = useCaseTaxonomy.find(c => c.id === categoryId);
  if (!cat) return 0;
  return cat.children.reduce((sum, sub) => sum + sub.children.length, 0);
}
