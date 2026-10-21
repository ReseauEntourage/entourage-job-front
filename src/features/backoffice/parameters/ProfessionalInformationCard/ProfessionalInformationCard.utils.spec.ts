// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from './ProfessionalInformationCard.utils';

const sectorOccupations = [
  {
    businessSector: { id: 's1', name: 'BTP' },
    occupation: { id: 'o1', name: 'Maçon' },
  },
  {
    businessSector: { id: 's2', name: 'Commerce' },
    occupation: undefined,
  },
  {
    businessSector: undefined,
    occupation: { id: 'o3', name: 'Vendeur' },
  },
] as any;

describe('getCoachDefaultProfessionalValues', () => {
  it('maps business sectors and company, skipping empty sectors', () => {
    expect(
      getCoachDefaultProfessionalValues(
        { sectorOccupations, currentJob: 'Chef de chantier' },
        { name: 'Acme' }
      )
    ).toEqual({
      currentJob: 'Chef de chantier',
      businessSectorIds: [
        { value: 's1', label: 'BTP' },
        { value: 's2', label: 'Commerce' },
      ],
      companyName: { value: 'Acme', label: 'Acme' },
    });
  });

  it('handles a coach without company, job or sectors', () => {
    expect(
      getCoachDefaultProfessionalValues({ currentJob: null }, null)
    ).toEqual({
      currentJob: undefined,
      businessSectorIds: [],
      companyName: undefined,
    });
  });
});

describe('getCandidateDefaultProfessionalValues', () => {
  it('indexes sectors and occupations independently', () => {
    expect(
      getCandidateDefaultProfessionalValues({ sectorOccupations })
    ).toEqual({
      businessSectorId0: { value: 's1', label: 'BTP' },
      businessSectorId1: { value: 's2', label: 'Commerce' },
      occupation0: 'Maçon',
      occupation1: 'Vendeur',
    });
  });

  it('returns nothing without sector occupations', () => {
    expect(getCandidateDefaultProfessionalValues({})).toEqual({});
    expect(
      getCandidateDefaultProfessionalValues({ sectorOccupations: [] })
    ).toEqual({});
  });
});
