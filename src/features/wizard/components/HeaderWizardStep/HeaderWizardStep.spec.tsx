jest.mock('@/src/features/wizard/shell/OnboardingReferentContact', () => ({
  OnboardingReferentContact: () => <div data-testid="referent-contact" />,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HeaderWizardStep } from './HeaderWizardStep';

const subProgress = {
  sectionLabel: 'Inscription',
  currentInSection: 0,
  totalInSection: 2,
};

describe('HeaderWizardStep', () => {
  it('renders the title and description', () => {
    render(<HeaderWizardStep title="Titre" description="Description" />);

    expect(screen.getByText('Titre')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('renders the sub-progress badge when provided', () => {
    render(<HeaderWizardStep title="Titre" subProgress={subProgress} />);

    expect(screen.getByText('Inscription — Étape 1/2')).toBeTruthy();
  });

  it('renders neither the sub-progress row nor the referent contact by default', () => {
    render(<HeaderWizardStep title="Titre" />);

    expect(screen.queryByTestId('referent-contact')).toBeNull();
  });

  it('renders the referent contact during the onboarding phase, alongside the sub-progress badge', () => {
    render(
      <HeaderWizardStep
        title="Titre"
        subProgress={subProgress}
        isOnboardingPhase
      />
    );

    expect(screen.getByText('Inscription — Étape 1/2')).toBeTruthy();
    expect(screen.getByTestId('referent-contact')).toBeTruthy();
  });

  it('renders the referent contact during the onboarding phase even without a sub-progress', () => {
    render(<HeaderWizardStep title="Titre" isOnboardingPhase />);

    expect(screen.getByTestId('referent-contact')).toBeTruthy();
  });

  it('does not render the referent contact outside the onboarding phase', () => {
    render(<HeaderWizardStep title="Titre" subProgress={subProgress} />);

    expect(screen.queryByTestId('referent-contact')).toBeNull();
  });
});
