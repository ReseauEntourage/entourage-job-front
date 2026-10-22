jest.mock('@/src/api');
jest.mock('@/src/constants/nudges', () => ({
  createNudgeOption: jest.fn((role, nudge) =>
    nudge.value === 'known' ? { value: nudge.id, label: `${role}-label` } : null
  ),
}));

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  loadBusinessSectorsOptions,
  loadCompaniesOptions,
  loadDepartmentsOptions,
  loadLanguagesOptions,
  loadNudgesOptions,
  loadSkillsOptions,
} from './loadOptions.utils';

const mockedApi = getMockedApi();

describe('loadOptions utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  describe('loadNudgesOptions', () => {
    it('maps nudges to options and drops unknown ones', async () => {
      mockedApi.getAllNudges.mockResolvedValue({
        data: [
          { id: 'n1', value: 'known' },
          { id: 'n2', value: 'unknown' },
        ],
      } as never);
      const callback = jest.fn();

      await loadNudgesOptions('Coach', callback);

      expect(mockedApi.getAllNudges).toHaveBeenCalledWith({
        search: '',
        limit: 50,
        offset: 0,
      });
      expect(callback).toHaveBeenCalledWith([
        { value: 'n1', label: 'Coach-label' },
      ]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllNudges.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadNudgesOptions('Coach', callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('loadLanguagesOptions', () => {
    it('maps languages and forwards the search', async () => {
      mockedApi.getAllLanguages.mockResolvedValue({
        data: [{ id: 'l1', name: 'Français' }],
      } as never);
      const callback = jest.fn();

      await loadLanguagesOptions(callback, 'fr');

      expect(mockedApi.getAllLanguages).toHaveBeenCalledWith({
        search: 'fr',
        limit: 50,
        offset: 0,
      });
      expect(callback).toHaveBeenCalledWith([
        { value: 'l1', label: 'Français' },
      ]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllLanguages.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadLanguagesOptions(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('loadBusinessSectorsOptions', () => {
    it('maps business sectors', async () => {
      mockedApi.getAllBusinessSectors.mockResolvedValue({
        data: [{ id: 'b1', name: 'BTP' }],
      } as never);
      const callback = jest.fn();

      await loadBusinessSectorsOptions(callback, 'bt');

      expect(mockedApi.getAllBusinessSectors).toHaveBeenCalledWith({
        search: 'bt',
        limit: 50,
        offset: 0,
      });
      expect(callback).toHaveBeenCalledWith([{ value: 'b1', label: 'BTP' }]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllBusinessSectors.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadBusinessSectorsOptions(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('loadSkillsOptions', () => {
    const skills = { data: [{ id: 's1', name: 'Excel' }] } as never;

    it('uses the id as value by default and turns an empty search into undefined', async () => {
      mockedApi.getAllSkills.mockResolvedValue(skills);
      const callback = jest.fn();

      await loadSkillsOptions(callback, '');

      expect(mockedApi.getAllSkills).toHaveBeenCalledWith({
        search: undefined,
        limit: 50,
        offset: 0,
      });
      expect(callback).toHaveBeenCalledWith([{ value: 's1', label: 'Excel' }]);
    });

    it('uses the name as value when requested', async () => {
      mockedApi.getAllSkills.mockResolvedValue(skills);
      const callback = jest.fn();
      await loadSkillsOptions(callback, 'ex', true);
      expect(callback).toHaveBeenCalledWith([
        { value: 'Excel', label: 'Excel' },
      ]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllSkills.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadSkillsOptions(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('loadDepartmentsOptions', () => {
    it('labels departments with their code and name', async () => {
      mockedApi.getAllDepartments.mockResolvedValue({
        data: [{ id: 'd1', value: '75', name: 'Paris' }],
      } as never);
      const callback = jest.fn();

      await loadDepartmentsOptions(callback);

      expect(mockedApi.getAllDepartments).toHaveBeenCalledWith({ search: '' });
      expect(callback).toHaveBeenCalledWith([
        { value: 'd1', label: '75 - Paris' },
      ]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllDepartments.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadDepartmentsOptions(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('loadCompaniesOptions', () => {
    it('uses the company name as value and label', async () => {
      mockedApi.getAllCompanies.mockResolvedValue({
        data: [{ id: 'c1', name: 'ACME' }],
      } as never);
      const callback = jest.fn();

      await loadCompaniesOptions(callback, 'ac');

      expect(mockedApi.getAllCompanies).toHaveBeenCalledWith({
        search: 'ac',
        limit: 50,
        offset: 0,
        departments: [],
        businessSectorIds: [],
        onlyWithReferent: false,
      });
      expect(callback).toHaveBeenCalledWith([{ value: 'ACME', label: 'ACME' }]);
    });

    it('calls back with an empty list on error', async () => {
      mockedApi.getAllCompanies.mockRejectedValue(new Error('x'));
      const callback = jest.fn();
      await loadCompaniesOptions(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });
});
