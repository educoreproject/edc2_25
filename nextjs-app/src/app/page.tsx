import Link from 'next/link';
import Image from 'next/image';
import EcosystemMap from '@/components/EcosystemMap';

const BAKEOFF_ENTRIES = [
  {
    thumb: '/thumbnails/1 - Brandon - Exploring the EduCore Reference Library and AI Search Features 📚.jpg',
    title: 'EduCore Reference Library & AI Search',
    presenter: 'Brandon Dorman',
    desc: 'Demonstrates the EduCore Reference Library with an AI-powered search engine grounded in a CEDS-based RDF/JSON-LD ontology. Users can query natural-language questions and receive standards-aligned implementation roadmaps.',
    link: 'https://drive.google.com/file/d/1mLKKuhzBl3BdV67DMMqmYvkU9xKMaVF3/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/2 - Robert Bajor - 5 Minute Skill Nexus AI Demo - microcredential multiverse.jpg',
    title: 'Skill Nexus AI',
    presenter: 'Robert Bajor \u2014 Micro Credential Multiverse',
    desc: 'AI-driven labor market intelligence tool covering 1,016 O*NET occupations. Provides three tailored views \u2014 job seekers, hiring managers, and education providers. Includes LinkedIn integration and downloadable career kits.',
    link: 'https://drive.google.com/file/d/1DoXBwQvCg6Ekk2BH_iNqB7O5jIUf0n1F/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/3 - Jackson Smith - LEF_s CEDS-MCP Tool_ Exploring Equity Gaps in Education with AI-Driven Data Analysis.jpg',
    title: 'CEDS-MCP: AI-Driven Equity Gap Analysis',
    presenter: 'Jackson Smith \u2014 Learning Economy Foundation',
    desc: 'An MCP server that connects Claude directly to a CEDS database, letting AI autonomously discover schemas, identify populated tables, and write analytical SQL on a 50,000-student synthetic dataset.',
    link: 'https://drive.google.com/file/d/1FSh0PeW9YJw7XypU_fGbbKeKkCz4HO9Z/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/4 - David M - Big Vid - KSAWorks Goldcheck.jpg',
    title: 'KSAWorks GoldCheck',
    presenter: 'David Martel \u2014 Academy One',
    desc: 'Shows how EDUCORE\u2019s semantic backbone transforms static transcripts into actionable, linked data. GoldCheck is a free AI-enabled tool that reveals transfer credit pathways and competency mappings.',
    link: 'https://drive.google.com/file/d/152Jj07PxSrsK8BIA_pgEBO4UoZB2gUIf/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/David M - EDUCORE KSWORKS-P.jpg',
    title: 'KSAWorks: From Transcript to Selfie',
    presenter: 'David Martel \u2014 Academy One',
    desc: 'A real implementation of EDUCORE concepts showing how RDF endpoints and CEDS mapping turn static academic records into living competency profiles \u2014 creating a dynamic learner \u201cSelfie\u201d that AI navigation tools can act on.',
    link: 'https://drive.google.com/file/d/152Jj07PxSrsK8BIA_pgEBO4UoZB2gUIf/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/John Lovell - A4L.jpg',
    title: 'A4L (Access 4 Learning)',
    presenter: 'John Lovell',
    desc: 'A visual presentation on Access 4 Learning\u2019s role in the EDUCORE ecosystem, highlighting how A4L\u2019s data standards and community efforts connect with the broader initiative.',
    link: 'https://drive.google.com/file/d/1CsDI_fF9ESHI9KNtWOYey_kOGd5OuQgN/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/TQ_WHITE_II - AI_BAKEOFF.jpg',
    title: 'SIF & CEDS Data Model Explorer',
    presenter: 'TQ White II',
    desc: 'Loads both SIF and CEDS data models into a graph database for side-by-side exploration. Features a tree-based data model lookup, AI-powered cross-standard mapping, and visual graph diagrams.',
    link: 'https://drive.google.com/file/d/1wl_vVaAmUo-cn6WWahFTwH48SSsqJzvW/view?usp=drive_link',
  },
  {
    thumb: '/thumbnails/Vince Paredes - CEDS Assessment Query.jpg',
    title: 'CEDS Assessment Ontology Query',
    presenter: 'Vince Paredes',
    desc: 'A one-take ChatGPT session demonstrating how AI can read the CEDS assessment ontology, construct SPARQL queries, and execute queries against real data to answer standards questions autonomously.',
    link: 'https://drive.google.com/file/d/1xI6b6K-06SBUxXmX-tM3CATkh1mJWVqW/view?usp=drive_link',
  },
];

