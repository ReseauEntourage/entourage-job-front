jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ children }: any) => <div>{children}</div>,
}));
jest.mock(
  '@/src/features/wizard/components/WizardSummary/WizardSummary',
  () => ({
    WizardSummary: ({ value, onChange }: any) => (
      <button onClick={() => onChange(['COACH'])}>
        summary:{JSON.stringify(value)}
      </button>
    ),
  })
);
jest.mock('@/src/features/wizard/shell/WizardContentLayout', () => ({
  WizardContentLayout: ({ sidePanel, children }: any) => (
    <div>
      {sidePanel('full')}
      {children}
    </div>
  ),
}));
jest.mock(
  '@/src/features/wizard/sidepanels/WizardRoleSelectionSidePanel',
  () => ({
    WizardRoleSelectionSidePanel: ({ flow }: any) => (
      <div data-testid="side">{String(flow)}</div>
    ),
  })
);
const mockWizardRunShell = jest.fn();
jest.mock('@/src/features/wizard/WizardRunShell', () => ({
  WizardRunShell: (props: any) => {
    mockWizardRunShell(props);
    return <div data-testid="shell" />;
  },
}));
jest.mock('@/src/features/wizard/useWizard', () => ({
  useWizard: () => ({
    allSteps: ['s1'],
    currentStepIdx: 0,
    currentStep: null,
    isLoading: false,
    isInitializing: true,
    buttonLabel: 'Go',
    onNext: jest.fn(),
    onBack: jest.fn(),
    canGoBack: false,
    sidePanelContent: undefined,
    mobileBottomSheet: false,
  }),
}));

import { act, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import WizardHome from '@/src/pages/wizard';
import WizardRun from '@/src/pages/wizard/run';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';

const mockUseRouter = useRouter as jest.Mock;

describe('wizard home page', () => {
  it('lets the visitor choose a role and updates the side panel', () => {
    mockUseRouter.mockReturnValue({ query: {}, replace: jest.fn() });
    renderWithProviders(<WizardHome />);

    expect(screen.getByTestId('side').textContent).toBe('null');
    act(() => {
      fireEvent.click(screen.getByText(/summary:/));
    });
    expect(screen.getByTestId('side').textContent).toBe('COACH');
  });

  it('stores the flow of the URL and jumps to the wizard run', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      query: { flow: 'CANDIDATE', companyName: 'Acme', invitationId: 'inv' },
      replace,
    });
    const store = createTestStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    renderWithProviders(<WizardHome />, { store });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          flow: 'CANDIDATE',
          companyName: 'Acme',
          invitationId: 'inv',
        },
      })
    );
    expect(replace).toHaveBeenCalledWith('/wizard/run');
  });

  it('sends a logged in user to the dashboard and renders nothing', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({ query: {}, replace });
    const { container } = renderWithProviders(<WizardHome />, {
      preloadedState: {
        currentUser: { user: { id: 'u1', role: 'Candidat' } },
      } as any,
    });

    expect(replace).toHaveBeenCalledWith('/backoffice/dashboard');
    expect(container.innerHTML).toBe('');
  });
});

describe('wizard run page', () => {
  it('feeds the shell with the wizard state', () => {
    render_();

    expect(screen.getByTestId('shell')).toBeTruthy();
    expect(mockWizardRunShell).toHaveBeenCalledWith(
      expect.objectContaining({
        wizardSteps: ['s1'],
        currentWizardIdx: 0,
        isInitializing: true,
        buttonLabel: 'Go',
        canGoBack: false,
      })
    );
  });
});

function render_() {
  return renderWithProviders(<WizardRun />);
}
