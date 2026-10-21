jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockLayoutProps = jest.fn();
jest.mock('@/src/features/wizard/shell/WizardContentLayout', () => ({
  WizardContentLayout: (props: any) => {
    mockLayoutProps(props);
    return (
      <div>
        {props.stepper}
        {props.children}
      </div>
    );
  },
}));

import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { WizardRunShell } from './WizardRunShell';
import { WizardStep } from './shell/wizard.types';

const makeStep = (
  section: WizardStep['section'],
  overrides: Partial<WizardStep> = {}
) =>
  ({
    id: 'account',
    section,
    summary: { title: 's', duration: '1 min' },
    title: `Titre ${section}`,
    description: `Desc ${section}`,
    content: <div>{`Contenu ${section}`}</div>,
    ...overrides,
  }) as unknown as WizardStep;

const steps = [
  makeStep('inscription'),
  makeStep('inscription'),
  makeStep('profil'),
];

function renderShell(
  props: Partial<React.ComponentProps<typeof WizardRunShell>> = {}
) {
  const onNext = jest.fn().mockResolvedValue(undefined);
  const onBack = jest.fn();
  const utils = renderWithProviders(
    <WizardRunShell
      wizardSteps={steps}
      currentWizardIdx={0}
      currentStep={steps[0]}
      isLoading={false}
      buttonLabel="Suivant"
      onNext={onNext}
      onBack={onBack}
      canGoBack
      {...props}
    />
  );
  return { onNext, onBack, ...utils };
}

const lastLayoutProps = () =>
  mockLayoutProps.mock.calls[mockLayoutProps.mock.calls.length - 1][0];

describe('WizardRunShell', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the current step header and content with the next button', () => {
    const { onNext } = renderShell();

    expect(screen.getByText('Titre inscription')).toBeTruthy();
    expect(screen.getByText('Contenu inscription')).toBeTruthy();
    fireEvent.click(screen.getByTestId('wizard-next-step-btn'));
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Suivant')).toBeTruthy();
  });

  it('computes the progress inside the current section', () => {
    renderShell({ currentWizardIdx: 1, currentStep: steps[1] });

    expect(lastLayoutProps().subProgress).toEqual({
      sectionLabel: 'Inscription',
      currentInSection: 1,
      totalInSection: 2,
    });
    expect(lastLayoutProps().sectionProgress).toBe(100);
  });

  it('has no section progress for a single-step section', () => {
    renderShell({ currentWizardIdx: 2, currentStep: steps[2] });

    expect(lastLayoutProps().sectionProgress).toBeNull();
  });

  it('hides the stepper when the flow has a single section', () => {
    const single = [makeStep('inscription'), makeStep('inscription')];
    renderShell({ wizardSteps: single, currentStep: single[0] });

    expect(lastLayoutProps().stepper).toBeUndefined();
  });

  it('shows the stepper when the flow crosses several sections', () => {
    renderShell();

    expect(lastLayoutProps().stepper).toBeTruthy();
    expect(screen.getByText('Profil')).toBeTruthy();
  });

  it('shows the back button only when going back is possible', () => {
    const { onBack, unmount } = renderShell();

    fireEvent.click(screen.getByTestId('wizard-back-step-btn'));
    expect(onBack).toHaveBeenCalledTimes(1);
    unmount();

    renderShell({ canGoBack: false });
    expect(screen.queryByTestId('wizard-back-step-btn')).toBeNull();
  });

  it('disables both buttons and shows a loading label while loading', () => {
    renderShell({ isLoading: true });

    expect(screen.getByText(/Chargement/)).toBeTruthy();
    expect(
      (screen.getByTestId('wizard-next-step-btn') as HTMLButtonElement).disabled
    ).toBe(true);
    expect(
      (screen.getByTestId('wizard-back-step-btn') as HTMLButtonElement).disabled
    ).toBe(true);
  });

  it('disables next when the step is not ready', () => {
    const step = makeStep('inscription', { isNextEnabled: false });
    renderShell({ currentStep: step });

    expect(
      (screen.getByTestId('wizard-next-step-btn') as HTMLButtonElement).disabled
    ).toBe(true);
  });

  it('honours hideGenericStepHeader and hideGenericStepFooter', () => {
    const step = makeStep('inscription', {
      hideGenericStepHeader: true,
      hideGenericStepFooter: true,
    });
    renderShell({ currentStep: step });

    expect(screen.queryByText('Titre inscription')).toBeNull();
    expect(screen.getByText('Contenu inscription')).toBeTruthy();
    expect(screen.queryByTestId('wizard-next-step-btn')).toBeNull();
  });

  it('shows a spinner instead of the step while initializing', () => {
    renderShell({ isInitializing: true });

    expect(screen.queryByText('Contenu inscription')).toBeNull();
    expect(screen.queryByTestId('wizard-next-step-btn')).toBeNull();
  });

  it('shows a reload alert when there is no current step', () => {
    renderShell({ currentStep: null });

    expect(screen.getByText(/Veuillez recharger la page/)).toBeTruthy();
  });

  it('shows the step error message from the store', () => {
    const store = createTestStore();
    store.dispatch(
      onboardingActions.setFormErrorMessage('Sauvegarde impossible')
    );
    renderWithProviders(
      <WizardRunShell
        wizardSteps={steps}
        currentWizardIdx={0}
        currentStep={steps[0]}
        isLoading={false}
        buttonLabel="Suivant"
        onNext={jest.fn()}
      />,
      { store }
    );

    expect(screen.getByTestId('wizard-step-error').textContent).toContain(
      'Sauvegarde impossible'
    );
  });

  it('forwards side panel and mobile header props to the layout', () => {
    const sidePanelContent = jest.fn();
    renderShell({
      sidePanelContent,
      mobileBottomSheet: true,
      currentStep: makeStep('inscription', {
        mobileHeaderContent: <span>mobile</span>,
      }),
    });

    expect(lastLayoutProps().sidePanel).toBe(sidePanelContent);
    expect(lastLayoutProps().mobileBottomSheet).toBe(true);
    expect(lastLayoutProps().mobileHeaderContent).toBeTruthy();
  });
});
