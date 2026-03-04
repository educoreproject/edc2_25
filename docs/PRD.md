# EDU Reference Library — Product Requirements Document

**Product:** EDU Reference Library
**Version:** 2.0 (Production Architecture)
**Status:** Demo (Phase 1 complete) → Planning for Phase 2
**Live Demo:** https://edc2-25.onrender.com
**Date:** March 4, 2026

---

## 1. Product Summary

The EDU Reference Library is an AI-driven standards reference platform for education data interoperability. It enables district CTOs, EdTech vendors, state education agencies, and standards bodies to discover, compare, and plan implementation of education data standards (CASE, CTDL, Open Badges, CLR, IEEE LER) with alignment to the Common Education Data Standards (CEDS).

**Vision:** Become the authoritative, AI-assisted decision engine for education data interoperability — helping any organization navigate the standards landscape, assess implementation effort, and generate adoption roadmaps grounded in a live RDF/JSON-LD knowledge graph.

---

## 2. Screens Inventory

### 2.1 User-Facing Screens (6)

| # | Screen | Description | Key Interactions |
|---|--------|-------------|------------------|
| 1 | **Library** | Primary discovery hub. AI-powered interoperability mapper, sidebar filters (category, burden, access, capabilities, equity, privacy), sortable entry grid with expandable 4-tab detail cards (Overview, Implementation, Connections, Equity & Privacy). | Free-text AI query, filter/sort, expand spec cards, generate mapping, jump to roadmap |
| 2 | **Standards** | Category-organized browsing. 4 collapsible domain cards grouping the 5 specifications with version, governance, and burden metadata. | Expand/collapse categories, navigate to Library detail |
| 3 | **CEDS Alignment** | 5-spec x 13-domain alignment matrix with 3 views: Matrix (heatmap + cell detail modals), Gap Analysis (ecosystem-wide gap identification), and By Domain (filtered deep dive). | Switch views, click cells for modal detail, view CEDS element links |
| 4 | **Needs Explorer** | 3-tab taxonomy browser (Stakeholders, Technical Resources, Use Cases). Checkbox-driven business need selection feeds a scored implementation roadmap generator. | Select business needs, search/filter, generate roadmap, navigate to specs |
| 5 | **Vocabulary** | Interactive D3 force-directed graph of the RDF/JSON-LD ontology. OWL class reference with property lists. Stats bar and namespace table. | Drag/zoom graph, filter OWL classes, download ontology files |
| 6 | **Partners** | Directory table of ecosystem partners with type, agreement status, and placeholder onboarding flow. | View partner details (non-functional in demo) |

### 2.2 System/Admin-Facing Screens (0 in demo — 4 proposed for production)

The demo has **no admin UI**. All content is managed via static JS file edits and redeploys. The production architecture (Section 7) proposes the following admin screens:

| # | Proposed Screen | Purpose |
|---|-----------------|---------|
| A1 | **Standards Admin** | CRUD interface for specifications, CEDS alignment records, and field mappings. Form-based editing with validation against the ontology schema. |
| A2 | **Ontology Manager** | Visual editor for the RDF/JSON-LD knowledge graph. Add/edit/remove classes, properties, and alignment triples. Preview graph changes before publish. |
| A3 | **Taxonomy Editor** | Manage stakeholder groups, business needs, use cases, and CEDS RDF elements. Drag-and-drop reordering. |
| A4 | **Analytics Dashboard** | Query volume, popular specs, AI mapper usage patterns, roadmap generation metrics, user engagement by screen. |

---

## 3. User Stories

### Discovery & Research
| ID | Story | Persona |
|----|-------|---------|
| US-1 | As a **district CTO**, I want to filter standards by implementation burden and access level so I can identify "easy win" specifications my team can adopt quickly. | District CTO |
| US-2 | As an **EdTech vendor**, I want to expand a specification card and view its Implementation tab so I can assess engineering effort, required capabilities, and timeline before committing resources. | EdTech Vendor |
| US-3 | As a **standards analyst**, I want to browse specifications grouped by category so I can understand the landscape without information overload. | Standards Analyst |

