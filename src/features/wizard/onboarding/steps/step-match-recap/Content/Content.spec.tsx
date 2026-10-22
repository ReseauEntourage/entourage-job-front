jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/wizard/components/WizardSearchingLoader', () => ({
  SEARCHING_LOADER_VARIANTS: {
    embeddingPending: { title: 'embedding-title', subtitle: 's1' },
    computingReco: { title: 'computing-title', subtitle: 's2' },
  },
  WizardSearchingLoader: ({ title }: any) => <div>{title}</div>,
}));
jest.mock(
  '@/src/features/wizard/sidepanels/WizardCompatibleProfileCard',
  () => ({
    WizardCompatibleProfileCard: ({ profile, badgeLabel, variant }: any) => (
      <div data-testid="profile-card">
        {profile.firstName}|{badgeLabel}|{variant}
      </div>
    ),
  })
);
jest.mock(
  '@/src/features/backoffice/messaging/RecapSuggestedMessage/RecapSuggestedMessage',
  () => ({
    RecapSuggestedMessage: ({ onSend }: any) => (
      <button onClick={onSend}>suggested-message</button>
    ),
  })
);

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { Content } from './Content';

const recommendation = { publicProfile: { id: 'p1', firstName: 'Awa' } } as any;

const handlers = () => ({
  onSkipWait: jest.fn(),
  onPrimaryCta: jest.fn(),
  onSendSuggestedMessage: jest.fn(),
  onSecondaryCta: jest.fn(),
});

describe('MatchRecap Content', () => {
  afterEach(() => cleanup());

  it('shows the embedding loader and lets the user skip the wait', () => {
    const h = handlers();
    render(
      <Content
        panelState="EMBEDDING_PENDING"
        recommendation={null}
        userRole={UserRoles.CANDIDATE}
        isEligibleToContact={false}
        {...h}
      />
    );
    expect(screen.getByText('embedding-title')).toBeInTheDocument();
    fireEvent.click(screen.getByText("Passer l'attente"));
    expect(h.onSkipWait).toHaveBeenCalledTimes(1);
  });

  ['LOADING', 'COMPUTING_RECO'].forEach((panelState) => {
    it(`shows the computing loader while ${panelState}`, () => {
      render(
        <Content
          panelState={panelState as any}
          recommendation={null}
          userRole={UserRoles.CANDIDATE}
          isEligibleToContact={false}
          {...handlers()}
        />
      );
      expect(screen.getByText('computing-title')).toBeInTheDocument();
    });
  });

  it('renders nothing when ready without a recommendation', () => {
    const { container } = render(
      <Content
        panelState="READY"
        recommendation={null}
        userRole={UserRoles.CANDIDATE}
        isEligibleToContact
        {...handlers()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('invites a candidate who cannot contact yet to view the profile of the coach', () => {
    const h = handlers();
    render(
      <Content
        panelState="READY"
        recommendation={recommendation}
        userRole={UserRoles.CANDIDATE}
        isEligibleToContact={false}
        {...h}
      />
    );
    expect(
      screen.getByText(
        'Félicitations ! Vous pouvez dès à présent consulter le profil de votre coach'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('profile-card')).toHaveTextContent(
      'Awa|Meilleur coach pour démarrer|full'
    );
    fireEvent.click(screen.getByTestId('wizard-match-recap-primary-cta'));
    expect(h.onPrimaryCta).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Voir le profil de Awa')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('wizard-match-recap-secondary-cta'));
    expect(h.onSecondaryCta).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Voir les autres coachs')).toBeInTheDocument();
    expect(screen.queryByText('suggested-message')).toBeNull();
  });

  it('invites a coach who cannot contact yet to view the profile of the candidate', () => {
    render(
      <Content
        panelState="READY"
        recommendation={recommendation}
        userRole={UserRoles.COACH}
        isEligibleToContact={false}
        {...handlers()}
      />
    );
    expect(
      screen.getByText(
        'Félicitations ! Vous pouvez dès à présent consulter le profil de votre candidat'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('profile-card')).toHaveTextContent(
      'Meilleur candidat pour démarrer'
    );
    expect(screen.getByText('Voir les autres candidats')).toBeInTheDocument();
  });

  it('offers the suggested message to a candidate who can contact', () => {
    const h = handlers();
    render(
      <Content
        panelState="READY"
        recommendation={recommendation}
        userRole={UserRoles.CANDIDATE}
        isEligibleToContact
        {...h}
      />
    );
    expect(
      screen.getByText(
        'Félicitations ! Vous pouvez dès à présent contacter des coachs'
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('wizard-match-recap-primary-cta')).toBeNull();
    fireEvent.click(screen.getByText('suggested-message'));
    expect(h.onSendSuggestedMessage).toHaveBeenCalledTimes(1);
  });

  it('tells a coach who can contact that they can contact candidates', () => {
    render(
      <Content
        panelState="READY"
        recommendation={recommendation}
        userRole={UserRoles.COACH}
        isEligibleToContact
        {...handlers()}
      />
    );
    expect(
      screen.getByText(
        'Félicitations ! Vous pouvez dès à présent contacter des candidats'
      )
    ).toBeInTheDocument();
  });
});
