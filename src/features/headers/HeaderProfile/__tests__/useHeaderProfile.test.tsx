import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { useHeaderProfile } from '../useHeaderProfile';

const mockOpenCorrespondingModal = jest.fn();
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'me' }),
}));
jest.mock(
  '../../../profile/ProfilePartCards/ModalEditUserInformation/useOpenModal',
  () => ({
    useOpenCorrespondingModal: () => ({
      openCorrespondingModal: mockOpenCorrespondingModal,
    }),
  })
);
jest.mock('../useUploadProfileImage', () => ({
  useUploadProfileImage: () => ({
    imageUploading: true,
    uploadProfileImage: 'upload-fn',
  }),
}));
jest.mock('@/src/features/backoffice/useContextualRole', () => ({
  useContextualRole: (role: string) => ({ contextualRole: `ctx-${role}` }),
}));

describe('useHeaderProfile', () => {
  it('assembles the helpers of the profile header', () => {
    const { result } = renderHook(() => useHeaderProfile(UserRoles.COACH));
    expect(result.current).toEqual({
      openCorrespondingModal: mockOpenCorrespondingModal,
      imageUploading: true,
      uploadProfileImage: 'upload-fn',
      shouldShowAllProfile: true,
      contextualRole: `ctx-${UserRoles.COACH}`,
    });
  });

  it('shows the whole profile only for candidates and coaches', () => {
    expect(
      renderHook(() => useHeaderProfile(UserRoles.CANDIDATE)).result.current
        .shouldShowAllProfile
    ).toBe(true);
    expect(
      renderHook(() => useHeaderProfile(UserRoles.ADMIN)).result.current
        .shouldShowAllProfile
    ).toBe(false);
  });
});