const USE_CASES = [
  {
    icon: '\u{1F916}',
    title: 'AI Integration with Integrity',
    desc: 'Enable AI systems to work with education and workforce data using consistent, governed semantics \u2014 ensuring interoperable standards underpin AI-driven tools rather than proprietary data silos. A shared semantic backbone enables portable AI memory: learner context that travels with the individual across institutions, platforms, and life stages with full provenance and human oversight.',
  },
  {
    icon: '\u{1F393}',
    title: 'Adult Learner LER Assembly',
    desc: 'Help adult learners assemble a comprehensive Learning and Employment Record from fragmented sources \u2014 community colleges, workforce programs, employer training, and professional certifications \u2014 into a single, portable, standards-based credential profile.',
  },
  {
    icon: '\u{1F512}',
    title: 'Disability Accommodations-Aware Record Sharing',
    desc: 'Support the secure exchange of learner records that include disability accommodation information, with fine-grained privacy controls ensuring sensitive data is only shared with authorized parties on a need-to-know basis.',
  },
  {
    icon: '\u{1F310}',
    title: 'Multilingual Advising & Communication',
    desc: 'Enable multilingual academic advising and family communication with full data provenance \u2014 ensuring translated records and communications can be traced back to verified, authoritative source documents.',
  },
  {
    icon: '\u{1F3EB}',
    title: 'Small District Reporting & Interoperability',
    desc: 'Enable small and rural districts to meet state and federal reporting requirements using existing systems. EDUcore provides standards-aligned mappings so districts can share and report data without adopting new platforms or infrastructure.',
  },
];

