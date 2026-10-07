import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupList } from '../HelpGroupList';
import { buildCard } from '../__fixtures__/help-groups.fixtures';

describe('HelpGroupList', () => {
  it('renders a card linking to the group page, with the members count only', () => {
    renderWithProviders(<HelpGroupList groups={[buildCard()]} />);
    const card = screen.getByTestId('help-group-card');
    expect(card).toHaveTextContent('Refaire un CV');
    expect(card).toHaveTextContent('Échanger sur la rédaction de son CV');
    expect(card).toHaveTextContent('128 membres');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/backoffice/groupes/refaire-un-cv'
    );
    // No other counter on the card
    expect(card.textContent?.match(/\d+/g)).toEqual(['128']);
    expect(card).not.toHaveTextContent('Vous êtes membre');
  });

  it('never shows « 0 membre », but an invitation', () => {
    renderWithProviders(
      <HelpGroupList groups={[buildCard({ membersCount: 0 })]} />
    );
    const card = screen.getByTestId('help-group-card');
    expect(card).not.toHaveTextContent(/0 membre/);
    expect(card).toHaveTextContent('Soyez parmi les premiers à rejoindre');
    expect(card.textContent).not.toMatch(/\d/);
  });

  it('flags a group the reader is a member of', () => {
    renderWithProviders(
      <HelpGroupList
        groups={[buildCard({ membersCount: 61, isMember: true })]}
      />
    );
    const card = screen.getByTestId('help-group-card');
    expect(card).toHaveTextContent('Vous êtes membre');
    expect(card).toHaveTextContent('61 membres, dont vous');
  });

  it('shows « À la une » on a pinned group, and only on it', () => {
    renderWithProviders(
      <HelpGroupList
        groups={[
          buildCard({ pinnedAt: '2026-10-01T10:00:00.000Z' }),
          buildCard({
            id: 'group-2',
            slug: 'preparer-un-entretien',
            name: 'Préparer un entretien',
          }),
        ]}
      />
    );
    const [pinned, notPinned] = screen.getAllByTestId('help-group-card');
    expect(
      within(pinned).getByTestId('help-group-pinned-badge')
    ).toHaveTextContent('À la une');
    expect(notPinned).not.toHaveTextContent('À la une');
    expect(
      within(notPinned).queryByTestId('help-group-pinned-badge')
    ).not.toBeInTheDocument();
  });

  it('makes the whole card a single link, ending with an arrow', () => {
    renderWithProviders(
      <HelpGroupList
        groups={[
          buildCard({
            pinnedAt: '2026-10-01T10:00:00.000Z',
            isMember: true,
            recentContributors: [
              { id: 'without-picture', initials: 'SB', hasPicture: false },
            ],
          }),
        ]}
      />
    );
    const link = screen.getByRole('link');
    const card = screen.getByTestId('help-group-card');
    expect(link).toContainElement(card);
    expect(within(card).getByTestId('help-group-member-badge')).toBeVisible();
    expect(card.querySelector('svg.lucide-arrow-right')).not.toBeNull();
  });

  it('shows the contributors picture when available, otherwise their initials', () => {
    process.env.NEXT_PUBLIC_AWSS3_URL = 'https://s3.example/';
    process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY = 'images/';
    renderWithProviders(
      <HelpGroupList
        groups={[
          buildCard({
            recentContributors: [
              { id: 'with-picture', initials: 'AL', hasPicture: true },
              { id: 'without-picture', initials: 'SB', hasPicture: false },
            ],
          }),
        ]}
      />
    );
    const avatars = screen.getAllByTestId('help-group-avatar');
    expect(avatars).toHaveLength(2);
    expect(avatars[0].querySelector('img')).not.toBeNull();
    expect(avatars[0]).not.toHaveTextContent('AL');
    expect(avatars[1].querySelector('img')).toBeNull();
    expect(avatars[1]).toHaveTextContent('SB');
  });

  it('shows no avatar nor placeholder without contributors', () => {
    renderWithProviders(<HelpGroupList groups={[buildCard()]} />);
    expect(screen.queryByTestId('help-group-avatar')).not.toBeInTheDocument();
  });
});
