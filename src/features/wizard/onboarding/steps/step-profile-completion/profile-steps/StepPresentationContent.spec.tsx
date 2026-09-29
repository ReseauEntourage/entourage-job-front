jest.mock('@/src/api');

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. MessagingEditor.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

// The form itself is covered elsewhere: a plain textarea exposing the values
// it is mounted with is enough to observe what gets inserted.
jest.mock('@/src/features/wizard/FormWithValidationSync', () => ({
  FormWithValidationSync: ({
    defaultValues,
  }: {
    defaultValues: { description: string };
  }) => (
    <textarea
      data-testid="presentation-field"
      defaultValue={defaultValues.description}
    />
  ),
}));

import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { createRef } from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  currentUserApi,
  GENERATE_PRESENTATION_FIXED_CACHE_KEY,
} from '@/src/use-cases/current-user';
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import { selectAbandonedPresentationGenerationId } from '@/src/use-cases/onboarding';
import { StepPresentationContent } from './StepPresentationContent';
import { PRESENTATION_GENERATION_TIMEOUT_MS } from './presentationGeneration.utils';

const mockedApi = getMockedApi();

const PROPOSAL = "J'ai travaillé dans la logistique. N'hésitez pas à m'écrire.";

const buildStore = (profileComplete: Record<string, unknown>) =>
  createTestStore({
    currentUser: {
      ...currentUserSlice.getInitialState(),
      profileComplete: {
        description: null,
        experiences: [],
        formations: [],
        ...profileComplete,
      },
    } as never,
  });

const launchFromSkillsStep = (store: TestStore) =>
  store.dispatch(
    currentUserApi.endpoints.generatePresentation.initiate(undefined, {
      fixedCacheKey: GENERATE_PRESENTATION_FIXED_CACHE_KEY,
    })
  );

const renderContent = (store: TestStore) =>
  render(
    <Provider store={store}>
      <StepPresentationContent
        formSchema={{ id: 'form', fields: [] }}
        formRef={createRef<FormWithValidationRef>()}
        onSubmit={jest.fn()}
        onWatch={jest.fn()}
      />
    </Provider>
  );

