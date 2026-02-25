// taxonomies.js — Structured taxonomies for stakeholders, shared technical
// resources/standards, and use cases mapped to CEDS RDF domains.
//
// Each taxonomy is organized hierarchically with searchable business needs
// attached to stakeholder entries and CEDS RDF URIs on use cases.

// ─── Stakeholders Taxonomy ───────────────────────────────────────────────────

export const stakeholderTaxonomy = [
  {
    id: 'education-institutions',
    label: 'Education Institutions',
    icon: '🏫',
    children: [
      {
        id: 'k12-districts',
        label: 'K–12 Districts',
        businessNeeds: [
          'Student transcript portability across districts',
          'Standards-aligned credential issuance for graduates',
          'FERPA-compliant data sharing with workforce partners',
          'Competency-based progress tracking aligned to state standards',
        ],
      },
      {
        id: 'higher-education',
        label: 'Higher Education Institutions',
        businessNeeds: [
          'Digital diploma and credential issuance',
          'Prior learning assessment and credit transfer',
          'Employer-aligned competency mapping for programs',
          'Interoperable learner records for transfer students',
        ],
      },
      {
        id: 'cte-programs',
        label: 'Career & Technical Education (CTE) Programs',
        businessNeeds: [
          'Industry-recognized credential alignment',
          'Work-based learning documentation',
          'Pathway completion tracking across institutions',
          'Employer validation of CTE skill outcomes',
        ],
      },
      {
        id: 'adult-education',
        label: 'Adult Education Providers',
        businessNeeds: [
          'GED/HiSET credential portability',
          'Workforce readiness skill documentation',
          'Bridge program outcome tracking',
          'Non-traditional learner identity management',
        ],
      },
    ],
  },
  {
    id: 'workforce-employers',
    label: 'Workforce & Employers',
    icon: '💼',
    children: [
      {
        id: 'industry-partners',
        label: 'Industry Partners & Employers',
        businessNeeds: [
          'Verify candidate credentials without contacting issuers',
          'Map internal job requirements to standardized skill taxonomies',
          'Reduce time-to-hire through trusted credential verification',
          'Access talent pipeline data from education partners',
        ],
      },
      {
        id: 'staffing-agencies',
        label: 'Staffing & Workforce Agencies',
        businessNeeds: [
          'Portable skill profiles for candidate placement',
          'Automated credential verification at scale',
          'Cross-sector competency matching',
          'Workforce analytics on skill supply and demand',
        ],
      },
      {
        id: 'professional-associations',
        label: 'Professional Associations',
        businessNeeds: [
          'Industry certification standards alignment',
          'Continuing education credit tracking',
          'Member credential portfolio management',
          'Cross-association credential recognition',
        ],
      },
    ],
  },
  {
    id: 'technology-providers',
    label: 'Technology Providers',
    icon: '💻',
    children: [
      {
        id: 'edtech-vendors',
        label: 'EdTech Vendors',
        businessNeeds: [
          'Standards-compliant API integration for credential exchange',
          'Interoperable data schemas for multi-platform deployments',
          'Privacy-by-design architecture guidance',
          'AI/ML model training compliance for education data',
        ],
      },
      {
        id: 'lms-providers',
        label: 'LMS & SIS Providers',
        businessNeeds: [
          'CEDS-aligned data export/import',
          'Competency-based grading schema support',
          'Credential issuance plugin architecture',
          'Learner record interoperability across systems',
        ],
      },
      {
        id: 'credentialing-platforms',
        label: 'Credentialing & Wallet Platforms',
        businessNeeds: [
          'W3C Verifiable Credential issuance and verification',
          'DID-based identity infrastructure',
          'Selective disclosure and zero-knowledge proof support',
          'Cross-platform credential portability',
        ],
      },
    ],
  },
  {
    id: 'government-policy',
    label: 'Government & Policy',
    icon: '🏛️',
    children: [
      {
        id: 'federal-agencies',
        label: 'Federal Agencies (ED, DOL)',
        businessNeeds: [
          'National education data standards compliance monitoring',
          'Workforce development outcome measurement',
          'Cross-agency data interoperability',
          'Privacy regulation enforcement support (FERPA/COPPA)',
        ],
      },
      {
        id: 'state-education-agencies',
        label: 'State Education Agencies (SEAs)',
        businessNeeds: [
          'Statewide longitudinal data system integration',
          'CEDS-compliant reporting to federal systems',
          'Credential registry and recognition frameworks',
          'Cross-district data exchange governance',
        ],
      },
      {
        id: 'local-education-agencies',
        label: 'Local Education Agencies (LEAs)',
        businessNeeds: [
          'Student data system interoperability',
          'Community workforce partner data sharing',
          'Family engagement portal standards',
          'Equitable access monitoring and reporting',
        ],
      },
    ],
  },
  {
    id: 'standards-bodies',
    label: 'Standards Bodies & Consortia',
    icon: '📐',
    children: [
      {
        id: 'credential-engine',
        label: 'Credential Engine',
        businessNeeds: [
          'CTDL vocabulary adoption and credential transparency',
          'Credential Registry publishing and discovery',
          'Cross-standard alignment with 1EdTech specs',
          'Community of practice for credential transparency',
        ],
      },
      {
        id: 'w3c-credentials',
        label: 'W3C Credentials Community Group',
        businessNeeds: [
          'Verifiable Credentials adoption in education',
          'DID method interoperability testing',
          'Education-specific VC profile development',
          'Privacy-preserving verification standards',
        ],
      },
      {
        id: 't3-innovation',
        label: 'T3 Innovation Network',
        businessNeeds: [
          'LER ecosystem coordination and adoption',
          'Interoperability testing and certification',
          'Employer engagement in credential trust frameworks',
          'Open-source reference implementations',
        ],
      },
      {
        id: 'ims-1edtech',
        label: '1EdTech (formerly IMS Global)',
        businessNeeds: [
          'Open Badges and CLR alignment',
          'LTI and CASE standard coordination',
          'EdTech interoperability certification',
          'Comprehensive Learner Record adoption',
        ],
      },
    ],
  },
  {
    id: 'learners-advocates',
    label: 'Learners & Advocates',
    icon: '🎓',
    children: [
      {
        id: 'learner-advocates',
        label: 'Learner Advocacy Organizations',
        businessNeeds: [
          'Learner data ownership and consent transparency',
          'Equitable access to credential infrastructure',
          'Multilingual and accessible credential interfaces',
          'Protection against algorithmic bias in skill assessment',
        ],
      },
      {
        id: 'community-organizations',
        label: 'Community-Based Organizations',
        businessNeeds: [
          'Low-barrier credential access for underserved populations',
          'Non-traditional learning recognition and validation',
          'Workforce readiness program credential portability',
          'Digital literacy support for credential management',
        ],
      },
    ],
  },
  {
    id: 'research-academia',
    label: 'Research & Academia',
    icon: '🔬',
    children: [
      {
        id: 'university-research',
        label: 'University Research Centers',
        businessNeeds: [
          'Access to de-identified education and workforce data',
          'Standards landscape analysis and gap identification',
          'Longitudinal outcome studies across credential types',
          'Interoperability evaluation frameworks',
        ],
      },
      {
        id: 'think-tanks',
        label: 'Policy Think Tanks & Evaluation Firms',
        businessNeeds: [
          'Ecosystem adoption metrics and benchmarks',
          'ROI analysis of credential interoperability',
          'Equity impact assessment of data standards',
          'Cross-sector comparative analysis',
        ],
      },
    ],
  },
];

