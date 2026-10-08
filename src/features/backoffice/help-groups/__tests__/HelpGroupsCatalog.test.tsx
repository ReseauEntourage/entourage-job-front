import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { HelpGroupsCatalog } from '../HelpGroupList';
import { buildCard } from '../__fixtures__/help-groups.fixtures';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/use-cases/help-groups', () => ({
  useGetHelpGroupsQuery: jest.fn(),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import { useRouter } from 'next/router';
// eslint-disable-next-line import-x/order
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
// eslint-disable-next-line import-x/order
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';

describe('HelpGroupsCatalog', () => {
  const replace = jest.fn();

  // react-modal scrolls its content on open, which jsdom does not implement
  beforeAll(() => {
    Element.prototype.scrollTo = jest.fn();
  });

  beforeEach(() => {
    replace.mockReset();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
  });

  it('redirects to the default page of the role when no group is published', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).toHaveBeenCalledWith('/backoffice/dashboard');
    expect(screen.queryByTestId('help-group-card')).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/0 groupe|aucun groupe/i);
  });

  it('redirects an admin to the members list when no group is published', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).toHaveBeenCalledWith('/backoffice/admin/membres');
  });

  it('does not redirect while loading', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('introduces the groups, with a link to their frame', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [buildCard()],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    const intro = screen.getByTestId('help-groups-intro');
    expect(intro).toHaveTextContent("Groupes d'entraide");
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Trouvez le groupe qui parle de votre situation',
      })
    ).toBeInTheDocument();
    expect(intro).toHaveTextContent(
      "Posez une question, partagez une situation, proposez votre aide. Candidats, coachs et prescripteurs s'y entraident d'égal à égal."
    );
    expect(screen.getByTestId('help-groups-charter-link')).toHaveTextContent(
      'Lire le cadre des groupes'
    );
  });

  it('opens the frame common to every group from the introduction', async () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [buildCard()],
      isLoading: false,
    });
    render(
      <>
        <HelpGroupsCatalog />
        <ModalsListener />
      </>
    );
    fireEvent.click(screen.getByTestId('help-groups-charter-link'));
    const modal = await screen.findByTestId(
      'help-groups-charter-modal',
      {},
      { timeout: 5000 }
    );
    expect(modal).toHaveTextContent('Ces règles valent pour tous les groupes.');
    expect(modal.querySelectorAll('li')).toHaveLength(4);
  });

  it('lists the groups without redirecting when one is published', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [buildCard()],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByTestId('help-group-card')).toBeInTheDocument();
  });

  it('shows an error with a retry, without redirecting, when the groups fail to load', () => {
    const refetch = jest.fn();
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByTestId('help-group-load-error')).toHaveTextContent(
      'Les groupes n’ont pas pu être chargés.'
    );
    fireEvent.click(screen.getByTestId('help-group-load-error-retry'));
    expect(refetch).toHaveBeenCalled();
  });
});