### AI-Powered Mapping
| ID | Story | Persona |
|----|-------|---------|
| US-4 | As a **practitioner**, I want to describe my interoperability scenario in plain language and receive AI-generated recommendations (with burden levels and spec links) so I don't need to be a standards expert. | Practitioner |
| US-5 | As a **decision-maker**, I want the AI mapper to automatically activate relevant stakeholders and use cases so I can jump directly to a tailored implementation roadmap. | Decision-Maker |
| US-6 | As a **researcher**, I want the AI response to cite specific ontology resources (URIs) so I can verify recommendations against the source data. | Researcher |

### CEDS Alignment
| ID | Story | Persona |
|----|-------|---------|
| US-7 | As a **state agency analyst**, I want to view a matrix of all specifications against all 13 CEDS domains so I can identify which standards cover my reporting requirements. | State Agency Analyst |
| US-8 | As an **interoperability planner**, I want to see ecosystem-wide gaps (CEDS domains with zero spec coverage) so I can flag areas needing new standards development. | Interoperability Planner |
| US-9 | As an **implementer**, I want to click a matrix cell and see specific CEDS elements, alignment notes, and gap details so I can plan data mapping work. | Implementer |

### Roadmap Generation
| ID | Story | Persona |
|----|-------|---------|
| US-10 | As a **K-12 district leader**, I want to select my stakeholder business needs and generate a scored implementation roadmap so I get a prioritized adoption path. | K-12 Leader |
| US-11 | As a **CTE coordinator**, I want to explore use cases and see which CEDS RDF elements and standards apply so I can build a compliance plan. | CTE Coordinator |
| US-12 | As a **technology integrator**, I want the roadmap to rank specifications by alignment score (desc) and burden (asc) so I tackle high-value, low-effort integrations first. | Technology Integrator |

### Ontology & Vocabulary
| ID | Story | Persona |
|----|-------|---------|
| US-13 | As a **data architect**, I want to interact with a force-directed graph of specs and CEDS domains so I can visually understand relationships and alignment statuses. | Data Architect |
| US-14 | As a **developer**, I want to download the ontology in JSON-LD or Turtle format and reference OWL class properties so I can integrate the data model into my system. | Developer |

### Connections & Equity
| ID | Story | Persona |
|----|-------|---------|
| US-15 | As a **product manager**, I want to see which specifications are commonly paired together (with rationale) so I can plan a holistic integration strategy. | Product Manager |
| US-16 | As an **equity advocate**, I want to review equity/accessibility and privacy/security considerations per specification so I can assess risk to vulnerable populations. | Equity Advocate |

### Partners & Admin (Production)
| ID | Story | Persona |
|----|-------|---------|
| US-17 | As an **ecosystem coordinator**, I want to view partner organizations, their agreement types, and statuses so I can track ecosystem participation. | Ecosystem Coordinator |
| US-18 | As an **admin**, I want to add and edit specifications through a web form (not code) so non-technical staff can maintain the library. | Admin |
| US-19 | As an **admin**, I want to view AI mapper query analytics so I can understand what interoperability questions the community is asking. | Admin |
| US-20 | As an **admin**, I want to manage the RDF ontology through a visual editor so I can update alignment data without editing raw JSON-LD. | Admin |

---

## 4. Technology Stack (Current Demo)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 19.2.0 | UI component library |
| Build Tool | Vite | 7.x | Dev server, bundling, env var injection |
| Styling | Tailwind CSS | 4.2.1 | Utility-first CSS |
| Visualization | D3.js | 7.9.0 | Force-directed ontology graph |
| Markdown | react-markdown | 10.1.0 | AI response rendering |
| AI Model | Claude Sonnet 4.6 | — | Browser-direct Anthropic Messages API |
| Data Format | JSON-LD / RDF | — | Ontology knowledge graph |
| Hosting | Render.com | — | Static site deployment |
| Routing | State-based | — | `activePage` state in App.jsx (no router lib) |
| Database | None | — | All data is static JS exports |
| Auth | None | — | Public read-only access |

