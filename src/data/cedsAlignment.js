// cedsAlignment.js — CEDS ontology vocabulary match-up data.
//
// Source: Common Education Data Standards (CEDS) v11+
//   https://ceds.ed.gov  |  https://github.com/CEDStandards/CEDS-Elements
//
// CEDS has 13 official domains (v11):
//   Early Learning, K12, Postsecondary, Career & Technical, Adult Education,
//   Workforce, Assessments, Credentials, Competencies, Learning Resources,
//   Facilities, Implementation Variables, Authentication & Authorization
//
// For each library entry we map to each CEDS domain with:
//   status: 'full' | 'partial' | 'gap'
//   notes: short rationale
//   cedsElements: specific CEDS element names or entity names that align
//   gapNotes: what CEDS covers that this standard does NOT address

export const cedsDomains = [
  { id: 'credentials',         label: 'Credentials',                    icon: '🎓' },
  { id: 'competencies',        label: 'Competencies',                   icon: '🧠' },
  { id: 'workforce',           label: 'Workforce',                      icon: '💼' },
  { id: 'assessments',         label: 'Assessments',                    icon: '📝' },
  { id: 'learningResources',   label: 'Learning Resources',             icon: '📚' },
  { id: 'k12',                 label: 'K–12',                           icon: '🏫' },
  { id: 'postsecondary',       label: 'Postsecondary',                  icon: '🎒' },
  { id: 'cte',                 label: 'Career & Technical',             icon: '🔧' },
  { id: 'adultEd',             label: 'Adult Education',                icon: '🧑‍🏫' },
  { id: 'earlyLearning',       label: 'Early Learning',                 icon: '🧒' },
  { id: 'authN',               label: 'Auth & Authorization',           icon: '🔐' },
  { id: 'implVars',            label: 'Implementation Variables',       icon: '⚙️' },
  { id: 'facilities',          label: 'Facilities',                     icon: '🏢' },
];

// status values:
//   'full'    — strong alignment; the standard directly addresses this CEDS domain
//   'partial' — some overlap but the standard is scoped more narrowly or broadly
//   'gap'     — the library standard does not cover this CEDS domain at all