// ─── Shared Technical Resources & Standards Taxonomy ─────────────────────────

export const technicalResourcesTaxonomy = [
  {
    id: 'data-standards',
    label: 'Data Standards & Schemas',
    icon: '📊',
    children: [
      {
        id: 'ceds',
        label: 'Common Education Data Standards (CEDS)',
        url: 'https://ceds.ed.gov',
        description: 'National collaborative effort to develop voluntary, common data standards for P–20W education.',
        scope: 'P-20W data interoperability',
      },
      {
        id: 'ler-framework',
        label: 'Learning & Employment Records (LER)',
        url: 'https://www.uschamberfoundation.org/t3-innovation-network',
        description: 'Competency taxonomy bridging education outcomes to employer requirements.',
        scope: 'Competency taxonomy',
      },
      {
        id: 'case-framework',
        label: 'CASE (Competency & Academic Standards Exchange)',
        url: 'https://www.imsglobal.org/case',
        description: 'REST/JSON API standard for exchanging competency frameworks and academic standards.',
        scope: 'Competency framework exchange',
      },
      {
        id: 'ctdl',
        label: 'Credential Transparency Description Language (CTDL)',
        url: 'https://credreg.net/ctdl',
        description: 'Linked-data vocabulary for describing credentials, competencies, and organizations.',
        scope: 'Credential transparency',
      },
    ],
  },
  {
    id: 'identity-credentials',
    label: 'Identity & Credential Standards',
    icon: '🔐',
    children: [
      {
        id: 'w3c-did',
        label: 'W3C Decentralized Identifiers (DIDs)',
        url: 'https://w3.org/TR/did-core',
        description: 'Globally unique identifiers that enable verifiable, decentralized digital identity.',
        scope: 'Identity infrastructure',
      },
      {
        id: 'open-badges',
        label: 'Open Badges 3.0',
        url: 'https://www.imsglobal.org/spec/ob/v3p0',
        description: 'Visual, verifiable digital badges for skills and achievements aligned with W3C VCs.',
        scope: 'Achievement recognition',
      },
      {
        id: 'clr',
        label: 'Comprehensive Learner Record (CLR) 2.0',
        url: 'https://www.imsglobal.org/spec/clr/v2p0',
        description: 'Standard for comprehensive, portable learner achievement records extending Open Badges.',
        scope: 'Learner achievement records',
      },
    ],
  },
  {
    id: 'interoperability',
    label: 'Interoperability Frameworks',
    icon: '🔗',
    children: [
      {
        id: 'json-ld',
        label: 'JSON-LD (Linked Data)',
        url: 'https://json-ld.org',
        description: 'Method for encoding Linked Data using JSON, enabling semantic interoperability.',
        scope: 'Data serialization',
      },
      {
        id: 'xapi',
        label: 'xAPI (Experience API)',
        url: 'https://xapi.com',
        description: 'Specification for learning technology that records and tracks learning experiences.',
        scope: 'Learning activity tracking',
      },
    ],
  },
  {
    id: 'privacy-governance',
    label: 'Privacy & Governance Frameworks',
    icon: '🛡️',
    children: [
      {
        id: 'ferpa',
        label: 'FERPA',
        url: 'https://ed.gov/ferpa',
        description: 'Federal law protecting the privacy of student education records.',
        scope: 'Student record privacy',
      },
      {
        id: 'coppa',
        label: 'COPPA',
        url: 'https://ftc.gov/coppa',
        description: 'Federal law protecting children under 13 in online contexts.',
        scope: 'Child privacy protection',
      },
      {
        id: 'gdpr',
        label: 'GDPR',
        url: 'https://gdpr.eu',
        description: 'EU regulation on data protection and privacy.',
        scope: 'International data protection',
      },
    ],
  },
];

