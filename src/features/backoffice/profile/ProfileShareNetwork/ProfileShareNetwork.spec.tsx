import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useProfileShare } from '@/src/hooks/useProfileShare';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';
import { ProfileShareNetwork } from './ProfileShareNetwork';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/useProfileShare', () => ({
  useProfileShare: jest.fn(),
}));
jest.mock('@/src/features/modals/Modal/openModal', () => ({
  openModal: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/LinkedInPostWhatsAppInviteModal/LinkedInPostWhatsAppInviteModal',
  () => ({ LinkedInPostWhatsAppInviteModal: () => null })
);
jest.mock('@/src/features/profile/ProfilePartCards/Card/Card/Card', () => ({
  ProfilePartCard: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

const profile = { id: 'p1', firstName: 'Jane' };

describe('ProfileShareNetwork', () => {
  const replace = jest.fn();
  const handleLinkedinShare = jest.fn();
  const handleWhatsappShare = jest.fn();
  let shareState: Record<string, unknown>;

  const setup = (query: Record<string, unknown> = {}, isReady = true) => {
    (useRouter as jest.Mock).mockReturnValue({ isReady, query, replace });
    return renderWithProviders(<ProfileShareNetwork profile={profile} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    shareState = { hasSharedWhatsapp: false, isWhatsappLoading: false };
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    (useProfileShare as jest.Mock).mockImplementation(() => ({
      handleLinkedinShare,
      handleWhatsappShare,
      ...shareState,
    }));
  });

  it('renders nothing when the viewer is a candidate', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
    setup();

    expect(screen.queryByText('Mobiliser mon réseau')).not.toBeInTheDocument();
  });

  it('lets a coach share the candidate profile on LinkedIn and WhatsApp', () => {
    setup();

    expect(
      screen.getByText('Faites connaître Jane à votre réseau professionnel')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Partager sur LinkedIn'));
    fireEvent.click(screen.getByText('Partager sur WhatsApp'));

    expect(handleLinkedinShare).toHaveBeenCalledTimes(1);
    expect(handleWhatsappShare).toHaveBeenCalledTimes(1);
  });

  it('disables the WhatsApp button while it is loading', () => {
    shareState.isWhatsappLoading = true;
    setup();

    expect(
      screen.getByText('Partager sur WhatsApp').closest('button')
    ).toBeDisabled();
  });

  it('does nothing special when the router is not ready', () => {
    setup({ linkedinJustConnected: 'true', openLinkedInSharer: 'true' }, false);

    expect(Api.postLinkedinShare).not.toHaveBeenCalled();
    expect(handleLinkedinShare).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('opens the LinkedIn sharer and cleans the URL when openLinkedInSharer is set', () => {
    setup({ openLinkedInSharer: 'true' });

    expect(handleLinkedinShare).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith('/backoffice/profile/p1', undefined, {
      shallow: true,
    });
  });

  describe('after the LinkedIn OAuth round trip (linkedinJustConnected)', () => {
    it('posts the pending text, notifies, invites to WhatsApp and cleans the URL', async () => {
      localStorage.setItem('pendingLinkedinText_p1', 'my text');
      (Api.postLinkedinShare as jest.Mock).mockResolvedValue({
        data: { linkedinPostUrl: 'https://linkedin/post' },
      });
      const { store } = setup({ linkedinJustConnected: 'true' });

      await waitFor(() => expect(openModal).toHaveBeenCalledTimes(1));
      expect(Api.postLinkedinShare).toHaveBeenCalledWith('p1', 'my text');
      expect(localStorage.getItem('pendingLinkedinText_p1')).toBeNull();
      expect(
        selectNotifications(store.getState()).map((n) => n.message)
      ).toEqual([
        'Compte LinkedIn lié avec succès !',
        'Profil partagé sur LinkedIn avec succès !',
      ]);
      expect(replace).toHaveBeenCalledWith(
        '/backoffice/profile/p1',
        undefined,
        {
          shallow: true,
        }
      );
    });

    it('does not invite to WhatsApp when it was already shared or no post URL is returned', async () => {
      shareState.hasSharedWhatsapp = true;
      (Api.postLinkedinShare as jest.Mock).mockResolvedValue({
        data: { linkedinPostUrl: 'https://linkedin/post' },
      });
      const { store } = setup({ linkedinJustConnected: 'true' });

      await waitFor(() =>
        expect(selectNotifications(store.getState())).toHaveLength(2)
      );
      expect(Api.postLinkedinShare).toHaveBeenCalledWith('p1', undefined);
      expect(openModal).not.toHaveBeenCalled();
    });

    it('notifies an error when the share fails', async () => {
      (Api.postLinkedinShare as jest.Mock).mockRejectedValue(new Error('x'));
      const { store } = setup({ linkedinJustConnected: 'true' });

      await waitFor(() =>
        expect(
          selectNotifications(store.getState()).map((n) => n.type)
        ).toEqual(['success', 'danger'])
      );
      expect(openModal).not.toHaveBeenCalled();
    });
  });
});
