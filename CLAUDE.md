# EDU Reference Library — Project Guide

## Overview
A React + Vite web app that serves as a living, AI-driven standards library for education data interoperability. Users browse specifications (CASE, CTDL, Open Badges, CLR, IEEE LER), explore CEDS alignment, and ask an AI assistant interoperability mapping questions grounded in a local RDF/JSON-LD ontology.

**Live:** https://edc2-25.onrender.com
**AI Model:** Claude Sonnet 4.6 via Anthropic Messages API (browser-side fetch)

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4
- D3 7 (force-directed ontology graph on Vocabulary page)
- react-markdown (AI response rendering)
- No backend — all data is static JSON/JS, AI calls go directly from browser to Anthropic API
- Deployed on Render.com as a static site

## Environment Variables
```
VITE_ANTHROPIC_API_KEY=sk-ant-...   # Required for AI mapper feature
```
Set in Render.com dashboard (baked into JS bundle at build time via Vite).

## File Structure

```
src/
├── main.jsx                  # Entry point, mounts App
├── App.jsx                   # SPA router (state-based, no router lib)
├── index.css                 # Tailwind import + custom scrollbar + .glass class
├── components/
│   ├── SiteHeader.jsx        # Sticky nav bar with 6 page links
│   ├── LibraryPage.jsx       # Main page: filters + AI mapper + entry cards
│   ├── LibraryEntryCard.jsx  # Expandable spec card (4 tabs: overview/impl/connections/equity)
│   ├── StandardsPage.jsx     # Category-grouped standards browser
│   ├── CedsAlignmentPage.jsx # CEDS alignment matrix (matrix/gap/domain views)
│   ├── TaxonomiesPage.jsx    # Stakeholder needs + use cases + roadmap generator
│   ├── VocabularyPage.jsx    # D3 force graph + OWL class reference
│   ├── PartnersPage.jsx      # Partner directory (placeholder)
│   ├── MetadataBadge.jsx     # Color-coded pills (burden/concern/access/status)
│   ├── ExplainerBadge.jsx    # Design rationale sticky notes
│   ├── WireframeBox.jsx      # Placeholder box for future features
│   └── Annotation.jsx        # Hover-triggered design notes (legacy)
├── data/
│   ├── libraryEntries.js     # 5+ spec objects with full metadata schemas
│   ├── taxonomies.js         # stakeholderTaxonomy, technicalResourcesTaxonomy, useCasesCedsRdf
│   ├── cedsAlignment.js      # cedsDomains (13), cedsAlignmentMatrix (65 records)
│   └── fieldMappings.js      # specLabels (5 specs), fieldMappings (50+ crosswalk rows)
public/
│   └── ontology.jsonld       # RDF/JSON-LD graph: 5 Specifications, 13 CedsDomains, 65 CedsAlignments
docs/
│   └── ai-search-flow.svg    # Pipeline flowchart diagram
```

## Data Flow

```
App.jsx (page state + pendingActivation)
├── SiteHeader (nav)
├── LibraryPage
│   ├── Sidebar filters → filtered libraryEntries
│   ├── AI Mapper → Anthropic API → parsed response
│   │   └── activates stakeholder/use case IDs → passed to TaxonomiesPage
│   └── LibraryEntryCard[] (grid)
├── StandardsPage (entries grouped by category)
├── CedsAlignmentPage (matrix of cedsAlignmentMatrix data)
├── TaxonomiesPage (receives pendingActivation from AI)
│   └── computeRoadmap() → RoadmapCards scored by CEDS alignment
└── VocabularyPage (fetches ontology.jsonld → D3 force graph)
```

## AI Search Pipeline (LibraryPage.jsx `handleAiSubmit`)

### How It Works
1. User types a query in the textarea
2. Three context sources are assembled in parallel:
   - `fetchOntologyContext()` — parses `ontology.jsonld` into specs/domains/alignments
   - `buildStakeholderContext()` — flattens `stakeholderTaxonomy` + `useCasesCedsRdf`
   - `buildFieldMappingContext()` — renders `fieldMappings` as a markdown table
3. System prompt is assembled: base instructions + ontology + stakeholders + field mappings (~10KB)
4. Single API call to `https://api.anthropic.com/v1/messages` (claude-sonnet-4-6, max_tokens 4096)
5. Response is split on `## Ontology Resources Used` and `## Activated Context` headers
6. URIs extracted via regex (3-stage fallback), enriched with ontology metadata
7. Activated stakeholder/use case IDs parsed from JSON block, passed up to App

### API Call Format
```js
fetch('https://api.anthropic.com/v1/messages', {
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
    messages: [{ role: 'user', content: aiQuery }],
  }),
})
```

