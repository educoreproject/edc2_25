import { libraryEntries } from '@/lib/data/library-entries';
import { cedsDomains, cedsAlignmentMatrix } from '@/lib/data/ceds-alignment';
import { stakeholderTaxonomy, useCasesCedsRdf } from '@/lib/data/taxonomies';
import { fieldMappings, specLabels } from '@/lib/data/field-mappings';

function buildOntologyContext(): string {
  const specs = libraryEntries.map(e =>
    `- ${e.title} (educore:spec/${e.id}): ${e.category}, owner: ${e.owner}, burden: ${e.implementationBurden}. ${e.aiSummary} Compatibility: ${e.compatibilityNotes || 'N/A'}`
  ).join('\n');

  const domains = cedsDomains.map(d => `- ${d.label} (educore:ceds-domain/${d.id})`).join('\n');

  const alignments = cedsAlignmentMatrix.flatMap(a =>
    Object.entries(a.domains).map(([domainId, data]) => {
      const d = data as { status: string; notes: string; cedsElements: string[] };
      return `- ${a.entryShortName} → ${domainId}: ${d.status} — ${d.notes} [${(d.cedsElements || []).join(', ')}]`;
    })
  ).join('\n');

  return `## Ontology Context\n\nSpecifications:\n${specs}\n\nCEDS Domains:\n${domains}\n\nAlignments:\n${alignments}`;
}

function buildStakeholderContext(): string {
  const stakeholders = stakeholderTaxonomy.flatMap(g =>
    g.children.map(c => `- ${c.id}: ${c.label} (${g.label})`)
  ).join('\n');

  const useCases = useCasesCedsRdf.map(uc =>
    `- ${uc.id}: ${uc.label} — domains: ${uc.cedsDomains.join(', ')} — stakeholders: ${uc.stakeholders.join(', ')}`
  ).join('\n');

  return `## Available Stakeholders (use these exact IDs):\n${stakeholders}\n\n## Available Use Cases (use these exact IDs):\n${useCases}`;
}

function buildFieldMappingContext(): string {
  const header = `| Concept | ${Object.values(specLabels).join(' | ')} | Strength |`;
  const divider = `|${'-|'.repeat(Object.keys(specLabels).length + 2)}`;
  const rows = fieldMappings.map(fm => {
    const cells = Object.keys(specLabels).map(specId => {
      const m = (fm.mappings as Record<string, { field: string; path: string } | undefined>)[specId];
      return m ? m.field : '-';
    });
    return `| ${fm.concept} | ${cells.join(' | ')} | ${fm.matchStrength} |`;
  }).join('\n');

  return `## Field-Level Crosswalk\n${header}\n${divider}\n${rows}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const { query } = await request.json();

  const systemPrompt = `You are the EDUcore Reference Library AI assistant — an expert on education data interoperability standards.

Your job: given a user query, recommend the best standards, explain burden levels, and map to CEDS domains.

Response format:
1. 2-4 paragraphs with specific recommendations, mentioning burden levels and linking to specs
2. End with two structured sections:

## Ontology Resources Used
List the educore URIs you referenced, one per line in backticks.

## Activated Context
\`\`\`json
{
  "stakeholderIds": ["id1", "id2"],
  "useCaseIds": ["uc-id1"]
}
\`\`\`

${buildOntologyContext()}

${buildStakeholderContext()}

${buildFieldMappingContext()}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: err?.error?.message || `API error ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  const fullText = data.content[0].text;

  // Parse response sections
  const [mainAndSources, activatedRaw] = fullText.split('## Activated Context');
  const [mainAnswer, sourcesRaw] = (mainAndSources || '').split('## Ontology Resources Used');

  // Extract URIs
  const uriRegex = /`?(https:\/\/firsteducore\.org\/ontology#[^\s`<>)]+)`?/g;
  const shorthandRegex = /`?educore:([^\s`<>)]+)`?/g;
  const sources: string[] = [];
  if (sourcesRaw) {
    let match;
    while ((match = uriRegex.exec(sourcesRaw)) !== null) sources.push(match[1]);
    while ((match = shorthandRegex.exec(sourcesRaw)) !== null) sources.push(`https://firsteducore.org/ontology#${match[1]}`);
  }

  // Extract activated context
  let activatedContext = { stakeholderIds: [] as string[], useCaseIds: [] as string[] };
  if (activatedRaw) {
    const jsonMatch = activatedRaw.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        activatedContext = JSON.parse(jsonMatch[1]);
      } catch { /* ignore parse errors */ }
    }
  }

  return Response.json({
    answer: (mainAnswer || fullText).trim(),
    sources,
    activatedContext,
    fullText,
  });
}
