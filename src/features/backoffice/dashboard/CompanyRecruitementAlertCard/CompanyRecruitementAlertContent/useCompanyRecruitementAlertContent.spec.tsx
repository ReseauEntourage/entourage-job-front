import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { WorkingExperienceYears } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { useCompanyRecruitementAlertContent } from './useCompanyRecruitementAlertContent';

jest.mock('@/src/api');

const buildAlert = (
  overrides: Partial<RecruitementAlert> = {}
): RecruitementAlert => ({
  id: 'alert-1',
  name: 'Vendeur',
  jobName: 'Vendeur polyvalent',
  department: 'Paris (75)' as any,
  workingExperienceYears: WorkingExperienceYears.LESS_THAN_1_YEAR,
  contractType: 'cdi' as any,
  companyId: 'company-1',
  businessSectors: [{ id: 'b1', name: 'Commerce' } as any],
  skills: [{ name: 'Vente' }],
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

const setup = (alert: RecruitementAlert) => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return {
    store,
    ...renderHook(() => useCompanyRecruitementAlertContent(alert), { wrapper }),
  };
};

describe('useCompanyRecruitementAlertContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Api.getRecruitementAlertMatching as jest.Mock).mockResolvedValue({
      data: [{ id: 'profile-1' }],
    });
  });

  it('fetches the matching candidates on mount and exposes them', async () => {
    const { result } = setup(buildAlert());
    await waitFor(() => expect(result.current.candidates).toHaveLength(1));
    expect(Api.getRecruitementAlertMatching).toHaveBeenCalledTimes(1);
    expect(Api.getRecruitementAlertMatching).toHaveBeenCalledWith('alert-1');
  });

  it('suffixes the title with the contract label when there is one', () => {
    expect(setup(buildAlert()).result.current.title).toBe('Vendeur - CDI');
    expect(setup(buildAlert({ contractType: null })).result.current.title).toBe(
      'Vendeur'
    );
  });

  it('lists badges in the expected order', () => {
    const { result } = setup(buildAlert());
    expect(result.current.badgesStringList).toEqual([
      'Paris (75)',
      'Vendeur polyvalent',
      'Moins de 3 ans',
      'CDI',
      'Commerce',
      'Vente',
    ]);
  });

  it('skips the badges of empty criteria', () => {
    const { result } = setup(
      buildAlert({
        department: null,
        workingExperienceYears: null,
        contractType: null,
        businessSectors: [],
        skills: undefined,
        jobName: '',
      })
    );
    expect(result.current.badgesStringList).toEqual([]);
  });

  it('ignores an unknown working experience value', () => {
    const { result } = setup(
      buildAlert({ workingExperienceYears: 'unknown' as any })
    );
    expect(result.current.badgesStringList).not.toContain('unknown');
  });

  it('toggles the edit modal', () => {
    const { result } = setup(buildAlert());
    expect(result.current.isEditModalOpen).toBe(false);
    act(() => result.current.handleEdit());
    expect(result.current.isEditModalOpen).toBe(true);
    act(() => result.current.handleCloseEditModal());
    expect(result.current.isEditModalOpen).toBe(false);
  });

  it('deletes the alert through the API', async () => {
    (Api.deleteRecruitementAlert as jest.Mock).mockResolvedValue({});
    const { result } = setup(buildAlert());
    act(() => result.current.handleDelete());
    await flushPromises();
    expect(Api.deleteRecruitementAlert).toHaveBeenCalledWith('alert-1');
  });

  it('nulls the empty optional criteria when updating', async () => {
    (Api.updateRecruitementAlert as jest.Mock).mockResolvedValue({
      data: buildAlert(),
    });
    const { result } = setup(buildAlert());
    act(() =>
      result.current.handleUpdateAlert({
        companyId: 'company-1',
        name: 'Vendeur',
        jobName: 'x',
        department: '' as any,
        contractType: '' as any,
        workingExperienceYears: '' as any,
      } as RecruitementAlertDto)
    );
    await flushPromises();
    expect(Api.updateRecruitementAlert).toHaveBeenCalledWith(
      'alert-1',
      expect.objectContaining({
        department: null,
        contractType: null,
        workingExperienceYears: null,
      })
    );
  });
});
