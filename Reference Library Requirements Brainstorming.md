# EduCore Reference Library Scope and Requirements

[**Overview	1**](#overview)

[**Core Requirements	2**](#core-requirements)

[Functional Requirements	2](#functional-requirements)

[Personas	2](#personas)

[User Stories Ideas/UI	3](#user-stories-ideas/ui)

[Requirements	3](#requirements)

[Timeline	3](#timeline)

[Examples	4](#examples)

[**Agents	6**](#agents)

[**Library Content	6**](#library-content)

[Standards Library Content	7](#standards-library-content)

[Use Case Library	9](#use-case-library)

[Investment Language	9](#investment-language)

# Overview {#overview}

EDU will publish and maintain a **Working Reference Library** that serves as the shared “source of truth” for this ecosystem, establishing context and providing navigation to stakeholders, partner agreements, repositories, and other essential resources. The primary deliverable is a **living, AI-driven website** that functions as a standards and project library, enabling stakeholders to find, access, and apply approved Gates Foundation and standards-based resources intelligently. Consistent with DSU principles and the Gates Foundation’s emphasis on scalable public benefit, EDU will ensure referenced materials are **open and accessible** or clearly labeled when restrictions apply.

We will also add metadata fields in the library entries to support:

* discovery by both humans and AI and analytic systems  
* “implementation burden level,”  
* “required capabilities,”  
* “equity/accessibility considerations,”(possibly derived from LIF)  
* “privacy/security considerations.”

**So that:** implementers and partners can quickly discover what exists, reduce duplicated effort, and apply standards consistently, accelerating adoption of solutions that improve learner pathways and workforce mobility.

The user interface  layer consists of two types of interfaces:

* The first interface in the fourth layer consists of standardized APIs and endpoints. These allow AI systems, applications, reporting tools, and analytic services to discover and reference nodes, relationships, and properties defined in the semantic and data layers, as well as the curated resources documented in the library. APIs at this layer expose meaning in a controlled, referenceable form rather than as flattened payloads.  
* The second interface in the fourth layer is a web-responsive user interface. This interface supports human navigation of the semantic backbone, including access to the data model, linked reference documentation, and standards resources. Its purpose is transparency and usability, ensuring that the infrastructure remains intelligible not only to engineers, but also to practitioners, policymakers, and governance bodies who rely on trust and traceability.

# Core Requirements {#core-requirements}

## **Functional Requirements**  {#functional-requirements}

[MVP Educore Reference Library Product Requirements Document](https://docs.google.com/document/d/11y1XbCdCeQ8ytoUaqmZI3dbMy0iCecy_llRXX615IMY/edit?usp=sharing)

## **Personas** {#personas}

Personas: eventually able to be read by AI, but first something useful for stakeholders, practitioners, funders, learning providers and students, UI could change based on persona type even

* Hyperscalers themselves (Palantir, OpenAI, Anthropic, Google, AWS)  
* Innovative entrepreneurs  
* State Technical teams   
* Institution technical teams  
* Educators themselves   
* Employers  
* Learners  
* Employees

could even change view of site depending on persona) 

Profile Types: 

* **Standards Implementer** (ed-tech vendor integrating specs): I want to know which specs to implement and where to go for support, as well as what it will enable.   
* **Policy Analyst (state/federal agency evaluating adoption):** I want to see a heat map of Government RFP references and Vendor adoption claims for a specification so I can assess its market momentum and recommend it for statewide use.  
* **Workgroup Participant** (contributor tracking cross-spec activity): I need to see what other specs work with the one I’m working with, even ones I may not be aware of for the best possible implementation AND to perhaps see what may be missing.   
* **AI/LLM Developer** (building systems that consume education data): As an AI/LLM Developer, I want to consume the AI-Ready Transparency Metadata via an API so I can ensure my models only reason over governance-aware, non-deprecated standards.

## **User Stories Ideas/UI**  {#user-stories-ideas/ui}

* Directory of stakeholders, use cases, linked together both on the website and in a machine readable way  
* Able to click on those and filter/search by parameters/tags and then go to a webpage about it and stay interactive (related standards etc)   
* Eg State IEP’s, and it would show SEDM data model, and show the github repo,   
* If select 1edtech, shows the 1edtech standards that are relevant and can link to that, as well as show CASE OB3 CLR with business language about CLR and workgroup/links , download an SDK   
* demo site [https://www.loom.com/share/c4f19881cff74eeab9cc3454e2e34def](https://www.loom.com/share/c4f19881cff74eeab9cc3454e2e34def)  
  * [https://lifespecviewer.bolt.host/](https://lifespecviewer.bolt.host/) there is some weird formatting with that page when I tried to make updates but I haven't had   
* I also really like how [g.ai](http://g.ai) /google ai mode summarizes things but includes links and people can ask for more, but unsure how a 'chatbot' would play out   
* Recommend implementation patterns that skip the BS and focus on the problem-solving regardless of specification. 


## **Requirements** {#requirements}

1. **Stakeholder Registry, Resource Catalog, and Community of Practice.**  This spring, the project will make available a comprehensive registry of stakeholders and catalog of relevant resources.  It will expand the DSU, Ed3, and T3 networks into vibrant communities of practice where providers and  experts can more effectively connect and collaborate.  Special attention will be provided to ensure AI lab hyperscalers and other stakeholders not yet fully participating within the Data Standards United network of networks are fully engaged.  
2. Will include references to key content described later in this document.  
3. Visually engaging and usable  
4. AI-ified somehow? (dynamically show use cases.)  
5. Able to edit/fill in components of a use case/additional information

## **Timeline** {#timeline}

| Work Strand | February | March | April  | May | June  | July |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| **Working Reference Library** | Scope Content | Work on Prototype | Launch prototype | Work on Site based on User Acceptance Testing (UAT) | Launch v0.1 site | Gather feedback & update plans |

## **Examples** {#examples}

| Title | Strengths/Things to Borrow |  |
| :---- | :---- | :---- |
| Cefr (COMMON EUROPEAN FRAMEWORK OF REFERENCE FOR LANGUAGES: LEARNING, TEACHING, ASSESSMENT )  [https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4](https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4)  |  |  |
| SURF [https://www.surf.nl/en](https://www.surf.nl/en)  |  • Cooperative governance model • Infrastructure \+ services ecosystem • Strong interoperability orientation • Clear stakeholder coordination  | • Not a structured semantic registry of standards • No unified, filterable cross-standard metadata layer • Lacks AI-readable taxonomy navigation • No visible “implementation burden level” scoring • No systematic privacy/security metadata classification • Equity lens not surfaced as structured metadata |
| [https://lebok.wiki/](https://lebok.wiki/) | Represents nodes as SCD (AI discoverable?) • Well-organized knowledge areas • Deep domain structure • Multi-layered conceptual breakdown • Clear professional practice framing |  • No structured implementation complexity indicators • No explicit privacy/security tagging • Equity/accessibility not systematized as metadata fields |
| Learn and work ecosystem library: [https://learnworkecosystemlibrary.com/](https://learnworkecosystemlibrary.com/) | • Strong aggregation model • Glossary and topic indexing • Ecosystem-wide coverage • Open licensing | Metadata not standardized for AI analytics (that I can tell) No implementation burden classification • No technical capability tagging Equity considerations not consistently structured Privacy/security dimensions not systematically included Limited machine-actionable schema exposure Needs manual updating/not linked to workgroups or more information |
| [https://www.edmatrix.org/matrix.html](https://www.edmatrix.org/matrix.html)  | Multi-dimensional standards classification (shows area of interoperability focus) Graphically shows relationships between standards Directory-style comparison | Not machine readable (github perhaps though?)  No equity score No visible vocabulary  |
|  A host of resources are available on the LMC website: [https://lnkd.in/gAMpJJ8v](https://lnkd.in/gAMpJJ8v)  And, the Guidebooks\! Led by [DXtera Institute](https://www.linkedin.com/company/dxtera-institute/): [https://lnkd.in/gWUmNk9Y](https://lnkd.in/gWUmNk9Y)  Led by Skybridge Skills ([Nate Otto](https://www.linkedin.com/in/nateotto/)) [https://lnkd.in/gZqZzD8W](https://lnkd.in/gZqZzD8W) |  |  |

Potential interface/modeled after with DOL AI Literacy Framework?:   
[https://www.dol.gov/sites/dolgov/files/ETA/advisories/TEN/2025/TEN%2007-25/TEN%2007-25%20%28complete%20document%29.pdf](https://www.dol.gov/sites/dolgov/files/ETA/advisories/TEN/2025/TEN%2007-25/TEN%2007-25%20%28complete%20document%29.pdf)

# 

# Agents {#agents}

Agent for each interoperability spec that maintains real time spec updates from github repo’s and can update itself automatically? 

Store specs from RDF to something like Claude Skills.   
[https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

For this skill, I built within claude code in the directory of my skill spec translation API (so i don’t like how it says ‘start the service’ etc \- it could just run the python script service on it’s own\! 

But interesting concept if there were ‘skills’ for each specification that explained how they’re used and work together so the llm does the rest. 

- Once up and running, create agent that scans github for specification usage, workgroups, etc (github has API that supplies most of this, a simple llm call could organize/summarize it in real time)  
- Use github for versioning in background  
- 

[SKILL.md](https://drive.google.com/file/d/1UaFZ6FtOraYJO1dkMaKEM2pk74F8djTh/view?usp=drive_link) 

* Research agents to build

	⁃	Documents research library 

# Library Content {#library-content}

All content should be discoverable (and thus have metadata that allows filtering and scoping of search) , and  be able to be navigated through search or  navigating a taxonomy, as appropriate 

* discovery by both humans and AI and analytic systems  
* “implementation burden level,”  
* “required capabilities,”  
* “equity/accessibility considerations,”(possibly derived from LIF)  
* “privacy/security considerations.”

Priority Standards: 

1\. LERs:   
    a. 1EdTech OBv3, CASE, CLR,   
    b. W3C VCs  
2\. EdFI/A4L/CEDS,SEDM   
3\. HROS JEDx  
4\. HROS TCP  
5\. PESC JSON-LD Transcript

## 

## **Standards Library Content** {#standards-library-content}

| Organization | Domain Focus | Core Contribution and Standards | Priority |
| :---- | :---- | :---- | :---- |
| 1EdTech | K-12 and Higher Ed | Open Badges, CLR Standard, CASE5 | OBv3, CLR, CASE as components of an LER |
| Access 4 Learning (A4L) | K-12 Data Mgmt | SIF/JEDx Infrastructure, data handling, and student privacy standards 3 | JEDX Infrastructure, PODS, Privacy Registry, LEDx Data Model |
| Common Education Standards (CEDS)  | PK20W+  | CEDS | CEDS Ontology, Generate |
| Credential Engine | Credential Transparency | CTDL and ASN-CTDL | CTDL and ASN-CTDL  |
| Dublin Core | General Metadata | Standardized metadata schemas for digital resource discovery 2 | LRMI |
| Gates Foundation | Education and Workforce Ecosystem  | Learning Information Framework (LIF), CEDS EDFi Data Warehouse | LIF, CEDS EdFi Data Warehouse |
| HR Open Standards | Employment and HR | JEDx DataModel,  Skills API, Trusted Career Profile (TCP) specifications for recruitment | JEDx Data Model, TCP |
| IEEE LTSC | Technical Engineering | SCD, LER (2024) Guideline | SCD, LER, xAPI, LMT, xAPI Profiles |
| MedBiquitous | Healthcare Education | Common language for health professions and lifelong learning 3 | Common Vocabulary Model |
| i2idl | Military | ELR, Total Learning Architecture (TLA)  | ELR, TLA |
| PESC | Postsecondary Ed | JSON Transcripts and open standards for student record exchange 3 | JSON-LD Transcript |
| W3C VC | General Metadata | Verifiable Credentials, W3C-EDU | VC2 |

1. **Experimental Learning:** Users can "click through" real data flows to understand how different standards (like xAPI and CTDL) interact.20  
2. **Visual Engagement:** The library uses "Search Animations" and interactive nodes to provide an engaging experience that lowers the cognitive load for non-technical users.19

## **Use Case Library**  {#use-case-library}

### **Investment Language** {#investment-language}

EDUcore will document the ecosystem’s most valuable and feasible applications by assembling a **broad, stakeholder-driven set of business and use cases** spanning education, workforce, and hyperscaler participation. Deliverables include a **Living Use Case document** that is also discoverable through the Reference Library, a **prioritized list** identifying the use cases to be tackled in Phase II in coordination with Gates Foundation investments and standards bodies, and a **use case template and intake process** that allows other partners to propose new use cases and priorities.

Some examples of use cases might be: 

* small district reporting and interoperability without new platforms  
* adult learner LER assembly from fragmented sources,  
* disability accommodations-aware record sharing with privacy controls,  
* multilingual advising/communication with provenance.

**So that:** the infrastructure roadmap is anchored in the highest impact, most implementable scenarios, driving real improvements in credential transparency, learner support, and pathways to employment rather than producing purely theoretical architecture.

Related Research and Projects

Gen AI in Assessment blog: [https://genai-insights-hub.learningdatainsights.com/2026/01/announcing-genai-evidence-insights-hub.html?m=1](https://genai-insights-hub.learningdatainsights.com/2026/01/announcing-genai-evidence-insights-hub.html?m=1)

Learner information Framework 