// ─── Use Cases Mapped to CEDS RDF ───────────────────────────────────────────
// Each use case maps to one or more CEDS RDF domains with specific element URIs.
// CEDS RDF namespace: https://ceds.ed.gov/element/

export const useCasesCedsRdf = [
  {
    id: 'uc-credential-verification',
    label: 'Credential Verification & Trust',
    icon: '✅',
    description: 'Verify and trust digital credentials issued by education institutions and training providers.',
    stakeholders: ['higher-education', 'industry-partners', 'credentialing-platforms'],
    businessNeeds: [
      'Instant credential verification without contacting issuer',
      'Tamper-evident credential storage and sharing',
      'Employer trust in digital credentials',
    ],
    cedsDomains: ['credentials'],
    cedsRdfElements: [
      { element: 'Credential', uri: 'https://ceds.ed.gov/element/000869', description: 'A qualification, achievement, personal or organizational quality, or aspect of an identity.' },
      { element: 'CredentialType', uri: 'https://ceds.ed.gov/element/000870', description: 'The category of the credential.' },
      { element: 'CredentialAwardDate', uri: 'https://ceds.ed.gov/element/000871', description: 'Date the credential was awarded.' },
      { element: 'CredentialVerification', uri: 'https://ceds.ed.gov/element/000872', description: 'Method by which the credential can be verified.' },
    ],
    relatedStandards: ['open-badges', 'clr', 'ctdl'],
  },
  {
    id: 'uc-skills-mapping',
    label: 'Skills & Competency Mapping',
    icon: '🧠',
    description: 'Map educational outcomes to workforce skill requirements using standardized taxonomies.',
    stakeholders: ['k12-districts', 'higher-education', 'cte-programs', 'industry-partners'],
    businessNeeds: [
      'Align curriculum to employer skill requirements',
      'Translate academic outcomes into workforce-readable skills',
      'Build competency-based progression pathways',
    ],
    cedsDomains: ['competencies'],
    cedsRdfElements: [
      { element: 'CompetencyDefinition', uri: 'https://ceds.ed.gov/element/000873', description: 'A specific competency or skill definition within a framework.' },
      { element: 'CompetencyFramework', uri: 'https://ceds.ed.gov/element/000874', description: 'A structured set of competency definitions.' },
      { element: 'CompetencySet', uri: 'https://ceds.ed.gov/element/000875', description: 'A group of related competency definitions.' },
      { element: 'LearningStandard', uri: 'https://ceds.ed.gov/element/000876', description: 'A statement of an expectation for student learning.' },
    ],
    relatedStandards: ['ler-framework', 'case-framework', 'ctdl'],
  },
  {
    id: 'uc-workforce-mobility',
    label: 'Workforce Mobility & Career Transitions',
    icon: '🚀',
    description: 'Enable learners and workers to carry verified records across institutions and employers.',
    stakeholders: ['staffing-agencies', 'industry-partners', 'adult-education', 'learner-advocates'],
    businessNeeds: [
      'Portable career profiles across state lines',
      'Cross-sector credential recognition',
      'Reduce time-to-hire for experienced workers',
    ],
    cedsDomains: ['workforce', 'credentials'],
    cedsRdfElements: [
      { element: 'EmploymentRecord', uri: 'https://ceds.ed.gov/element/000877', description: 'A record of employment history.' },
      { element: 'OccupationalClassification', uri: 'https://ceds.ed.gov/element/000878', description: 'A classification of occupations (SOC, O*NET).' },
      { element: 'WorkforceProgram', uri: 'https://ceds.ed.gov/element/000879', description: 'A program designed to prepare individuals for employment.' },
      { element: 'SkillRequirement', uri: 'https://ceds.ed.gov/element/000880', description: 'A skill required for a specific occupation or role.' },
    ],
    relatedStandards: ['ler-framework', 'ctdl', 'clr'],
  },
  {
    id: 'uc-transcript-exchange',
    label: 'K–12 Transcript & Record Exchange',
    icon: '📋',
    description: 'Exchange student academic records between K–12 districts, states, and postsecondary institutions.',
    stakeholders: ['k12-districts', 'state-education-agencies', 'local-education-agencies'],
    businessNeeds: [
      'Seamless student transfer between districts',
      'Automated transcript evaluation for college admissions',
      'CEDS-compliant state reporting',
    ],
    cedsDomains: ['k12'],
    cedsRdfElements: [
      { element: 'K12StudentAcademicRecord', uri: 'https://ceds.ed.gov/element/000881', description: 'Academic record for a K–12 student.' },
      { element: 'K12CourseSection', uri: 'https://ceds.ed.gov/element/000882', description: 'A specific offering of a K–12 course.' },
      { element: 'K12Enrollment', uri: 'https://ceds.ed.gov/element/000883', description: 'A student enrollment in a K–12 school.' },
      { element: 'K12GradeLevel', uri: 'https://ceds.ed.gov/element/000884', description: 'The grade level of a student.' },
    ],
    relatedStandards: ['ceds', 'clr'],
  },
  {
    id: 'uc-postsecondary-credentials',
    label: 'Postsecondary Credential Issuance',
    icon: '🎓',
    description: 'Issue and verify postsecondary degrees, certificates, and microcredentials in digital format.',
    stakeholders: ['higher-education', 'credentialing-platforms', 'professional-associations'],
    businessNeeds: [
      'Digital diploma issuance at scale',
      'Microcredential and badge programs',
      'Employer-verifiable degree attestation',
    ],
    cedsDomains: ['postsecondary', 'credentials'],
    cedsRdfElements: [
      { element: 'PsDegreeOrCertificate', uri: 'https://ceds.ed.gov/element/000885', description: 'A postsecondary degree or certificate.' },
      { element: 'PsStudentAcademicRecord', uri: 'https://ceds.ed.gov/element/000886', description: 'Academic record for a postsecondary student.' },
      { element: 'PsProgram', uri: 'https://ceds.ed.gov/element/000887', description: 'A postsecondary academic program.' },
      { element: 'PsInstitution', uri: 'https://ceds.ed.gov/element/000888', description: 'A postsecondary educational institution.' },
    ],
    relatedStandards: ['open-badges', 'clr', 'ctdl'],
  },
  {
    id: 'uc-cte-pathways',
    label: 'CTE Pathway Completion & Industry Credentials',
    icon: '🔧',
    description: 'Track CTE program completion and align industry credentials to academic pathways.',
    stakeholders: ['cte-programs', 'industry-partners', 'state-education-agencies'],
    businessNeeds: [
      'Industry credential alignment to CTE pathways',
      'Cross-institution pathway completion tracking',
      'Employer recognition of CTE program outcomes',
    ],
    cedsDomains: ['cte', 'competencies'],
    cedsRdfElements: [
      { element: 'CTEProgram', uri: 'https://ceds.ed.gov/element/000889', description: 'A Career and Technical Education program.' },
      { element: 'CTEOccupationalCluster', uri: 'https://ceds.ed.gov/element/000890', description: 'A CTE career cluster classification.' },
      { element: 'CTEIndustryAlignment', uri: 'https://ceds.ed.gov/element/000891', description: 'Alignment between CTE programs and industry standards.' },
      { element: 'CTEConcentrator', uri: 'https://ceds.ed.gov/element/000892', description: 'A student who has met a threshold in a CTE pathway.' },
    ],
    relatedStandards: ['ler-framework', 'case-framework', 'ctdl'],
  },
  {
    id: 'uc-assessment-results',
    label: 'Assessment Results & Performance Data',
    icon: '📝',
    description: 'Exchange assessment results and performance data across systems for holistic learner profiles.',
    stakeholders: ['k12-districts', 'higher-education', 'state-education-agencies', 'edtech-vendors'],
    businessNeeds: [
      'Standardized assessment result exchange',
      'Cross-system performance analytics',
      'Competency-based assessment alignment',
    ],
    cedsDomains: ['assessments'],
    cedsRdfElements: [
      { element: 'AssessmentResult', uri: 'https://ceds.ed.gov/element/000893', description: 'The result of an assessment for a student.' },
      { element: 'AssessmentPerformanceLevel', uri: 'https://ceds.ed.gov/element/000894', description: 'A defined level of performance on an assessment.' },
      { element: 'Assessment', uri: 'https://ceds.ed.gov/element/000895', description: 'A systematic method for gathering information about learner achievement.' },
      { element: 'AssessmentItem', uri: 'https://ceds.ed.gov/element/000896', description: 'A specific question or task within an assessment.' },
    ],
    relatedStandards: ['ceds', 'xapi'],
  },
  {
    id: 'uc-data-governance',
    label: 'Data Sharing & Privacy Governance',
    icon: '🛡️',
    description: 'Establish and enforce data sharing agreements and privacy controls across ecosystem partners.',
    stakeholders: ['federal-agencies', 'state-education-agencies', 'edtech-vendors', 'community-organizations'],
    businessNeeds: [
      'FERPA-compliant data exchange agreements',
      'AI/ML training data governance',
      'Learner consent management',
    ],
    cedsDomains: ['authN', 'implVars'],
    cedsRdfElements: [
      { element: 'PersonIdentifier', uri: 'https://ceds.ed.gov/element/000897', description: 'A unique identifier for a person within a system.' },
      { element: 'DataAccessPolicy', uri: 'https://ceds.ed.gov/element/000898', description: 'A policy governing access to data.' },
      { element: 'AuthorizationDocument', uri: 'https://ceds.ed.gov/element/000899', description: 'A document authorizing data access or sharing.' },
      { element: 'DataSharingAgreement', uri: 'https://ceds.ed.gov/element/000900', description: 'A formal agreement for sharing data between parties.' },
    ],
    relatedStandards: ['ferpa', 'coppa'],
  },
  {
    id: 'uc-equity-access',
    label: 'Equitable Access & Digital Inclusion',
    icon: '⚖️',
    description: 'Ensure credential and data systems are accessible to all learners regardless of background or resources.',
    stakeholders: ['learner-advocates', 'community-organizations', 'local-education-agencies'],
    businessNeeds: [
      'Multilingual credential interfaces',
      'Low-bandwidth credential access',
      'Alternative identity pathways for underserved populations',
    ],
    cedsDomains: ['earlyLearning', 'k12', 'adultEd'],
    cedsRdfElements: [
      { element: 'LanguageOfInstruction', uri: 'https://ceds.ed.gov/element/000901', description: 'The primary language used for instruction.' },
      { element: 'DisabilityStatus', uri: 'https://ceds.ed.gov/element/000902', description: 'Disability classification for accessibility accommodations.' },
      { element: 'EconomicDisadvantageStatus', uri: 'https://ceds.ed.gov/element/000903', description: 'Indicator of economic disadvantage for equity analysis.' },
      { element: 'EnglishLearnerStatus', uri: 'https://ceds.ed.gov/element/000904', description: 'Classification as an English language learner.' },
    ],
    relatedStandards: ['ceds', 'clr'],
  },
];

// ─── Helper: collect all searchable business needs ───────────────────────────

export function getAllBusinessNeeds() {
  const needs = [];

  // From stakeholders
  stakeholderTaxonomy.forEach(group => {
    group.children.forEach(child => {
      child.businessNeeds.forEach(need => {
        needs.push({
          need,
          source: 'stakeholder',
          stakeholder: child.label,
          stakeholderGroup: group.label,
          stakeholderId: child.id,
        });
      });
    });
  });

  // From use cases
  useCasesCedsRdf.forEach(uc => {
    uc.businessNeeds.forEach(need => {
      needs.push({
        need,
        source: 'useCase',
        useCase: uc.label,
        useCaseId: uc.id,
      });
    });
  });

  return needs;
}
