#!/usr/bin/env node
// generate-rdf.js — Serializes library entries + CEDS alignment to Turtle and JSON-LD.
// Run: node scripts/generate-rdf.js
// Output: public/ontology.ttl, public/ontology.jsonld

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { libraryEntries } from '../src/data/libraryEntries.js';
import { cedsAlignmentMatrix, cedsDomains } from '../src/data/cedsAlignment.js';
import { fieldMappings } from '../src/data/fieldMappings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const BASE = 'https://firsteducore.org/ontology#';
const SPEC = (id) => `${BASE}spec/${id}`;
const CEDS_ALIGN = (specId, domainId) => `${BASE}ceds-alignment/${specId}/${domainId}`;
const CEDS_DOMAIN = (id) => `${BASE}ceds-domain/${id}`;
const BURDEN_RUBRIC = (id) => `${BASE}burden-rubric/${id}`;
const BURDEN_DIM = (id, dim) => `${BASE}burden-dimension/${id}/${dim}`;
const EQUITY = (id) => `${BASE}equity/${id}`;
const PRIVACY = (id) => `${BASE}privacy/${id}`;
const REF_IMPL = (specId, i) => `${BASE}ref-impl/${specId}/${i}`;
const DOC_LINK = (specId, i) => `${BASE}doc-link/${specId}/${i}`;
const FIELD_PROP = (specKey, fieldName) => {
  // e.g. 'case-1.1', 'identifier' → 'educore:case11_identifier'
  const prefix = specKey.replace(/[-.]/g, '');
  const safe = fieldName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  return `${BASE}field/${prefix}_${safe}`;
};
const FIELD_MAPPING = (i) => `${BASE}field-mapping/${i}`;

const matchStrengthPredicate = {
  equivalent: 'owl:equivalentProperty',
  close:      'skos:closeMatch',
  related:    'skos:relatedMatch',
};

// --- Turtle helpers ---

