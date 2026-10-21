// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { getSectorOccupationLabels } from './ProfileCareerPathSentence.utils';

describe('getSectorOccupationLabels', () => {
  it('returns nothing without sector occupation', () => {
    expect(getSectorOccupationLabels()).toEqual({
      occupation: undefined,
      sector: undefined,
    });
    expect(getSectorOccupationLabels([])).toEqual({
      occupation: undefined,
      sector: undefined,
    });
  });

  it('uses the first sector occupation only', () => {
    expect(
      getSectorOccupationLabels([
        {
          occupation: { name: 'Cuisinier' },
          businessSector: { name: 'Hôtellerie' },
        },
        {
          occupation: { name: 'Autre' },
          businessSector: { name: 'Autre secteur' },
        },
      ] as any)
    ).toEqual({ occupation: 'Cuisinier', sector: 'Hôtellerie' });
  });

  it('tolerates a missing occupation or sector', () => {
    expect(
      getSectorOccupationLabels([{ businessSector: { name: 'BTP' } }] as any)
    ).toEqual({ occupation: undefined, sector: 'BTP' });
    expect(
      getSectorOccupationLabels([{ occupation: { name: 'Maçon' } }] as any)
    ).toEqual({ occupation: 'Maçon', sector: undefined });
  });
});
