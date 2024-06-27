import { ExtendedSlices } from './types';

export function assertSlicesAreUniq<S extends ExtendedSlices>(slices: S) {
  const duplicatedModule = Object.values(slices).find((slice) => {
    const duplicatedCount = Object.values(slices).filter(
      (sliceToSearch) => sliceToSearch.slice.name === slice.slice.name
    ).length;

    return duplicatedCount > 1;
  });

  if (duplicatedModule) {
    throw new Error(
      `[MODULE ERROR]: 2 modules with the name '${duplicatedModule.slice.name}'`
    );
  }
}
