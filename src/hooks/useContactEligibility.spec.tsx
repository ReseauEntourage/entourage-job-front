import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useContactEligibility } from './useContactEligibility';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('src/features/modals/Modal', () => ({ openModal: jest.fn() }));
// ElearningGateModal transitively imports the UI barrel, which pulls in the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx) -
// stub it directly so this hook test doesn't need to transform that chain.
jest.mock('src/features/modals/ElearningGateModal/ElearningGateModal', () => ({
  ElearningGateModal: () => null,
}));

const { ElearningGateModal } = jest.requireMock(
  'src/features/modals/ElearningGateModal/ElearningGateModal'
);

const mockUseRouter = useRouter as jest.Mock;
const mockUseAuthenticatedUser = useAuthenticatedUser as jest.Mock;
const mockOpenModal = openModal as jest.Mock;

describe('useContactEligibility', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push });
  });

  describe('isEligibleToContact', () => {
    it('is true when the current user has completed elearning', () => {
      mockUseAuthenticatedUser.mockReturnValue({
        elearningCompletedAt: '2026-01-01T00:00:00.000Z',
      });

      const { result } = renderHook(() => useContactEligibility());

      expect(result.current.isEligibleToContact).toBe(true);
    });

    it('is false when the current user has not completed elearning', () => {
      mockUseAuthenticatedUser.mockReturnValue({ elearningCompletedAt: null });

      const { result } = renderHook(() => useContactEligibility());

      expect(result.current.isEligibleToContact).toBe(false);
    });

    it('is true for an Admin account, which always has elearningCompletedAt set', () => {
      // Documents a product assumption (admin-bypass-elearning-gate change):
      // an Admin account always has `elearningCompletedAt` defined, so this
      // hook needs no role-specific branch to already be permissive for admins.
      mockUseAuthenticatedUser.mockReturnValue({
        role: UserRoles.ADMIN,
        elearningCompletedAt: '2026-01-01T00:00:00.000Z',
      });

      const { result } = renderHook(() => useContactEligibility());

      expect(result.current.isEligibleToContact).toBe(true);
    });
  });

  describe('openConversationOrGate', () => {
    it('opens the elearning gate modal when the user is not eligible', () => {
      mockUseAuthenticatedUser.mockReturnValue({ elearningCompletedAt: null });

      const { result } = renderHook(() => useContactEligibility());
      result.current.openConversationOrGate('user-42');

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal.mock.calls[0][0].type).toBe(ElearningGateModal);
      expect(push).not.toHaveBeenCalled();
    });

    it('navigates to the messaging page when the user is eligible', () => {
      mockUseAuthenticatedUser.mockReturnValue({
        elearningCompletedAt: '2026-01-01T00:00:00.000Z',
      });

      const { result } = renderHook(() => useContactEligibility());
      result.current.openConversationOrGate('user-42');

      expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=user-42');
      expect(mockOpenModal).not.toHaveBeenCalled();
    });
  });
});