const PHASE1 = [
  { title: 'Outreach & Partnerships', desc: 'Stakeholder letters, signatories, and engagement with standards bodies and technology partners.' },
  { title: 'Advisory Council', desc: 'Vertical-specific demos followed by business alignment sessions with stakeholder leadership.' },
  { title: 'Reference Library', desc: "User\u2019s guide, stakeholder registry, use case registry, resource catalog, and standards registry." },
  { title: 'CEDS Ontology & RDF', desc: 'RDF foundation with mappings to all specifications, but starting with CEDS and SIF, Special Education Data Model (SEDM) and other high impact areas.' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-up">

      {/* Hero */}
      <div className="hero-gradient text-white text-center px-6 py-16 sm:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 60%, rgba(0,181,184,.18) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-block text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,181,184,0.2)', border: '1px solid rgba(0,181,184,0.4)', color: '#5EEAED' }}
          >
            Open Standards &middot; AI-Ready
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Harmonizing Interoperability Specs for AI
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            AI is reshaping education and workforce systems, but fragmented data standards hold the ecosystem back.
            EDUcore is building the shared semantic backbone that makes existing standards easier to understand,
            implement, and connect &mdash; without replacing them.
          </p>
        </div>
      </div>

      {/* Ecosystem Map */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Ecosystem Map</h2>
          <Link href="/drivers" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B3FD3' }}>All Drivers &rarr;</Link>
        </div>
        <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#fff', border: '1px solid rgba(7,42,108,0.06)' }}>
          <EcosystemMap />
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10" id="use-cases">
        <h2 className="text-2xl font-normal mb-1" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Use Cases</h2>
        <p className="text-sm mb-6 pb-3 border-b" style={{ color: '#7A8499', borderColor: '#EEF1F7' }}>
          Real-world scenarios driving EduCore&apos;s design and priorities.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="card p-6">
              <div className="text-2xl mb-3">{uc.icon}</div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#072A6C' }}>{uc.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#7A8499' }}>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why EDUcore */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10" id="why">
        <h2 className="text-2xl font-normal mb-1" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Why EDUcore?</h2>
        <p className="text-sm mb-6 pb-3 border-b" style={{ color: '#7A8499', borderColor: '#EEF1F7' }}>
          Education runs on data, but interoperability standards are fragmented.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: '#111827' }}>
            <p>
              Institutions that need to exchange learner, program, credential, and outcomes data must navigate multiple
              specifications that do not map cleanly to each other. The result is duplicated integration work, inconsistent
              meaning, and limited reuse &mdash; creating challenges for innovation, implementation, and scalability.
            </p>
            <p>
              EDUcore&apos;s mission is to establish an <strong>AI-ready &ldquo;source of truth&rdquo; for interoperability</strong> built
              by aligning existing standards rather than replacing them. Through active participation from standards bodies,
              combined resources, and a broad coalition of stakeholders, EDUcore provides a shared semantic backbone and a
              practical mapping layer so organizations can continue using current systems while achieving consistent, governed
              interoperability.
            </p>
            <p>
              We are not creating &ldquo;one new standard to rule them all.&rdquo; We are building shared infrastructure that
              makes the standards already in use easier to understand, implement, and connect across the PK20W+ ecosystem &mdash;
              lifelong learning ranging from early childhood through workforce.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#072A6C', letterSpacing: '0.06em' }}>
              What We&apos;re Working Toward
            </div>
            <ul className="space-y-3 text-[14px] leading-relaxed" style={{ color: '#7A8499' }}>
              <li><strong className="text-gray-900">A common semantic backbone</strong> &mdash; A baseline linked-data model (RDF/JSON-LD) grounded in the CEDS ontology and informed by credential transparency work, with governed extensions where gaps exist.</li>
              <li><strong className="text-gray-900">Use-case-driven mappings</strong> &mdash; Cross-sector use cases with the highest-value standards mapped to the baseline model. Crosswalks that are explicit, versioned, and auditable so AI tools can assist implementation without inventing meaning.</li>
              <li><strong className="text-gray-900">A practical reference library</strong> &mdash; Searchable and structured for implementers: canonical definitions, mappings, implementation notes, openness status, and governance metadata.</li>
              <li><strong className="text-gray-900">Future-proofed, safe-by-design enablement</strong> &mdash; Architecture that supports modern AI workflows while embedding guardrails for privacy, provenance, auditability, and human oversight in high-stakes contexts.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phase 1 Deliverables */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10" id="phase1">
        <h2 className="text-2xl font-normal mb-1" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>Phase 1 Deliverables</h2>
        <p className="text-sm mb-6 pb-3 border-b" style={{ color: '#7A8499', borderColor: '#EEF1F7' }}>
          Targeted outputs for the initial project phase.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASE1.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 border-l-4"
              style={{ borderLeftColor: '#00B5B8', boxShadow: '0 2px 12px rgba(7,42,108,.08), 0 0 0 1px rgba(7,42,108,.06)' }}
            >
              <h3 className="text-sm font-bold mb-2" style={{ color: '#072A6C' }}>{item.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#7A8499' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Standards Alignment Banner */}
      <div
        className="text-center px-6 py-14 relative overflow-hidden"
        style={{ background: '#072A6C' }}
        id="alignment"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(0,181,184,.12) 0%, transparent 70%)' }}
        />
        <h2 className="text-2xl font-normal text-white mb-2 relative z-10" style={{ fontFamily: 'var(--font-display)' }}>
          Standards Alignment
        </h2>
        <p className="text-sm relative z-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          EduCore seeks alignment with the leading education data standards and initiatives.
        </p>
      </div>

      {/* AI Bakeoff */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10" id="bakeoff">
        <h2 className="text-2xl font-normal mb-1" style={{ color: '#072A6C', fontFamily: 'var(--font-display)' }}>EDUcore AI Bakeoff</h2>
        <p className="text-sm mb-6 pb-3 border-b" style={{ color: '#7A8499', borderColor: '#EEF1F7' }}>
          Community demonstrations showcasing AI-powered tools built on education data standards.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {BAKEOFF_ENTRIES.map((entry) => (
            <div key={entry.title + entry.presenter} className="card overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={entry.thumb}
                  alt={entry.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold mb-0.5" style={{ color: '#072A6C' }}>{entry.title}</h3>
                <div className="text-xs font-bold mb-2" style={{ color: '#00B5B8', letterSpacing: '0.02em' }}>{entry.presenter}</div>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#7A8499' }}>{entry.desc}</p>
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-link inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border-2 transition-colors"
                >
                  Watch on Drive
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