---

## 5. Current Architecture Limitations

| Limitation | Impact |
|------------|--------|
| **Static data files** — all specs, alignments, taxonomies are hardcoded JS | Any content change requires a developer, code commit, and redeploy |
| **No authentication** — entire site is public, no role separation | Cannot differentiate admin vs. public user capabilities |
| **API key in client bundle** — `VITE_ANTHROPIC_API_KEY` baked into JS at build time | Key is exposed in browser DevTools; anyone can extract and abuse it |
| **No backend** — AI calls go browser → Anthropic API directly | No rate limiting, no usage tracking, no audit trail, no prompt injection filtering |
| **No database** — ontology is a static .jsonld file | Cannot query, version, or collaboratively edit the knowledge graph |
| **Render.com static hosting** — single region, no scaling controls | No auto-scaling, no CDN granularity, limited observability |
| **No routing library** — state-based page switching | No deep linking, no browser back/forward support, no shareable URLs |

---

## 6. Proposed Production Architecture (AWS EC2 + NoSQL)

### 6.1 Architecture Overview

```
                                    ┌─────────────────────────┐
                                    │      Route 53 (DNS)     │
                                    └────────────┬────────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │   CloudFront (CDN)      │
                                    │   + WAF (rate limiting,  │
                                    │     bot protection)      │
                                    └────────────┬────────────┘
                                                 │
                              ┌──────────────────┼──────────────────┐
                              │                  │                  │
                    ┌─────────▼──────┐ ┌─────────▼──────┐ ┌────────▼───────┐
                    │  S3 (Static    │ │  ALB (API)     │ │  S3 (Ontology  │
                    │  React Bundle) │ │                │ │  File Store)   │
                    └────────────────┘ └────────┬───────┘ └────────────────┘
                                                │
                                   ┌────────────▼────────────┐
                                   │  EC2 Auto Scaling Group │
                                   │  (Node.js API servers)  │
                                   │  ┌────────────────────┐ │
                                   │  │  Express/Fastify    │ │
                                   │  │  ├─ /api/specs     │ │
                                   │  │  ├─ /api/ontology  │ │
                                   │  │  ├─ /api/ai-mapper │ │
                                   │  │  ├─ /api/roadmap   │ │
                                   │  │  └─ /api/admin     │ │
                                   │  └────────────────────┘ │
                                   └──────┬─────────┬────────┘
                                          │         │
                              ┌───────────▼──┐  ┌───▼──────────────┐
                              │  Amazon      │  │  Amazon Neptune  │
                              │  DynamoDB    │  │  (Graph DB)      │
                              │              │  │                  │
                              │  - Users     │  │  - RDF Triples   │
                              │  - Sessions  │  │  - SPARQL Query  │
                              │  - Analytics │  │  - Ontology      │
                              │  - Partners  │  │  - Alignments    │
                              └──────────────┘  └──────────────────┘
                                                        │
                                              ┌─────────▼─────────┐
                                              │  ElastiCache      │
                                              │  (Redis)          │
                                              │  - Query cache    │
                                              │  - Session store  │
                                              │  - Rate limiting  │
                                              └───────────────────┘
```

### 6.2 Component Breakdown

#### Frontend (React SPA → S3 + CloudFront)

| Change | From (Demo) | To (Production) |
|--------|-------------|-----------------|
| Hosting | Render.com static | S3 static site + CloudFront CDN |
| Routing | State-based (`activePage`) | React Router v7 with deep linking |
| Auth UI | None | AWS Cognito hosted UI (login/signup/MFA) |
| API calls | Browser → Anthropic API direct | Browser → ALB → EC2 API server |
| Env vars | `VITE_ANTHROPIC_API_KEY` in bundle | None in client; all secrets server-side |

