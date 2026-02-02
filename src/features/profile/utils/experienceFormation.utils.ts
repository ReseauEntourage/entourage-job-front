import type { Experience, Formation, Skill } from '@/src/api/types';
import type { FilterConstant } from '@/src/constants/utils';

export type ProfileExperienceModalValues = {
  title: string;
  location: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: FilterConstant<string>[];
};

export type ProfileFormationModalValues = {
  title: string;
  location: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: FilterConstant<string>[];
};

type MapSkillsOptions = {
  includeId?: boolean;
};

const asOptionalString = (value: string | undefined | null) => {
  if (!value) {
    return undefined;
  }
  const trimmed = String(value).trim();
  return trimmed ? trimmed : undefined;
};

export const mapSkillsFromFilters = (
  skills: FilterConstant<string>[] | undefined,
  { includeId = false }: MapSkillsOptions = {}
): Skill[] => {
  return (
    skills?.map((skill) => {
      const name = String(skill.label ?? skill.value ?? '').trim();
      const id = String(skill.value ?? skill.label ?? '').trim();

      if (includeId && id) {
        return { id, name: name || id };
      }

      return { name: name || id };
    }) ?? []
  );
};

export const buildExperienceFromModalValues = (
  values: ProfileExperienceModalValues,
  {
    id,
    base,
    includeSkillId = false,
  }: { id?: string; base?: Partial<Experience>; includeSkillId?: boolean } = {}
): Experience => {
  return {
    ...(base ?? {}),
    id: id || base?.id || undefined,
    title: (values.title || (base?.title as any) || '') as string,
    location: asOptionalString(values.location) ?? base?.location,
    company: asOptionalString(values.company) ?? base?.company,
    startDate: asOptionalString(values.startDate) ?? base?.startDate,
    endDate: asOptionalString(values.endDate) ?? base?.endDate,
    description: asOptionalString(values.description) ?? base?.description,
    skills: mapSkillsFromFilters(values.skills, { includeId: includeSkillId }),
  };
};

export const buildFormationFromModalValues = (
  values: ProfileFormationModalValues,
  {
    id,
    base,
    includeSkillId = false,
  }: { id?: string; base?: Partial<Formation>; includeSkillId?: boolean } = {}
): Formation => {
  return {
    ...(base ?? {}),
    id: id || base?.id || undefined,
    title: (values.title || (base?.title as any) || '') as string,
    location: asOptionalString(values.location) ?? base?.location,
    institution: asOptionalString(values.institution) ?? base?.institution,
    startDate: asOptionalString(values.startDate) ?? base?.startDate,
    endDate: asOptionalString(values.endDate) ?? base?.endDate,
    description: asOptionalString(values.description) ?? base?.description,
    skills: mapSkillsFromFilters(values.skills, { includeId: includeSkillId }),
  };
};

export const upsertById = <T extends { id?: string }>(
  items: T[],
  nextItem: T
): T[] => {
  const id = nextItem.id;
  if (!id) {
    return [...items, nextItem];
  }

  const hasId = items.some((item) => item.id === id);
  if (!hasId) {
    return [...items, nextItem];
  }

  return items.map((item) => (item.id === id ? nextItem : item));
};

export const removeById = <T extends { id?: string }>(
  items: T[],
  id?: string
): T[] => {
  if (!id) {
    return items;
  }
  return items.filter((item) => item.id !== id);
};

export const replaceAtIndex = <T>(items: T[], index: number, next: T): T[] => {
  const nextItems = items.slice();
  nextItems[index] = next;
  return nextItems;
};

export const removeAtIndex = <T>(items: T[], index: number): T[] => {
  return items.filter((_, i) => i !== index);
};
