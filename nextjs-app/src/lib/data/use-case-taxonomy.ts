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
          { id: 'ler-issuing-general', label: 'LER Issuing', githubIssue: 2, tags: ['LER'] },
          { id: 'k12-after-school', label: 'K12 After School Program Recognition' },
          { id: 'slds-issuance', label: 'Education Records Issuance from SLDS', githubIssue: 6, tags: ['LER'] },
          { id: 'workforce-training', label: 'Workforce Training Recognition', githubIssue: 4, tags: ['LER', 'Workforce'] },
          { id: 'military-transition', label: 'Military Transition to Civilian Life' },
          { id: 'employment-records', label: 'Employment Records' },
          { id: 'volunteer-records', label: 'Volunteer Service Records' },
          { id: 'vaccination-records', label: 'Health Care: Self-Sovereign Vaccination Records' },
          { id: 'allergy-records', label: 'Health Care: Allergy & Medical Alert Records' },
          { id: 'health-worker-recognition', label: 'Health Care: Health Worker Learning & Development Recognition' },
          { id: 'stackable-credentials', label: 'Workforce Readiness & Digital Literacy Recognition Through Stackable Credentials', githubIssue: 32, tags: ['LER', 'Workforce'] },
          { id: 'educator-licensure', label: 'Educator Licensure & Teacher Talent Pipeline Using Wallet-Based LER', githubIssue: 36, tags: ['LER', 'Workforce'] },
          { id: 'military-skill-translation', label: 'Military-to-Civilian Skill Translation for Hiring', githubIssue: 37, tags: ['LER', 'Military'] },
          { id: 'informal-learning', label: 'Recognition of Informal, Community-Based, & Entrepreneurial Learning', githubIssue: 38, tags: ['LER'] },
          { id: 'employer-skill-recognition', label: 'Employer-Issued Skill Recognition for Career Mobility & Portability', githubIssue: 33, tags: ['LER', 'Workforce'] },
        ],
      },
      {
        id: 'ler-verifying',
        label: 'LER Verifying',
        children: [
          { id: 'ler-verification-general', label: 'LER Verification', githubIssue: 3, tags: ['LER'] },
          { id: 'program-qualification', label: 'Program Qualification (using verifiable employment and volunteer records)', githubIssue: 7, tags: ['LER', 'Workforce'] },
          { id: 'community-college-app', label: 'Community College Application' },
          { id: 'job-application', label: 'Job Application' },
          { id: 'endorsement-trust', label: 'Endorsement and Progressive Trust of Credentials' },
          { id: 'skills-based-job-app', label: 'Skills-Based Job Application with a Verifiable LER', githubIssue: 26, tags: ['LER', 'Workforce'] },
          { id: 'program-completion-verification', label: 'Verification of Program Completion & Job Readiness Training', githubIssue: 31, tags: ['LER', 'Workforce'] },
          { id: 'privacy-preserving-access', label: 'Privacy-Preserving & Selectively Disclosed Opportunity Access', githubIssue: 40, tags: ['LER', 'Workforce'] },
        ],
      },
      {
        id: 'ler-wallets',
        label: 'LER Wallets & Digital Credentials',
        children: [
          { id: 'digital-wallet-storage', label: 'Digital Wallet Storage, Control, and Selective Sharing of LERs', githubIssue: 25, tags: ['LER', 'Workforce'] },
          { id: 'digital-wallets-vc', label: 'Digital Wallets & Verifiable Credentials', githubIssue: 12, tags: ['LER'] },
        ],
      },
      {
        id: 'ler-workforce',
        label: 'Workforce LER Applications',
        children: [
          { id: 'resume-to-ler', label: 'Resume-to-Structured LER Conversion for Reuse Across Hiring Systems', githubIssue: 27, tags: ['LER', 'Workforce'] },
          { id: 'passive-candidate-discovery', label: 'Passive Candidate Discovery and Employer Matching Using an LER', githubIssue: 28, tags: ['LER', 'Workforce'] },
          { id: 'career-pathway-navigation', label: 'Career Pathway Navigation & Opportunity Discovery Using an LER', githubIssue: 29, tags: ['LER', 'Workforce'] },
          { id: 'job-board-ats-transfer', label: 'Job Board-to-ATS Transfer for Partial Application Completion', githubIssue: 30, tags: ['LER', 'Workforce'] },
          { id: 'inclusive-ler-support', label: 'Inclusive LER Support for Nonlinear & Marginalized Worker Journeys', githubIssue: 34, tags: ['LER', 'Workforce'] },
          { id: 'regional-ler-ecosystem', label: 'State or Regional LER Ecosystem for Talent Pipelines & Pathway Coordination', githubIssue: 35, tags: ['LER', 'Workforce'] },
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
          { id: 'career-navigation', label: 'Career Navigation & Advising', githubIssue: 15, tags: ['Workforce'] },
          { id: 'health-worker-learning', label: 'Health Care: Health Worker Learning & Development Optimization' },
          { id: 'advanced-manufacturing', label: 'Advanced Manufacturing' },
          { id: 'military-learning', label: 'Military: Learning, Development, & Training Optimization' },
          { id: 'ai-ed-research', label: 'AI-Empowered Education Research & Evaluation', githubIssue: 11 },
          { id: 'ai-evaluations-outcomes', label: 'Connecting AI Evaluations to Educational Outcomes', githubIssue: 11 },
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
          { id: 'edfacts-fs002', label: 'edFACTS FS002 — Child Count', githubIssue: 5, tags: ['Administration / Operations'] },
          { id: 'edfacts-general', label: 'Federal K-12 EDFacts Reporting', githubIssue: 1, tags: ['Administration / Operations'] },
          { id: 'granular-statistical-reports', label: 'Produce Granular & Timely Government Statistical Reports (6.1)', githubIssue: 23 },
        ],
      },
      {
        id: 'unemployment-workforce-data',
        label: 'Unemployment & Workforce Data Systems',
        children: [
          { id: 'ui-benefit-payments', label: 'Initial and Ongoing Unemployment Insurance Benefit Payments (1.1)', githubIssue: 16 },
          { id: 'ui-reemployment', label: 'Reemployment of UI Benefit Recipients (1.2)', githubIssue: 18 },
          { id: 'hr-analytics-recruitment', label: 'Benchmarking HR Analytics and Talent Recruitment & Management (2.1)', githubIssue: 19 },
          { id: 'compensation-career-guidance', label: 'Benchmarking Compensation and Career Guidance & Job Search Services (3.1)', githubIssue: 20 },
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
          { id: 'employment-outcomes', label: 'Improving Employment Outcomes Data for Program Management (4.1)', githubIssue: 21 },
          { id: 'supply-demand-analysis', label: 'Supply-Demand Analysis to Align Education & Workforce Investment (5.1)', githubIssue: 22 },
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
      {
        id: 'human-services',
        label: 'Human Services',
        children: [
          { id: 'guardianship-consent', label: 'Guardianship & Consent Credentials for Education & Human Services', githubIssue: 39, tags: ['LER', 'Human Services'] },
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

  // All Learning Counts → LER Wallets & Digital Credentials
  'digital-wallet-storage':     ['credentials', 'authN'],
  'digital-wallets-vc':         ['credentials', 'authN'],

  // All Learning Counts → Workforce LER Applications
  'resume-to-ler':              ['workforce', 'credentials', 'competencies'],
  'passive-candidate-discovery': ['workforce', 'credentials', 'competencies'],
  'career-pathway-navigation':  ['workforce', 'competencies', 'credentials'],
  'job-board-ats-transfer':     ['workforce', 'credentials'],
  'inclusive-ler-support':      ['workforce', 'credentials', 'competencies'],
  'regional-ler-ecosystem':     ['workforce', 'credentials', 'k12', 'postsecondary'],

  // All Learning Counts → New LER Issuing entries
  'stackable-credentials':     ['credentials', 'workforce', 'competencies'],
  'educator-licensure':        ['credentials', 'k12', 'workforce'],
  'military-skill-translation': ['workforce', 'credentials', 'competencies'],
  'informal-learning':         ['credentials', 'competencies'],
  'employer-skill-recognition': ['workforce', 'credentials', 'competencies'],

  // All Learning Counts → New LER Verifying entries
  'skills-based-job-app':      ['workforce', 'credentials', 'competencies'],
  'program-completion-verification': ['workforce', 'credentials'],
  'privacy-preserving-access': ['credentials', 'authN', 'workforce'],

  // AI-Empowered Learning → New
  'ai-evaluations-outcomes':   ['assessments', 'learningResources', 'implVars'],

  // Government & Administrative → Unemployment & Workforce Data
  'ui-benefit-payments':       ['workforce', 'implVars'],
  'ui-reemployment':           ['workforce', 'implVars'],
  'hr-analytics-recruitment':  ['workforce', 'implVars'],
  'compensation-career-guidance': ['workforce', 'implVars'],
  'granular-statistical-reports': ['implVars', 'k12', 'postsecondary', 'workforce'],
  'employment-outcomes':       ['workforce', 'implVars'],
  'supply-demand-analysis':    ['workforce', 'implVars', 'postsecondary'],

  // Health Care → Human Services
  'guardianship-consent':      ['credentials', 'authN', 'k12'],

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