#### API Server (EC2 Auto Scaling Group)

**Runtime:** Node.js 22 LTS + Fastify (or Express)
**Deployment:** Docker containers on EC2 instances behind an Application Load Balancer

| Endpoint Group | Purpose |
|----------------|---------|
| `GET /api/specs` | List/filter specifications (replaces `libraryEntries.js`) |
| `GET /api/specs/:id` | Single spec with full metadata |
| `PUT /api/specs/:id` | Admin: update spec (auth required) |
| `GET /api/ontology/graph` | Serialized ontology for D3 visualization |
| `GET /api/ontology/sparql` | SPARQL proxy to Neptune for custom queries |
| `GET /api/alignments` | CEDS alignment matrix data |
| `GET /api/taxonomies/:type` | Stakeholders, resources, or use cases |
| `POST /api/ai-mapper` | Proxied AI query (server-side Anthropic call with rate limiting) |
| `POST /api/roadmap/generate` | Compute roadmap from selected needs |
| `GET /api/admin/analytics` | Query volume, usage metrics |
| `POST /api/admin/ontology` | Upload/update ontology triples |

#### Database Layer

##### Amazon Neptune (Graph Database) — RDF/Knowledge Graph

**Why Neptune over other NoSQL options:**
- Native RDF triple store with SPARQL 1.1 query support
- Direct ingest of the existing `ontology.jsonld` (JSON-LD → RDF triples)
- Graph traversal queries for "which specs align to which domains" are O(edges), not O(n^2) joins
- Supports OWL reasoning for inferring implicit relationships
- Managed service: automatic backups, multi-AZ replication, encryption at rest

**Data model migration:**

| Current (Static JS) | Neptune (RDF Triples) |
|---------------------|-----------------------|
| `libraryEntries.js` (5 spec objects) | `educore:spec/*` nodes with `dcterms:title`, `educore:burden`, etc. |
| `cedsAlignment.js` (65 alignment records) | `educore:ceds-alignment/*` triples linking specs → domains |
| `ontology.jsonld` (flat file) | Bulk-loaded as named graph `educore:ontology` |
| `fieldMappings.js` (50+ crosswalk rows) | `educore:mapping/*` nodes with `skos:exactMatch`, `skos:closeMatch` |
| `taxonomies.js` (stakeholders + use cases) | `educore:stakeholder/*` and `educore:use-case/*` with `skos:broader` hierarchy |

**Example SPARQL queries replacing static lookups:**

```sparql
# Replace: cedsAlignmentMatrix.filter(a => a.status === 'gap')
SELECT ?spec ?domain ?notes WHERE {
  ?alignment a educore:CedsAlignment ;
             educore:specification ?spec ;
             educore:cedsDomain ?domain ;
             educore:alignmentStatus "gap" ;
             educore:notes ?notes .
}

# Replace: computeRoadmap() scoring loop
SELECT ?spec (SUM(?score) AS ?totalScore) WHERE {
  ?alignment educore:specification ?spec ;
             educore:cedsDomain ?domain ;
             educore:alignmentStatus ?status .
  VALUES (?domain) { (educore:ceds-domain/credentials) (educore:ceds-domain/competencies) }
  BIND(IF(?status = "full", 3, IF(?status = "partial", 1, 0)) AS ?score)
}
GROUP BY ?spec ORDER BY DESC(?totalScore)
```

##### Amazon DynamoDB — Application Data

| Table | Partition Key | Sort Key | Purpose |
|-------|--------------|----------|---------|
| `Users` | `userId` | — | Cognito-linked user profiles, roles (admin/viewer) |
| `Sessions` | `sessionId` | `createdAt` | Auth sessions (TTL: 24h) |
| `AIQueryLog` | `userId` | `timestamp` | AI mapper queries + responses for analytics |
| `RoadmapSnapshots` | `userId` | `snapshotId` | Saved roadmap configurations |
| `PartnerAgreements` | `partnerId` | `agreementId` | Partner directory with agreement metadata |
| `AuditLog` | `entityId` | `timestamp` | Admin change tracking |

