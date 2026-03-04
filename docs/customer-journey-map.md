# EDU Reference Library — Customer Journey Map

**Product:** EDU Reference Library
**Date:** March 4, 2026
**Companion doc:** [PRD.md](./PRD.md)

---

## 1. Primary Persona

### Jordan Chen — District Chief Technology Officer

- **Title:** CTO, Lakewood Unified School District (42 schools, 28K students)
- **Age:** 41
- **Experience:** 12 years in K-12 IT, 3 years in current role
- **Reports to:** Superintendent and School Board

**Job to Be Done:**
> *When I'm tasked with making our student data systems interoperable with state reporting, college admissions, and workforce platforms, I want to quickly identify which data standards to adopt and in what order, so I can build a realistic implementation plan that my team can execute without hiring outside consultants.*

**Current Pain:**
- Drowning in acronyms (CASE, CTDL, CLR, LER, CEDS) with no clear comparison framework
- Can't tell which standards overlap, conflict, or complement each other
- Implementation burden is opaque until months into a project
- State agency expects CEDS alignment but doesn't specify which standards satisfy it
- Board wants a timeline and cost estimate before approving any integration work

**Alternatives Today:**
- Google searches + reading individual spec documentation (hours per standard)
- Hiring a consultant ($15K-$50K for a standards landscape assessment)
- Attending conferences (IMS Global, CEDS, A4L) and hoping to connect the dots
- Asking peers in CTO Slack channels and getting anecdotal, inconsistent answers

---

## 2. Secondary Personas (abbreviated)

| Persona | JTBD | Key Difference from Primary |
|---------|------|-----------------------------|
| **Maya Torres** — EdTech Product Manager | "When I need to support credential portability in our SaaS platform, I want to know which specs our competitors support and which give us a competitive edge." | Cares more about Connections tab and commonly-paired specs; less about CEDS compliance |
| **Dr. Aisha Patel** — State Education Agency Analyst | "When I need to audit district data submissions for federal reporting, I want to see exactly which CEDS elements each standard covers." | Primary user of CEDS Alignment matrix and Gap Analysis view; needs exportable evidence |
| **Carlos Rivera** — CTE Program Coordinator | "When I'm building career pathway credentials for students, I want to map our competencies to recognized frameworks so credentials are portable to employers." | Focused on Use Cases tab (CTE Pathways), needs to generate roadmaps tied to workforce standards |

---

## 3. Journey Map

### Stage 1: Awareness

> *"I keep hearing about these standards but don't know where to start."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Conference presentation, peer recommendation in CTO Slack/listserv, state agency memo referencing CEDS compliance, Google search ("education data interoperability standards comparison"), LinkedIn post from standards body |
| **User Actions** | Clicks shared link to EDU Reference Library; bookmarks it; skims the landing page and nav bar |
| **Thoughts & Questions** | "Is this an official standards body site or a vendor pitch?" / "Does this cover the standards my state cares about?" / "Is this free?" |
| **Emotion** | Cautiously hopeful (finally, one place that might explain this) |
| **Pain Points** | No clear value proposition on first load — the site title alone doesn't communicate what it does or who it's for. No onboarding flow or guided tour. No indication of credibility (who built this? who maintains it?) |
| **Opportunities** | Add a hero section with a 1-sentence value prop and 3 persona entry points ("I'm a district leader" / "I'm a vendor" / "I'm a state analyst"). Add trust signals (logos of standards bodies, "maintained by" attribution). |

**Emotion curve:** Neutral → Curious (3/5)

---

### Stage 2: Consideration

> *"Let me see if this actually helps me understand the landscape."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Standards Page (category browsing), Library Page (sidebar filters), individual spec cards (Overview tab) |
| **User Actions** | Browses Standards Page to see what's covered. Opens Library Page. Filters by "Low burden" + "Open access." Expands a spec card (e.g., Open Badges 3.0) and reads Overview tab. Compares 2-3 specs by opening multiple cards. |
| **Thoughts & Questions** | "Are these the same 5 standards I keep hearing about?" / "What does 'implementation burden: medium' actually mean for my team?" / "How current is this data?" |
| **Emotion** | Engaged but evaluating — deciding if the depth justifies continued investment of time |
| **Pain Points** | Only 5 specs currently — user may question completeness. No side-by-side comparison view. No "last verified" date on individual data points. Burden labels (low/medium/high) feel subjective without benchmarks. |
| **Opportunities** | Add a comparison mode (select 2-3 specs → side-by-side table). Show "last verified" timestamps. Add burden benchmarks ("Low = ~2 weeks engineering for a team of 2"). Add a "What's NOT covered yet" transparency note. |

**Emotion curve:** Curious → Interested (3.5/5)

---

