jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockQuiz: { current: any } = { current: null };
jest.mock(
  '@/src/features/backoffice/elearning/elearning-unit/useElearningQuiz',
  () => ({
    useElearningQuiz: (opts: any) => {
      mockQuiz.current = { ...opts, reset: mockQuizReset };
      return mockQuiz.current;
    },
  })
);
const mockQuizReset = jest.fn();
jest.mock('@/src/hooks/utils/usePlatforms', () => ({
  useIsDesktop: () => true,
}));

const mockContentProps: Record<string, any> = {};
jest.mock('./step-elearning/Content/Content', () => ({
  Content: (props: any) => {
    mockContentProps.elearning = props;
    return <div data-testid="elearning-content" />;
  },
}));
jest.mock('./step-elearning/SidePanel/ElearningSidePanel', () => ({
  ElearningSidePanel: (props: any) => {
    mockContentProps.elearningPanel = props;
    return <div data-testid="elearning-panel" />;
  },
}));
jest.mock('./step-webinar/Content', () => ({
  Content: (props: any) => {
    mockContentProps.webinar = props;
    return <div data-testid="webinar-content" />;
  },
}));
jest.mock('./step-match-recap/MatchRecapContainer', () => ({
  MatchRecapContainer: (props: any) => {
    mockContentProps.matchRecap = props;
    return <div data-testid="match-recap" />;
  },
}));

import { act, render, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { EventType } from '@/src/constants/events';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import {
  onboardingActions,
  selectWebinarSfId,
} from '@/src/use-cases/onboarding';
import { useOnboardingStepElearning } from './step-elearning/useOnboardingStepElearning';
import { useOnboardingStepMatchRecap } from './step-match-recap/useOnboardingStepMatchRecap';
import { useOnboardingStepWebinar } from './step-webinar/useOnboardingStepWebinar';

const mockedApi = getMockedApi();

const wrapperFor = (store: ReturnType<typeof createTestStore>) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };

const unit = (id: string, completions = 0) => ({
  id,
  questions: [{ id: `q-${id}` }],
  userCompletions: Array.from({ length: completions }, () => ({ unitId: id })),
});

