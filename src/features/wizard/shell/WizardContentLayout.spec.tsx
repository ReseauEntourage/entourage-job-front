jest.mock('@/src/components/ui/BottomSheet', () => ({
  BottomSheet: ({ children }: any) => (
    <div data-testid="bottom-sheet">{children('compact')}</div>
  ),
}));
jest.mock('@/src/components/ui/Navbar/NavbarLogo', () => ({
  NavbarLogo: ({ type }: any) => <div data-testid={`logo-${type}`} />,
}));
jest.mock('./WizardAuthSection', () => ({
  WizardAuthSection: () => <div data-testid="auth" />,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { WizardContentLayout } from './WizardContentLayout';

const sidePanel = (mode: string) => <div>{`panel-${mode}`}</div>;

describe('WizardContentLayout', () => {
  it('renders children, logos and the stepper without side panel', () => {
    render(
      <WizardContentLayout stepper={<div>stepper</div>}>
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.getByText('content')).toBeTruthy();
    expect(screen.getByText('stepper')).toBeTruthy();
    expect(screen.getByTestId('logo-primary')).toBeTruthy();
    expect(screen.getByTestId('logo-secondary')).toBeTruthy();
    expect(screen.queryByText('panel-full')).toBeNull();
    expect(screen.queryByTestId('bottom-sheet')).toBeNull();
  });

  it('renders the side panel in full mode and keeps the top bar logo on the right', () => {
    render(
      <WizardContentLayout sidePanel={sidePanel}>
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.getByText('panel-full')).toBeTruthy();
    expect(screen.getByTestId('logo-primary')).toBeTruthy();
    expect(screen.queryByTestId('bottom-sheet')).toBeNull();
  });

  it('drops the top bar logo when the side panel is on the left', () => {
    render(
      <WizardContentLayout sidePanel={sidePanel} sidePanelSide="left">
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.queryByTestId('logo-primary')).toBeNull();
  });

  it('renders the bottom sheet only with a side panel', () => {
    const { unmount } = render(
      <WizardContentLayout sidePanel={sidePanel} mobileBottomSheet>
        <p>content</p>
      </WizardContentLayout>
    );
    expect(screen.getByTestId('bottom-sheet').textContent).toBe(
      'panel-compact'
    );
    unmount();

    render(
      <WizardContentLayout mobileBottomSheet>
        <p>content</p>
      </WizardContentLayout>
    );
    expect(screen.queryByTestId('bottom-sheet')).toBeNull();
  });

  it('shows the mobile sub progress and custom header content', () => {
    render(
      <WizardContentLayout
        sectionProgress={50}
        subProgress={{
          sectionLabel: 'Profil',
          currentInSection: 0,
          totalInSection: 2,
        }}
      >
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.getByText(/Profil — Étape 1\/2/)).toBeTruthy();
  });

  it('renders the mobile help link next to the step header, even with a custom header', () => {
    render(
      <WizardContentLayout
        mobileHeaderContent={<div>custom-header</div>}
        mobileHelpLink={<a href="mailto:ref@example.org">Besoin d'aide ?</a>}
      >
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.getByText('custom-header')).toBeTruthy();
    expect(screen.getByText("Besoin d'aide ?")).toBeTruthy();
  });

  it('renders no help link by default', () => {
    render(
      <WizardContentLayout>
        <p>content</p>
      </WizardContentLayout>
    );

    expect(screen.queryByText("Besoin d'aide ?")).toBeNull();
  });
});
