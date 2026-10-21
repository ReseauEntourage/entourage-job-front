jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/useContactEligibility', () => ({
  useContactEligibility: jest.fn(),
}));
const mockEmbeddingStatus = jest.fn();
jest.mock('@/src/hooks/useEmbeddingStatus', () => ({
  useEmbeddingStatus: (props: any) => mockEmbeddingStatus(props),
}));
jest.mock('./Content/Content', () => ({
  Content: (props: any) => (
    <div>
      <span data-testid="panel-state">{props.panelState}</span>
      <span data-testid="recommendation">
        {JSON.stringify(props.recommendation)}
      </span>
      <span data-testid="eligible">{String(props.isEligibleToContact)}</span>
      <button onClick={props.onSkipWait}>skip</button>
      <button onClick={props.onPrimaryCta}>primary</button>
      <button onClick={props.onSendSuggestedMessage}>send</button>
      <button onClick={props.onSecondaryCta}>secondary</button>
    </div>
  ),
}));

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useContactEligibility } from '@/src/hooks/useContactEligibility';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { MatchRecapContainer } from './MatchRecapContainer';

const mockedApi = getMockedApi();
const push = jest.fn();

const recommendation = {
  publicProfile: { id: 'p1', firstName: 'Awa' },
  score: 1,
};

async function setup({
  userRole = UserRoles.CANDIDATE,
  eligible = false,
}: { userRole?: UserRoles; eligible?: boolean } = {}) {
  (useContactEligibility as jest.Mock).mockReturnValue({
    isEligibleToContact: eligible,
  });
  const onOnboardingCompleted = jest.fn().mockResolvedValue(undefined);
  const onSuggestedMessageSent = jest.fn();
  render(
    <MatchRecapContainer
      userRole={userRole}
      onOnboardingCompleted={onOnboardingCompleted}
      onSuggestedMessageSent={onSuggestedMessageSent}
    />
  );
  await act(async () => {
    await flushPromises();
  });
  return { onOnboardingCompleted, onSuggestedMessageSent };
}

const state = () => screen.getByTestId('panel-state').textContent;
const reco = () =>
  JSON.parse(screen.getByTestId('recommendation').textContent!);

describe('MatchRecapContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });
  afterEach(() => cleanup());

  it('shows the top recommendation enriched with experiences and formations', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { recommendations: [recommendation] },
    } as any);
    mockedApi.getPublicUserProfile.mockResolvedValue({
      data: { experiences: [{ id: 'e1' }], formations: [{ id: 'f1' }] },
    } as any);
    const { onOnboardingCompleted } = await setup();

    expect(mockedApi.getProfilesRecommendations).toHaveBeenCalledWith({
      limit: 1,
    });
    expect(mockedApi.getPublicUserProfile).toHaveBeenCalledWith('p1');
    expect(state()).toBe('READY');
    expect(reco().publicProfile).toMatchObject({
      id: 'p1',
      experiences: [{ id: 'e1' }],
      formations: [{ id: 'f1' }],
    });
    expect(onOnboardingCompleted).not.toHaveBeenCalled();
  });

  it('defaults missing experiences and formations to empty lists', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { recommendations: [recommendation] },
    } as any);
    mockedApi.getPublicUserProfile.mockResolvedValue({ data: {} } as any);
    await setup();
    expect(reco().publicProfile).toMatchObject({
      experiences: [],
      formations: [],
    });
  });

  it('falls back to the bare recommendation when the full profile fails', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { recommendations: [recommendation] },
    } as any);
    mockedApi.getPublicUserProfile.mockRejectedValue(new Error('boom'));
    await setup();
    expect(state()).toBe('READY');
    expect(reco()).toEqual(recommendation);
  });

  it('waits for the embedding when it is still pending, then recomputes', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValueOnce({
      data: { embeddingPending: true },
    } as any);
    await setup();
    expect(state()).toBe('EMBEDDING_PENDING');
    expect(mockEmbeddingStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true })
    );

    mockedApi.getProfilesRecommendations.mockResolvedValueOnce({
      data: { recommendations: [] },
    } as any);
    const { onReady } = mockEmbeddingStatus.mock.calls.at(-1)![0];
    await act(async () => {
      onReady();
      await flushPromises();
    });
    expect(mockedApi.getProfilesRecommendations).toHaveBeenCalledTimes(2);
    expect(state()).toBe('READY');
  });

  it('completes the onboarding right away when there is no recommendation', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { recommendations: [] },
    } as any);
    const { onOnboardingCompleted } = await setup();
    expect(state()).toBe('READY');
    expect(onOnboardingCompleted).toHaveBeenCalledTimes(1);
    expect(onOnboardingCompleted).toHaveBeenCalledWith(false);
  });

  it('completes the onboarding when fetching the recommendations fails', async () => {
    mockedApi.getProfilesRecommendations.mockRejectedValue(new Error('boom'));
    const { onOnboardingCompleted } = await setup();
    expect(state()).toBe('READY');
    expect(onOnboardingCompleted).toHaveBeenCalledTimes(1);
  });

  describe('with a recommendation', () => {
    beforeEach(() => {
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: { recommendations: [recommendation] },
      } as any);
      mockedApi.getPublicUserProfile.mockResolvedValue({ data: {} } as any);
    });

    it('skips the wait on demand, once', async () => {
      const { onOnboardingCompleted } = await setup();
      fireEvent.click(screen.getByText('skip'));
      fireEvent.click(screen.getByText('skip'));
      expect(onOnboardingCompleted).toHaveBeenCalledTimes(1);
      expect(onOnboardingCompleted).toHaveBeenCalledWith(false);
    });

    it('opens the profile of the match for a user who cannot contact yet', async () => {
      const { onOnboardingCompleted } = await setup();
      fireEvent.click(screen.getByText('primary'));
      expect(onOnboardingCompleted).toHaveBeenCalledWith(true);
      expect(push).toHaveBeenCalledWith('/backoffice/profile/p1');
    });

    it('arms the redirect after a suggested message is sent', async () => {
      const { onOnboardingCompleted, onSuggestedMessageSent } = await setup({
        eligible: true,
      });
      expect(screen.getByTestId('eligible')).toHaveTextContent('true');
      fireEvent.click(screen.getByText('send'));
      expect(onOnboardingCompleted).toHaveBeenCalledWith(true);
      expect(onSuggestedMessageSent).toHaveBeenCalledTimes(1);
    });

    it('sends a candidate to the directory of coaches', async () => {
      await setup({ userRole: UserRoles.CANDIDATE });
      fireEvent.click(screen.getByText('secondary'));
      expect(push).toHaveBeenCalledWith(
        `/backoffice/annuaire?entity=user&sort=relevance&role=${UserRoles.COACH}`
      );
    });

    it('sends a coach to the directory of candidates', async () => {
      await setup({ userRole: UserRoles.COACH });
      fireEvent.click(screen.getByText('secondary'));
      expect(push).toHaveBeenCalledWith(
        `/backoffice/annuaire?entity=user&sort=relevance&role=${UserRoles.CANDIDATE}`
      );
    });
  });
});
