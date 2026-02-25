// libraryEntries.js — Reference library entries for LER ecosystem specifications.
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
    id: 'lrw-competency-framework',
    title: 'Learning & Employment Records (LER) Competency Framework',
    type: 'Framework',
    category: 'Learner Records',
    description: 'Structured competency taxonomy aligned to workforce needs, providing a bridge between educational outcomes and employer requirements. Serves as the overarching framework that CASE, CTDL, Open Badges, and CLR implement pieces of.',
    owner: 'US Chamber of Commerce Foundation',
    governanceBody: 'US Chamber of Commerce Foundation / T3 Innovation Network',
    lastUpdated: '2025-07-20',
    version: '2.1',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://www.uschamberfoundation.org/t3-innovation-network',
    authoritativeRepoUrl: 'https://github.com/uschamber/ler-competency-framework',
    tags: ['competency', 'LER', 'workforce', 'taxonomy', 'employer-aligned', '1EdTech', 'credential-engine'],
    // AI/analytics metadata
    aiTaxonomy: ['competency-taxonomy', 'employer-alignment', 'skills-mapping'],
    aiSummary: 'Competency taxonomy bridging education and workforce. Use to map curriculum outcomes to employer skill requirements.',
    aiUnlocksSummary: 'Enables your product to translate educational outcomes into employer-recognized competencies. Unlocks curriculum-to-job alignment, competency gap analysis, and sector-specific skill mapping — helping learners see the workforce value of what they learn.',
    // Implementation fields
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
      { label: 'Framework Documentation', url: 'https://www.uschamberfoundation.org/t3-innovation-network/ler' },
      { label: 'Sector Crosswalk Files', url: 'https://www.uschamberfoundation.org/t3-innovation-network/crosswalks' },
    ],
    // Cross-spec awareness
    commonlyPairedWith: [
      { id: 'case-v1', rationale: 'CASE provides the competency framework exchange mechanism that LER references for competency alignment across education and workforce.' },
      { id: 'ctdl', rationale: 'CTDL provides the linked-data vocabulary for describing credentials referenced in LER records, enabling credential transparency.' },
      { id: 'clr-v2', rationale: 'CLR is the primary record format for packaging LER data into a comprehensive, portable learner record.' },
      { id: 'open-badges-v3', rationale: 'Open Badges 3.0 provides the micro-credential and achievement format that feeds into LER-compatible learner records.' },
    ],
    compatibilityNotes: 'The LER Framework provides the overarching competency structure that CASE makes exchangeable, CTDL makes discoverable, and CLR/Open Badges make portable. It is the conceptual backbone connecting these implementation standards.',
    // Equity field
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'Taxonomy reflects current labor market which may embed historical inequities. Review sector-specific terms for bias before exposing to learners. Community validation process exists but is opt-in.',
      lifDerived: false,
    },
    // Privacy field
    privacyConsiderations: {
      level: 'low-concern',
      notes: 'Framework document only. No PII involved at the framework level. Usage analytics of framework adoption may require disclosure.',
      dataClassification: 'public',
    },
    relatedResources: ['case-v1', 'ctdl', 'open-badges-v3', 'clr-v2'],
    status: 'approved',
  },
  {
    id: 'case-v1',
    title: 'Competency & Academic Standards Exchange (CASE) v1.0',
    type: 'Standard',
    category: 'Competency Frameworks',
    description: '1EdTech standard for exchanging competency frameworks and academic standards as structured, machine-readable data via a REST/JSON API. Enables systems to publish, discover, and align competency definitions across institutions and platforms.',
    owner: '1EdTech Consortium',
    governanceBody: '1EdTech Consortium (formerly IMS Global)',
    lastUpdated: '2025-06-01',
    version: '1.0',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://www.imsglobal.org/case',
    authoritativeRepoUrl: 'https://github.com/1EdTech/CASE-Specification',
    tags: ['competency', 'CASE', 'academic-standards', '1EdTech', 'REST-API', 'framework-exchange'],
    aiTaxonomy: ['competency-exchange', 'academic-standards', 'framework-api'],
    aiSummary: 'REST/JSON API standard for publishing and exchanging competency frameworks. Use when systems need to share, align, or discover competency definitions across platforms.',
    aiUnlocksSummary: 'Enables your product to publish, consume, and align competency frameworks from multiple authorities (state standards, industry frameworks, institutional outcomes). Unlocks cross-institutional competency alignment, dynamic curriculum mapping, and automated standards crosswalking.',
    implementationBurden: 'medium',
    implementationBurdenRationale: 'Well-defined REST API with JSON responses. Moderate effort for consumer-side; higher for publisher-side where you must model your competency data into CASE format.',
    burdenRubric: {
      engineering: { level: 'moderate', note: '3–6 weeks for consumer integration; 6–10 weeks to publish frameworks via the API.' },
      infrastructure: { level: 'low', note: 'Standard REST API endpoints. No specialized infrastructure required.' },
      legal: { level: 'low', note: 'Open standard. 1EdTech membership recommended but not required for basic use.' },
      timeline: '4–10 weeks depending on consumer vs. publisher role',
    },
    requiredCapabilities: ['REST API client', 'JSON parser', 'Competency data model (for publishers)'],
    implementationGuidance: 'Start as a CASE consumer: query existing published frameworks (e.g., state standards) via the REST API. Build a local cache of competency trees. Phase 2: publish your own institutional competency frameworks. Use the CASE Network sandbox for testing.',
    referenceImplementations: [
      { name: 'CASE Network', url: 'https://casenetwork.imsglobal.org', description: 'Public registry of CASE-published competency frameworks from states and organizations.' },
      { name: 'OpenSALT', url: 'https://github.com/opensalt/opensalt', description: 'Open-source CASE framework editor and publisher.' },
    ],
    samplePayloads: [
      {
        label: 'CASE Competency Framework Item (JSON)',
        language: 'json',
        code: `{
  "CFItem": {
    "identifier": "urn:case:item:math-algebra-1",
    "fullStatement": "Solve linear equations in one variable",
    "humanCodingScheme": "MATH.ALG.1.1",
    "CFItemType": "Standard",
    "educationLevel": ["09", "10", "11"],
    "lastChangeDateTime": "2025-03-15T00:00:00Z"
  }
}`,
      },
    ],
    knownAdopters: ['Achieve (state standards)', 'OpenSALT community', 'Multiple US state education agencies', 'Credential Engine'],
    technicalDocLinks: [
      { label: 'CASE v1.0 Specification', url: 'https://www.imsglobal.org/spec/case/v1p0' },
      { label: 'CASE REST API Endpoints', url: 'https://www.imsglobal.org/spec/case/v1p0/errata' },
      { label: 'CASE Network (Public Registry)', url: 'https://casenetwork.imsglobal.org' },
    ],
    commonlyPairedWith: [
      { id: 'lrw-competency-framework', rationale: 'LER references competency frameworks that CASE makes exchangeable. CASE provides the API plumbing for distributing competency definitions used in LER records.' },
      { id: 'ctdl', rationale: 'CTDL describes credentials and their competency requirements. CASE provides the competency framework data that CTDL credential descriptions reference.' },
      { id: 'clr-v2', rationale: 'CLR records reference competencies achieved by learners. CASE provides the canonical framework identifiers that CLR uses for competency alignment.' },
    ],
    compatibilityNotes: 'CASE is complementary to CTDL (competency definitions vs. credential descriptions) and CLR (competency references in learner records). No overlaps or conflicts. JSON format is simpler than JSON-LD — consider a JSON-LD bridge if integrating with CTDL.',
    equityConsiderations: {
      level: 'low-concern',
      notes: 'Framework exchange standard with no PII. Equity concern: published frameworks may embed curriculum biases. Review competency language for cultural neutrality before adoption.',
      lifDerived: false,
    },
    privacyConsiderations: {
      level: 'low-concern',
      notes: 'Schema/framework data only. No learner PII involved. Published frameworks are public data.',
      dataClassification: 'public',
    },
    relatedResources: ['lrw-competency-framework', 'ctdl', 'clr-v2'],
    status: 'approved',
  },
  {
    id: 'ctdl',
    title: 'Credential Transparency Description Language (CTDL)',
    type: 'Standard',
    category: 'Credential Transparency',
    description: 'Linked-data vocabulary (JSON-LD/RDF) for describing credentials, organizations, competencies, and their relationships. Maintained by Credential Engine, CTDL powers the Credential Registry and enables machine-readable credential transparency at national scale.',
    owner: 'Credential Engine',
    governanceBody: 'Credential Engine',
    lastUpdated: '2025-08-01',
    version: 'current',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://credreg.net/ctdl/terms',
    authoritativeRepoUrl: 'https://github.com/CredentialEngine/CTDL_Json_Validation_Schema',
    tags: ['CTDL', 'credential-transparency', 'linked-data', 'JSON-LD', 'RDF', 'Credential-Engine', 'registry'],
    aiTaxonomy: ['credential-vocabulary', 'linked-data', 'transparency'],
    aiSummary: 'Linked-data vocabulary for describing credentials, their requirements, and issuing organizations. Use when publishing or consuming credential metadata for transparency and discovery.',
    aiUnlocksSummary: 'Enables your product to describe credentials in a machine-readable, semantically rich format that the Credential Registry and search engines can index. Unlocks credential discovery, comparison, and pathway mapping at national scale — letting learners and employers find and evaluate credentials across thousands of providers.',
    implementationBurden: 'medium',
    implementationBurdenRationale: 'JSON-LD/RDF requires familiarity with linked data concepts. Credential Engine provides tools and APIs that reduce the burden. Publishing to the Registry has a structured onboarding process.',
    burdenRubric: {
      engineering: { level: 'moderate', note: '4–8 weeks to model and publish credentials in CTDL. 2–4 weeks for consumer/search integration via Registry API.' },
      infrastructure: { level: 'low', note: 'Credential Engine hosts the Registry. Publishers need minimal infrastructure beyond data preparation.' },
      legal: { level: 'low', note: 'Open vocabulary. No licensing. Publishing agreement with Credential Engine is straightforward.' },
      timeline: '4–8 weeks for publishing; 2–4 weeks for consuming Registry data',
    },
    requiredCapabilities: ['JSON-LD understanding', 'Credential data modeling', 'REST API client (for Registry integration)'],
    implementationGuidance: 'Begin by exploring the Credential Registry search to understand CTDL data in practice. Map your credentials to CTDL terms using the CTDL Handbook. Use the Credential Engine publisher tool for initial data entry. For programmatic integration, use the Registry API.',
    referenceImplementations: [
      { name: 'Credential Finder', url: 'https://credentialfinder.org', description: 'National registry of credentials described in CTDL. Searchable by learners, employers, and systems.' },
      { name: 'CTDL Explorer', url: 'https://credreg.net/ctdl/explorer', description: 'Interactive browser for CTDL vocabulary terms and relationships.' },
    ],
    samplePayloads: [
      {
        label: 'CTDL Credential Description (JSON-LD)',
        language: 'json',
        code: `{
  "@context": "https://credreg.net/ctdl/schema/context/json",
  "@type": "ceterms:BachelorDegree",
  "ceterms:name": "B.S. Computer Science",
  "ceterms:ownedBy": {
    "@id": "https://credentialfinder.org/org/12345"
  },
  "ceterms:requires": [{
    "@type": "ceterms:ConditionProfile",
    "ceterms:targetCompetency": [
      { "ceterms:competencyText": "Software Engineering" }
    ]
  }]
}`,
      },
    ],
    knownAdopters: ['Credential Engine publisher network (4,000+ organizations)', 'US state longitudinal data systems', 'Lumina Foundation grantees', 'EMSI/Lightcast'],
    technicalDocLinks: [
      { label: 'CTDL Terms & Vocabulary', url: 'https://credreg.net/ctdl/terms' },
      { label: 'CTDL Handbook', url: 'https://credreg.net/ctdl/handbook' },
      { label: 'Credential Registry API', url: 'https://credreg.net/registry/assistant' },
    ],
    commonlyPairedWith: [
      { id: 'case-v1', rationale: 'CTDL credential descriptions reference competency frameworks. CASE provides the machine-readable competency data that CTDL credentials point to for their requirements.' },
      { id: 'open-badges-v3', rationale: 'Open Badges 3.0 credentials can embed CTDL metadata for richer credential descriptions. CTDL alignment adds discoverability via the Credential Registry.' },
      { id: 'lrw-competency-framework', rationale: 'LER competency taxonomy provides the workforce-aligned competency structure that CTDL credential descriptions reference.' },
    ],
    compatibilityNotes: 'CTDL is the description/transparency layer while Open Badges and CLR are the issuance/record layers. CTDL describes what a credential IS; OB3/CLR record that a learner HAS one. They are complementary, not competing. CTDL uses JSON-LD; ensure JSON-LD tooling is available if integrating with CASE (plain JSON).',
    equityConsiderations: {
      level: 'low-concern',
      notes: 'Vocabulary standard describing credentials. Equity benefit: makes credential information transparent and discoverable to underserved populations. Concern: credential descriptions may omit alternative or non-traditional pathways if not intentionally included.',
      lifDerived: false,
    },
    privacyConsiderations: {
      level: 'low-concern',
      notes: 'Describes credentials and organizations — no learner PII. Published data is public by design. Organizations publishing to the Registry share institutional information voluntarily.',
      dataClassification: 'public',
    },
    relatedResources: ['case-v1', 'open-badges-v3', 'lrw-competency-framework'],
    status: 'approved',
  },
  {
    id: 'open-badges-v3',
    title: 'Open Badges 3.0',
    type: 'Standard',
    category: 'Digital Credentials',
    description: '1EdTech standard for issuing, displaying, and verifying digital badges and micro-credentials. Version 3.0 aligns with W3C Verifiable Credentials, enabling cryptographic verification and decentralized trust for achievement recognition.',
    owner: '1EdTech Consortium',
    governanceBody: '1EdTech Consortium (formerly IMS Global)',
    lastUpdated: '2024-12-01',
    version: '3.0',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://www.imsglobal.org/spec/ob/v3p0',
    authoritativeRepoUrl: 'https://github.com/1EdTech/openbadges-specification',
    tags: ['open-badges', 'micro-credentials', 'digital-badges', '1EdTech', 'verifiable-credentials', 'JSON-LD', 'achievement'],
    aiTaxonomy: ['digital-badge', 'micro-credential', 'achievement-verification'],
    aiSummary: 'Standard for issuing and verifying digital badges aligned with W3C VCs. Use when implementing achievement recognition, micro-credentialing, or skill badge systems.',
    aiUnlocksSummary: 'Enables your product to issue, display, and verify portable digital badges that learners can share across platforms and with employers. Unlocks micro-credentialing programs, stackable credential pathways, and verifiable achievement sharing — with W3C VC alignment providing cryptographic trust without centralized verification.',
    implementationBurden: 'medium',
    implementationBurdenRationale: 'OB3 is well-documented with robust tooling. The W3C VC alignment adds cryptographic complexity but managed services exist. Issuing is more complex than consuming/verifying.',
    burdenRubric: {
      engineering: { level: 'moderate', note: '4–8 weeks for issuer implementation; 2–3 weeks for verifier/displayer. Managed badge platforms reduce to 1–2 weeks.' },
      infrastructure: { level: 'moderate', note: 'Issuers need key management for VC signing. Managed badge platforms (Badgr, Credly) handle infrastructure.' },
      legal: { level: 'low', note: 'Open standard. 1EdTech certification available but not required.' },
      timeline: '3–8 weeks depending on issuer vs. consumer role and managed vs. custom implementation',
    },
    requiredCapabilities: ['JSON-LD processing', 'Cryptographic signing (for issuers)', 'Badge display/rendering UI', 'REST API client'],
    implementationGuidance: 'Start as a badge verifier/displayer: accept and render OB3 badges from other issuers. Use a managed badge platform (Badgr, Credly, Accredible) for initial issuance to skip infrastructure. Custom issuance requires W3C VC signing infrastructure. Test with 1EdTech conformance suite.',
    referenceImplementations: [
      { name: '1EdTech OB3 Conformance Suite', url: 'https://www.imsglobal.org/spec/ob/v3p0/cert', description: 'Official conformance testing tool for Open Badges 3.0 implementations.' },
      { name: 'Badgr (open-source)', url: 'https://github.com/concentricsky/badgr-server', description: 'Open-source badge issuing platform supporting OB3.' },
    ],
    samplePayloads: [
      {
        label: 'Open Badge 3.0 Credential (JSON-LD)',
        language: 'json',
        code: `{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
  ],
  "type": ["VerifiableCredential", "OpenBadgeCredential"],
  "issuer": {
    "id": "https://university.edu/issuers/1",
    "type": "Profile",
    "name": "State University"
  },
  "credentialSubject": {
    "type": "AchievementSubject",
    "achievement": {
      "type": "Achievement",
      "name": "Python Programming Fundamentals",
      "criteria": { "narrative": "Completed 40-hour course..." }
    }
  }
}`,
      },
    ],
    knownAdopters: ['Credly', 'Badgr/Instructure', 'Accredible', 'Digital Promise', 'Mozilla Foundation (original OB creator)'],
    technicalDocLinks: [
      { label: 'Open Badges 3.0 Specification', url: 'https://www.imsglobal.org/spec/ob/v3p0' },
      { label: 'OB3 Implementation Guide', url: 'https://www.imsglobal.org/spec/ob/v3p0/impl' },
      { label: '1EdTech Certification Program', url: 'https://www.imsglobal.org/cc/detail.cfm' },
    ],
    commonlyPairedWith: [
      { id: 'clr-v2', rationale: 'CLR aggregates individual Open Badges into a comprehensive learner record. Open Badges are the building blocks; CLR is the container.' },
      { id: 'ctdl', rationale: 'CTDL metadata can enrich Open Badge credential descriptions, adding discoverability and transparency to badge programs via the Credential Registry.' },
      { id: 'lrw-competency-framework', rationale: 'LER competency definitions can be referenced as achievement criteria in Open Badges, connecting badge evidence to workforce-aligned competencies.' },
    ],
    compatibilityNotes: 'OB3 is built on W3C Verifiable Credentials, so it inherits VC trust infrastructure. CLR 2.0 extends OB3 — they share the same data model foundation. CTDL can describe the same credentials that OB3 issues, providing the transparency layer. No conflicts with CASE; competency frameworks from CASE can be referenced as badge criteria.',
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'Badge UX must be accessible across devices and literacy levels. Visual badge design should meet WCAG standards. Wallet/sharing UX can be a barrier for low-digital-literacy populations. Consider QR code and paper-friendly fallbacks.',
      lifDerived: true,
    },
    privacyConsiderations: {
      level: 'medium-concern',
      notes: 'Badges contain learner achievement data. Hosted badge verification can create tracking vectors. Learner consent required before public sharing. Revocation mechanisms needed for accuracy. FERPA considerations when badges are issued by educational institutions.',
      dataClassification: 'credential-metadata',
      regulations: ['FERPA (educational contexts)', 'GDPR (international)'],
    },
    relatedResources: ['clr-v2', 'ctdl', 'lrw-competency-framework'],
    status: 'approved',
  },
  {
    id: 'clr-v2',
    title: 'Comprehensive Learner Record (CLR) 2.0',
    type: 'Standard',
    category: 'Learner Records',
    description: '1EdTech standard for comprehensive, portable learner achievement records. CLR 2.0 extends Open Badges 3.0 to aggregate multiple achievements, competencies, and experiences into a single verifiable record aligned with W3C Verifiable Credentials.',
    owner: '1EdTech Consortium',
    governanceBody: '1EdTech Consortium (formerly IMS Global)',
    lastUpdated: '2024-12-01',
    version: '2.0',
    accessLevel: 'open',
    opennessStatus: 'open',
    accessUrl: 'https://www.imsglobal.org/spec/clr/v2p0',
    authoritativeRepoUrl: 'https://github.com/1EdTech/CLR-Specification',
    tags: ['CLR', 'comprehensive-learner-record', 'learner-record', '1EdTech', 'verifiable-credentials', 'JSON-LD', 'portable-record'],
    aiTaxonomy: ['learner-record', 'credential-aggregation', 'portable-record'],
    aiSummary: 'Standard for aggregating achievements, badges, and competencies into a comprehensive, verifiable learner record. Use when building learner portfolios, transcript alternatives, or comprehensive credential packages.',
    aiUnlocksSummary: 'Enables your product to create comprehensive, portable learner records that aggregate badges, credentials, competencies, and experiences into a single verifiable package. Unlocks holistic learner profiles, transcript modernization, competency-based record-keeping, and cross-institutional record portability — giving learners a complete, verifiable picture of their achievements.',
    implementationBurden: 'high',
    implementationBurdenRationale: 'CLR 2.0 builds on OB3 and W3C VC, requiring familiarity with both. Aggregating multiple credential types into a coherent record adds data modeling complexity. Managed platforms exist but full custom implementation is significant.',
    burdenRubric: {
      engineering: { level: 'high', note: '8–16 weeks for full issuer implementation. 4–6 weeks for consumer/viewer. Managed platforms reduce effort.' },
      infrastructure: { level: 'high', note: 'Requires credential aggregation pipeline, W3C VC signing infrastructure, and learner consent management.' },
      legal: { level: 'moderate', note: 'Learner data aggregation requires consent management. FERPA compliance for educational institutions. 1EdTech certification available.' },
      timeline: '3–6 months for full implementation; 6–8 weeks for consumer-only mode',
    },
    requiredCapabilities: ['JSON-LD processing', 'W3C VC signing infrastructure', 'Credential aggregation pipeline', 'Learner consent UI', 'Open Badges 3.0 compatibility'],
    implementationGuidance: 'Begin by implementing Open Badges 3.0 support first — CLR extends OB3. Start as a CLR consumer: accept and display CLR records from other issuers. Phase 2: aggregate your own badges/achievements into CLR records. Phase 3: implement full issuance with consent management and VC signing. Use 1EdTech conformance suite for validation.',
    referenceImplementations: [
      { name: '1EdTech CLR Conformance Suite', url: 'https://www.imsglobal.org/spec/clr/v2p0/cert', description: 'Official conformance testing for CLR 2.0 implementations.' },
      { name: 'CLR Reference Implementation', url: 'https://github.com/1EdTech/CLR-Reference', description: 'Reference implementation demonstrating CLR record creation and verification.' },
    ],
    samplePayloads: [
      {
        label: 'CLR 2.0 Record (JSON-LD, simplified)',
        language: 'json',
        code: `{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/clr/v2p0/context.json"
  ],
  "type": ["VerifiableCredential", "ClrCredential"],
  "issuer": {
    "id": "https://university.edu/issuers/1",
    "type": "Profile",
    "name": "State University"
  },
  "credentialSubject": {
    "type": "ClrSubject",
    "verifiableCredential": [{
      "type": ["VerifiableCredential", "OpenBadgeCredential"],
      "credentialSubject": {
        "achievement": {
          "name": "Data Structures & Algorithms",
          "type": "Achievement"
        }
      }
    }]
  }
}`,
      },
    ],
    knownAdopters: ['Western Governors University', 'AACRAO (Digital Connect)', 'Parchment', 'National Student Clearinghouse'],
    technicalDocLinks: [
      { label: 'CLR 2.0 Specification', url: 'https://www.imsglobal.org/spec/clr/v2p0' },
      { label: 'CLR Implementation Guide', url: 'https://www.imsglobal.org/spec/clr/v2p0/impl' },
      { label: 'CLR & Open Badges Relationship', url: 'https://www.imsglobal.org/activity/comprehensive-learner-record' },
    ],
    commonlyPairedWith: [
      { id: 'open-badges-v3', rationale: 'CLR 2.0 extends Open Badges 3.0. Individual badges are aggregated into CLR records. Implement OB3 first as the foundation.' },
      { id: 'case-v1', rationale: 'CASE-published competency frameworks provide the canonical competency identifiers referenced in CLR achievement records.' },
      { id: 'lrw-competency-framework', rationale: 'LER provides the workforce-aligned competency taxonomy that CLR records reference for employer-readable skill evidence.' },
    ],
    compatibilityNotes: 'CLR 2.0 is a superset of Open Badges 3.0 — every OB3 badge can be included in a CLR. Both are built on W3C Verifiable Credentials. CTDL can describe CLR-issued credentials for registry transparency. CASE competency identifiers can be referenced in CLR achievement criteria. The entire LER stack fits together without conflicts.',
    equityConsiderations: {
      level: 'medium-concern',
      notes: 'CLR aggregation complexity can create a digital divide. Learners with fewer institutional touchpoints may have thinner CLR records, potentially disadvantaging them. Ensure CLR viewers present non-traditional achievements equitably. Wallet UX accessibility is critical.',
      lifDerived: true,
    },
    privacyConsiderations: {
      level: 'high-concern',
      notes: 'CLR records aggregate comprehensive learner data including achievements, competencies, and institutional history. FERPA compliance mandatory for educational issuers. Learner consent required for each achievement included. Selective disclosure mechanisms (from W3C VC) should be implemented to let learners share only relevant portions.',
      dataClassification: 'PII / educational-record',
      regulations: ['FERPA', 'COPPA (under-13 contexts)', 'GDPR (international)', 'state privacy laws'],
    },
    relatedResources: ['open-badges-v3', 'case-v1', 'lrw-competency-framework'],
    status: 'approved',
  },
];

// Human-readable title lookup keyed by entry ID.
export const entryTitles = {
  'lrw-competency-framework': 'LER Competency Framework',
  'case-v1': 'CASE v1.0',
  'ctdl': 'CTDL',
  'open-badges-v3': 'Open Badges 3.0',
  'clr-v2': 'CLR 2.0',
};

export const categoryFilters = [
  'All',
  'Learner Records',
  'Competency Frameworks',
  'Credential Transparency',
  'Digital Credentials',
];

export const typeFilters = ['All', 'Standard', 'Framework'];

export const burdenFilters = ['All', 'low', 'medium', 'high'];

// Unique list of all required capabilities across entries, for filtering.
export const allCapabilities = [...new Set(
  libraryEntries.flatMap(e => e.requiredCapabilities)
)].sort();

export const equityLevelFilters = ['All', 'low-concern', 'medium-concern', 'high-concern'];
export const privacyLevelFilters = ['All', 'low-concern', 'medium-concern', 'high-concern'];
