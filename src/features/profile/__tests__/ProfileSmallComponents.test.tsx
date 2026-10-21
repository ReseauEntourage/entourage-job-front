import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Genders } from '@/src/constants/genders';
import { useIsMobile } from '@/src/hooks/utils';
import { ProfileAchievementHighlighter } from '../ProfileAchievementHighlighter';
import { OpenAILegalMention } from '../ai/OpenAILegalMention';
import { ProfileGenerationLoadingIndicator } from '../ai/ProfileGenerationLoadingIndicator';

jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));

describe('ProfileAchievementHighlighter', () => {
  beforeEach(() => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
  });

  const achievement = (type: string) =>
    ({ achievementType: type, title: 'Titre perso' }) as never;

  it('shows "Super engagé" for a super engaged coach', () => {
    render(
      <ProfileAchievementHighlighter
        achievement={achievement('super_engaged_coach')}
        gender={Genders.MALE}
      />
    );
    expect(screen.getByText('Super engagé')).toBeInTheDocument();
  });

  it('shows the feminine form for a female coach', () => {
    render(
      <ProfileAchievementHighlighter
        achievement={achievement('super_engaged_coach')}
        gender={Genders.FEMALE}
      />
    );
    expect(screen.getByText('Super engagée')).toBeInTheDocument();
  });

  it('falls back to the achievement title for other types', () => {
    render(
      <ProfileAchievementHighlighter
        achievement={achievement('other')}
        gender={Genders.MALE}
      />
    );
    expect(screen.getByText('Titre perso')).toBeInTheDocument();
  });

  it('reveals the explanation tooltip on hover', () => {
    render(
      <ProfileAchievementHighlighter
        achievement={achievement('super_engaged_coach')}
        gender={Genders.MALE}
      />
    );
    fireEvent.mouseEnter(screen.getByText('Super engagé'));
    expect(
      screen.queryByText(/Ce coach répond régulièrement aux messages/)
    ).toBeInTheDocument();
  });
});

describe('OpenAILegalMention', () => {
  it('links to the OpenAI terms in a new tab', () => {
    render(<OpenAILegalMention />);
    const link = screen.getByRole('link', {
      name: /Conditions Générales d'Utilisation d'OpenAI/,
    });
    expect(link).toHaveAttribute(
      'href',
      'https://openai.com/fr-FR/policies/row-terms-of-use/'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('ProfileGenerationLoadingIndicator', () => {
  it('shows the default waiting text and image', () => {
    render(<ProfileGenerationLoadingIndicator />);
    expect(
      screen.getByText('Patientez quelques secondes ...')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Chargement en cours')).toBeInTheDocument();
  });

  it('accepts a custom text', () => {
    render(<ProfileGenerationLoadingIndicator text="Analyse du CV" />);
    expect(screen.getByText('Analyse du CV')).toBeInTheDocument();
  });
});