### Stage 3: Acquisition (First Value Exchange)

> *"Let me try the AI thing — that's what makes this different."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Library Page — AI Interoperability Mapper textarea |
| **User Actions** | Types a scenario: "We need to share student transcripts with colleges and align with our state's CEDS reporting requirements." Clicks "Generate Mapping." Waits for response. Reads AI recommendation. |
| **Thoughts & Questions** | "Will it understand my specific situation?" / "How long does this take?" / "Can I trust an AI recommendation for a standards decision?" |
| **Emotion** | Anticipation during loading → surprised delight if response is relevant, or skepticism if generic |
| **Pain Points** | No example queries or prompt suggestions — blank textarea is intimidating. No indication of expected wait time. Response quality varies with query specificity. No way to refine or follow up (single-turn only). Cited ontology URIs may confuse non-technical users. |
| **Opportunities** | Add 3-4 example queries as clickable chips ("Transcript portability for K-12", "Credential verification for employers"). Show a loading skeleton with estimated time. Add a "Was this helpful?" feedback mechanism. Support multi-turn conversation. Translate URIs into plain-language resource cards. |

**Emotion curve:** Anticipation → Surprise/Delight or Skepticism (4/5 if relevant, 2/5 if generic)

---

### Stage 4: Onboarding (First Deep Engagement)