##### ElastiCache (Redis)

| Use | TTL | Purpose |
|-----|-----|---------|
| SPARQL query cache | 15 min | Cache expensive graph traversals |
| AI response cache | 60 min | Deduplicate identical AI mapper queries |
| Rate limit counters | sliding window | Per-user AI query throttling (e.g., 20/hour) |
| Session store | 24h | Cognito session tokens |

#### Authentication & Authorization (AWS Cognito)

| Role | Permissions |
|------|------------|
| **Public (unauthenticated)** | Read all screens, limited AI queries (5/hour by IP) |
| **Registered User** | Full AI mapper access (20/hour), save roadmaps, export data |
| **Admin** | All of above + CRUD specs + edit ontology + view analytics |
| **Super Admin** | All of above + manage users + manage partners |

#### Observability

| Service | Purpose |
|---------|---------|
| CloudWatch Logs | API server logs, Lambda logs |
| CloudWatch Metrics | Request latency, error rates, Neptune query time |
| X-Ray | Distributed tracing (request → API → Neptune → Anthropic) |
| CloudWatch Alarms | Alert on error rate > 1%, latency p99 > 2s, Neptune CPU > 70% |

### 6.3 Migration Path (Phased)

#### Phase 2A: Server-Side API + Auth (4-6 weeks)

| Task | Details |
|------|---------|
| Stand up EC2 + ALB | Node.js API server, Docker, Auto Scaling Group (min 2 instances) |
| Move AI calls server-side | `POST /api/ai-mapper` proxies to Anthropic; API key in AWS Secrets Manager |
| Add Cognito auth | Public read, registered user for AI, admin role for future CRUD |
| Add React Router | Deep linking, browser history, shareable URLs |
| Deploy frontend to S3 + CloudFront | Replace Render.com |
| Add Redis rate limiting | Per-user and per-IP throttling |

#### Phase 2B: Neptune Graph Database (4-6 weeks)

| Task | Details |
|------|---------|
| Provision Neptune cluster | db.r5.large (start small), multi-AZ |
| Migrate ontology.jsonld → Neptune | Bulk loader for JSON-LD → RDF triples |
| Migrate static JS data → Neptune | Script to convert libraryEntries, cedsAlignment, fieldMappings, taxonomies to RDF |
| Build SPARQL query layer | Replace in-memory filtering with graph queries |
| Add query caching (Redis) | Cache SPARQL results with 15-min TTL |
| Update D3 graph | Fetch from `/api/ontology/graph` instead of static file |

#### Phase 2C: Admin UI + Analytics (3-4 weeks)

| Task | Details |
|------|---------|
| Standards Admin screen | Form-based CRUD for specs, writes to Neptune |
| Ontology Manager screen | Visual triple editor with preview |
| Taxonomy Editor screen | Drag-and-drop stakeholder/use case management |
| Analytics Dashboard | DynamoDB query logs → CloudWatch dashboards + custom admin screen |
| Audit logging | All admin writes logged to DynamoDB AuditLog table |

#### Phase 2D: Production Hardening (2-3 weeks)

| Task | Details |
|------|---------|
| WAF rules | SQL injection, XSS, bot detection on CloudFront |
| Penetration testing | OWASP Top 10 assessment |
| Backup strategy | Neptune automated snapshots (daily), DynamoDB point-in-time recovery |
| CI/CD pipeline | GitHub Actions → ECR → EC2 rolling deploy |
| Load testing | Verify auto-scaling under 100+ concurrent users |
| Disaster recovery | Multi-AZ Neptune, cross-region S3 replication for static assets |

### 6.4 Cost Estimate (Monthly, US-East-1)