function esc(str) {
  if (str == null) return '';
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function literal(val) {
  return `"${esc(String(val))}"`;
}

function uri(u) {
  return `<${u}>`;
}

// --- Generate Turtle ---

function generateTurtle() {
  const lines = [];
  const w = (s) => lines.push(s);

  // Prefixes
  w(`@prefix owl: <http://www.w3.org/2002/07/owl#> .`);
  w(`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .`);
  w(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .`);
  w(`@prefix dcterms: <http://purl.org/dc/terms/> .`);
  w(`@prefix skos: <http://www.w3.org/2004/02/skos/core#> .`);
  w(`@prefix foaf: <http://xmlns.com/foaf/0.1/> .`);
  w(`@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .`);
  w(`@prefix educore: <${BASE}> .`);
  w('');

  // Ontology declaration
  w(`${uri(BASE.slice(0, -1))} a owl:Ontology ;`);
  w(`    rdfs:label "EDU Reference Library Ontology" ;`);
  w(`    rdfs:comment "Machine-readable catalog of LER ecosystem specifications, implementation metadata, and CEDS alignment." ;`);
  w(`    owl:versionInfo "1.0" .`);
  w('');

  // OWL Class declarations
  const classes = [
    ['Specification', 'A specification or standard in the EDU reference library'],
    ['BurdenRubric', 'Implementation burden breakdown for a specification'],
    ['BurdenDimension', 'A single dimension of implementation burden (engineering, infrastructure, or legal)'],
    ['EquityConsideration', 'Equity and accessibility assessment for a specification'],
    ['PrivacyConsideration', 'Privacy and security assessment for a specification'],
    ['ReferenceImplementation', 'A reference implementation or tool for a specification'],
    ['TechnicalDocLink', 'A link to technical documentation'],
    ['CedsAlignment', 'Alignment assessment between a specification and a CEDS domain'],
    ['CedsDomain', 'A CEDS (Common Education Data Standards) ontology domain'],
    ['FieldMapping', 'A cross-standard field-level mapping linking equivalent properties across specifications'],
  ];
  for (const [name, comment] of classes) {
    w(`educore:${name} a owl:Class ;`);
    w(`    rdfs:label "${name}" ;`);
    w(`    rdfs:comment "${esc(comment)}" .`);
    w('');
  }

  // CEDS domains
  for (const domain of cedsDomains) {
    w(`${uri(CEDS_DOMAIN(domain.id))} a educore:CedsDomain ;`);
    w(`    rdfs:label ${literal(domain.label)} ;`);
    w(`    dcterms:identifier ${literal(domain.id)} .`);
    w('');
  }

  // Specifications
  for (const entry of libraryEntries) {
    const s = uri(SPEC(entry.id));

    w(`${s} a educore:Specification ;`);
    w(`    dcterms:identifier ${literal(entry.id)} ;`);
    w(`    dcterms:title ${literal(entry.title)} ;`);
    w(`    dcterms:description ${literal(entry.description)} ;`);
    w(`    dcterms:type ${literal(entry.type)} ;`);
    w(`    educore:category ${literal(entry.category)} ;`);
    w(`    educore:owner ${literal(entry.owner)} ;`);
    w(`    educore:governanceBody ${literal(entry.governanceBody)} ;`);
    w(`    dcterms:modified "${entry.lastUpdated}"^^xsd:date ;`);
    w(`    educore:version ${literal(entry.version)} ;`);
    w(`    educore:accessLevel ${literal(entry.accessLevel)} ;`);
    w(`    educore:opennessStatus ${literal(entry.opennessStatus)} ;`);
    w(`    educore:status ${literal(entry.status)} ;`);

    if (entry.accessUrl && entry.accessUrl !== '#') {
      w(`    foaf:page ${uri(entry.accessUrl)} ;`);
    }
    if (entry.authoritativeRepoUrl) {
      w(`    educore:authoritativeRepoUrl ${uri(entry.authoritativeRepoUrl)} ;`);
    }

    // AI discovery
    w(`    educore:aiSummary ${literal(entry.aiSummary)} ;`);
    w(`    educore:aiUnlocksSummary ${literal(entry.aiUnlocksSummary)} ;`);
    for (const term of entry.aiTaxonomy) {
      w(`    educore:aiTaxonomy ${literal(term)} ;`);
    }

    // Tags
    for (const tag of entry.tags) {
      w(`    dcterms:subject ${literal(tag)} ;`);
    }

    // Implementation
    w(`    educore:implementationBurden ${literal(entry.implementationBurden)} ;`);
    w(`    educore:implementationBurdenRationale ${literal(entry.implementationBurdenRationale)} ;`);
    if (entry.implementationGuidance) {
      w(`    educore:implementationGuidance ${literal(entry.implementationGuidance)} ;`);
    }
    for (const cap of entry.requiredCapabilities) {
      w(`    educore:requiredCapability ${literal(cap)} ;`);
    }
    for (const adopter of (entry.knownAdopters || [])) {
      w(`    educore:knownAdopter ${literal(adopter)} ;`);
    }

    // Cross-references
    for (const pair of (entry.commonlyPairedWith || [])) {
      w(`    educore:commonlyPairedWith ${uri(SPEC(pair.id))} ;`);
    }
    for (const rel of (entry.relatedResources || [])) {
      w(`    educore:relatedResource ${uri(SPEC(rel))} ;`);
    }
    if (entry.compatibilityNotes) {
      w(`    educore:compatibilityNotes ${literal(entry.compatibilityNotes)} ;`);
    }

    // Burden rubric
    if (entry.burdenRubric) {
      w(`    educore:burdenRubric ${uri(BURDEN_RUBRIC(entry.id))} ;`);
    }

    // Equity & Privacy
    w(`    educore:equityConsiderations ${uri(EQUITY(entry.id))} ;`);
    w(`    educore:privacyConsiderations ${uri(PRIVACY(entry.id))} ;`);

    // Reference implementations
    (entry.referenceImplementations || []).forEach((_, i) => {
      w(`    educore:referenceImplementation ${uri(REF_IMPL(entry.id, i))} ;`);
    });

    // Technical doc links
    (entry.technicalDocLinks || []).forEach((_, i) => {
      w(`    educore:technicalDocLink ${uri(DOC_LINK(entry.id, i))} ;`);
    });

    // CEDS alignment links
    const alignment = cedsAlignmentMatrix.find(a => a.entryId === entry.id);
    if (alignment) {
      for (const domainId of Object.keys(alignment.domains)) {
        w(`    educore:cedsAlignment ${uri(CEDS_ALIGN(entry.id, domainId))} ;`);
      }
    }

    // Close — replace last semicolon with period
    const last = lines.length - 1;
    lines[last] = lines[last].replace(/ ;$/, ' .');
    w('');

    // Burden rubric detail
    if (entry.burdenRubric) {
      w(`${uri(BURDEN_RUBRIC(entry.id))} a educore:BurdenRubric ;`);
      if (entry.burdenRubric.timeline) {
        w(`    educore:timeline ${literal(entry.burdenRubric.timeline)} ;`);
      }
      for (const dim of ['engineering', 'infrastructure', 'legal']) {
        if (entry.burdenRubric[dim]) {
          w(`    educore:${dim} ${uri(BURDEN_DIM(entry.id, dim))} ;`);
        }
      }
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      w('');

      for (const dim of ['engineering', 'infrastructure', 'legal']) {
        const d = entry.burdenRubric[dim];
        if (!d) continue;
        w(`${uri(BURDEN_DIM(entry.id, dim))} a educore:BurdenDimension ;`);
        w(`    rdfs:label ${literal(dim)} ;`);
        w(`    educore:level ${literal(d.level)} ;`);
        w(`    educore:note ${literal(d.note)} .`);
        w('');
      }
    }

    // Equity
    w(`${uri(EQUITY(entry.id))} a educore:EquityConsideration ;`);
    w(`    educore:level ${literal(entry.equityConsiderations.level)} ;`);
    w(`    educore:notes ${literal(entry.equityConsiderations.notes)} ;`);
    w(`    educore:lifDerived "${entry.equityConsiderations.lifDerived}"^^xsd:boolean .`);
    w('');

    // Privacy
    w(`${uri(PRIVACY(entry.id))} a educore:PrivacyConsideration ;`);
    w(`    educore:level ${literal(entry.privacyConsiderations.level)} ;`);
    w(`    educore:notes ${literal(entry.privacyConsiderations.notes)} ;`);
    if (entry.privacyConsiderations.dataClassification) {
      w(`    educore:dataClassification ${literal(entry.privacyConsiderations.dataClassification)} ;`);
    }
    for (const reg of (entry.privacyConsiderations.regulations || [])) {
      w(`    educore:regulation ${literal(reg)} ;`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    w('');

    // Reference implementations
    (entry.referenceImplementations || []).forEach((impl, i) => {
      w(`${uri(REF_IMPL(entry.id, i))} a educore:ReferenceImplementation ;`);
      w(`    rdfs:label ${literal(impl.name)} ;`);
      w(`    foaf:page ${uri(impl.url)} ;`);
      w(`    dcterms:description ${literal(impl.description)} .`);
      w('');
    });

    // Technical doc links
    (entry.technicalDocLinks || []).forEach((link, i) => {
      w(`${uri(DOC_LINK(entry.id, i))} a educore:TechnicalDocLink ;`);
      w(`    rdfs:label ${literal(link.label)} ;`);
      w(`    foaf:page ${uri(link.url)} .`);
      w('');
    });

    // CEDS alignment instances
    if (alignment) {
      for (const [domainId, data] of Object.entries(alignment.domains)) {
        w(`${uri(CEDS_ALIGN(entry.id, domainId))} a educore:CedsAlignment ;`);
        w(`    educore:specification ${s} ;`);
        w(`    educore:cedsDomain ${uri(CEDS_DOMAIN(domainId))} ;`);
        w(`    educore:alignmentStatus ${literal(data.status)} ;`);
        w(`    educore:notes ${literal(data.notes)} ;`);
        if (data.gapNotes) {
          w(`    educore:gapNotes ${literal(data.gapNotes)} ;`);
        }
        for (const el of (data.cedsElements || [])) {
          w(`    educore:cedsElement ${literal(el)} ;`);
        }
        lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
        w('');
      }
    }
  }

  // Field-level crosswalk property mappings
  w(`# ─── Field-Level Crosswalk Mappings ───`);
  w('');
  fieldMappings.forEach((mapping, i) => {
    const predicate = matchStrengthPredicate[mapping.matchStrength] || 'skos:relatedMatch';
    const specKeys = Object.keys(mapping.mappings);
    const propUris = specKeys.map(k => FIELD_PROP(k, mapping.mappings[k].field));

    // Declare the mapping node
    w(`${uri(FIELD_MAPPING(i))} a educore:FieldMapping ;`);
    w(`    rdfs:label ${literal(mapping.concept)} ;`);
    if (mapping.entityType) {
      w(`    educore:entityType ${literal(mapping.entityType)} ;`);
    }
    w(`    educore:matchStrength ${literal(mapping.matchStrength)} ;`);
    if (mapping.notes) {
      w(`    rdfs:comment ${literal(mapping.notes)} ;`);
    }
    for (const propUri of propUris) {
      w(`    educore:mapsProperty ${uri(propUri)} ;`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    w('');

    // Declare each property and emit equivalence/match triples between them
    for (const specKey of specKeys) {
      const m = mapping.mappings[specKey];
      const propUri = FIELD_PROP(specKey, m.field);
      w(`${uri(propUri)} a rdf:Property ;`);
      w(`    rdfs:label ${literal(m.field)} ;`);
      w(`    educore:specKey ${literal(specKey)} ;`);
      w(`    educore:jsonPath ${literal(m.path)} .`);
      w('');
    }

    // Emit pairwise match triples
    for (let a = 0; a < propUris.length; a++) {
      for (let b = a + 1; b < propUris.length; b++) {
        w(`${uri(propUris[a])} ${predicate} ${uri(propUris[b])} .`);
      }
    }
    if (propUris.length > 1) w('');
  });

  return lines.join('\n');
}

// --- Generate JSON-LD ---

function generateJsonLd() {
  const context = {
    'educore': BASE,
    'dcterms': 'http://purl.org/dc/terms/',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl': 'http://www.w3.org/2002/07/owl#',
    'skos': 'http://www.w3.org/2004/02/skos/core#',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
  };

  const graph = [];

  // CEDS domains
  for (const domain of cedsDomains) {
    graph.push({
      '@id': CEDS_DOMAIN(domain.id),
      '@type': `${BASE}CedsDomain`,
      'rdfs:label': domain.label,
      'dcterms:identifier': domain.id,
    });
  }

  // Specifications
  for (const entry of libraryEntries) {
    const spec = {
      '@id': SPEC(entry.id),
      '@type': `${BASE}Specification`,
      'dcterms:identifier': entry.id,
      'dcterms:title': entry.title,
      'dcterms:description': entry.description,
      'dcterms:type': entry.type,
      [`${BASE}category`]: entry.category,
      [`${BASE}owner`]: entry.owner,
      [`${BASE}governanceBody`]: entry.governanceBody,
      'dcterms:modified': { '@value': entry.lastUpdated, '@type': 'xsd:date' },
      [`${BASE}version`]: entry.version,
      [`${BASE}accessLevel`]: entry.accessLevel,
      [`${BASE}opennessStatus`]: entry.opennessStatus,
      [`${BASE}status`]: entry.status,
      [`${BASE}aiSummary`]: entry.aiSummary,
      [`${BASE}aiUnlocksSummary`]: entry.aiUnlocksSummary,
      [`${BASE}aiTaxonomy`]: entry.aiTaxonomy,
      'dcterms:subject': entry.tags,
      [`${BASE}implementationBurden`]: entry.implementationBurden,
      [`${BASE}implementationBurdenRationale`]: entry.implementationBurdenRationale,
      [`${BASE}requiredCapability`]: entry.requiredCapabilities,
      [`${BASE}knownAdopter`]: entry.knownAdopters || [],
      [`${BASE}compatibilityNotes`]: entry.compatibilityNotes || null,
    };

    if (entry.accessUrl && entry.accessUrl !== '#') {
      spec['foaf:page'] = { '@id': entry.accessUrl };
    }
    if (entry.authoritativeRepoUrl) {
      spec[`${BASE}authoritativeRepoUrl`] = { '@id': entry.authoritativeRepoUrl };
    }
    if (entry.implementationGuidance) {
      spec[`${BASE}implementationGuidance`] = entry.implementationGuidance;
    }

    // Cross-references
    spec[`${BASE}commonlyPairedWith`] = (entry.commonlyPairedWith || []).map(p => ({ '@id': SPEC(p.id) }));
    spec[`${BASE}relatedResource`] = (entry.relatedResources || []).map(r => ({ '@id': SPEC(r) }));

    // Linked nodes
    spec[`${BASE}burdenRubric`] = entry.burdenRubric ? { '@id': BURDEN_RUBRIC(entry.id) } : null;
    spec[`${BASE}equityConsiderations`] = { '@id': EQUITY(entry.id) };
    spec[`${BASE}privacyConsiderations`] = { '@id': PRIVACY(entry.id) };
    spec[`${BASE}referenceImplementation`] = (entry.referenceImplementations || []).map((_, i) => ({ '@id': REF_IMPL(entry.id, i) }));
    spec[`${BASE}technicalDocLink`] = (entry.technicalDocLinks || []).map((_, i) => ({ '@id': DOC_LINK(entry.id, i) }));

    // CEDS alignment links
    const alignment = cedsAlignmentMatrix.find(a => a.entryId === entry.id);
    if (alignment) {
      spec[`${BASE}cedsAlignment`] = Object.keys(alignment.domains).map(d => ({ '@id': CEDS_ALIGN(entry.id, d) }));
    }

    graph.push(spec);

    // Burden rubric
    if (entry.burdenRubric) {
      const rubric = {
        '@id': BURDEN_RUBRIC(entry.id),
        '@type': `${BASE}BurdenRubric`,
        [`${BASE}timeline`]: entry.burdenRubric.timeline || null,
      };
      for (const dim of ['engineering', 'infrastructure', 'legal']) {
        if (entry.burdenRubric[dim]) {
          rubric[`${BASE}${dim}`] = { '@id': BURDEN_DIM(entry.id, dim) };
          graph.push({
            '@id': BURDEN_DIM(entry.id, dim),
            '@type': `${BASE}BurdenDimension`,
            'rdfs:label': dim,
            [`${BASE}level`]: entry.burdenRubric[dim].level,
            [`${BASE}note`]: entry.burdenRubric[dim].note,
          });
        }
      }
      graph.push(rubric);
    }

    // Equity
    graph.push({
      '@id': EQUITY(entry.id),
      '@type': `${BASE}EquityConsideration`,
      [`${BASE}level`]: entry.equityConsiderations.level,
      [`${BASE}notes`]: entry.equityConsiderations.notes,
      [`${BASE}lifDerived`]: { '@value': String(entry.equityConsiderations.lifDerived), '@type': 'xsd:boolean' },
    });

    // Privacy
    const priv = {
      '@id': PRIVACY(entry.id),
      '@type': `${BASE}PrivacyConsideration`,
      [`${BASE}level`]: entry.privacyConsiderations.level,
      [`${BASE}notes`]: entry.privacyConsiderations.notes,
    };
    if (entry.privacyConsiderations.dataClassification) {
      priv[`${BASE}dataClassification`] = entry.privacyConsiderations.dataClassification;
    }
    if (entry.privacyConsiderations.regulations?.length) {
      priv[`${BASE}regulation`] = entry.privacyConsiderations.regulations;
    }
    graph.push(priv);

    // Reference implementations
    (entry.referenceImplementations || []).forEach((impl, i) => {
      graph.push({
        '@id': REF_IMPL(entry.id, i),
        '@type': `${BASE}ReferenceImplementation`,
        'rdfs:label': impl.name,
        'foaf:page': { '@id': impl.url },
        'dcterms:description': impl.description,
      });
    });

    // Technical doc links
    (entry.technicalDocLinks || []).forEach((link, i) => {
      graph.push({
        '@id': DOC_LINK(entry.id, i),
        '@type': `${BASE}TechnicalDocLink`,
        'rdfs:label': link.label,
        'foaf:page': { '@id': link.url },
      });
    });

    // CEDS alignment instances
    if (alignment) {
      for (const [domainId, data] of Object.entries(alignment.domains)) {
        const node = {
          '@id': CEDS_ALIGN(entry.id, domainId),
          '@type': `${BASE}CedsAlignment`,
          [`${BASE}specification`]: { '@id': SPEC(entry.id) },
          [`${BASE}cedsDomain`]: { '@id': CEDS_DOMAIN(domainId) },
          [`${BASE}alignmentStatus`]: data.status,
          [`${BASE}notes`]: data.notes,
        };
        if (data.gapNotes) {
          node[`${BASE}gapNotes`] = data.gapNotes;
        }
        if (data.cedsElements?.length) {
          node[`${BASE}cedsElement`] = data.cedsElements;
        }
        graph.push(node);
      }
    }
  }

  // Field-level crosswalk property mappings
  fieldMappings.forEach((mapping, i) => {
    const predicate = matchStrengthPredicate[mapping.matchStrength] || 'skos:relatedMatch';
    const specKeys = Object.keys(mapping.mappings);
    const propUris = specKeys.map(k => FIELD_PROP(k, mapping.mappings[k].field));

    // Mapping node
    const mappingNode = {
      '@id': FIELD_MAPPING(i),
      '@type': `${BASE}FieldMapping`,
      'rdfs:label': mapping.concept,
      [`${BASE}matchStrength`]: mapping.matchStrength,
      [`${BASE}mapsProperty`]: propUris.map(u => ({ '@id': u })),
    };
    if (mapping.entityType) {
      mappingNode[`${BASE}entityType`] = mapping.entityType;
    }
    if (mapping.notes) {
      mappingNode['rdfs:comment'] = mapping.notes;
    }
    graph.push(mappingNode);

    // Property nodes with match triples
    for (let idx = 0; idx < specKeys.length; idx++) {
      const specKey = specKeys[idx];
      const m = mapping.mappings[specKey];
      const propUri = FIELD_PROP(specKey, m.field);

      const propNode = {
        '@id': propUri,
        '@type': 'rdf:Property',
        'rdfs:label': m.field,
        [`${BASE}specKey`]: specKey,
        [`${BASE}jsonPath`]: m.path,
      };

      // Pairwise match triples
      const matchTargets = propUris.filter((_, j) => j > idx);
      if (matchTargets.length > 0) {
        propNode[predicate] = matchTargets.map(u => ({ '@id': u }));
      }

      graph.push(propNode);
    }
  });

  return JSON.stringify({ '@context': context, '@graph': graph }, null, 2);
}

// --- Main ---

const ttl = generateTurtle();
const jsonld = generateJsonLd();

writeFileSync(join(publicDir, 'ontology.ttl'), ttl, 'utf-8');
writeFileSync(join(publicDir, 'ontology.jsonld'), jsonld, 'utf-8');

console.log(`Generated public/ontology.ttl (${(ttl.length / 1024).toFixed(1)} KB)`);
console.log(`Generated public/ontology.jsonld (${(jsonld.length / 1024).toFixed(1)} KB)`);