> *"OK, the AI pointed me to CASE and CLR. Now let me really dig in."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Library Page — expanded spec cards (Implementation tab, Connections tab), CEDS Alignment Page (Matrix view) |
| **User Actions** | Opens Implementation tab for recommended specs — reads burden rubric, timeline, required capabilities. Switches to Connections tab — sees "commonly paired with" specs. Navigates to CEDS Alignment — clicks cells for specs the AI recommended, checks alignment status against domains the state requires. |
| **Thoughts & Questions** | "What does my team need to know to implement this?" / "If I adopt CASE, do I also need CLR?" / "Which CEDS domains are gaps — will the state flag us?" |
| **Emotion** | Empowered — starting to build a mental model of the landscape |
| **Pain Points** | Jumping between Library cards and CEDS Alignment requires mental context-switching (no persistent selection). Implementation tab shows capabilities needed but not how to acquire them. No way to save or bookmark findings mid-session. CEDS matrix is dense — 65 cells with no guided reading path. |
| **Opportunities** | Add a "My Shortlist" feature — pin specs across pages. Link Implementation tab capabilities to learning resources. Add a "Start here" guided path through the CEDS matrix (highlight cells relevant to the user's query). Add session persistence (localStorage) so users can return to their exploration. |

**Emotion curve:** Focused → Empowered (4/5)

---

### Stage 5: Engagement (Roadmap Generation)

> *"I need to turn this research into a plan I can present to the board."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Needs Explorer (Taxonomies Page) — Stakeholders tab, Use Cases tab, Roadmap Generator |
| **User Actions** | AI mapper auto-activates relevant stakeholder/use case IDs (or user manually selects). Checks business needs checkboxes for "K-12 Districts" and "Transcript Exchange" use case. Clicks "Create My Roadmap." Reviews scored, ranked specs with burden breakdowns and CEDS alignment badges. |
| **Thoughts & Questions** | "Is this roadmap defensible enough to present to the superintendent?" / "Can I export this?" / "What's the total timeline if I adopt these in order?" |
| **Emotion** | Peak satisfaction — the tool just did what would have taken weeks of research |
| **Pain Points** | Roadmap is not exportable (no PDF, no share link, no print-friendly view). Scores are relative with no absolute benchmarks. No cost estimates alongside burden levels. Roadmap disappears if user navigates away (no persistence). Cannot adjust weights or priorities in the scoring algorithm. |
| **Opportunities** | Add PDF/CSV export for the roadmap. Add a "Share roadmap" link (generates a URL with encoded selections). Add cumulative timeline view ("If you implement these 3 in order: ~6 months"). Allow users to drag-reorder or pin/unpin specs from the roadmap. Save roadmap snapshots to a user profile (production auth). |

**Emotion curve:** Anticipation → Peak satisfaction (5/5) — **This is the Aha Moment**

---

### Stage 6: Retention

> *"I need to come back when the state updates its requirements or when we start Phase 2."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Return visits to Library Page, CEDS Alignment, Needs Explorer. Vocabulary Page for technical integration. Partners Page for ecosystem context. |
| **User Actions** | Returns weeks later with a new scenario. Checks if new specs have been added. Downloads ontology.jsonld for internal use. Shares the site with a colleague implementing a different standard. Checks CEDS gaps to prepare for state audit. |
| **Thoughts & Questions** | "Has anything changed since last time?" / "Can I pick up where I left off?" / "Is there a way to get notified when new specs are added?" |
| **Emotion** | Functional loyalty — returns because no better alternative exists, but engagement is fragile |
| **Pain Points** | No changelog or "what's new" indicator. No user accounts — nothing persists between sessions. No email notifications for updates. Static data means updates are infrequent and invisible. Vocabulary Page (D3 graph) is impressive but not obviously actionable for non-architects. |
| **Opportunities** | Add a "What's changed" banner on return visits (compare last-visit timestamp to data freshness). Add optional email signup for quarterly update digests. Persist user selections and roadmaps (localStorage → user accounts in production). Add a "Data Architect" vs. "Decision Maker" toggle on Vocabulary Page to show different levels of detail. |

**Emotion curve:** Stable but fragile (3.5/5)

---

### Stage 7: Advocacy

> *"My colleague in the neighboring district needs this too."*

| Dimension | Detail |
|-----------|--------|
| **Touchpoints** | Email/Slack share, conference mention, state CTO council recommendation |
| **User Actions** | Copies site URL and shares with peer. Describes it as "the one site that actually compares ed-data standards." Mentions it in a state CTO council meeting. Screenshots the roadmap for a presentation. Recommends it to a vendor partner evaluating which specs to support. |
| **Thoughts & Questions** | "Will this make me look good for recommending it?" / "Is it maintained enough that it won't embarrass me?" / "Can my colleague get the same value without me walking them through it?" |
| **Emotion** | Pride in being a connector — but hedged ("it's a demo, but it's useful") |
| **Pain Points** | No shareable deep links (state-based routing means URLs don't point to specific pages). No embeddable widgets for presentations. "Demo" feel reduces confidence in recommending. No community forum or user directory to see who else uses it. Partners Page is placeholder — undermines credibility. |
| **Opportunities** | Implement React Router for shareable deep links (`/library/case-v1`, `/ceds/gap-analysis`). Add "Share this view" buttons that generate URLs with encoded state. Create embeddable comparison widgets for presentations. Build out Partners Page with real data. Add a "Used by" section showing institutional logos (with permission). |

**Emotion curve:** Proud but cautious (3.5/5)

---

## 4. Emotion Curve (Visual Summary)

```
5 |                              *
  |                             / \
4 |                   *--------*   \
  |                  /               \
3 |    *-----*------*                 *---------*
  |   /      |
2 |  /       |
  | /        |
1 |/         |
  +----+-----+-----+-----+-----+-----+-----+-----→
     Aware  Consider  Acquire  Onboard  Engage  Retain  Advocate
                        (AI)            (Roadmap)

   Legend:
   * = Emotion peak/valley
   Aha Moment = Roadmap generation (Stage 5)
   Biggest drop risk = Consideration → Acquisition (blank AI textarea)
```

---

## 5. Critical Moments

### Aha Moment
**When:** The user clicks "Create My Roadmap" and sees a scored, ranked implementation plan generated from their business needs selections — especially when the AI mapper auto-activated the right stakeholders.

**Why it matters:** This is the moment the tool delivers value no alternative can match. A consultant charges $15K+ for a similar deliverable. Google searches can't produce a scored comparison. This moment converts a curious visitor into a returning user.

### Moments of Truth

| Moment | Stage | Decision |
|--------|-------|----------|
| **First AI response quality** | Acquisition | If the AI response is generic or misunderstands the scenario, the user closes the tab and doesn't return. If it's specific and references the right standards, they lean in. |
| **CEDS matrix comprehension** | Onboarding | 65 cells is overwhelming. If the user can quickly find the cells relevant to their state's requirements, they stay. If it feels like a wall of data, they disengage. |
| **Roadmap defensibility** | Engagement | If the roadmap feels exportable and presentable to leadership, the user becomes an advocate. If it feels like "just a demo," they extract the insights mentally but don't share the tool. |

### Churn Triggers

| Trigger | Stage | Risk Level | Mitigation |
|---------|-------|------------|------------|
| Blank AI textarea with no guidance | Acquisition | **High** | Add example query chips |
| AI response is generic / hallucinates standards | Acquisition | **High** | Improve system prompt grounding; add "Was this helpful?" feedback |
| Roadmap not exportable | Engagement | **Medium** | Add PDF/CSV export |
| No persistence between sessions | Retention | **Medium** | localStorage (demo) → user accounts (production) |
| Only 5 specs in the library | Consideration | **Medium** | Add "coming soon" roadmap of planned specs; accept community submissions |
| No deep links / shareable URLs | Advocacy | **Medium** | Implement React Router |
| Partners Page is placeholder | Advocacy | **Low** | Populate with real data or remove from nav |

---

## 6. Prioritized Improvements

### Quick Wins (1-2 weeks each, high impact)

| # | Improvement | Stage Impacted | Expected Impact |
|---|-------------|---------------|-----------------|
| 1 | **Add example query chips** to AI mapper ("Transcript portability for K-12", "Credential verification for employers", "CEDS compliance for state reporting") | Acquisition | Reduces blank-textarea abandonment; sets quality expectations for AI responses |
| 2 | **Add React Router** for deep linking | All stages | Enables shareable URLs, browser back/forward, bookmarking specific views |
| 3 | **Add a hero section** with value prop + persona entry points on Library Page | Awareness | Reduces bounce rate; immediately communicates who this is for and why |
| 4 | **Add "Was this helpful?" feedback** on AI responses | Acquisition | Captures signal for prompt improvement; gives users agency |
| 5 | **Add localStorage persistence** for selected needs and roadmap state | Retention | Users can return to their work-in-progress without re-selecting |

### Medium Investment (3-6 weeks each, high impact)

| # | Improvement | Stage Impacted | Expected Impact |
|---|-------------|---------------|-----------------|
| 6 | **Roadmap PDF/CSV export** with branding | Engagement → Advocacy | Makes the tool's output presentable to leadership; biggest advocacy driver |
| 7 | **Multi-turn AI conversation** (follow-up questions) | Acquisition → Onboarding | Allows refinement ("What about equity concerns?" / "Compare just these two") |
| 8 | **Side-by-side spec comparison mode** | Consideration | Eliminates mental context-switching between cards; directly answers "A vs. B" |
| 9 | **Guided CEDS matrix path** (highlight cells relevant to user's AI query) | Onboarding | Makes 65-cell matrix approachable; connects AI recommendations to evidence |
| 10 | **"My Shortlist" feature** — pin specs across pages | Onboarding → Engagement | Persistent selection context across Library, CEDS, and Needs Explorer |

### Strategic Investment (Phase 2 architecture, high impact)

| # | Improvement | Stage Impacted | Expected Impact |
|---|-------------|---------------|-----------------|
| 11 | **User accounts + saved roadmaps** (Cognito, production architecture) | Retention → Advocacy | Enables returning to previous work; sharing roadmaps via link |
| 12 | **Expand to 15+ specifications** (via admin UI + Neptune) | Consideration → Retention | Increases completeness and credibility; covers more user scenarios |
| 13 | **Email digest for library updates** | Retention | Re-engagement channel; notifies when new specs or alignment data are added |
| 14 | **Embeddable comparison widgets** | Advocacy | Users can embed spec comparisons in internal wikis, presentations, board decks |

---

## 7. Journey Map Summary Table

| Stage | Touchpoint | User Action | Emotion | Key Pain Point | Top Opportunity |
|-------|-----------|-------------|---------|---------------|-----------------|
| **Awareness** | Shared link, conference, search | Lands on site, skims nav | Curious (3/5) | No value prop on landing | Hero section + persona entry points |
| **Consideration** | Standards Page, Library filters | Browses categories, filters by burden | Interested (3.5/5) | Only 5 specs, no comparison view | Side-by-side comparison mode |
| **Acquisition** | AI Mapper textarea | Types scenario, generates mapping | Anticipation → Delight or Skepticism (2-4/5) | Blank textarea, no prompt guidance | Example query chips |
| **Onboarding** | Spec cards (Impl/Connections), CEDS matrix | Digs into burden, capabilities, alignment | Empowered (4/5) | Context-switching between pages | "My Shortlist" + guided CEDS path |
| **Engagement** | Needs Explorer, Roadmap Generator | Selects needs, generates roadmap | Peak satisfaction (5/5) | Roadmap not exportable | PDF/CSV export |
| **Retention** | Return visits, Vocabulary Page | Checks for updates, downloads ontology | Fragile loyalty (3.5/5) | No persistence, no changelog | localStorage + email digest |
| **Advocacy** | Email/Slack share, conference mention | Shares URL, screenshots roadmap | Proud but cautious (3.5/5) | No deep links, demo feel | React Router + shareable roadmap links |

---

## 8. Visualization Recommendation

To create a visual version of this journey map, use **Miro** or **FigJam** with the following layout:

1. **Horizontal swimlanes** — one row per dimension (Touchpoints, Actions, Thoughts, Emotions, Pain Points, Opportunities)
2. **7 vertical columns** — one per journey stage
3. **Emotion line** — overlay a line graph connecting the emotion scores across stages (dip at Acquisition, peak at Engagement)
4. **Color coding** — green for opportunities, red for pain points, yellow for moments of truth
5. **Callout boxes** — highlight the Aha Moment (roadmap generation) and primary churn trigger (blank AI textarea)

---

*This journey map should be revisited after implementing user analytics (Phase 2C) to validate assumptions with real behavioral data.*
