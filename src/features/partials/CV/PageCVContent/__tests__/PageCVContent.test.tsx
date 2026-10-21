import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { PublicCV } from '@/src/api/types';
import { PageCVContent } from '../PageCVContent';

const mockIsDesktop = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => mockIsDesktop(),
  useIsMobile: () => !mockIsDesktop(),
}));
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back-link</span>,
}));
jest.mock('../../CVShareButtons', () => ({
  CVShareButtons: ({ actionDisabled }: { actionDisabled: boolean }) => (
    <span>share-buttons:{String(actionDisabled)}</span>
  ),
}));
jest.mock(
  '@/src/features/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence',
  () => ({
    ProfileCareerPathSentence: () => <span>career-path</span>,
  })
);
jest.mock(
  '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation',
  () => ({
    CVExperienceOrFormation: ({
      title,
      structure,
    }: {
      title: string;
      structure: string;
    }) => (
      <li>
        {title} @ {structure}
      </li>
    ),
  })
);

const buildCV = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'cv1',
    firstName: 'Marie',
    lastName: 'Dupont',
    role: 'Candidat',
    userProfile: {
      hasPicture: false,
      description: 'Ma présentation',
      sectorOccupations: [],
      skills: [
        { id: 's1', name: 'Rigueur' },
        { id: 's2', name: 'Écoute' },
      ],
      contracts: [{ name: 'cdi' }],
      userProfileLanguages: [{ language: { id: 'l1', name: 'Français' } }],
      interests: [{ name: 'Football' }],
      experiences: [
        { id: 'e1', title: 'Cuisinière', company: 'Resto', skills: [] },
      ],
      formations: [
        { id: 'f1', title: 'CAP Cuisine', institution: 'Lycée', skills: [] },
      ],
      ...((overrides.userProfile as object) || {}),
    },
    ...overrides,
  }) as unknown as PublicCV;

describe('PageCVContent', () => {
  describe('on desktop', () => {
    beforeEach(() => mockIsDesktop.mockReturnValue(true));

    it('shows the identity, story and skills', () => {
      render(<PageCVContent publicCV={buildCV()} />);
      expect(
        screen.getByRole('heading', { name: 'Marie Dupont' })
      ).toBeInTheDocument();
      expect(screen.getByText('Ma présentation')).toBeInTheDocument();
      expect(screen.getByText('Rigueur')).toBeInTheDocument();
      expect(screen.getByText('Écoute')).toBeInTheDocument();
      expect(screen.getByText('career-path')).toBeInTheDocument();
    });

    it('shows a back link except in preview', () => {
      const { rerender } = render(<PageCVContent publicCV={buildCV()} />);
      expect(screen.getByText('back-link')).toBeInTheDocument();
      rerender(<PageCVContent publicCV={buildCV()} isPreview />);
      expect(screen.queryByText('back-link')).not.toBeInTheDocument();
    });

    it('renders share buttons once, with the disabled state', () => {
      render(<PageCVContent publicCV={buildCV()} actionDisabled />);
      expect(screen.getAllByText(/share-buttons/)).toHaveLength(1);
      expect(screen.getByText('share-buttons:true')).toBeInTheDocument();
    });

    it('lists contracts, languages, interests, experiences and formations', () => {
      render(<PageCVContent publicCV={buildCV()} />);
      expect(screen.getByText('Type de contrat')).toBeInTheDocument();
      expect(screen.getByText('CDI')).toBeInTheDocument();
      expect(screen.getByText('Français')).toBeInTheDocument();
      expect(screen.getByText('Football')).toBeInTheDocument();
      expect(screen.getByText('Cuisinière @ Resto')).toBeInTheDocument();
      expect(screen.getByText('CAP Cuisine @ Lycée')).toBeInTheDocument();
    });

    it('omits sections without data', () => {
      render(
        <PageCVContent
          publicCV={buildCV({
            userProfile: {
              description: null,
              sectorOccupations: null,
              contracts: [],
              userProfileLanguages: [],
              interests: [],
              experiences: [],
              formations: [],
              skills: null,
            },
          })}
        />
      );
      expect(screen.queryByText('career-path')).not.toBeInTheDocument();
      expect(screen.queryByText('Type de contrat')).not.toBeInTheDocument();
      expect(screen.queryByText('Langues')).not.toBeInTheDocument();
      expect(
        screen.queryByText("Mes centres d'intérêts")
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Expériences')).not.toBeInTheDocument();
      expect(screen.queryByText('Formation')).not.toBeInTheDocument();
    });
  });

  describe('on mobile', () => {
    beforeEach(() => mockIsDesktop.mockReturnValue(false));

    it('shows share buttons once and a "read more" link for the story', () => {
      render(<PageCVContent publicCV={buildCV()} />);
      expect(screen.getAllByText(/share-buttons/)).toHaveLength(1);
      const readMore = screen.getByText('En lire plus');
      fireEvent.click(readMore);
      expect(screen.queryByText('En lire plus')).not.toBeInTheDocument();
      expect(screen.getByText('Ma présentation')).toBeInTheDocument();
    });

    it('shows the interests inside the right column', () => {
      render(<PageCVContent publicCV={buildCV()} />);
      expect(screen.getByText('Football')).toBeInTheDocument();
    });

    it('lets the user toggle the accordions', () => {
      render(<PageCVContent publicCV={buildCV()} />);
      fireEvent.click(screen.getByText('Informations'));
      fireEvent.click(screen.getByText('Expériences'));
      fireEvent.click(screen.getByText('Formation'));
      fireEvent.click(screen.getByText("Mes centres d'intérêts"));
      expect(screen.getByText('Informations')).toBeInTheDocument();
    });
  });
});
