// LibraryPage.jsx — The main working reference library interface.
// WHY IT EXISTS: This is the primary deliverable surface described in the PDD —
// "a living, AI-driven website that functions as a standards and project library,
// enabling stakeholders to find, access, and apply approved resources intelligently."

import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { libraryEntries, categoryFilters, burdenFilters, allCapabilities, equityLevelFilters, privacyLevelFilters } from '../data/libraryEntries';
import {
  stakeholderTaxonomy,
  useCasesCedsRdf,
} from '../data/taxonomies';
import { fieldMappings, specLabels } from '../data/fieldMappings';
import LibraryEntryCard from './LibraryEntryCard';
import ExplainerBadge from './ExplainerBadge';
import WireframeBox from './WireframeBox';

const concernLabel = {
  'low-concern': 'Low',
  'medium-concern': 'Moderate',
  'high-concern': 'High',
};
const concernIcon = {
  'low-concern': '🟢',
  'medium-concern': '🟡',
  'high-concern': '🔴',
};

export default function LibraryPage({ selectedEntryId = null, onNavigateToEntry, onClearSelection, onActivateNeeds, hasPendingRoadmap, onGoToRoadmap }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [burden, setBurden] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');
  const [capabilityFilter, setCapabilityFilter] = useState([]);
  const [equityFilter, setEquityFilter] = useState('All');
  const [privacyFilter, setPrivacyFilter] = useState('All');
  const [showExplainers, setShowExplainers] = useState(true);

  const [sortBy, setSortBy] = useState('relevant');

  // AI Interoperability Mapper state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiSources, setAiSources] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (selectedEntryId) {
      setQuery('');
      setCategory('All');
      setBurden('All');
      setAccessFilter('All');
      setCapabilityFilter([]);
      setEquityFilter('All');
      setPrivacyFilter('All');
    }
  }, [selectedEntryId]);

  const toggleCapability = (cap) => {
    setCapabilityFilter(prev =>
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  };

  const hasActiveFilters = category !== 'All' || burden !== 'All' || accessFilter !== 'All' ||
    capabilityFilter.length > 0 || equityFilter !== 'All' || privacyFilter !== 'All' || query;

  const resetAll = () => {
    setBurden('All');
    setAccessFilter('All');
    setCategory('All');
    setQuery('');
    setCapabilityFilter([]);
    setEquityFilter('All');
    setPrivacyFilter('All');
  };

  const filtered = useMemo(() => {
    let results = libraryEntries.filter(e => {
      const q = query.toLowerCase();
      const matchQuery = !query ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.includes(q)) ||
        e.aiTaxonomy.some(t => t.includes(q)) ||
        e.requiredCapabilities.some(c => c.toLowerCase().includes(q));
      const matchCat = category === 'All' || e.category === category;
      const matchBurden = burden === 'All' || e.implementationBurden === burden;
      const matchAccess = accessFilter === 'All' || e.accessLevel === accessFilter;
      const matchCaps = capabilityFilter.length === 0 ||
        capabilityFilter.every(cap => e.requiredCapabilities.includes(cap));
      const matchEquity = equityFilter === 'All' || e.equityConsiderations.level === equityFilter;
      const matchPrivacy = privacyFilter === 'All' || e.privacyConsiderations.level === privacyFilter;
      return matchQuery && matchCat && matchBurden && matchAccess && matchCaps && matchEquity && matchPrivacy;
    });

    if (sortBy === 'updated') {
      results = [...results].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else if (sortBy === 'burden-asc') {
      const order = { low: 0, medium: 1, high: 2 };
      results = [...results].sort((a, b) => order[a.implementationBurden] - order[b.implementationBurden]);
    }

    return results;
  }, [query, category, burden, accessFilter, capabilityFilter, equityFilter, privacyFilter, sortBy]);

  // Fetch and condense the ontology for the AI context
  const fetchOntologyContext = async () => {
    const res = await fetch('/ontology.jsonld');
    if (!res.ok) return null;
    const data = await res.json();
    const graph = data['@graph'] || [];

    const BASE = 'https://firsteducore.org/ontology#';
    const getVal = (node, key) => node[key] ?? node[BASE + key] ?? '';
    const getStr = (node, key) => { const v = getVal(node, key); return typeof v === 'string' ? v : v?.['@value'] ?? ''; };
    const getArr = (node, key) => { const v = getVal(node, key); return Array.isArray(v) ? v : v ? [v] : []; };

    const specs = graph.filter(n => n['@type']?.endsWith('Specification')).map(n => ({
      uri: n['@id'],
      title: n['dcterms:title'] || '',
      category: getStr(n, 'category'),
      owner: getStr(n, 'owner'),
      burden: getStr(n, 'implementationBurden'),
      aiSummary: getStr(n, 'aiSummary'),
      compatibilityNotes: getStr(n, 'compatibilityNotes'),
      guidance: getStr(n, 'implementationGuidance'),
      pairedWith: getArr(n, 'commonlyPairedWith').map(r => r['@id'] || r),
      page: n['foaf:page']?.['@id'] || '',
    }));

    const domains = graph.filter(n => n['@type']?.endsWith('CedsDomain')).map(n => ({
      uri: n['@id'],
      label: n['rdfs:label'] || '',
    }));

    const alignments = graph.filter(n => n['@type']?.endsWith('CedsAlignment')).map(n => ({
      uri: n['@id'],
      spec: getVal(n, 'specification')?.['@id'] || '',
      domain: getVal(n, 'cedsDomain')?.['@id'] || '',
      status: getStr(n, 'alignmentStatus'),
      notes: getStr(n, 'notes'),
      elements: getArr(n, 'cedsElement'),
      privacyRisk: getStr(n, 'alignmentPrivacyRisk'),
      piiFields: getArr(n, 'piiField').map(r => r['@id'] || r),
    }));

    const domainPrivacy = graph.filter(n => n['@type']?.endsWith('DomainPrivacyProfile')).map(n => ({
      uri: n['@id'],
      domainId: n['@id'].replace(BASE + 'domain-privacy/', ''),
      riskLevel: getStr(n, 'privacyRiskLevel'),
      rationale: getStr(n, 'privacyRiskRationale'),
      piiCategories: getArr(n, 'piiCategories').map(r => (r['@id'] || r).replace(BASE + 'pii-category/', '')),
      regulations: getArr(n, 'applicableRegulation'),
      consentRequired: getVal(n, 'consentRequired') === true || getVal(n, 'consentRequired') === 'true',
      transferRisk: getStr(n, 'transferRisk'),
    }));

    const piiFields = graph.filter(n => n['@type']?.endsWith('PIIField')).map(n => ({
      uri: n['@id'],
      label: n['rdfs:label'] || '',
      fieldPath: getStr(n, 'fieldPath'),
      piiCategory: (getVal(n, 'piiCategory')?.[' @id'] || getVal(n, 'piiCategory')?.['@id'] || '').replace(BASE + 'pii-category/', ''),
      sensitivityLevel: getStr(n, 'sensitivityLevel'),
      ferpaProtected: getVal(n, 'ferpaProtected') === true || getVal(n, 'ferpaProtected') === 'true',
      coppaScope: getVal(n, 'coppaScope') === true || getVal(n, 'coppaScope') === 'true',
      mitigation: getStr(n, 'mitigationStrategy'),
    }));

    return { specs, domains, alignments, domainPrivacy, piiFields };
  };

  const buildStakeholderContext = () => {
    const stakeholders = stakeholderTaxonomy.flatMap(group =>
      group.children.map(child => ({
        id: child.id,
        label: child.label,
        group: group.label,
        needs: child.businessNeeds,
      }))
    );
    const useCases = useCasesCedsRdf.map(uc => ({
      id: uc.id,
      label: uc.label,
      stakeholders: uc.stakeholders,
      businessNeeds: uc.businessNeeds,
      cedsDomains: uc.cedsDomains,
    }));
    return { stakeholders, useCases };
  };

  const buildFieldMappingContext = () => {
    const specKeys = Object.keys(specLabels);
    const header = `| Concept | ${specKeys.map(k => specLabels[k]).join(' | ')} | Strength |`;
    const sep = `|---|${specKeys.map(() => '---').join('|')}|---|`;
    const rows = fieldMappings.map(m => {
      const cells = specKeys.map(k => {
        const entry = m.mappings[k];
        return entry ? `\`${entry.field}\`` : '—';
      });
      return `| ${m.concept} | ${cells.join(' | ')} | ${m.matchStrength} |`;
    });
    return `${header}\n${sep}\n${rows.join('\n')}`;
  };

  const downloadAiSkill = () => {
    const slug = aiQuery.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

    const specSources = aiSources.filter(s => s.type === 'Specification');
    const specList = specSources
      .map(s => `- **${s.label}** (\`${s.uri.replace('https://firsteducore.org/ontology#', 'educore:')}\`)`)
      .join('\n');

    const domainList = aiSources
      .filter(s => s.type === 'CEDS Domain')
      .map(s => `- ${s.label}`)
      .join('\n');

    const specNames = specSources.map(s => s.label).join(', ');

    // Match recommended specs back to libraryEntries for sample payloads and burden rubrics
    const matchedEntries = specSources.map(s => {
      const localName = s.uri.replace('https://firsteducore.org/ontology#spec/', '');
      return libraryEntries.find(e => e.id === localName);
    }).filter(Boolean);

    // Build sample payload section from matched entries
    const payloadSection = matchedEntries.flatMap(entry =>
      (entry.samplePayloads || []).map(p =>
        `### ${entry.title} — ${p.label}\n\`\`\`${p.language}\n${p.code}\n\`\`\``
      )
    ).join('\n\n');

    // Build burden rubric section
    const burdenSection = matchedEntries.map(entry => {
      if (!entry.burdenRubric) return '';
      const rows = Object.entries(entry.burdenRubric)
        .map(([dim, r]) => `| ${dim} | ${r.level} | ${r.note} |`).join('\n');
      return `### ${entry.title} (overall: ${entry.implementationBurden})\n| Dimension | Level | Notes |\n|---|---|---|\n${rows}`;
    }).filter(Boolean).join('\n\n');

    // Build field mapping crosswalk for recommended specs
    const specIds = matchedEntries.map(e => {
      // Map entry IDs back to fieldMappings keys
      const idMap = { 'case-v1': 'case-1.1', 'ctdl': 'asn-ctdl', 'open-badges-v3': 'ob3', 'clr-v2': 'clr-2.0', 'lrw-competency-framework': 'ieee-scd' };
      return idMap[e.id] || e.id;
    });
    const relevantMappings = fieldMappings.filter(m =>
      specIds.some(id => m.mappings[id])
    );
    let fieldMappingSection = '';
    if (relevantMappings.length > 0) {
      const activeKeys = Object.keys(specLabels).filter(k => specIds.includes(k));
      const header = `| Concept | ${activeKeys.map(k => specLabels[k]).join(' | ')} | Strength |`;
      const sep = `|---|${activeKeys.map(() => '---').join('|')}|---|`;
      const rows = relevantMappings.map(m => {
        const cells = activeKeys.map(k => {
          const entry = m.mappings[k];
          return entry ? `\`${entry.field}\` (\`${entry.path}\`)` : '—';
        });
        return `| ${m.concept} | ${cells.join(' | ')} | ${m.matchStrength} |`;
      });
      fieldMappingSection = `${header}\n${sep}\n${rows.join('\n')}`;
    }

    const content = `---
name: edu-interop-${slug || 'mapper'}
description: >
  Education data interoperability skill for: ${aiQuery.slice(0, 120).replace(/\n/g, ' ')}
  TRIGGER when working on integrations involving ${specNames || 'education standards'}.
  DO NOT TRIGGER for general programming tasks unrelated to education data exchange.
---

# EDU Interoperability Skill

## Use Case This Skill Was Generated For
> ${aiQuery.replace(/\n/g, '\n> ')}

## Recommended Standards
${specList || '_No specific specifications extracted._'}

## CEDS Domains Involved
${domainList || '_No specific domains extracted._'}

## AI-Generated Mapping Guidance

${aiResponse}

---

## Implementation Burden Rubrics
${burdenSection || '_No burden rubrics available for the recommended standards._'}

## Field-Level Crosswalk
Use this table to map fields between the recommended specifications. Field paths use dot notation
matching each spec's JSON/JSON-LD schema.

${fieldMappingSection || '_No field mappings available for the recommended standards._'}

## Sample JSON-LD Payloads
Copy and adapt these templates for your implementation. Each payload follows the spec's normative
JSON-LD structure.

${payloadSection || '_No sample payloads available for the recommended standards._'}

## Transport Layer Patterns

When building a connector or integration between systems, use these patterns:

### REST API Contract Template
\`\`\`
POST /api/v1/credentials/exchange
Content-Type: application/ld+json
Authorization: Bearer {oauth2_access_token}

Accept: application/ld+json
\`\`\`

### OAuth 2.0 Institutional Trust Flow
1. **Registration:** Each institution registers as an OAuth 2.0 client with the receiving system
2. **Token request:** Client credentials grant (\`grant_type=client_credentials\`) with scope limited to data categories from NDPA Exhibit B
3. **Token scoping:** Scopes should map to NDPA data categories (e.g., \`student:enrollment\`, \`student:demographics\`, \`student:assessment\`)
4. **Token lifetime:** Short-lived (15-60 min) with no refresh tokens for batch transfers

### Error Handling
\`\`\`json
{
  "error": "invalid_scope",
  "error_description": "Requested data category 'student:health' not authorized in DPA Exhibit B",
  "ndpa_exhibit_b_ref": "Special Indicator > Medical alerts/health data"
}
\`\`\`

## Student Data Privacy Compliance

### SDPC National Data Privacy Agreement (NDPA v2.2)
Reference: https://files.a4l.org/privacy/NDPA/NDPA_v2-2_STANDARD_WEB.pdf
Registry: https://privacy.a4l.org/national-dpa/

When exchanging student data between institutions or with providers, ensure a signed NDPA (or
equivalent DPA) is in place. The NDPA defines the legal framework for all student data handled by
the recommended specifications above.

### NDPA Compliance Checklist

**Before Implementation:**
- [ ] Signed DPA/NDPA between all parties (LEA ↔ Provider or LEA ↔ LEA)
- [ ] Exhibit A completed: Services described and scoped
- [ ] Exhibit B completed: Specific data elements identified as Required (R) or Optional (O)
- [ ] Exhibit F completed: Cybersecurity framework declared (NIST CSF, ISO 27000, CIS, or SDPC GESS)
- [ ] Exhibit G attached if state-specific terms apply
- [ ] Provider designated as School Official with legitimate educational interest (FERPA §99.31(a)(1))

**NDPA Exhibit B — Data Categories (map your payloads to these):**
- Application Technology Metadata (IP addresses, cookies)
- Application Use Statistics (interaction metadata)
- Assessment (standardized scores, observation data, voice recordings)
- Attendance (school daily, class-level)
- Communication (emails, blog entries captured)
- Conduct (behavioral data)
- Demographics (DOB, place of birth, gender, ethnicity, race, language)
- Enrollment (school enrollment, grade level, homeroom, counselor, graduation year)
- Parent/Guardian Contact Information (address, email, phone)
- Parent/Guardian ID (linked parent-student identifiers)
- Parent/Guardian Name
- Schedule (courses, teacher names)
- Special Indicator (ELL, low-income, medical, disability, IEP/504, homeless/foster)
- Student Contact Information (address, email, phone)
- Student Identifiers (local ID, state ID, provider-assigned ID, username, passwords)
- Student Name
- Student In App Performance
- Student Program Membership (academic/extracurricular)
- Student Survey Responses
- Student Work (student generated content)
- Transcript (course grades, performance scores)
- Transportation (bus assignment, pick-up/drop-off, bus card ID)

**Data Handling Rules (from NDPA Standard Clauses):**
- [ ] **No Sale:** Provider shall not sell Student Data (Article IV §4.4)
- [ ] **Purpose Limitation:** Data used only for Services described in Exhibit A (§4.2)
- [ ] **No Targeted Advertising:** Targeted advertising strictly prohibited; contextual ads and adaptive learning permitted (§4.7)
- [ ] **Subprocessor Agreements:** All subprocessors bound by equivalent terms; must not sell Student Data (§2.3)
- [ ] **De-identification:** If creating de-identified data, must follow NIST or US DoE standards; no re-identification without LEA direction (§4.5)
- [ ] **Data Minimization:** Only process data elements listed in Exhibit B — if new elements needed, submit Addendum with 30-day LEA objection window (§1.3)
- [ ] **Employee Confidentiality:** All employees with access must have signed confidentiality agreements (§4.3)
- [ ] **Storage Location:** If data stored outside US, countries listed in Exhibit B (§5.1)

**Breach Notification (Article V §5.4):**
- [ ] Provider notifies LEA within **72 hours** of confirmed breach
- [ ] Notification includes: provider contact, date of notice, date/range of breach, description, affected data types, impacted individuals
- [ ] Provider maintains written breach response plan consistent with industry standards
- [ ] LEA is responsible for notifying affected students/parents/guardians
- [ ] Annual security audit required; audit report available to LEA on 10 days' notice (§5.2)

**Data Retention & Deletion (§4.6):**
- [ ] On written LEA request: dispose of data within **60 days**
- [ ] On DPA termination: dispose of data within **60 days** (unless directed otherwise)
- [ ] LEA may issue special disposition instructions via Exhibit D (partial/complete, destroy/transfer)
- [ ] De-identified data and transferred Student Generated Content survive deletion requirements

### FERPA Compliance Checklist
- [ ] Provider operates under "School Official" exception (20 U.S.C. §1232g; 34 CFR §99.31(a)(1))
- [ ] LEA annual notification includes Provider as School Official with legitimate educational interest
- [ ] **Minimum Necessary:** Only fields required for the stated educational purpose are transmitted
- [ ] **Directory Information:** If using directory info, LEA has published directory info notice and opt-out period has passed
- [ ] **Re-disclosure:** Provider does not re-disclose PII except to subprocessors bound by DPA or as permitted (34 CFR §99.33)
- [ ] **Audit trail:** System logs who accessed what student records and when
- [ ] **Parent/eligible student access:** Mechanism exists for LEA to request and receive student data copies within 30 days (§2.2)

### State Privacy Law Considerations
- **COPPA** (15 U.S.C. §6501-6506): Applies to children under 13. If the service collects data from students under 13, LEA provides consent on behalf of parents for school-authorized educational purposes.
- **SOPIPA-type laws** (CA, NY, CO, CT, etc.): Many states have Student Online Personal Protection Acts that go beyond FERPA. Check Exhibit G (Supplemental State Terms) for applicable state.
- **State breach notification:** State laws may impose shorter notification windows than the NDPA's 72 hours. Exhibit G should address this.

## End-to-End Worked Example

**Scenario:** District A sends student enrollment data to District B during a mid-year transfer.

### Step 1: Verify DPA Coverage
Both districts must have a signed DPA (or be Subscribing LEAs under the same Provider's Exhibit E).
Confirm Exhibit B includes: Student Name, Student Identifiers, Demographics, Enrollment, Transcript.

### Step 2: Build the Payload
Using the recommended standards above, construct a JSON-LD credential. Map NDPA Exhibit B
categories to spec fields using the Field-Level Crosswalk table in this skill.

### Step 3: Apply Data Minimization
Before transmitting, strip any Exhibit B categories NOT listed in the receiving district's DPA.
For example, if the receiving DPA does not list "Special Indicator," remove IEP/504 and medical data.

### Step 4: Transmit
\`\`\`
POST https://district-b.edu/api/v1/credentials/exchange
Content-Type: application/ld+json
Authorization: Bearer {oauth2_token}
X-DPA-Reference: NDPA-2024-0042
X-Data-Categories: student:name,student:identifiers,student:demographics,student:enrollment,student:transcript
\`\`\`

### Step 5: Audit & Confirm
- Log the transfer: timestamp, sender, receiver, data categories, student count, DPA reference
- Receiving district verifies credential signature (if using W3C VC)
- Both districts retain audit log for duration of DPA + retention schedule

---

## How to Use This Skill
When a developer describes an interoperability problem involving the standards above, use the
guidance in this skill to:
- Map the developer's data requirements to NDPA Exhibit B categories to determine what data is permissible
- Suggest appropriate field mappings using the crosswalk table above
- Generate JSON-LD payloads adapted from the sample templates, scoped to authorized data categories
- Identify CEDS domain alignment for each standard
- Recommend implementation sequence by burden level (low → medium → high)
- Apply the privacy compliance checklists before any data exchange goes live
- Reference the transport layer patterns for API contracts and auth flows

## What This Skill Cannot Do
- Make live API calls to standards registries (Credential Registry, IMS Global, etc.)
- Validate credentials against CEDS RDF endpoints in real time
- Auto-configure LMS plugins or EdTech vendor APIs
- Provide implementation timelines — burden ratings are estimates only
- Field mappings reflect a static ontology snapshot; verify against live spec docs
- Replace legal review — privacy checklists are guidance, not legal advice
- Provide state-specific privacy terms — consult Exhibit G for your state

## Installation
Save this file to \`~/.claude/skills/edu-interop-${slug || 'mapper'}.md\`
Then in Claude Code, type \`/${slug || 'edu-interop'}\` to invoke it.

## Reference
Generated by EDU Reference Library — https://edc2-25.onrender.com
Ontology: https://edc2-25.onrender.com/ontology.jsonld
SDPC National Data Privacy Agreement (NDPA v2.2): https://files.a4l.org/privacy/NDPA/NDPA_v2-2_STANDARD_WEB.pdf
SDPC Privacy Registry: https://privacy.a4l.org/national-dpa/
FERPA: 20 U.S.C. §1232g (34 CFR Part 99)
COPPA: 15 U.S.C. §6501-6506 (16 CFR Part 312)
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edu-interop-${slug || 'mapper'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAiSubmit = async () => {
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiError('');
    setAiResponse('');
    setAiSources([]);

    try {
      console.group('%c[EDU AI] Interoperability Mapping Request', 'color: #4f46e5; font-weight: bold');
      console.log('%cUser query:', 'font-weight: bold', aiQuery);

      console.log('%c[1/4] Fetching ontology (ontology.jsonld)…', 'color: #6366f1');
      const ontology = await fetchOntologyContext();
      if (ontology) {
        console.log('%c[1/4] Ontology loaded:', 'color: #16a34a',
          `${ontology.specs.length} specs, ${ontology.domains.length} CEDS domains, ${ontology.alignments.length} alignment triples, ${ontology.domainPrivacy.length} domain privacy profiles, ${ontology.piiFields.length} PII fields`);
        console.table(ontology.specs.map(s => ({ title: s.title, uri: s.uri, burden: s.burden, category: s.category })));
        console.table(ontology.domains.map(d => ({ label: d.label, uri: d.uri })));
      } else {
        console.warn('%c[1/4] Ontology fetch failed — proceeding without RDF context', 'color: #dc2626');
      }

      console.log('%c[2/4] Building stakeholder & use case context…', 'color: #6366f1');
      const { stakeholders, useCases } = buildStakeholderContext();
      console.log(`  ${stakeholders.length} stakeholders, ${useCases.length} use cases`);

      const highRiskAlignments = ontology
        ? ontology.alignments.filter(a => a.privacyRisk === 'high')
        : [];
      const piiFieldMap = ontology
        ? Object.fromEntries(ontology.piiFields.map(f => [f.uri, f]))
        : {};

      const ontologyContext = ontology
        ? `\n\nYou have access to the EDU Reference Library ontology (JSON-LD at https://edc2-25.onrender.com/ontology.jsonld). Use it to ground your answer.\n\n## Specifications in the ontology:\n${ontology.specs.map(s =>
              `- **${s.title}** (${s.uri})\n  Category: ${s.category} | Owner: ${s.owner} | Burden: ${s.burden}\n  Summary: ${s.aiSummary}\n  Compatibility: ${s.compatibilityNotes}\n  Paired with: ${s.pairedWith.join(', ')}\n  Spec page: ${s.page}`
            ).join('\n')}\n\n## CEDS Domains:\n${ontology.domains.map(d => `- ${d.label} (${d.uri})`).join('\n')}\n\n## CEDS Alignment Triples (spec → domain → status):\n${ontology.alignments.map(a => `- ${a.spec} → ${a.domain} = ${a.status}${a.privacyRisk ? ' [privacy:' + a.privacyRisk + ']' : ''}${a.notes ? ': ' + a.notes : ''}${a.elements.length ? ' [elements: ' + a.elements.join(', ') + ']' : ''}`).join('\n')}\n\n## CEDS Domain Privacy Risk Levels:\n${ontology.domainPrivacy.map(d => `- **${d.domainId}** (${d.uri}): risk=${d.riskLevel} | consent=${d.consentRequired} | transferRisk=${d.transferRisk} | regulations=[${d.regulations.join(', ')}] | piiTypes=[${d.piiCategories.join(', ')}]\n  Rationale: ${d.rationale}`).join('\n')}\n\n## High-Risk Spec × Domain Combinations (with PII fields):\n${highRiskAlignments.map(a => {
              const specLabel = a.spec.replace('https://firsteducore.org/ontology#spec/', '');
              const domainLabel = a.domain.replace('https://firsteducore.org/ontology#ceds-domain/', '');
              const fields = a.piiFields.map(fUri => {
                const f = piiFieldMap[fUri];
                return f ? `${f.label} (${f.piiCategory}, ferpa=${f.ferpaProtected}) → mitigation: ${f.mitigation}` : fUri;
              });
              return `- **${specLabel}** × **${domainLabel}**: ${fields.length ? '\n    ' + fields.join('\n    ') : 'no specific PII fields listed'}`;
            }).join('\n')}`
        : '';

      const stakeholderContext = `\n\n## Available Stakeholders (use these exact IDs):\n${stakeholders.map(s => `- id: "${s.id}" | ${s.label} (${s.group})`).join('\n')}\n\n## Available Use Cases (use these exact IDs):\n${useCases.map(uc => `- id: "${uc.id}" | ${uc.label} | CEDS domains: ${uc.cedsDomains.join(', ')} | stakeholders: ${uc.stakeholders.join(', ')}`).join('\n')}`;

      console.log('%c[2.5/4] Building field-level crosswalk context…', 'color: #6366f1');
      const fieldMappingTable = buildFieldMappingContext();
      console.log(`  ${fieldMappings.length} field mappings across ${Object.keys(specLabels).length} specs`);

      const fieldMappingContext = `\n\n## Field-Level Crosswalk (CASE 1.1 ↔ IEEE SCD ↔ ASN-CTDL ↔ OB3 ↔ CLR 2.0)\nUse this table to answer specific field mapping questions. When a user asks how to map a field from one standard to another, reference the exact field names and paths below.\n\n${fieldMappingTable}`;

      const systemPrompt = `You are the EDU Reference Library AI assistant. Answer interoperability questions using the ontology data below.

RESPONSE FORMAT RULES:
1. Keep your answer BRIEF — 2-4 short paragraphs maximum. Focus on WHICH specifications are needed and WHY, not detailed implementation steps.
2. For each specification you recommend, mention its implementation burden level (low/medium/high).
3. Include links to the technical specification pages.
4. PRIVACY QUERIES: If the user's question is about privacy, data protection, FERPA, COPPA, NDPA, PII, or student data, structure your response to: (a) identify which specs have high/medium/low privacy concern levels, (b) state which CEDS domains are involved and their privacy risk level from the ontology, (c) name any specific PII fields at risk using their field paths and piiCategory, (d) cite applicable regulations, (e) recommend the mitigation strategies from the piiField nodes (selective disclosure, hashing, etc.), and (f) reference the educore:domain-privacy/* and educore:pii-field/* URIs in the Ontology Resources Used section.
5. At the end of your response, include TWO structured sections:

## Ontology Resources Used
List every educore: URI you referenced, one per line, formatted as: \`<URI>\`

## Activated Context
\`\`\`json
{
  "stakeholderIds": ["id1", "id2"],
  "useCaseIds": ["uc-id1", "uc-id2"]
}
\`\`\`
Choose the stakeholder IDs and use case IDs from the lists below that are MOST RELEVANT to the user's question. Select only the ones that directly apply.${ontologyContext}${stakeholderContext}${fieldMappingContext}`;

      console.log('%c[3/4] System prompt assembled', 'color: #6366f1', `(${systemPrompt.length} chars)`);
      console.groupCollapsed('Full system prompt');
      console.log(systemPrompt);
      console.groupEnd();

      // Check API key right before the call (deferred so ontology logging always runs)
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.warn('%c[4/4] No API key — set VITE_ANTHROPIC_API_KEY', 'color: #dc2626');
        console.groupEnd();
        throw new Error('Anthropic API key not configured. Set VITE_ANTHROPIC_API_KEY in your environment.');
      }

      console.log('%c[4/4] Sending to Anthropic (claude-sonnet-4-6)…', 'color: #6366f1');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            { role: 'user', content: aiQuery },
          ],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed (${res.status})`);
      }

      const data = await res.json();
      const fullResponse = data.content?.[0]?.text || 'No response received.';

      console.log('%cResponse received', 'color: #16a34a; font-weight: bold',
        `(${(data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)} tokens)`);
      console.groupCollapsed('Full AI response (raw)');
      console.log(fullResponse);
      console.groupEnd();

      const sourceSplit = fullResponse.split(/## Ontology Resources Used/i);
      const mainResponse = sourceSplit[0].trim();
      const afterMain = sourceSplit[1] || '';

      const contextSplit = afterMain.split(/## Activated Context/i);
      const sourcesSection = contextSplit[0] || '';
      const activatedSection = contextSplit[1] || '';

      // Match full URIs or educore: shorthand
      const fullUriPattern = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g;
      const shortPattern = /`?educore:([^\s`<>)]+)`?/g;
      const foundUris = [];
      let match;
      while ((match = fullUriPattern.exec(sourcesSection)) !== null) {
        foundUris.push(match[1]);
      }
      while ((match = shortPattern.exec(sourcesSection)) !== null) {
        const expanded = `https://firsteducore.org/ontology#${match[1]}`;
        if (!foundUris.includes(expanded)) foundUris.push(expanded);
      }

      // If no URIs found in the sources section, scan the main response too
      if (foundUris.length === 0) {
        const fullScan = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g;
        const shortScan = /`?educore:([^\s`<>)]+)`?/g;
        while ((match = fullScan.exec(fullResponse)) !== null) {
          if (!foundUris.includes(match[1])) foundUris.push(match[1]);
        }
        while ((match = shortScan.exec(fullResponse)) !== null) {
          const expanded = `https://firsteducore.org/ontology#${match[1]}`;
          if (!foundUris.includes(expanded)) foundUris.push(expanded);
        }
      }

      // Last resort: match spec names from ontology against the main response text
      if (foundUris.length === 0 && ontology) {
        for (const spec of ontology.specs) {
          if (mainResponse.includes(spec.title)) {
            foundUris.push(spec.uri);
          }
        }
        for (const domain of ontology.domains) {
          if (mainResponse.includes(domain.label)) {
            foundUris.push(domain.uri);
          }
        }
      }

      const enrichedSources = foundUris.map(uri => {
        if (!ontology) return { uri, label: uri };
        const spec = ontology.specs.find(s => s.uri === uri);
        if (spec) return { uri, label: spec.title, type: 'Specification' };
        const domain = ontology.domains.find(d => d.uri === uri);
        if (domain) return { uri, label: domain.label, type: 'CEDS Domain' };
        const alignment = ontology.alignments.find(a => a.uri === uri);
        if (alignment) return { uri, label: `${alignment.status} alignment`, type: 'CEDS Alignment', status: alignment.status };
        const localName = uri.replace('https://firsteducore.org/ontology#', '');
        return { uri, label: localName, type: 'Resource' };
      });

      console.log('%cOntology URIs extracted:', 'color: #6366f1; font-weight: bold', foundUris.length);
      if (foundUris.length > 0) {
        console.table(enrichedSources.map(s => ({ type: s.type, label: s.label, uri: s.uri.replace('https://firsteducore.org/ontology#', 'educore:') })));
      } else {
        console.warn('No ontology URIs found in response — sources panel will be empty');
      }

      setAiResponse(mainResponse);
      setAiSources(enrichedSources);

      const jsonMatch = activatedSection.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const activated = JSON.parse(jsonMatch[1]);
          const sIds = activated.stakeholderIds || [];
          const ucIds = activated.useCaseIds || [];

          console.log('%cActivated context:', 'color: #6366f1; font-weight: bold',
            { stakeholderIds: sIds, useCaseIds: ucIds });

          if (sIds.length > 0 || ucIds.length > 0) {
            onActivateNeeds?.(sIds, ucIds);
          }
        } catch (_) {
          console.warn('Failed to parse activated context JSON');
        }
      }

      console.groupEnd(); // close [EDU AI] group
    } catch (err) {
      console.error('%c[EDU AI] Error:', 'color: #dc2626', err.message);
      console.groupEnd();
      setAiError(err.message || 'An unexpected error occurred.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Standards & Specifications Library</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplainers(!showExplainers)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                ${showExplainers
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {showExplainers ? 'Explainers ON' : 'Explainers OFF'}
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">
          Search, filter, and evaluate specifications for your product roadmap.
          Each entry includes implementation burden, required capabilities, and cross-spec dependencies.
          <span className="ml-2 text-gray-400">{libraryEntries.length} specifications</span>
        </p>
      </div>

      {showExplainers && (
        <ExplainerBadge icon="🏗️">
          <strong>For Standards Implementers:</strong> Use the filters on the left to narrow by use case, implementation burden, required capabilities, and equity/privacy considerations. Expand any specification to see implementation pathways, sample payloads, known adopters, and cross-spec dependencies.
        </ExplainerBadge>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-60 flex-shrink-0">

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-medium text-indigo-600">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                <button onClick={resetAll}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Clear all
                </button>
              </div>
            )}

            {/* Use Case Category */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Use Case</div>
              {categoryFilters.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${category === c
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Implementation Burden */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Implementation Burden</div>
              {burdenFilters.map(b => (
                <button key={b} onClick={() => setBurden(b)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 capitalize transition-colors
                    ${burden === b
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {b === 'low' ? '🟢 ' : b === 'medium' ? '🟡 ' : b === 'high' ? '🔴 ' : ''}{b === 'low' ? 'Low' : b === 'medium' ? 'Moderate' : b === 'high' ? 'High' : b}
                </button>
              ))}
            </div>

            {/* Access Level */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Access Level</div>
              {['All', 'open', 'restricted'].map(a => (
                <button key={a} onClick={() => setAccessFilter(a)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 capitalize transition-colors
                    ${accessFilter === a
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {a === 'open' ? 'Open' : a === 'restricted' ? 'Restricted' : a}
                </button>
              ))}
            </div>

            {/* Required Capabilities */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Capabilities</div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {allCapabilities.map(cap => (
                  <label key={cap}
                    className={`flex items-start gap-2 text-sm px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors
                      ${capabilityFilter.includes(cap)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={capabilityFilter.includes(cap)}
                      onChange={() => toggleCapability(cap)}
                      className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs leading-snug">{cap}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equity Considerations */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Equity / Accessibility</div>
              {equityLevelFilters.map(level => (
                <button key={level} onClick={() => setEquityFilter(level)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${equityFilter === level
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {level === 'All' ? 'All' : `${concernIcon[level]} ${concernLabel[level]}`}
                </button>
              ))}
            </div>

            {/* Privacy Considerations */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Privacy / Security</div>
              {privacyLevelFilters.map(level => (
                <button key={level} onClick={() => setPrivacyFilter(level)}
                  className={`block w-full text-left text-sm px-2.5 py-1.5 rounded-lg mb-0.5 transition-colors
                    ${privacyFilter === level
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  {level === 'All' ? 'All' : `${concernIcon[level]} ${concernLabel[level]}`}
                </button>
              ))}
            </div>

            {/* Quick Filters */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Filters</div>
              <button onClick={() => { setBurden('low'); setAccessFilter('open'); setCapabilityFilter([]); setEquityFilter('All'); setPrivacyFilter('All'); }}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 transition-colors mb-1.5 font-medium">
                Easy wins (low burden + open)
              </button>
              <button onClick={() => { setBurden('All'); setAccessFilter('All'); setPrivacyFilter('low-concern'); setEquityFilter('low-concern'); setCapabilityFilter([]); }}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-sky-200 text-sky-700 bg-sky-50/50 hover:bg-sky-50 transition-colors mb-1.5 font-medium">
                Low risk (low equity + privacy concern)
              </button>
              <button onClick={resetAll}
                className="block w-full text-left text-xs px-2.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                Reset all filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main list */}
        <div className="flex-1 min-w-0">
          {/* AI Interoperability Mapper */}
          <div className="mb-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-200/40 rounded-xl p-5">
            <h2 className="text-base font-bold text-gray-900 mb-1">Interoperability Mapping Assistant</h2>
            <p className="text-xs text-gray-500 mb-3 max-w-2xl">
              Describe your interoperability scenario — the standards your system uses, the standards you need to
              exchange data with, and any non-standard local fields. Get an AI-generated mapping guide grounded in
              1EdTech, A4L, and IEEE specifications from the site's RDF ontology.
            </p>
            <textarea
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              placeholder="My system adheres to Standard X. I need to send/receive data to/from a system that stores its data in Standard Y. However, my system has non-standard local data fields A, B, C. Generate an executable mapping/translation document."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-shadow placeholder:text-gray-400 resize-y"
            />
            {/* Suggested workflow chips */}
            {!aiQuery.trim() && !aiResponse && (
              <div className="mt-2 mb-1">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Try a scenario</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Issue W3C VCs from an LMS', query: 'Our LMS issues course completion records. We want to package them as W3C Verifiable Credentials using Open Badges 3.0 so learners can store them in a digital wallet and share with employers. What standards and roles from the IEEE LER ecosystem do we need?' },
                    { label: 'Map CTDL credentials to CASE competencies', query: 'We publish credentials described in CTDL on the Credential Registry. We need to align the competencies referenced in those credentials to state academic standards published via CASE frameworks. How do the field mappings work between CTDL and CASE?' },
                    { label: 'Build a CLR-based learner wallet', query: 'We are building a digital learner wallet that aggregates credentials from multiple issuers into a single Comprehensive Learner Record (CLR 2.0). What ecosystem roles from IEEE 1484.2 does our wallet fulfill, and how do Open Badges 3.0 achievements feed into the CLR?' },
                    { label: 'Employer credential verification', query: 'An employer needs to verify a job candidate\'s skills credentials without contacting each issuing institution. The credentials were issued as Open Badges 3.0 VCs. What verification flow does the IEEE LER ecosystem recommend, and which CEDS domains are involved?' },
                    { label: 'CTE pathway to industry credential', query: 'A CTE program wants to map its program competencies (published in CASE) to industry-recognized credentials listed in CTDL, then issue completions as Open Badges 3.0 that roll up into a CLR 2.0 for the learner. What is the standards integration path?' },
                  ].map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => setAiQuery(chip.query)}
                      className="text-xs bg-white border border-indigo-200/60 text-indigo-600 rounded-lg px-3 py-1.5 hover:bg-indigo-50 hover:border-indigo-300 transition-colors font-medium"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={handleAiSubmit}
                disabled={aiLoading || !aiQuery.trim()}
                className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-2 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  'Generate Mapping'
                )}
              </button>
              {aiQuery.trim() && !aiLoading && (
                <button
                  onClick={() => { setAiQuery(''); setAiResponse(''); setAiError(''); setAiSources([]); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {aiError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {aiError}
              </div>
            )}

            {aiResponse && (
              <div className="mt-3 space-y-3">
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm prose prose-sm prose-indigo max-w-none">
                  <ReactMarkdown
                    components={{
                      a: ({ children, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {aiResponse}
                  </ReactMarkdown>
                </div>

                {aiSources.length > 0 && (
                  <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.798" />
                        </svg>
                      </div>
                      <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                        Ontology Resources Used ({aiSources.length})
                      </div>
                      <a
                        href="/ontology.jsonld"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-[10px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                      >
                        View full JSON-LD
                      </a>
                    </div>
                    <div className="space-y-1.5">
                      {aiSources.map((source, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white rounded-lg border border-indigo-100 px-3 py-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border flex-shrink-0
                            ${source.type === 'Specification' ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                              : source.type === 'CEDS Domain' ? 'bg-sky-50 text-sky-600 border-sky-200'
                              : source.type === 'CEDS Alignment' ? (
                                  source.status === 'full' ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : source.status === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-200'
                                  : 'bg-gray-50 text-gray-600 border-gray-200')
                              : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                          >
                            {source.type}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{source.label}</span>
                          <code className="ml-auto text-[10px] text-gray-400 font-mono truncate max-w-xs hidden sm:block">
                            {source.uri.replace('https://firsteducore.org/ontology#', 'educore:')}
                          </code>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-indigo-400 mt-2">
                      These RDF resources from the EDU ontology were used to ground this response. URIs resolve to <code>ontology.jsonld</code>.
                    </p>
                  </div>
                )}

                {/* Download as Claude Skill */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-700 mb-0.5">Download as Claude Skill</div>
                      <p className="text-[11px] text-slate-500 leading-snug max-w-md">
                        Saves this mapping as a <code className="bg-slate-100 px-1 rounded">.md</code> skill file you can install in Claude Code (<code className="bg-slate-100 px-1 rounded">~/.claude/skills/</code>).
                        Includes standards, field crosswalk, sample JSON-LD payloads, NDPA/FERPA privacy checklists, transport patterns, and an end-to-end worked example.
                        <span className="text-slate-400"> Cannot make live API calls or auto-install.</span>
                      </p>
                    </div>
                    <button
                      onClick={downloadAiSkill}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Skill (.md)
                    </button>
                  </div>
                </div>

                {/* Navigate to roadmap button */}
                {hasPendingRoadmap && (
                  <button
                    onClick={onGoToRoadmap}
                    className="w-full bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-3 hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    View Implementation Roadmap
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count + sort */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {filtered.length} of {libraryEntries.length} specifications
              {query && <span className="ml-1">matching "<strong className="text-gray-700">{query}</strong>"</span>}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="relevant">Sort: Most relevant</option>
              <option value="updated">Sort: Recently updated</option>
              <option value="burden-asc">Sort: Burden (low → high)</option>
            </select>
          </div>

          {/* Entry cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 shadow-sm">
                <div className="text-3xl mb-3">
                  <svg className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="font-medium text-gray-600">No specifications match your filters</div>
                <div className="text-sm mt-1">Try adjusting your search or filter criteria</div>
                <button onClick={resetAll} className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              filtered.map((entry, i) => (
                <LibraryEntryCard
                  key={entry.id}
                  entry={entry}
                  showExplainers={showExplainers && i === 0}
                  isSelected={entry.id === selectedEntryId}
                  onNavigateToEntry={onNavigateToEntry}
                  onClearSelection={onClearSelection}
                />
              ))
            )}
          </div>

          {/* Submit a resource */}
          <div className="mt-8 border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-1">Don't see what you need?</div>
            <div className="text-xs text-gray-400 mb-4">Submit a specification for review or request an alignment assessment</div>
            <div className="flex justify-center gap-3">
              <button className="text-xs border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium">Submit a specification</button>
              <button className="text-xs bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors font-medium shadow-sm">Request review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
