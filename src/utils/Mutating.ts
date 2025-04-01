import { AnyCantFix } from './Types';

export function mutateToArray<T>(
  value: T | null | undefined
): T extends AnyCantFix[] | null | undefined ? T : T[] {
  if (value === null || value === undefined) {
    return value as T extends AnyCantFix[] | null | undefined ? T : never;
  }
  if (Array.isArray(value)) {
    return value as T extends AnyCantFix[] | null | undefined ? T : never;
  }
  return [value] as T extends AnyCantFix[] | null | undefined ? never : T[];
}
