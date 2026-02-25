// libraryEntries.js — Sample reference library entries with full metadata schema.
// WHY THIS SCHEMA EXISTS: The metadata fields were designed to serve three goals:
// 1) Human discovery (filters, tags, labels a person can scan)
// 2) AI/analytics discovery (structured fields a system can query programmatically)
// 3) Implementation readiness signaling (burden, capabilities, equity, privacy)
//
// Fields map to the EDU Reference Library spec:
// - implementationBurden: helps implementers triage what they can adopt now vs. later
// - requiredCapabilities: prevents adopting something you lack infrastructure for
// - equityConsiderations: surfaces LIF-derived accessibility flags
// - privacyConsiderations: flags FERPA, COPPA, or data sensitivity issues
// - accessLevel: open vs. restricted (Gates Foundation openness principle)

export const libraryEntries = [
  {
    id: 'hropen-skills-api-v4',
    title: 'HR Open Skills API v4.0',
    type: 'Standard',
    category: 'Skills & Credentials',
    description: 'JSON-LD schema for representing skills, competencies, and learning outcomes in a machine-readable, interoperable format. Used as the canonical skills vocabulary across the EDU ecosystem.',
    owner: 'HR Open Standards Consortium',
    governanceBody: 'HR Open Standards Consortium',
    lastUpdated: '2025-11-01',
    version: '4.0',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://hropenstandards.org',
    authoritativeRepoUrl: 'https://github.com/hropenstandards/skills-api',
    tags: ['skills', 'JSON-LD', 'interoperability', 'competencies', 'workforce'],
    // AI/analytics metadata
    aiTaxonomy: ['skills-ontology', 'machine-readable', 'schema'],
    aiSummary: 'Canonical JSON-LD vocabulary for skills and competencies. Use when mapping learner outcomes to workforce requirements.',
    aiUnlocksSummary: 'Enables your product to speak a common skills language across education and workforce systems. Unlocks interoperable skills matching, portable competency records, and alignment with employer skill taxonomies — making your platform a first-class participant in the skills-based hiring ecosystem.',
    // Implementation fields
    implementationBurden: 'medium',
    implementationBurdenRationale: 'Requires JSON-LD tooling and schema validation. Moderate lift for orgs new to linked data. Well-documented with SDKs available.',
    burdenRubric: {
      engineering: { level: 'moderate', note: '2–4 weeks for a team familiar with REST APIs; add 2 weeks if new to JSON-LD' },
      infrastructure: { level: 'low', note: 'Standard REST endpoints. No specialized infrastructure beyond a web server.' },
      legal: { level: 'low', note: 'Open standard. No licensing fees or legal agreements required.' },
      timeline: '4–8 weeks for a production-ready integration',
    },
    requiredCapabilities: ['JSON-LD parser', 'REST API client', 'Schema validation tooling'],
    implementationGuidance: 'Start by consuming the Skills API read-only to map incoming skills data. Use the JSON-LD context files to validate payloads. Once read integration is stable, add write support for publishing your own skill definitions.',
    referenceImplementations: [
      { name: 'HR Open Skills SDK (Node.js)', url: 'https://github.com/hropenstandards/skills-sdk-node', description: 'Official Node.js SDK with JSON-LD context resolution and schema validation.' },
      { name: 'Skills API Reference Server', url: 'https://github.com/hropenstandards/skills-api-reference', description: 'Reference REST API server implementing the full Skills API v4 spec.' },
    ],
    samplePayloads: [
      {
        label: 'Skill Definition (JSON-LD)',
        language: 'json',
        code: `{
  "@context": "https://hropenstandards.org/skills/v4/context.jsonld",
  "@type": "Skill",
  "identifier": "skill:python-programming",
  "name": "Python Programming",
  "category": "Technical",
  "proficiencyLevels": ["beginner", "intermediate", "advanced"]
}`,
      },
    ],
    knownAdopters: ['Credential Engine', 'Open Skills Network', 'EMSI/Lightcast', 'Western Governors University'],
    technicalDocLinks: [
      { label: 'API Specification (OpenAPI)', url: 'https://hropenstandards.org/specs/skills-api-v4' },
      { label: 'JSON-LD Context Files', url: 'https://hropenstandards.org/context/v4' },
      { label: 'Implementation Guide', url: 'https://hropenstandards.org/guides/getting-started' },
    ],
    // Cross-spec awareness
    commonlyPairedWith: [
      { id: 'tcp-v4-5', rationale: 'TCP uses HR Open skill identifiers as its canonical vocabulary for learner skill records. Implementing both enables end-to-end skill portability.' },
      { id: 'lrw-competency-framework', rationale: 'LER Framework competencies map directly to HR Open skill definitions, providing employer-aligned context for skill data.' },
    ],
    compatibilityNotes: 'Fully compatible with W3C Verifiable Credentials when skills are embedded as credential subjects. JSON-LD context is designed for seamless integration with other linked-data standards.',
    // Equity field
    equityConsiderations: {
      level: 'low-concern',
      notes: 'Standard itself is neutral. Implementation teams should ensure skill labels are free of occupational bias. No language accessibility provisions built in — consider multilingual extension.',
      lifDerived: true,
    },
    // Privacy field
    privacyConsiderations: {
      level: 'low-concern',
      notes: 'Vocabulary standard only — no PII transmission required. Implementations storing learner-skill mappings must comply with FERPA/COPPA depending on context.',
      dataClassification: 'schema-only',
    },
    relatedResources: ['tcp-v4-5', 'lrw-competency-framework'],
    status: 'approved',
  },
  {
    id: 'tcp-v4-5',
    title: 'Trusted Career Profile (TCP) v4.5',
    type: 'Data Standard',
    category: 'Learner Records',
    description: 'Interoperable data format for sharing verified experience, credentials, and skill evidence across institutions and employers. Designed for workforce mobility and learner agency.',
    owner: 'EDU Working Group / T3 Innovation Network',
    governanceBody: 'T3 Innovation Network / US Chamber of Commerce Foundation',
    lastUpdated: '2025-09-15',
    version: '4.5',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://t3networkhub.org',
    authoritativeRepoUrl: 'https://github.com/t3-innovation-network/tcp',
    tags: ['learner-record', 'portability', 'credentials', 'workforce-mobility', 'verifiable'],
    aiTaxonomy: ['credential-exchange', 'learner-identity', 'portable-record'],
    aiSummary: 'Structured format for a learner\'s portable career record. Use when implementing credential exchange, learner dashboard, or employer verification flows.',
    aiUnlocksSummary: 'Enables your product to issue, store, and share portable learner records that travel with the individual across institutions and employers. Unlocks learner-controlled data sharing, employer verification workflows, and cross-institutional transcript exchange — positioning your platform as a trust anchor in the learner mobility ecosystem.',
    implementationBurden: 'high',
    implementationBurdenRationale: 'Full TCP implementation requires identity infrastructure, credential issuance capability, and partner agreements. Phased adoption path available — start with read-only consumer.',
    burdenRubric: {
      engineering: { level: 'high', note: '8–16 weeks for full implementation. Consumer-only mode reduces to 4–6 weeks.' },
      infrastructure: { level: 'high', note: 'Requires identity system, credential store, consent management, and secure data exchange pipeline.' },
      legal: { level: 'moderate', note: 'Data sharing agreements required with each partner. FERPA compliance review mandatory.' },
      timeline: '3–6 months for full implementation; 6–8 weeks for consumer-only mode',
    },
    requiredCapabilities: ['Digital identity system', 'Credential issuance (or consumer-only mode)', 'Data exchange agreement', 'Learner consent UI'],
    implementationGuidance: 'Begin with consumer-only mode: accept and display TCP records from partner institutions. This lets you validate the data model and UX before investing in issuance infrastructure. Phase 2 adds write/issue capability. Phase 3 adds bi-directional exchange with consent management.',
    referenceImplementations: [
      { name: 'TCP Consumer Reference App', url: 'https://github.com/t3-innovation-network/tcp-consumer-demo', description: 'Demo app showing how to receive and render TCP records. Good starting point for consumer-only implementations.' },
      { name: 'TCP Issuance Toolkit', url: 'https://github.com/t3-innovation-network/tcp-issuer-toolkit', description: 'Server-side toolkit for issuing TCP-compliant records with consent management.', restricted: true },
    ],
    samplePayloads: [
      {
        label: 'TCP Record (simplified)',
        language: 'json',
        code: `{
  "@context": "https://t3networkhub.org/tcp/v4.5/context.jsonld",
  "@type": "TrustedCareerProfile",
  "learner": { "id": "did:example:learner123" },
  "credentials": [{
    "type": "Certification",
    "name": "AWS Cloud Practitioner",
    "issuer": "Amazon Web Services",
    "dateIssued": "2025-03-15",
    "skills": ["cloud-computing", "aws-infrastructure"]
  }],
  "consentStatus": "active"
}`,
      },
    ],
    knownAdopters: ['Western Governors University', 'Credential Engine', 'JFF (Jobs for the Future)', 'National Student Clearinghouse'],
    technicalDocLinks: [
      { label: 'TCP v4.5 Specification', url: 'https://t3networkhub.org/specs/tcp-v4.5' },
      { label: 'Consumer Integration Guide', url: 'https://t3networkhub.org/guides/consumer-quickstart' },
      { label: 'Consent Management Framework', url: 'https://t3networkhub.org/specs/consent-framework' },
    ],
    commonlyPairedWith: [
      { id: 'hropen-skills-api-v4', rationale: 'TCP references HR Open skill identifiers for its competency data. Implementing HR Open first gives you the vocabulary layer TCP builds on.' },
      { id: 'w3c-vc-data-model', rationale: 'TCP records can be wrapped in Verifiable Credentials for cryptographic trust. Pairing with W3C VC enables tamper-evident, verifier-independent records.' },
      { id: 'edu-partner-agreement-template', rationale: 'Data sharing agreements are required before exchanging TCP records with partners. The EDU agreement template covers the legal prerequisites.' },
    ],
    compatibilityNotes: 'TCP is designed to wrap W3C Verifiable Credentials and reference HR Open skill vocabularies. It complements rather than competes with these standards. Implementations that skip the VC layer lose cryptographic verification but retain data portability.',
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'Learners without institutional email or stable identity credentials may face access barriers. Recommend implementing alternative identity pathways (phone-based, guardian-mediated). Multilingual UI required for equitable access.',
      lifDerived: true,
    },
    privacyConsiderations: {
      level: 'high-concern',
      notes: 'Contains PII and educational records. FERPA compliance mandatory. Consent management required before any third-party data sharing. Zero-knowledge evidence patterns available for privacy-preserving verification.',
      dataClassification: 'PII / educational-record',
      regulations: ['FERPA', 'COPPA (under-13 contexts)', 'state privacy laws'],
    },
    relatedResources: ['hropen-skills-api-v4', 'edu-partner-agreement-template'],
    status: 'approved',
  },
  {
    id: 'lrw-competency-framework',
    title: 'Learning & Employment Records (LER) Competency Framework',
    type: 'Framework',
    category: 'Skills & Credentials',
    description: 'Structured competency taxonomy aligned to workforce needs, providing a bridge between educational outcomes and employer requirements. Includes sector-specific extensions.',
    owner: 'US Chamber of Commerce Foundation',
    governanceBody: 'US Chamber of Commerce Foundation / T3 Innovation Network',
    lastUpdated: '2025-07-20',
    version: '2.1',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://learningeconomy.io',
    authoritativeRepoUrl: 'https://github.com/uschamber/ler-competency-framework',
    tags: ['competency', 'LER', 'workforce', 'taxonomy', 'employer-aligned'],
    aiTaxonomy: ['competency-taxonomy', 'employer-alignment', 'skills-mapping'],
    aiSummary: 'Competency taxonomy bridging education and workforce. Use to map curriculum outcomes to employer skill requirements.',
    aiUnlocksSummary: 'Enables your product to translate educational outcomes into employer-recognized competencies. Unlocks curriculum-to-job alignment, competency gap analysis, and sector-specific skill mapping — helping learners see the workforce value of what they learn.',
    implementationBurden: 'low',
    implementationBurdenRationale: 'Well-documented taxonomy with flat file exports (CSV/JSON). No API integration required for basic use. Sector extensions may require additional mapping work.',
    burdenRubric: {
      engineering: { level: 'low', note: '1–2 weeks for basic import and mapping. Sector extensions add 1 week each.' },
      infrastructure: { level: 'low', note: 'Static taxonomy files. No server-side infrastructure required.' },
      legal: { level: 'low', note: 'Open license. No agreements needed.' },
      timeline: '2–4 weeks for a complete integration',
    },
    requiredCapabilities: ['Data import tooling', 'Taxonomy management (recommended)'],
    implementationGuidance: 'Download the CSV/JSON exports and map your existing competency data to the LER framework categories. Start with a single sector (e.g., healthcare or IT) to validate the mapping before expanding. Use the provided crosswalk files for common skill-to-competency translations.',
    referenceImplementations: [
      { name: 'LER Taxonomy Browser', url: 'https://github.com/uschamber/ler-taxonomy-browser', description: 'Interactive web app for browsing and searching the competency taxonomy.' },
    ],
    samplePayloads: [
      {
        label: 'Competency Definition (JSON)',
        language: 'json',
        code: `{
  "competencyId": "ler:healthcare:patient-care-fundamentals",
  "name": "Patient Care Fundamentals",
  "sector": "Healthcare",
  "category": "Clinical Skills",
  "alignedSkills": ["patient-assessment", "vital-signs", "care-planning"],
  "proficiencyScale": ["awareness", "application", "mastery"]
}`,
      },
    ],
    knownAdopters: ['EMSI/Lightcast', 'Credential Engine', 'National Association of Manufacturers', 'CompTIA'],
    technicalDocLinks: [
      { label: 'Framework Documentation', url: 'https://learningeconomy.io/docs/ler-framework' },
      { label: 'Sector Crosswalk Files', url: 'https://learningeconomy.io/crosswalks' },
    ],
    commonlyPairedWith: [
      { id: 'hropen-skills-api-v4', rationale: 'LER competencies map to HR Open skill definitions, providing the vocabulary bridge between education and employment contexts.' },
    ],
    compatibilityNotes: 'The LER Framework is designed as a complement to HR Open Skills API. It provides the employer-facing competency structure while HR Open provides the machine-readable skill vocabulary. No conflicts or overlaps.',
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'Taxonomy reflects current labor market which may embed historical inequities. Review sector-specific terms for bias before exposing to learners. Community validation process exists but is opt-in.',
      lifDerived: false,
    },
    privacyConsiderations: {
      level: 'low-concern',
      notes: 'Framework document only. No PII involved at the framework level. Usage analytics of framework adoption may require disclosure.',
      dataClassification: 'public',
    },
    relatedResources: ['hropen-skills-api-v4'],
    status: 'approved',
  },
  {
    id: 'edu-partner-agreement-template',
    title: 'EDU Partner Data Sharing Agreement Template',
    type: 'Governance',
    category: 'Partner Agreements',
    description: 'Standard legal template for data sharing agreements between EDU ecosystem partners. Covers FERPA, COPPA, state privacy laws, and AI/ML use restrictions.',
    owner: 'EDU Legal Working Group',
    governanceBody: 'EDU Legal Working Group',
    lastUpdated: '2026-01-10',
    version: '1.3',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: '#',
    authoritativeRepoUrl: null,
    tags: ['legal', 'governance', 'data-sharing', 'FERPA', 'partner'],
    aiTaxonomy: ['legal-template', 'governance', 'data-agreement'],
    aiSummary: 'Legal template for partner data agreements. Consult before establishing any data exchange relationship within the EDU ecosystem.',
    aiUnlocksSummary: 'Enables your organization to establish compliant data sharing relationships with EDU ecosystem partners. Unlocks multi-party data exchange, AI/ML governance guardrails, and streamlined legal onboarding — reducing agreement turnaround from months to weeks.',
    implementationBurden: 'medium',
    implementationBurdenRationale: 'Template must be reviewed and customized by legal counsel. Typical turnaround is 2-4 weeks. Streamlined version available for Tier 1 partners.',
    burdenRubric: {
      engineering: { level: 'low', note: 'No engineering work required. Template is a legal document.' },
      infrastructure: { level: 'low', note: 'No infrastructure changes. May require a data governance inventory.' },
      legal: { level: 'high', note: 'Full legal review required. Customization for each partner relationship. 2–4 weeks typical turnaround.' },
      timeline: '2–6 weeks depending on legal review cycles',
    },
    requiredCapabilities: ['Legal review capacity', 'Data governance officer (recommended)', 'Privacy officer'],
    implementationGuidance: 'Download the template and begin with the self-assessment checklist in Appendix A. This identifies which sections require customization for your use case. Have your privacy officer review the data classification matrix. Legal counsel reviews the full agreement last.',
    referenceImplementations: [
      { name: 'Agreement Self-Assessment Checklist', url: '#', description: 'Step-by-step worksheet for determining which template sections apply to your partnership.' },
    ],
    samplePayloads: [],
    knownAdopters: ['EDU pilot partners', 'Gates Foundation grantees'],
    technicalDocLinks: [
      { label: 'Agreement Template (PDF)', url: '#' },
      { label: 'Data Classification Guide', url: '#' },
    ],
    commonlyPairedWith: [
      { id: 'tcp-v4-5', rationale: 'Data sharing agreements are a legal prerequisite for TCP record exchange. Execute this agreement before any learner data flows between partners.' },
    ],
    compatibilityNotes: 'This agreement template is designed to cover the legal requirements for exchanging data formatted in TCP, HR Open, or W3C VC standards. It is standard-agnostic at the legal layer.',
    equityConsiderations: {
      level: 'low-concern',
      notes: 'Template includes accessibility provisions and language equity clauses. Ensure translated versions are available for partners with non-English primary language.',
      lifDerived: false,
    },
    privacyConsiderations: {
      level: 'high-concern',
      notes: 'This IS the privacy governance instrument. Failure to execute before data sharing is a compliance risk. Includes AI/ML use restriction clauses — partners must not train commercial models on shared learner data.',
      dataClassification: 'legal-instrument',
      regulations: ['FERPA', 'COPPA', 'state privacy laws', 'Gates Foundation AI policy'],
    },
    relatedResources: ['tcp-v4-5'],
    status: 'approved',
  },
  {
    id: 'w3c-vc-data-model',
    title: 'W3C Verifiable Credentials Data Model 2.0',
    type: 'Standard',
    category: 'Identity & Credentials',
    description: 'W3C standard for cryptographically verifiable digital credentials. Enables trust without centralized verification authorities — critical for learner-controlled records.',
    owner: 'W3C Credentials Community Group',
    governanceBody: 'World Wide Web Consortium (W3C)',
    lastUpdated: '2024-02-01',
    version: '2.0',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://w3.org/TR/vc-data-model-2.0',
    authoritativeRepoUrl: 'https://github.com/w3c/vc-data-model',
    tags: ['W3C', 'verifiable-credentials', 'cryptographic', 'decentralized', 'trust'],
    aiTaxonomy: ['credential-verification', 'cryptography', 'W3C-standard'],
    aiSummary: 'W3C standard for tamper-evident digital credentials. Use when issuing or verifying badges, diplomas, or skill credentials.',
    aiUnlocksSummary: 'Enables your product to issue, hold, and verify tamper-evident digital credentials without relying on a central authority. Unlocks decentralized trust, learner-controlled credential sharing, selective disclosure of sensitive data, and cross-border credential recognition — making your platform part of the global verifiable credentials ecosystem.',
    implementationBurden: 'high',
    implementationBurdenRationale: 'Requires cryptographic key infrastructure, DID method selection, and wallet/holder infrastructure. Significant engineering investment. Consider using a managed VC service for initial implementation.',
    burdenRubric: {
      engineering: { level: 'high', note: '12–20 weeks for custom implementation. 4–6 weeks using a managed VC platform (e.g., SpruceID, Transmute).' },
      infrastructure: { level: 'high', note: 'Key management system, DID resolution, credential storage, and holder wallet required.' },
      legal: { level: 'moderate', note: 'Regulatory landscape is evolving. GDPR right-to-erasure vs. immutability requires legal analysis.' },
      timeline: '3–5 months custom; 6–10 weeks with managed service',
    },
    requiredCapabilities: ['Cryptographic key management', 'DID infrastructure or managed service', 'JSON-LD processing', 'Wallet/holder UI'],
    implementationGuidance: 'Start with a managed VC service (SpruceID, Transmute, or Dock) to skip the infrastructure build. Issue a single credential type (e.g., course completion badge) end-to-end before expanding. Build the verifier flow first — it is simpler than the issuer flow and validates your architecture decisions.',
    referenceImplementations: [
      { name: 'VC Playground (W3C)', url: 'https://vcplayground.org', description: 'Interactive tool for creating, signing, and verifying VCs. Good for prototyping and learning.' },
      { name: 'SpruceID DIDKit', url: 'https://github.com/spruceid/didkit', description: 'Open-source toolkit for DID-based credential issuance and verification. Rust core with bindings.' },
      { name: 'Transmute VC Platform', url: 'https://github.com/transmute-industries/verifiable-data', description: 'Enterprise-grade VC platform with API-first design.', restricted: true },
    ],
    samplePayloads: [
      {
        label: 'Verifiable Credential (Education)',
        language: 'json',
        code: `{
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  "type": ["VerifiableCredential", "EducationCredential"],
  "issuer": "did:web:university.edu",
  "validFrom": "2025-06-15",
  "credentialSubject": {
    "id": "did:example:learner456",
    "achievement": {
      "name": "B.S. Computer Science",
      "type": "Degree",
      "criteria": { "narrative": "Completed 120 credit hours..." }
    }
  },
  "proof": { "type": "DataIntegrityProof", "..." : "..." }
}`,
      },
    ],
    knownAdopters: ['Digital Credentials Consortium (MIT/Harvard)', 'European Blockchain Services Infrastructure (EBSI)', 'SpruceID', 'Dock.io', 'BC Government'],
    technicalDocLinks: [
      { label: 'W3C VC Data Model 2.0 Spec', url: 'https://w3.org/TR/vc-data-model-2.0' },
      { label: 'DID Core Specification', url: 'https://w3.org/TR/did-core' },
      { label: 'VC Implementation Guide', url: 'https://w3c.github.io/vc-imp-guide' },
    ],
    commonlyPairedWith: [
      { id: 'tcp-v4-5', rationale: 'TCP records gain cryptographic verifiability when wrapped as W3C VCs. This pairing is the recommended path for tamper-evident learner records.' },
      { id: 'hropen-skills-api-v4', rationale: 'HR Open skill identifiers can be embedded as credential subjects in VCs, enabling verifiable skill claims.' },
    ],
    compatibilityNotes: 'W3C VCs are the envelope/trust layer — they wrap payloads from other standards (TCP, HR Open, Open Badges). Not a competitor but a complement. Implementing VC without a payload standard gives you the trust infrastructure but no interoperable content.',
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'Wallet/holder UX is complex for low-digital-literacy users. Ensure fallback paper/QR mechanisms. Device requirements may exclude learners on older hardware.',
      lifDerived: true,
    },
    privacyConsiderations: {
      level: 'medium-concern',
      notes: 'Privacy-preserving by design when implemented correctly (selective disclosure, ZK proofs). Blockchain anchoring can create permanent public records — evaluate carefully. GDPR right-to-erasure conflicts with immutability must be addressed.',
      dataClassification: 'credential-metadata',
      regulations: ['GDPR (international contexts)', 'FERPA'],
    },
    relatedResources: ['tcp-v4-5', 'hropen-skills-api-v4'],
    status: 'under-review',
  },
];

// Human-readable title lookup keyed by entry ID.
export const entryTitles = {
  'hropen-skills-api-v4': 'HR Open Skills API v4.0',
  'tcp-v4-5': 'Trusted Career Profile',
  'lrw-competency-framework': 'LER Competency Framework',
  'edu-partner-agreement-template': 'EDU Partner Data Sharing Agreement',
  'w3c-vc-data-model': 'W3C Verifiable Credentials 2.0',
};

export const categoryFilters = [
  'All',
  'Skills & Credentials',
  'Learner Records',
  'Identity & Credentials',
  'Partner Agreements',
  'Governance',
];

export const typeFilters = ['All', 'Standard', 'Data Standard', 'Framework', 'Governance'];

export const burdenFilters = ['All', 'low', 'medium', 'high'];

// Unique list of all required capabilities across entries, for filtering.
export const allCapabilities = [...new Set(
  libraryEntries.flatMap(e => e.requiredCapabilities)
)].sort();

export const equityLevelFilters = ['All', 'low-concern', 'medium-concern', 'high-concern'];
export const privacyLevelFilters = ['All', 'low-concern', 'medium-concern', 'high-concern'];