### Response Format (what the AI is instructed to produce)
```
[2-4 paragraphs with spec recommendations + burden levels + links]

## Ontology Resources Used
`https://firsteducore.org/ontology#spec/case-v1`
`educore:spec/ctdl`

## Activated Context
```json
{
  "stakeholderIds": ["k12-districts", "higher-education"],
  "useCaseIds": ["uc-credential-verification"]
}
```
```

### Response Parsing
- `data.content[0].text` → full response
- Split on `## Ontology Resources Used` → main answer vs. sources
- Split on `## Activated Context` → sources vs. JSON
- URI regex: `/`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g`
- Shorthand regex: `/`?educore:([^\s`<>)]+)`?/g` → expanded to full URI
- Fallback: text-match spec titles against ontology data

---

## Prompts for Recreating Key Elements

### Recreate the RDF/JSON-LD Ontology (`ontology.jsonld`)

```
I need you to create a JSON-LD ontology file for an education standards reference library.

Structure:
- Use @context with prefixes: educore (https://firsteducore.org/ontology#), dcterms, rdfs, owl, skos, foaf, xsd
- The @graph array contains three node types:

1. CedsDomain nodes (13 total):
   - @id: educore:ceds-domain/{id}
   - @type: educore:CedsDomain
   - rdfs:label, dcterms:identifier
   - Domains: credentials, competencies, workforce, assessments, learningResources, k12, postsecondary, cte, adultEd, earlyLearning, authN, implVars, facilities

2. Specification nodes (one per standard):
   - @id: educore:spec/{id}
   - @type: educore:Specification
   - Fields: dcterms:title, dcterms:description, category, owner, governanceBody, version, accessLevel, opennessStatus, implementationBurden (low/medium/high), implementationBurdenRationale, aiSummary, aiUnlocksSummary, aiTaxonomy[], requiredCapability[], knownAdopter[], compatibilityNotes, implementationGuidance, commonlyPairedWith[] (@id refs), foaf:page

3. CedsAlignment nodes (one per spec-domain pair):
   - @id: educore:ceds-alignment/{specId}/{domainId}
   - @type: educore:CedsAlignment
   - Links: specification (@id ref), cedsDomain (@id ref)
   - Data: alignmentStatus (full/partial/gap), notes, cedsElement[]

Current specs: IEEE P1484.2 LER, CASE v1.1, CTDL, Open Badges 3.0, CLR 2.0.
Each spec needs 13 alignment nodes (one per CEDS domain).
```

### Recreate the System Prompt Architecture

```
I need a system prompt for an education standards interoperability AI assistant.

The prompt has 4 concatenated sections:

1. BASE INSTRUCTIONS:
   - Role: "EDU Reference Library AI assistant"
   - Response format: brief (2-4 paragraphs), mention burden levels, include spec links
   - Must end with two structured sections:
     a. "## Ontology Resources Used" — list of educore: URIs in backticks
     b. "## Activated Context" — JSON with stakeholderIds[] and useCaseIds[]

2. ONTOLOGY CONTEXT (appended if ontology loaded):
   - "You have access to the EDU Reference Library ontology (JSON-LD at {url})"
   - List each spec: title, URI, category, owner, burden, aiSummary, compatibilityNotes, pairedWith, spec page URL
   - List CEDS domains: label + URI
   - List alignment triples: spec → domain = status: notes [elements]

3. STAKEHOLDER CONTEXT:
   - "## Available Stakeholders (use these exact IDs):" — id, label, group per stakeholder
   - "## Available Use Cases (use these exact IDs):" — id, label, CEDS domains, stakeholders per use case

4. FIELD MAPPING CONTEXT:
   - "## Field-Level Crosswalk" — markdown table
   - Columns: Concept | CASE 1.1 | IEEE SCD | ASN-CTDL | OB3 | CLR 2.0 | Strength
   - Each row shows equivalent field names across specs with match strength (equivalent/close/related)
```

### Recreate the CEDS Alignment Matrix (`cedsAlignment.js`)

```
Create a CEDS alignment matrix for education data standards.

Structure:
- cedsDomains: array of 13 CEDS domains, each with { id, label, icon }
  Domains: Credentials, Competencies, Workforce, Assessments, Learning Resources,
  K-12, Postsecondary, CTE, Adult Ed, Early Learning, Auth & Authorization,
  Implementation Variables, Facilities

- cedsAlignmentMatrix: array of objects, one per library entry:
  {
    entryId: string (matches libraryEntries id),
    entryShortName: string,
    domains: {
      [domainId]: {
        status: 'full' | 'partial' | 'gap',
        cedsElements: string[] (real CEDS element names),
        notes: string (why this status),
        gapNotes: string | null (what CEDS covers that the spec doesn't)
      }
    }
  }

For each of the 5 specs, assess alignment with all 13 CEDS domains.
"full" = spec's data model covers the domain's core elements.
"partial" = spec touches the domain but doesn't model it completely.
"gap" = spec doesn't address this domain at all.
```

