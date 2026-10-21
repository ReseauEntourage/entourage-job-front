import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HeaderProfileDesktop } from '../HeaderProfile.desktop';
import { HeaderProfileMobile } from '../HeaderProfile.mobile';
import { HeaderProfileProps } from '../HeaderProfile.types';

const mockHeaderProfile = jest.fn();
const mockCurrentUserId = jest.fn();
const mockOpenConversationOrGate = jest.fn();

jest.mock('../useHeaderProfile', () => ({
  useHeaderProfile: (role: string) => mockHeaderProfile(role),
}));
jest.mock('@/src/hooks/useContactEligibility', () => ({
  useContactEligibility: () => ({
    openConversationOrGate: mockOpenConversationOrGate,
  }),
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  // A new selector per access, so that useSelector re-runs it on re-render
  get selectCurrentUserId() {
    return () => mockCurrentUserId();
  },
  get selectAuthenticatedUser() {
    return () => ({ id: 'me' });
  },
}));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
}));
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back-link</span>,
}));
jest.mock(
  '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile',
  () => ({
    ImgUserProfile: () => <span>user-picture</span>,
  })
);
jest.mock('@/src/components/ui/UserActions/UserActions', () => ({
  UserActions: () => <span>user-actions</span>,
}));
jest.mock('@/src/components/ui/AvailabilityTag', () => ({
  AvailabilityTag: ({ isAvailable }: { isAvailable: boolean }) => (
    <span>tag:{String(isAvailable)}</span>
  ),
  AvailabilityTagEditable: () => <span>tag-editable</span>,
}));
jest.mock('@/src/components/ui/Inputs', () => ({
  ImageInput: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-input">{children}</div>
  ),
}));
jest.mock('../../../profile/ProfileAchievementHighlighter', () => ({
  ProfileAchievementHighlighter: () => <span>achievement</span>,
}));
jest.mock(
  '../../../profile/ProfilePartCards/ProfileStats/ProfileStats',
  () => ({
    ProfileStats: () => <span>profile-stats</span>,
  })
);
jest.mock('../ProfileCompletion/ProfileCompletion', () => ({
  ProfileCompletion: () => <span>profile-completion</span>,
}));
jest.mock('../ProfileContactInfos/ProfileContactInfos', () => ({
  ProfileContactInfos: () => <span>contact-infos</span>,
}));

const baseProps: HeaderProfileProps = {
  id: 'u1',
  isAvailable: true,
  firstName: 'Marie',
  lastName: 'Dupont',
  role: UserRoles.COACH,
  gender: 1,
  department: 'Paris (75)' as never,
  hasPicture: true,
  achievements: [],
  createdAt: null,
  averageDelayResponse: null,
  responseRate: null,
  totalConversationWithMirrorRoleCount: null,
  availableMirrorRoleParticipantsCount: null,
  lastConnection: '2026-01-01',
  phone: '0612345678',
  email: 'm@d.fr',
};

[
  ['desktop', HeaderProfileDesktop],
  ['mobile', HeaderProfileMobile],
].forEach(([name, Header]) => {
  const Component = Header as React.ComponentType<HeaderProfileProps>;

  describe(`HeaderProfile ${name}`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockCurrentUserId.mockReturnValue('other');
      mockHeaderProfile.mockReturnValue({
        imageUploading: false,
        uploadProfileImage: jest.fn(),
        shouldShowAllProfile: true,
        contextualRole: UserRoles.COACH,
      });
    });

    it('shows the identity, department, role and availability of another user', () => {
      renderWithProviders(<Component {...baseProps} />);
      expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
      expect(screen.getByText('Paris (75)')).toBeInTheDocument();
      expect(screen.getByText(UserRoles.COACH)).toBeInTheDocument();
      expect(screen.getByText('tag:true')).toBeInTheDocument();
      expect(screen.getByText('user-picture')).toBeInTheDocument();
      expect(screen.getByText('user-actions')).toBeInTheDocument();
      expect(screen.queryByText('contact-infos')).not.toBeInTheDocument();
      expect(screen.queryByTestId('image-input')).not.toBeInTheDocument();
    });

    it('shows the admin role instead of the contextual one for admins', () => {
      renderWithProviders(<Component {...baseProps} role={UserRoles.ADMIN} />);
      expect(screen.getByText(UserRoles.ADMIN)).toBeInTheDocument();
    });

    it('shows the first achievement', () => {
      renderWithProviders(
        <Component {...baseProps} achievements={[{ id: 'a' } as never]} />
      );
      expect(screen.getByText('achievement')).toBeInTheDocument();
    });

    it('opens a conversation through the message button for an available user', () => {
      renderWithProviders(<Component {...baseProps} />);
      const button = screen
        .getAllByRole('button')
        .find(
          (b) =>
            /Envoyer un message/.test(b.textContent || '') ||
            b.querySelector('svg')
        );
      fireEvent.click(button as HTMLElement);
      expect(mockOpenConversationOrGate).toHaveBeenCalledWith('u1');
    });

    it('hides the message button when the user is unavailable or on own profile', () => {
      const { rerender } = renderWithProviders(
        <Component {...baseProps} isAvailable={false} />
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      mockCurrentUserId.mockReturnValue('u1');
      rerender(<Component {...baseProps} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows a spinner instead of the picture while uploading', () => {
      mockHeaderProfile.mockReturnValue({
        imageUploading: true,
        uploadProfileImage: jest.fn(),
        shouldShowAllProfile: true,
        contextualRole: UserRoles.COACH,
      });
      renderWithProviders(<Component {...baseProps} />);
      expect(screen.queryByText('user-picture')).not.toBeInTheDocument();
    });

    it('hides role-specific info for users whose whole profile is not shown', () => {
      mockHeaderProfile.mockReturnValue({
        imageUploading: false,
        uploadProfileImage: jest.fn(),
        shouldShowAllProfile: false,
        contextualRole: UserRoles.COACH,
      });
      renderWithProviders(<Component {...baseProps} role={UserRoles.ADMIN} />);
      expect(screen.queryByText('Paris (75)')).not.toBeInTheDocument();
      expect(screen.queryByText(/^tag:/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('offers editing tools on the own editable profile', () => {
      mockCurrentUserId.mockReturnValue('u1');
      renderWithProviders(<Component {...baseProps} isEditable />);
      expect(screen.getByTestId('image-input')).toBeInTheDocument();
      expect(screen.getByText('contact-infos')).toBeInTheDocument();
      expect(screen.getByText('profile-completion')).toBeInTheDocument();
      expect(screen.getByText('tag-editable')).toBeInTheDocument();
    });

    it('shows a read-only availability tag on an editable profile of someone else', () => {
      renderWithProviders(<Component {...baseProps} isEditable />);
      expect(screen.queryByText('tag-editable')).not.toBeInTheDocument();
      expect(screen.getByText('tag:true')).toBeInTheDocument();
    });
  });
});