describe('useOnboardingStepElearning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuiz.current = null;
  });

  function setup(units: any[] | Error) {
    if (units instanceof Error) {
      mockedApi.getAllElearningUnits.mockRejectedValue(units);
    } else {
      mockedApi.getAllElearningUnits.mockResolvedValue({ data: units } as any);
    }
    const store = createTestStore();
    const requestAdvance = jest.fn();
    const utils = renderHook(
      () =>
        useOnboardingStepElearning({
          userRole: UserRoles.COACH,
          requestAdvance,
        }),
      { wrapper: wrapperFor(store) }
    );
    return { store, requestAdvance, ...utils };
  }

  it('describes the formation step, hiding the generic header and footer', async () => {
    const { result } = setup([unit('u1')]);
    const step = result.current.onboardingStepElearning;

    expect(step.id).toBe('elearning');
    expect(step.section).toBe('formation');
    expect(step.hideGenericStepHeader).toBe(true);
    expect(step.hideGenericStepFooter).toBe(true);
    expect(step.summary.title).toContain('Coach');
    await waitFor(() =>
      expect(mockedApi.getAllElearningUnits).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        role: UserRoles.COACH,
      })
    );
  });

  it('keeps next disabled while a unit is incomplete', async () => {
    const { result } = setup([unit('u1', 1), unit('u2', 0)]);
    await waitFor(() => expect(mockQuiz.current?.questions).toHaveLength(1));

    expect(result.current.onboardingStepElearning.isNextEnabled).toBe(false);
  });

  it('enables next once every unit is completed', async () => {
    const { result } = setup([unit('u1', 1), unit('u2', 2)]);

    await waitFor(() =>
      expect(result.current.onboardingStepElearning.isNextEnabled).toBe(true)
    );
  });

  it('resumes on the first incomplete unit', async () => {
    const { result } = setup([unit('u1', 1), unit('u2', 0), unit('u3', 0)]);
    await waitFor(() =>
      expect(mockQuiz.current?.questions[0]?.id).toBe('q-u2')
    );
    render(<>{result.current.onboardingStepElearning.content}</>);

    expect(mockContentProps.elearning.currentUnit.id).toBe('u2');
  });

  it('computes completion, auto skip and next permission from the fresh units', async () => {
    const { result } = setup([unit('u1', 1)]);
    const step = result.current.onboardingStepElearning;

    await expect(step.isStepCompleted!()).resolves.toBe(true);
    await expect(step.isAutoSkippable!()).resolves.toBe(true);
    await expect(step.incrementationIsAllowed!()).resolves.toBe(true);
    await expect(step.onSubmit!()).resolves.toBe(true);
  });

  it('is not completed nor auto skippable while a unit remains', async () => {
    const { result } = setup([unit('u1', 1), unit('u2', 0)]);
    const step = result.current.onboardingStepElearning;

    await expect(step.isStepCompleted!()).resolves.toBe(false);
    await expect(step.isAutoSkippable!()).resolves.toBe(false);
    await expect(step.incrementationIsAllowed!()).resolves.toBe(false);
  });

  it('skips automatically when no unit is assigned to the role', async () => {
    const { result } = setup([]);
    const step = result.current.onboardingStepElearning;

    await expect(step.isAutoSkippable!()).resolves.toBe(true);
    await expect(step.isStepCompleted!()).resolves.toBe(false);
  });

  it('treats a failing units request as not completed and not skippable', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = setup(new Error('boom'));
    const step = result.current.onboardingStepElearning;

    await expect(step.isStepCompleted!()).resolves.toBe(false);
    await expect(step.isAutoSkippable!()).resolves.toBe(true);
    error.mockRestore();
  });

  it('lets the user skip the whole step', async () => {
    const { result, requestAdvance } = setup([unit('u1')]);
    render(<>{result.current.onboardingStepElearning.content}</>);

    await act(async () => {
      await mockContentProps.elearning.onSkip();
    });

    expect(requestAdvance).toHaveBeenCalledWith('elearning');
  });

  it('goes to the next unit when a module is completed, then advances after the last one', async () => {
    mockedApi.postElearningCompletion.mockResolvedValue({
      data: { unitId: 'u1' },
    } as any);
    const { result, requestAdvance } = setup([unit('u1'), unit('u2')]);
    await waitFor(() => expect(mockQuiz.current?.questions).toHaveLength(1));

    act(() => {
      mockQuiz.current.onComplete();
    });
    await act(flushPromises);

    expect(mockedApi.postElearningCompletion).toHaveBeenCalledWith('u1');
    expect(requestAdvance).not.toHaveBeenCalled();
    render(<>{result.current.onboardingStepElearning.content}</>);
    expect(mockContentProps.elearning.currentUnit.id).toBe('u2');
    expect(mockQuizReset).toHaveBeenCalled();

    mockedApi.postElearningCompletion.mockResolvedValue({
      data: { unitId: 'u2' },
    } as any);
    act(() => {
      mockQuiz.current.onComplete();
    });
    await act(flushPromises);

    expect(mockedApi.postElearningCompletion).toHaveBeenCalledWith('u2');
    expect(requestAdvance).toHaveBeenCalledWith('elearning');
  });

  it('tracks the video start of the current unit and renders its panel', async () => {
    const { result } = setup([unit('u1')]);
    // Polls (outside waitFor, whose DOM observer a render would retrigger)
    // until the fetched units reach the hook.
    for (let attempt = 0; attempt < 20; attempt++) {
      await act(flushPromises);
      render(
        <>{result.current.onboardingStepElearning.sidePanelContent!('full')}</>
      ).unmount();
      if (mockContentProps.elearningPanel.totalUnits === 1) {
        break;
      }
    }
    render(
      <>{result.current.onboardingStepElearning.sidePanelContent!('full')}</>
    );

    expect(mockContentProps.elearningPanel).toMatchObject({
      isDesktop: true,
      currentUnitPosition: 1,
      totalUnits: 1,
    });

    act(() => {
      mockContentProps.elearningPanel.onVideoPlay();
    });
    render(<>{result.current.onboardingStepElearning.content}</>);
    expect(mockContentProps.elearning.hasStartedCurrentVideo).toBe(true);
  });
});

