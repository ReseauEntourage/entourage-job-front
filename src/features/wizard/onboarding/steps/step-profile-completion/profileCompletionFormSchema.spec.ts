jest.mock('@/src/features/forms/utils/loadOptions.utils', () => ({
  loadBusinessSectorsOptions: jest.fn(),
  loadCompaniesOptions: jest.fn(),
  loadLanguagesOptions: jest.fn(),
  loadSkillsOptions: jest.fn(),
}));

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import {
  loadBusinessSectorsOptions,
  loadCompaniesOptions,
  loadLanguagesOptions,
  loadSkillsOptions,
} from '@/src/features/forms/utils/loadOptions.utils';
import { PRESENTATION_MAX_LENGTH } from './profile-steps/presentationGeneration.utils';
import {
  buildIntroductionField,
  coachCurrentJobField,
  PROFILE_COMPLETION_FORM_ID,
  profileCompletionCvFields,
  profileCompletionFormSchema,
  profileCompletionProfessionalInfoCandidateRows,
  profileCompletionProfessionalInfoCoachFields,
} from './profileCompletionFormSchema';

const field = (fields: any[], id: string) =>
  fields.find((f) => f.id === id) as any;

describe('profileCompletionFormSchema', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is an empty schema identified by the profile completion form id', () => {
    expect(profileCompletionFormSchema).toEqual({
      id: PROFILE_COMPLETION_FORM_ID,
      fields: [],
    });
  });

  describe('buildIntroductionField', () => {
    it('is an optional textarea bounded by the presentation length', () => {
      expect(buildIntroductionField(UserRoles.COACH)).toMatchObject({
        id: 'description',
        component: 'textarea',
        maxLength: PRESENTATION_MAX_LENGTH,
      });
    });

    it('uses a placeholder written for the role', () => {
      const candidate = buildIntroductionField(UserRoles.CANDIDATE)
        .placeholder as string;
      const coach = buildIntroductionField(UserRoles.COACH)
        .placeholder as string;
      const unknown = buildIntroductionField(undefined).placeholder as string;
      expect(candidate).toContain('Adèle');
      expect(coach).toContain('Karim');
      expect(unknown).toBe(coach);
    });
  });

  it('requires the current job of coaches', () => {
    expect(coachCurrentJobField).toMatchObject({
      name: 'currentJob',
      isRequired: true,
      maxLength: 50,
    });
  });

  describe('coach professional fields', () => {
    const fields = profileCompletionProfessionalInfoCoachFields;

    it('loads the companies and sectors from their option loaders', () => {
      expect(field(fields, 'companyName').loadOptions).toBe(
        loadCompaniesOptions
      );
      expect(field(fields, 'businessSectorIds').loadOptions).toBe(
        loadBusinessSectorsOptions
      );
    });

    it('requires at least one sector', () => {
      const [rule] = field(fields, 'businessSectorIds').rules;
      expect(rule.method([{ value: 'a' }])).toBe(true);
      expect(rule.method([])).toBe(false);
      expect(rule.method(null)).toBe(false);
      expect(rule.message).toBe('Veuillez sélectionner au moins un secteur.');
    });

    it('only accepts empty or LinkedIn URLs', () => {
      const [rule] = field(fields, 'linkedinUrl').rules;
      expect(rule.method('')).toBe(true);
      expect(rule.method('https://www.linkedin.com/in/awa')).toBe(true);
      expect(rule.method('https://example.com/awa')).toBe(false);
      expect(rule.message).toBe('URL LinkedIn invalide.');
    });
  });

  describe('candidate professional rows', () => {
    const [firstRow, secondRow] =
      profileCompletionProfessionalInfoCandidateRows;

    it('has two rows of a sector and an occupation', () => {
      expect(firstRow.rowIndex).toBe(0);
      expect(secondRow.rowIndex).toBe(1);
      expect(firstRow.fields.map((f) => f.name)).toEqual([
        'businessSectorId0',
        'occupation0',
      ]);
      expect(secondRow.fields.map((f) => f.name)).toEqual([
        'businessSectorId1',
        'occupation1',
      ]);
      expect(firstRow.fields[0].isRequired).toBe(true);
    });

    it('requires the second sector only when a second occupation is given', () => {
      const [rule] = (secondRow.fields[0] as any).rules;
      expect(rule.method(null, { occupation1: 'Plombier' })).toBe(false);
      expect(rule.method(null, { occupation1: '' })).toBe(true);
      expect(rule.method({ value: 's' }, { occupation1: 'Plombier' })).toBe(
        true
      );
      expect(rule.message).toBe('Obligatoire');
    });
  });

  describe('CV fields', () => {
    it('asks the skills loader to include the creation of new skills', () => {
      const callback = jest.fn();
      field(profileCompletionCvFields, 'skills').loadOptions(callback, 'js');
      expect(loadSkillsOptions).toHaveBeenCalledWith(callback, 'js', true);
    });

    it('limits languages, skills and interests', () => {
      expect(field(profileCompletionCvFields, 'languages')).toMatchObject({
        maxItems: 10,
        loadOptions: loadLanguagesOptions,
      });
      expect(field(profileCompletionCvFields, 'skills').maxItems).toBe(50);
      expect(field(profileCompletionCvFields, 'interests').maxItems).toBe(10);
    });
  });
});