const deferred = () => {
  let resolve: (value: unknown) => void = () => undefined;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('StepPresentationContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('hides the field behind the waiting component while generating', async () => {
    const pending = deferred();
    mockedApi.postGeneratePresentation.mockReturnValue(
      pending.promise as never
    );
    const store = buildStore({ experiences: [{ id: 'e1' }] });
    launchFromSkillsStep(store);

    renderContent(store);

    expect(screen.queryByTestId('presentation-field')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Nous rédigeons une proposition à partir de votre parcours…'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Écrire moi-même')).toBeInTheDocument();
    // Launched from the skills step: no second generation on arrival.
    expect(mockedApi.postGeneratePresentation).toHaveBeenCalledTimes(1);
  });

  it('inserts the proposal with the AI notice when it arrives in time', async () => {
    const pending = deferred();
    mockedApi.postGeneratePresentation.mockReturnValue(
      pending.promise as never
    );
    const store = buildStore({ experiences: [{ id: 'e1' }] });
    launchFromSkillsStep(store);
    renderContent(store);

    await act(async () => {
      pending.resolve({ data: { description: PROPOSAL } });
      await flushPromises();
    });

    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      PROPOSAL
    );
    expect(
      screen.getByText(
        "Texte proposé par une IA (Claude, d'Anthropic) à partir de votre parcours. Relisez-le et modifiez-le si besoin."
      )
    ).toBeInTheDocument();
    // Reflected in the live profile preview.
    expect(store.getState().currentUser.profileComplete?.description).toBe(
      PROPOSAL
    );
  });

  it('keeps the proposal in the preview when the profile refresh lands afterwards', async () => {
    const pending = deferred();
    mockedApi.postGeneratePresentation.mockReturnValue(
      pending.promise as never
    );
    const store = buildStore({ experiences: [{ id: 'e1' }] });
    launchFromSkillsStep(store);
    renderContent(store);

    await act(async () => {
      pending.resolve({ data: { description: PROPOSAL } });
      await flushPromises();
    });
    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      PROPOSAL
    );

    // The refresh started by the skills save returns the server profile,
    // whose presentation is still empty.
    await act(async () => {
      store.dispatch(
        currentUserSlice.actions.fetchCurrentProfileCompleteSucceeded({
          description: null,
          experiences: [{ id: 'e1' }],
          formations: [],
        } as never)
      );
      await flushPromises();
    });

    expect(store.getState().currentUser.profileComplete?.description).toBe(
      PROPOSAL
    );
    expect(screen.getByTestId('presentation-field')).toHaveValue(PROPOSAL);
  });

  it('shows an empty field and never inserts the text after "Écrire moi-même"', async () => {
    const pending = deferred();
    mockedApi.postGeneratePresentation.mockReturnValue(
      pending.promise as never
    );
    const store = buildStore({});
    launchFromSkillsStep(store);
    renderContent(store);

    fireEvent.click(screen.getByText('Écrire moi-même'));
    expect(screen.getByTestId('presentation-field')).toHaveValue('');

    await act(async () => {
      pending.resolve({ data: { description: PROPOSAL } });
      await flushPromises();
    });

    expect(screen.getByTestId('presentation-field')).toHaveValue('');
    expect(
      screen.queryByText(/Texte proposé par une IA/)
    ).not.toBeInTheDocument();
  });

  it('shows the invitation when the generation returns no text', async () => {
    mockedApi.postGeneratePresentation.mockResolvedValue({
      data: { description: null },
    } as never);
    const store = buildStore({});
    launchFromSkillsStep(store);

    renderContent(store);

    expect(await screen.findByTestId('presentation-field')).toHaveValue('');
    expect(
      screen.getByText(
        'Présentez-vous en quelques lignes : votre parcours, ce que vous recherchez ou ce que vous pouvez apporter.'
      )
    ).toBeInTheDocument();
  });

  it('gives up after 10 s and ignores a late answer', async () => {
    jest.useFakeTimers();
    const pending = deferred();
    mockedApi.postGeneratePresentation.mockReturnValue(
      pending.promise as never
    );
    const store = buildStore({});
    launchFromSkillsStep(store);
    renderContent(store);

    await act(async () => {
      jest.advanceTimersByTime(PRESENTATION_GENERATION_TIMEOUT_MS + 50);
    });
    expect(screen.getByTestId('presentation-field')).toHaveValue('');
    expect(
      screen.getByText(/Présentez-vous en quelques lignes/)
    ).toBeInTheDocument();

    await act(async () => {
      pending.resolve({ data: { description: PROPOSAL } });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId('presentation-field')).toHaveValue('');
  });

  it('launches a generation on arrival when none was launched (reload on the step)', async () => {
    mockedApi.postGeneratePresentation.mockReturnValue(
      deferred().promise as never
    );
    const store = buildStore({});

    renderContent(store);
    await act(async () => {
      await flushPromises();
    });

    expect(mockedApi.postGeneratePresentation).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(
        'Nous rédigeons une proposition à partir de vos réponses…'
      )
    ).toBeInTheDocument();
  });

  it('keeps an existing presentation and never generates', async () => {
    const store = buildStore({ description: 'Ma présentation' });

    renderContent(store);
    await act(async () => {
      await flushPromises();
    });

    expect(mockedApi.postGeneratePresentation).not.toHaveBeenCalled();
    expect(screen.getByTestId('presentation-field')).toHaveValue(
      'Ma présentation'
    );
    expect(
      screen.queryByText(/Texte proposé par une IA/)
    ).not.toBeInTheDocument();
  });

  it('shows the profile as it is when coming back without a new generation', async () => {
    mockedApi.postGeneratePresentation.mockResolvedValue({
      data: { description: PROPOSAL },
    } as never);
    const store = buildStore({});
    launchFromSkillsStep(store);
    const first = renderContent(store);
    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      PROPOSAL
    );
    first.unmount();

    // Back from the next step: the draft is shown, no longer as an AI proposal.
    renderContent(store);
    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      PROPOSAL
    );
    expect(
      screen.queryByText(/Texte proposé par une IA/)
    ).not.toBeInTheDocument();
  });

  it('shows the new proposal after going back and validating the skills again', async () => {
    mockedApi.postGeneratePresentation.mockResolvedValueOnce({
      data: { description: PROPOSAL },
    } as never);
    const store = buildStore({});
    launchFromSkillsStep(store);
    const first = renderContent(store);
    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      PROPOSAL
    );
    first.unmount();

    const NEW_PROPOSAL = 'Je recherche un poste dans la logistique.';
    mockedApi.postGeneratePresentation.mockResolvedValueOnce({
      data: { description: NEW_PROPOSAL },
    } as never);
    await act(async () => {
      await launchFromSkillsStep(store);
    });
    renderContent(store);

    expect(await screen.findByTestId('presentation-field')).toHaveValue(
      NEW_PROPOSAL
    );
    expect(screen.getByText(/Texte proposé par une IA/)).toBeInTheDocument();
    expect(store.getState().currentUser.profileComplete?.description).toBe(
      NEW_PROPOSAL
    );
  });

  it('abandons the generation when the step is left while waiting', async () => {
    mockedApi.postGeneratePresentation.mockReturnValue(
      deferred().promise as never
    );
    const store = buildStore({});
    launchFromSkillsStep(store);
    const { unmount } = renderContent(store);

    unmount();

    expect(
      selectAbandonedPresentationGenerationId(store.getState())
    ).toBeTruthy();
  });
});