describe('useOnboardingStepWebinar', () => {
  beforeEach(() => jest.clearAllMocks());

  const user = (extra: Record<string, unknown> = {}) =>
    ({
      currentUser: { user: { id: 'u1', role: UserRoles.CANDIDATE, ...extra } },
    }) as any;

  function setup(role: UserRoles | undefined, state: any = user()) {
    const store = createTestStore(state);
    const requestAdvance = jest.fn();
    const utils = renderHook(
      () => useOnboardingStepWebinar({ userRole: role, requestAdvance }),
      { wrapper: wrapperFor(store) }
    );
    return { store, requestAdvance, ...utils };
  }

  it('uses the candidate or coach wording', () => {
    expect(
      setup(UserRoles.CANDIDATE).result.current.onboardingStepWebinar.title
    ).toContain('découvrir vos coachs');
    expect(
      setup(UserRoles.COACH).result.current.onboardingStepWebinar.title
    ).toContain('découvrir vos candidats');
  });

  it('enables next only once a webinar is chosen', () => {
    const { result, store } = setup(UserRoles.COACH);
    expect(result.current.onboardingStepWebinar.isNextEnabled).toBe(false);

    act(() => {
      store.dispatch(onboardingActions.setWebinarSfId('sf-1'));
    });

    expect(result.current.onboardingStepWebinar.isNextEnabled).toBe(true);
    expect(result.current.onboardingStepWebinar.buttonLabel).toBe(
      'Je réserve ma place'
    );
  });

  it('stores the chosen webinar from the content', () => {
    const { result, store } = setup(UserRoles.COACH);
    render(<>{result.current.onboardingStepWebinar.content}</>);

    act(() => {
      mockContentProps.webinar.onWebinarSfIdChange('sf-9');
    });

    expect(selectWebinarSfId(store.getState() as any)).toBe('sf-9');
  });

  it('books the chosen webinar on submit', async () => {
    mockedApi.updateEventParticipation.mockResolvedValue({} as any);
    const { result, store } = setup(UserRoles.COACH);
    act(() => {
      store.dispatch(onboardingActions.setWebinarSfId('sf-1'));
    });

    await act(async () => {
      await expect(
        result.current.onboardingStepWebinar.onSubmit!()
      ).resolves.toBe(true);
    });

    expect(mockedApi.updateEventParticipation).toHaveBeenCalledWith(
      'sf-1',
      true
    );
  });

  it('refuses to advance when the booking fails', async () => {
    mockedApi.updateEventParticipation.mockRejectedValue(new Error('full'));
    const { result, store } = setup(UserRoles.COACH);
    act(() => {
      store.dispatch(onboardingActions.setWebinarSfId('sf-1'));
    });

    await act(async () => {
      await expect(
        result.current.onboardingStepWebinar.onSubmit!()
      ).rejects.toBeDefined();
    });
  });

  it('submits without booking when no webinar is chosen', async () => {
    const { result } = setup(UserRoles.COACH);

    await expect(
      result.current.onboardingStepWebinar.onSubmit!()
    ).resolves.toBe(true);
  });

  it('is completed when the webinar was skipped', async () => {
    const { result } = setup(
      UserRoles.COACH,
      user({ onboardingWebinarSkippedAt: '2026-01-01' })
    );

    await expect(
      result.current.onboardingStepWebinar.isStepCompleted!()
    ).resolves.toBe(true);
    expect(mockedApi.getAllEvents).not.toHaveBeenCalled();
  });

  it('is completed when the user already takes part in a welcome or coffee session', async () => {
    mockedApi.getAllEvents.mockResolvedValue({ data: [{ id: 'e' }] } as any);
    const { result } = setup(UserRoles.COACH);

    await expect(
      result.current.onboardingStepWebinar.isStepCompleted!()
    ).resolves.toBe(true);
    expect(mockedApi.getAllEvents).toHaveBeenCalledWith({
      eventTypes: [EventType.WELCOME_SESSION, EventType.COFFEE_SESSION],
      isParticipating: true,
      limit: 1,
      offset: 0,
      departmentIds: [],
    });
  });

  it('is not completed without participation', async () => {
    mockedApi.getAllEvents.mockResolvedValue({ data: [] } as any);
    const { result } = setup(UserRoles.COACH);

    await expect(
      result.current.onboardingStepWebinar.isStepCompleted!()
    ).resolves.toBe(false);
  });

  it('skipping saves the date on the user and advances', async () => {
    mockedApi.putUser.mockResolvedValue({} as any);
    const { result, requestAdvance, store } = setup(UserRoles.COACH);
    render(<>{result.current.onboardingStepWebinar.content}</>);

    await act(async () => {
      await mockContentProps.webinar.onSkip();
    });

    expect(mockedApi.putUser).toHaveBeenCalledWith('u1', {
      onboardingWebinarSkippedAt: expect.any(String),
    });
    expect(requestAdvance).toHaveBeenCalledWith('webinar');
    expect(
      selectCurrentUser(store.getState() as any)?.onboardingWebinarSkippedAt
    ).toEqual(expect.any(String));
  });

  it('skipping does nothing without current user', async () => {
    const { result, requestAdvance } = setup(UserRoles.COACH, {});
    render(<>{result.current.onboardingStepWebinar.content}</>);

    await act(async () => {
      await mockContentProps.webinar.onSkip();
    });

    expect(mockedApi.putUser).not.toHaveBeenCalled();
    expect(requestAdvance).not.toHaveBeenCalled();
  });

  it('does not advance when saving the skip fails', async () => {
    mockedApi.putUser.mockRejectedValue(new Error('boom'));
    const { result, requestAdvance } = setup(UserRoles.COACH);
    render(<>{result.current.onboardingStepWebinar.content}</>);

    await act(async () => {
      await mockContentProps.webinar.onSkip().catch(() => undefined);
    });

    expect(requestAdvance).not.toHaveBeenCalled();
  });
});

describe('useOnboardingStepMatchRecap', () => {
  it('renders the recap with the completion callbacks and no generic chrome', () => {
    const onOnboardingCompleted = jest.fn();
    const onSuggestedMessageSent = jest.fn();
    const { result } = renderHook(() =>
      useOnboardingStepMatchRecap({
        userRole: UserRoles.CANDIDATE,
        onOnboardingCompleted,
        onSuggestedMessageSent,
      })
    );
    const step = result.current.onboardingStepMatchRecap;
    render(<>{step.content}</>);

    expect(step.id).toBe('match-recap');
    expect(step.hideGenericStepHeader).toBe(true);
    expect(step.hideGenericStepFooter).toBe(true);
    expect(mockContentProps.matchRecap).toMatchObject({
      userRole: UserRoles.CANDIDATE,
      onOnboardingCompleted,
      onSuggestedMessageSent,
    });
  });
});
