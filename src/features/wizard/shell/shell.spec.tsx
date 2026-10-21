jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HeaderWizardStep } from '../components/HeaderWizardStep/HeaderWizardStep';
import { WizardMobileStepHeader } from './WizardMobileStepHeader';
import { WizardProgressBar } from './WizardProgressBar';
import { WizardSubProgressBar } from './WizardSubProgressBar';
import { WIZARD_SECTIONS, WizardStep } from './wizard.types';

const makeStep = (section: WizardStep['section'], duration = '1 min') =>
  ({
    id: 'account',
    section,
    summary: { title: 't', duration },
  }) as unknown as WizardStep;

describe('WizardSubProgressBar', () => {
  it('shows the section label and the 1-based position', () => {
    render(
      <WizardSubProgressBar
        sectionLabel="Profil"
        currentInSection={1}
        totalInSection={4}
      />
    );

    expect(screen.getByText(/Profil — Étape 2\/4/)).toBeTruthy();
  });

  it('renders nothing for a single-step section', () => {
    const { container } = render(
      <WizardSubProgressBar
        sectionLabel="Profil"
        currentInSection={0}
        totalInSection={1}
      />
    );

    expect(container.innerHTML).toBe('');
  });
});

describe('WizardMobileStepHeader', () => {
  it('replaces the generic content with the custom one', () => {
    render(
      <WizardMobileStepHeader
        subProgress={{
          sectionLabel: 'Profil',
          currentInSection: 0,
          totalInSection: 3,
        }}
        progressPercent={30}
        customContent={<span>custom header</span>}
      />
    );

    expect(screen.getByText('custom header')).toBeTruthy();
    expect(screen.queryByText(/Étape/)).toBeNull();
  });

  it('shows the sub progress badge', () => {
    render(
      <WizardMobileStepHeader
        subProgress={{
          sectionLabel: 'Inscription',
          currentInSection: 2,
          totalInSection: 5,
        }}
        progressPercent={60}
      />
    );

    expect(screen.getByText(/Inscription — Étape 3\/5/)).toBeTruthy();
  });

  it('renders an empty header without progress', () => {
    const { container } = render(
      <WizardMobileStepHeader subProgress={null} progressPercent={null} />
    );

    expect(container.textContent).toBe('');
  });
});

describe('HeaderWizardStep', () => {
  it('renders title, description and sub progress', () => {
    render(
      <HeaderWizardStep
        title="Mon titre"
        description="Ma description"
        subProgress={{
          sectionLabel: 'Profil',
          currentInSection: 0,
          totalInSection: 2,
        }}
      />
    );

    expect(screen.getByText('Mon titre')).toBeTruthy();
    expect(screen.getByText('Ma description')).toBeTruthy();
    expect(screen.getByText(/Profil — Étape 1\/2/)).toBeTruthy();
  });

  it('omits the description and the progress when absent', () => {
    render(<HeaderWizardStep title="Seul" />);

    expect(screen.getByText('Seul')).toBeTruthy();
    expect(screen.queryByText(/Étape/)).toBeNull();
  });
});

describe('WizardProgressBar', () => {
  const steps = [
    makeStep('inscription'),
    makeStep('inscription'),
    makeStep('profil'),
    makeStep('formation'),
  ];

  it('numbers the sections with their label and duration', () => {
    render(
      <WizardProgressBar
        steps={steps}
        currentIdx={0}
        sections={WIZARD_SECTIONS}
      />
    );

    expect(screen.getByText('Inscription')).toBeTruthy();
    expect(screen.getByText('2 minutes')).toBeTruthy();
    expect(screen.getByText('Profil')).toBeTruthy();
    expect(screen.getByText('Formation')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders only the given sections', () => {
    render(
      <WizardProgressBar
        steps={steps}
        currentIdx={2}
        sections={[WIZARD_SECTIONS[1]]}
      />
    );

    expect(screen.getByText('Profil')).toBeTruthy();
    expect(screen.queryByText('Inscription')).toBeNull();
  });

  it('renders one badge per step without sections', () => {
    render(<WizardProgressBar steps={steps} currentIdx={1} />);

    ['1', '2', '3', '4'].forEach((n) => {
      expect(screen.getByText(n)).toBeTruthy();
    });
  });
});