export const cedsAlignmentMatrix = [
  {
    entryId: 'hropen-skills-api-v4',
    entryShortName: 'HR Open Skills API v4.0',
    domains: {
      credentials: {
        status: 'partial',
        cedsElements: ['Credential', 'CredentialType', 'CredentialAwardedBy'],
        notes: 'HR Open defines skills as attributes of a credential but does not model the full CEDS Credential entity (issuer, date, award status).',
        gapNotes: 'CEDS Credential includes attainment date, issuing org, and verification — HR Open skills schema covers competency content only.',
      },
      competencies: {
        status: 'full',
        cedsElements: ['LearningStandard', 'LearningStandardItem', 'CompetencyFramework', 'CompetencyDefinition'],
        notes: 'Strong alignment. HR Open JSON-LD skill objects map directly to CEDS CompetencyDefinition and LearningStandardItem entities.',
        gapNotes: null,
      },
      workforce: {
        status: 'full',
        cedsElements: ['WorkforceProgram', 'EmploymentRecord', 'OccupationalClassification', 'SkillRequirement'],
        notes: 'HR Open is workforce-native. Skills map to CEDS OccupationalClassification and SkillRequirement elements.',
        gapNotes: null,
      },
      assessments: {
        status: 'partial',
        cedsElements: ['AssessmentPerformanceLevel', 'AssessmentResult'],
        notes: 'HR Open skills can carry proficiency levels that loosely map to CEDS AssessmentPerformanceLevel, but assessment structure (test, session, item) is out of scope.',
        gapNotes: 'CEDS Assessments domain models full assessment lifecycle; HR Open only captures the outcome (skill claim).',
      },
      learningResources: {
        status: 'partial',
        cedsElements: ['LearningResource', 'LearningResourceEducationalAlignment'],
        notes: 'HR Open skills can reference associated learning resources but does not model the CEDS LearningResource entity.',
        gapNotes: 'CEDS Learning Resources includes URL, media type, educational level — not in HR Open scope.',
      },
      k12: {
        status: 'gap',
        cedsElements: [],
        notes: 'HR Open is not designed for K–12 context.',
        gapNotes: 'CEDS K12 elements for student records, course history, and grade-level competencies are not addressed.',
      },
      postsecondary: {
        status: 'partial',
        cedsElements: ['PsOrganization', 'PsStudentAcademicRecord'],
        notes: 'HR Open skills can describe postsecondary competency outcomes but does not model enrollment or academic records.',
        gapNotes: 'CEDS Postsecondary includes enrollment, program, degree — HR Open covers only skill/competency vocabulary.',
      },
      cte: {
        status: 'full',
        cedsElements: ['CTEProgram', 'CTEOccupationalCluster', 'CTEIndustryAlignment'],
        notes: 'Strong alignment in CTE context. HR Open skills are widely used to represent CTE industry-aligned competencies.',
        gapNotes: null,
      },
      adultEd: {
        status: 'partial',
        cedsElements: ['AdultEducationProgram'],
        notes: 'HR Open skills apply in adult education workforce contexts but the schema does not address adult learner record-keeping.',
        gapNotes: 'CEDS Adult Ed includes program enrollment and completion — not in scope for HR Open.',
      },
      earlyLearning: {
        status: 'gap',
        cedsElements: [],
        notes: 'No alignment. HR Open is not designed for early childhood competency frameworks.',
        gapNotes: 'CEDS Early Learning covers child developmental domains, Head Start outcomes — entirely outside HR Open scope.',
      },
      authN: {
        status: 'gap',
        cedsElements: [],
        notes: 'HR Open defines no authentication or authorization model.',
        gapNotes: 'CEDS Auth includes person identity, system access, and role management — not addressed.',
      },
      implVars: {
        status: 'partial',
        cedsElements: ['ImplementationStatus', 'OrganizationIdentificationSystem'],
        notes: 'Organizational identifiers (school/employer IDs) partially align with CEDS Implementation Variables.',
        gapNotes: null,
      },
      facilities: {
        status: 'gap',
        cedsElements: [],
        notes: 'No overlap. HR Open does not model physical facilities.',
        gapNotes: null,
      },
    },
  },

  {
    entryId: 'tcp-v4-5',
    entryShortName: 'Trusted Career Profile (TCP) v4.5',
    domains: {
      credentials: {
        status: 'full',
        cedsElements: ['Credential', 'CredentialType', 'CredentialAwardedBy', 'CredentialAwardStatus', 'CredentialCriteria'],
        notes: 'TCP is credential-centric. Full alignment with CEDS Credential entity including attainment, issuer, and verification fields.',
        gapNotes: null,
      },
      competencies: {
        status: 'full',
        cedsElements: ['CompetencyDefinition', 'LearningStandardItem', 'CompetencySet'],
        notes: 'TCP carries competency evidence as first-class records, aligning with CEDS CompetencyDefinition and CompetencySet.',
        gapNotes: null,
      },
      workforce: {
        status: 'full',
        cedsElements: ['WorkforceProgram', 'EmploymentRecord', 'OccupationalClassification'],
        notes: 'TCP is designed for workforce mobility. Employment history and skill evidence map to CEDS Workforce domain entities.',
        gapNotes: null,
      },
      assessments: {
        status: 'partial',
        cedsElements: ['AssessmentResult', 'AssessmentPerformanceLevel'],
        notes: 'TCP can carry assessment results as evidence of skill claims. Does not model the full CEDS assessment event lifecycle.',
        gapNotes: 'CEDS models assessment sessions, items, and accommodations — TCP only records outcomes.',
      },
      learningResources: {
        status: 'partial',
        cedsElements: ['LearningResource'],
        notes: 'TCP references learning experiences but does not model CEDS LearningResource metadata fields (media type, educational level, etc.).',
        gapNotes: null,
      },
      k12: {
        status: 'partial',
        cedsElements: ['K12StudentAcademicRecord', 'K12CourseSection', 'K12Enrollment'],
        notes: 'TCP supports learner records spanning K–12 through workforce. K–12 transcript data partially maps to CEDS K12StudentAcademicRecord.',
        gapNotes: 'CEDS K12 includes detailed course, attendance, discipline, and special education data beyond TCP scope.',
      },
      postsecondary: {
        status: 'full',
        cedsElements: ['PsStudentAcademicRecord', 'PsProgram', 'PsDegreeOrCertificate'],
        notes: 'Strong alignment. TCP postsecondary credential records map to CEDS PsStudentAcademicRecord and PsDegreeOrCertificate.',
        gapNotes: null,
      },
      cte: {
        status: 'full',
        cedsElements: ['CTEProgram', 'CTEIndustryAlignment', 'CTEOccupationalCluster'],
        notes: 'TCP is commonly used in CTE pathways to carry industry credentials. Aligns with CEDS CTE program completion and occupational cluster elements.',
        gapNotes: null,
      },
      adultEd: {
        status: 'partial',
        cedsElements: ['AdultEducationProgram', 'AdultEducationEnrollment'],
        notes: 'TCP supports adult learner credential portability. Partial alignment — TCP does not model adult education program structure.',
        gapNotes: null,
      },
      earlyLearning: {
        status: 'gap',
        cedsElements: [],
        notes: 'TCP is not designed for early childhood records.',
        gapNotes: 'CEDS Early Learning child developmental records are out of TCP scope.',
      },
      authN: {
        status: 'partial',
        cedsElements: ['PersonIdentifier', 'AuthorizationDocument'],
        notes: 'TCP requires learner identity verification. Person identity elements partially align with CEDS Auth domain, but TCP relies on external identity providers.',
        gapNotes: 'CEDS Auth models full system access and role management beyond TCP identity scope.',
      },
      implVars: {
        status: 'partial',
        cedsElements: ['ImplementationStatus', 'OrganizationIdentificationSystem'],
        notes: 'Partner and institution identifiers in TCP partially map to CEDS Implementation Variables.',
        gapNotes: null,
      },
      facilities: {
        status: 'gap',
        cedsElements: [],
        notes: 'No overlap.',
        gapNotes: null,
      },
    },
  },

  {
    entryId: 'lrw-competency-framework',
    entryShortName: 'LER Competency Framework',
    domains: {
      credentials: {
        status: 'partial',
        cedsElements: ['CredentialCriteria'],
        notes: 'The LER framework defines competency criteria that inform credential requirements but does not model credential attainment.',
        gapNotes: 'CEDS Credentials include full award lifecycle — framework only defines the competency vocabulary.',
      },
      competencies: {
        status: 'full',
        cedsElements: ['CompetencyFramework', 'CompetencyDefinition', 'CompetencySet', 'LearningStandard', 'LearningStandardItem'],
        notes: 'This IS a competency framework. Deep alignment with CEDS Competencies domain including hierarchical structure and sector extensions.',
        gapNotes: null,
      },
      workforce: {
        status: 'full',
        cedsElements: ['WorkforceProgram', 'OccupationalClassification', 'SkillRequirement'],
        notes: 'Framework is employer-aligned. Occupational cluster competencies map to CEDS Workforce OccupationalClassification elements.',
        gapNotes: null,
      },
      assessments: {
        status: 'gap',
        cedsElements: [],
        notes: 'Framework defines competencies but includes no assessment modeling.',
        gapNotes: 'CEDS Assessments domain (assessment events, items, results) is entirely outside framework scope.',
      },
      learningResources: {
        status: 'partial',
        cedsElements: ['LearningResourceEducationalAlignment'],
        notes: 'Framework competencies can align to learning resources via CEDS LearningResourceEducationalAlignment but does not model resources directly.',
        gapNotes: null,
      },
      k12: {
        status: 'partial',
        cedsElements: ['K12CourseCompetencySet'],
        notes: 'Some K–12 sector extensions exist. Partial alignment with CEDS K12 course-level competency sets.',
        gapNotes: 'CEDS K12 student record data (enrollment, graduation, attendance) is out of scope.',
      },
      postsecondary: {
        status: 'partial',
        cedsElements: ['PsStudentCompetencyRecord'],
        notes: 'Postsecondary sector extensions align with CEDS PsStudentCompetencyRecord for degree program competencies.',
        gapNotes: null,
      },
      cte: {
        status: 'full',
        cedsElements: ['CTEProgram', 'CTEOccupationalCluster', 'CTEIndustryAlignment'],
        notes: 'Strongest alignment. Framework originated in CTE/workforce context. Occupational cluster competencies directly map to CEDS CTE domain.',
        gapNotes: null,
      },
      adultEd: {
        status: 'partial',
        cedsElements: ['AdultEducationProgram'],
        notes: 'Applicable in adult workforce education but no adult education-specific elements in framework.',
        gapNotes: null,
      },
      earlyLearning: {
        status: 'gap',
        cedsElements: [],
        notes: 'No early learning competencies included.',
        gapNotes: 'CEDS Early Learning developmental domains not represented.',
      },
      authN: {
        status: 'gap',
        cedsElements: [],
        notes: 'Framework document only — no identity or access modeling.',
        gapNotes: null,
      },
      implVars: {
        status: 'gap',
        cedsElements: [],
        notes: 'No implementation variable modeling.',
        gapNotes: null,
      },
      facilities: {
        status: 'gap',
        cedsElements: [],
        notes: 'No overlap.',
        gapNotes: null,
      },
    },
  },

  {
    entryId: 'edu-partner-agreement-template',
    entryShortName: 'EDU Partner Data Sharing Agreement',
    domains: {
      credentials: {
        status: 'partial',
        cedsElements: ['CredentialAwardStatus'],
        notes: 'Agreement governs data sharing of credential records. Not a vocabulary standard — it constrains how credential data moves.',
        gapNotes: null,
      },
      competencies: {
        status: 'partial',
        cedsElements: [],
        notes: 'Agreement covers competency data flows but defines no competency vocabulary.',
        gapNotes: null,
      },
      workforce: {
        status: 'partial',
        cedsElements: [],
        notes: 'Agreement covers workforce data sharing. No CEDS Workforce element vocabulary.',
        gapNotes: null,
      },
      assessments: {
        status: 'partial',
        cedsElements: [],
        notes: 'Assessment data sharing governed by agreement. Includes FERPA-scoped assessment result restrictions.',
        gapNotes: null,
      },
      learningResources: {
        status: 'gap',
        cedsElements: [],
        notes: 'Agreement does not address learning resource data.',
        gapNotes: null,
      },
      k12: {
        status: 'partial',
        cedsElements: [],
        notes: 'FERPA provisions directly apply to K–12 student records covered by CEDS K12 domain.',
        gapNotes: null,
      },
      postsecondary: {
        status: 'partial',
        cedsElements: [],
        notes: 'FERPA provisions apply to postsecondary education records.',
        gapNotes: null,
      },
      cte: {
        status: 'partial',
        cedsElements: [],
        notes: 'CTE data sharing requires agreement execution before exchanging program records.',
        gapNotes: null,
      },
      adultEd: {
        status: 'partial',
        cedsElements: [],
        notes: 'Adult education records fall under agreement governance.',
        gapNotes: null,
      },
      earlyLearning: {
        status: 'gap',
        cedsElements: [],
        notes: 'Agreement does not include early learning-specific provisions.',
        gapNotes: null,
      },
      authN: {
        status: 'full',
        cedsElements: ['PersonIdentifier', 'AuthorizationDocument', 'DataAccessPolicy'],
        notes: 'This is the primary governance instrument. Authorization, data access policy, and person identity provisions align directly with CEDS Auth domain.',
        gapNotes: null,
      },
      implVars: {
        status: 'full',
        cedsElements: ['ImplementationStatus', 'OrganizationIdentificationSystem', 'DataSharingAgreement'],
        notes: 'Agreement itself is an Implementation Variable. Organization identifiers and data sharing status map to CEDS Implementation Variables domain.',
        gapNotes: null,
      },
      facilities: {
        status: 'gap',
        cedsElements: [],
        notes: 'No overlap.',
        gapNotes: null,
      },
    },
  },

  {
    entryId: 'w3c-vc-data-model',
    entryShortName: 'W3C Verifiable Credentials 2.0',
    domains: {
      credentials: {
        status: 'full',
        cedsElements: ['Credential', 'CredentialType', 'CredentialAwardedBy', 'CredentialAwardStatus', 'CredentialVerification'],
        notes: 'W3C VC is the cryptographic foundation for issuing and verifying credentials. Full alignment with CEDS Credential entity. Adds tamper-evidence and decentralized verification not in CEDS model.',
        gapNotes: null,
      },
      competencies: {
        status: 'partial',
        cedsElements: ['CompetencyDefinition'],
        notes: 'W3C VC can carry competency claims as credential subjects. Does not define the competency vocabulary itself.',
        gapNotes: 'CEDS Competencies domain defines the vocabulary; W3C VC is the transport/verification wrapper.',
      },
      workforce: {
        status: 'partial',
        cedsElements: ['EmploymentRecord', 'OccupationalClassification'],
        notes: 'W3C VC can carry workforce credentials. Alignment depends on the credential subject schema used (e.g., HR Open inside a VC).',
        gapNotes: null,
      },
      assessments: {
        status: 'partial',
        cedsElements: ['AssessmentResult'],
        notes: 'Assessment results can be issued as verifiable credentials. W3C VC adds verification layer but does not model assessment structure.',
        gapNotes: null,
      },
      learningResources: {
        status: 'gap',
        cedsElements: [],
        notes: 'W3C VC does not model learning resources.',
        gapNotes: null,
      },
      k12: {
        status: 'partial',
        cedsElements: ['K12StudentAcademicRecord'],
        notes: 'K–12 transcripts and diplomas can be issued as W3C VCs. Schema of the credential subject must separately align to CEDS K12 elements.',
        gapNotes: 'CEDS K12 vocabulary is not built into W3C VC — requires combination with HR Open or CEDS-native schema.',
      },
      postsecondary: {
        status: 'full',
        cedsElements: ['PsDegreeOrCertificate', 'PsStudentAcademicRecord'],
        notes: 'Postsecondary diplomas, certificates, and transcripts are a primary use case for W3C VC. Strong adoption in this domain.',
        gapNotes: null,
      },
      cte: {
        status: 'partial',
        cedsElements: ['CTEProgram'],
        notes: 'CTE industry credentials (journeyman cards, certifications) are a growing W3C VC use case.',
        gapNotes: null,
      },
      adultEd: {
        status: 'partial',
        cedsElements: [],
        notes: 'GED, HiSET, and adult completion credentials can use W3C VC. Schema alignment required.',
        gapNotes: null,
      },
      earlyLearning: {
        status: 'gap',
        cedsElements: [],
        notes: 'Not applicable in early learning context.',
        gapNotes: null,
      },
      authN: {
        status: 'full',
        cedsElements: ['PersonIdentifier', 'AuthorizationDocument'],
        notes: 'W3C VC is built on DID-based identity. Strong alignment with CEDS Auth domain for person identification and authorization documents.',
        gapNotes: null,
      },
      implVars: {
        status: 'full',
        cedsElements: ['ImplementationStatus', 'OrganizationIdentificationSystem'],
        notes: 'Issuer DIDs and credential status registries align with CEDS Implementation Variables. High implementation complexity captured in burden level.',
        gapNotes: null,
      },
      facilities: {
        status: 'gap',
        cedsElements: [],
        notes: 'No overlap.',
        gapNotes: null,
      },
    },
  },
];

// Derived: per-domain summary across all entries
export function getDomainSummary() {
  return cedsDomains.map(domain => {
    const statuses = cedsAlignmentMatrix.map(e => e.domains[domain.id]?.status ?? 'gap');
    return {
      domainId: domain.id,
      label: domain.label,
      icon: domain.icon,
      full: statuses.filter(s => s === 'full').length,
      partial: statuses.filter(s => s === 'partial').length,
      gap: statuses.filter(s => s === 'gap').length,
      total: statuses.length,
    };
  });
}