| Service | Spec | Estimated Cost |
|---------|------|---------------|
| EC2 (2x t3.medium) | API servers, Auto Scaling | ~$60 |
| ALB | Application Load Balancer | ~$25 |
| Neptune (db.r5.large) | Graph database, single writer | ~$280 |
| DynamoDB | On-demand, <1M reads/month | ~$5 |
| ElastiCache (cache.t3.micro) | Redis | ~$15 |
| S3 + CloudFront | Static hosting + CDN | ~$10 |
| Cognito | <10K MAU free tier | $0 |
| CloudWatch | Logs + metrics | ~$15 |
| Secrets Manager | API keys | ~$1 |
| **Total** | | **~$410/month** |

*Note: Anthropic API costs are usage-dependent and separate (~$3 per 1M input tokens for Sonnet).*

### 6.5 Why Neptune (Graph DB) Over Other NoSQL Options

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Amazon Neptune** | Native RDF/SPARQL, direct JSON-LD ingest, OWL reasoning, graph traversal | Higher cost (~$280/mo), learning curve for SPARQL | **Best fit** — the data IS a knowledge graph |
| **DynamoDB** | Cheap, fast, serverless, familiar | Requires flattening RDF into key-value pairs, no graph queries, loses relationship semantics | Good for app data, poor for ontology |
| **MongoDB (DocumentDB)** | Flexible schema, JSON-native | No native RDF support, graph queries require $graphLookup (limited), no SPARQL | Possible but fights the data model |
| **Neo4j on EC2** | Excellent graph DB, Cypher query language | Not RDF-native (property graph model), requires RDF→property graph conversion, self-managed | Strong alternative if team prefers Cypher over SPARQL |

---

## 7. Key Architectural Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| AD-1 | Neptune for RDF data, DynamoDB for app data | Polyglot persistence — use the right DB for each data shape |
| AD-2 | Server-side AI proxy (not browser-direct) | Protects API key, enables rate limiting, logging, and prompt injection filtering |
| AD-3 | Cognito for auth (not custom) | Managed MFA, social login, JWT tokens, free tier covers early usage |
| AD-4 | EC2 over Lambda for API | Persistent Neptune connections, predictable latency, WebSocket support for future real-time features |
| AD-5 | CloudFront + S3 over EC2 for frontend | Cheaper, faster (edge caching), separates deployment lifecycles |
| AD-6 | Redis for caching over DynamoDB DAX | Flexible (rate limiting + session + query cache in one service), cheaper at low scale |
| AD-7 | React Router v7 over state-based routing | Deep linking, shareable URLs, browser back/forward, SEO-ready |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Neptune cost exceeds budget at scale | Medium | High | Start with db.r5.large, monitor query patterns, consider Neptune Serverless when GA |
| SPARQL learning curve slows development | Medium | Medium | Use existing JSON-LD as seed data; team training on SPARQL basics; consider GraphQL wrapper (e.g., HyperGraphQL) |
| AI mapper prompt injection via user queries | High | Medium | Server-side input sanitization, output filtering, query length limits |
| Anthropic API rate limits at scale | Low | High | Response caching in Redis, queue-based processing for burst traffic |
| Data consistency between Neptune and DynamoDB | Medium | Medium | Event-driven sync via DynamoDB Streams, eventual consistency acceptable for analytics |

---

## 9. Success Metrics

| Metric | Current (Demo) | Target (Production) |
|--------|---------------|---------------------|
| AI mapper queries/month | Unknown (no tracking) | 500+ |
| Roadmap generations/month | Unknown | 200+ |
| Registered users | 0 | 100+ in first 6 months |
| Spec coverage (ontology entries) | 5 | 15+ |
| CEDS domain alignment records | 65 | 195+ (15 specs x 13 domains) |
| Admin content updates without deploys | 0 | 100% (all via admin UI) |
| API p99 latency | N/A | < 500ms (non-AI endpoints) |
| Uptime | Best-effort | 99.5% |