### Recreate the Field Mapping Crosswalk (`fieldMappings.js`)

```
Create a field-level crosswalk mapping between 5 education data standards:
CASE 1.1, IEEE SCD (Skill Credentialing Data), ASN-CTDL, Open Badges 3.0, CLR 2.0.

Structure:
- specLabels: { 'case-1.1': 'CASE 1.1', 'ieee-scd': 'IEEE SCD', 'asn-ctdl': 'ASN-CTDL', 'ob3': 'OB3', 'clr-2.0': 'CLR 2.0' }
- fieldMappings: array of objects:
  {
    concept: string (e.g., "Framework Identifier"),
    entityType: string (e.g., "CFDocument → CompetencyFramework"),
    mappings: {
      'case-1.1': { field: string, path: string } | undefined,
      'ieee-scd': { field: string, path: string } | undefined,
      ...
    },
    matchStrength: 'equivalent' | 'close' | 'related',
    notes: string
  }

Map concepts like: Framework Identifier, Framework Title, Framework Description,
Competency Identifier, Competency Label, Competency Type, Skill Level,
Achievement Type, Issuer, Evidence, etc.

"equivalent" = identical semantics. "close" = same concept, different structure.
"related" = loosely related, needs transformation.
Use real field names from each specification's schema.
```

### Recreate the Stakeholder Taxonomy (`taxonomies.js`)

```
Create a stakeholder taxonomy for education data interoperability.

Structure:
- stakeholderTaxonomy: array of group objects:
  {
    id, label, icon,
    children: [{
      id, label,
      businessNeeds: string[] (3-4 concrete needs per stakeholder)
    }]
  }

Groups:
1. Education Institutions: K-12 Districts, Higher Education, CTE Programs, Adult Education
2. Workforce & Employers: Industry Partners, Staffing Agencies, Professional Associations
3. Technology Providers: EdTech Vendors, Systems Integrators, API/Analytics Platforms
4. Policy & Governance: State Education Agencies, Federal Agencies, Standards Bodies
5. Research & Advocacy: EdTech Researchers, Equity Organizations, Disability Advocates

Business needs should be specific and actionable, e.g.:
- "Student transcript portability across districts"
- "Verify candidate credentials without contacting issuers"
- "CEDS-aligned data export/import"
```

### Recreate the D3 Force Graph (VocabularyPage.jsx)

```
Create a D3 force-directed graph visualization for an RDF ontology.

Data source: fetch and parse /ontology.jsonld
- Nodes: Specification nodes (purple, radius 22) + CedsDomain nodes (sky blue, radius 14)
- Edges: CedsAlignment nodes create links between specs and domains
  - Color by alignmentStatus: green (full), amber (partial), dashed gray (gap)
  - Additional edges for commonlyPairedWith between specs

Features:
- D3 forceSimulation with forceLink, forceManyBody, forceCenter, forceCollide
- Drag to reposition nodes
- Scroll to zoom
- Tooltip on hover showing node metadata
- ResizeObserver for responsive SVG sizing
- Stats bar showing counts: OWL Classes, Specs, Domains, Alignments, Full/Partial/Gap
```

### Recreate the Roadmap Generator (TaxonomiesPage.jsx)

```
Create an implementation roadmap generator based on selected business needs.

Input: User selects stakeholder business needs and/or use cases (checkboxes)
Scoring algorithm:
1. For each library entry (spec), compute a relevance score:
   - Match selected business needs against use case businessNeeds
   - Match selected use case cedsDomains against cedsAlignmentMatrix
   - Weight by alignment status: full=3, partial=1, gap=0
2. Sort specs by: alignment score (desc) → burden level (asc: low→medium→high)
3. Display as RoadmapCards showing: burden rubric, CEDS domain alignment, required capabilities

The AI mapper can auto-activate needs via "Activated Context" JSON in its response,
which pre-selects stakeholders/use cases and triggers roadmap generation.
```

## Conventions
- All styling is Tailwind utility classes (no component library)
- Color scheme: indigo (primary), slate (text), sky (secondary), amber (warnings/explainers)
- Burden/concern color coding: green (low), amber (medium), red (high)
- No router library — page switching via `activePage` state in App.jsx
- Console logging with colored groups: `console.log('%c[step] message', 'color: #hex')`
- All data is static JS exports — no database, no backend API except Anthropic
