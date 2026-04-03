import { notFound } from 'next/navigation';
import {
  getUseCaseById,
  getStandardsForUseCase,
} from '@/lib/data/resolvers';
import { useCaseTaxonomy } from '@/lib/data/use-case-taxonomy';
import UseCaseDetail from './UseCaseDetail';

function getOwnGithubIssue(useCaseId: string): number | null {
  for (const cat of useCaseTaxonomy) {
    for (const sub of cat.children) {
      for (const uc of sub.children) {
        if (uc.id === useCaseId && 'githubIssue' in uc && uc.githubIssue) {
          return (uc as { githubIssue: number }).githubIssue;
        }
      }
    }
  }
  return null;
}

function getOwnTags(useCaseId: string): string[] {
  for (const cat of useCaseTaxonomy) {
    for (const sub of cat.children) {
      for (const uc of sub.children) {
        if (uc.id === useCaseId && 'tags' in uc) {
          return (uc as { tags: string[] }).tags;
        }
      }
    }
  }
  return [];
}

function getSiblingUserStories(useCaseId: string, subcategoryId: string, categoryId: string) {
  for (const cat of useCaseTaxonomy) {
    if (cat.id !== categoryId) continue;
    for (const sub of cat.children) {
      if (sub.id !== subcategoryId) continue;
      return sub.children
        .filter(uc => 'githubIssue' in uc && uc.githubIssue && uc.id !== useCaseId)
        .map(uc => ({
          id: uc.id,
          label: uc.label,
          githubIssue: (uc as unknown as { githubIssue: number }).githubIssue,
        }));
    }
  }
  return [];
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ useCaseId: string }>;
}) {
  const { useCaseId } = await params;
  const useCase = getUseCaseById(useCaseId);
  if (!useCase) notFound();

  const standards = getStandardsForUseCase(useCaseId);
  const ownIssue = getOwnGithubIssue(useCaseId);
  const tags = getOwnTags(useCaseId);
  const siblingStories = getSiblingUserStories(useCaseId, useCase.subcategoryId, useCase.categoryId);

  // Serialize for client component
  const serializedStandards = standards.map((s, i) => ({
    id: s.entry.id,
    title: s.entry.title,
    burden: s.entry.implementationBurden,
    score: s.score,
    fullCount: s.fullCount,
    partialCount: s.partialCount,
    matchedDomains: s.matchedDomains,
    index: i,
  }));

  return (
    <UseCaseDetail
      useCase={useCase}
      standards={serializedStandards}
      ownIssue={ownIssue}
      tags={tags}
      siblingStories={siblingStories}
    />
  );
}
