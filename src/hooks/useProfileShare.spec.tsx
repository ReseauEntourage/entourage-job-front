jest.mock('@/src/api');
jest.mock('@/src/features/modals/Modal/openModal', () => ({
  openModal: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/LinkedInSharePreviewModal/LinkedInSharePreviewModal',
  () => ({ LinkedInSharePreviewModal: () => null })
);
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { useProfileShare } from './useProfileShare';

const mockedApi = getMockedApi();
const mockOpenModal = openModal as jest.Mock;
const mockUser = useAuthenticatedUser as jest.Mock;

function setup() {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return {
    store,
    ...renderHook(
      () => useProfileShare({ profileId: 'p1', firstName: 'Alice' }),
      { wrapper }
    ),
  };
}

describe('useProfileShare', () => {
  let open: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.mockReturnValue({ id: 'u1', hasLinkedinLinked: true });
    open = jest.spyOn(window, 'open').mockImplementation(() => null);
  });
  afterEach(() => open.mockRestore());

  describe('handleWhatsappShare', () => {
    it('opens WhatsApp with the encoded share text and records the share', async () => {
      mockedApi.getProfileShareText.mockResolvedValue({
        data: { text: 'Hello & bye' },
      } as never);
      mockedApi.postProfileShare.mockResolvedValue({} as never);
      const { result } = setup();

      await act(() => result.current.handleWhatsappShare());

      expect(mockedApi.getProfileShareText).toHaveBeenCalledWith('p1');
      expect(open).toHaveBeenCalledWith(
        'https://wa.me/?text=Hello%20%26%20bye',
        '_blank',
        'noopener,noreferrer'
      );
      expect(mockedApi.postProfileShare).toHaveBeenCalledWith('p1', 'whatsapp');
      expect(result.current.hasSharedWhatsapp).toBe(true);
      expect(result.current.isWhatsappLoading).toBe(false);
    });

    it('still succeeds when recording the share fails', async () => {
      mockedApi.getProfileShareText.mockResolvedValue({
        data: { text: 'x' },
      } as never);
      mockedApi.postProfileShare.mockRejectedValue(new Error('nope'));
      const { result, store } = setup();

      await act(() => result.current.handleWhatsappShare());

      expect(result.current.hasSharedWhatsapp).toBe(true);
      expect(store.getState().notifications.notifications).toHaveLength(0);
    });

    it('notifies the user when the share text cannot be fetched', async () => {
      mockedApi.getProfileShareText.mockRejectedValue(new Error('boom'));
      const { result, store } = setup();

      await act(() => result.current.handleWhatsappShare());

      expect(open).not.toHaveBeenCalled();
      expect(result.current.hasSharedWhatsapp).toBe(false);
      expect(result.current.isWhatsappLoading).toBe(false);
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        }),
      ]);
    });
  });

  describe('handleLinkedinShare', () => {
    it('opens the LinkedIn preview modal with the user and share state', async () => {
      const { result } = setup();
      act(() => result.current.handleLinkedinShare());

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      const element = mockOpenModal.mock.calls[0][0] as ReactElement<
        Record<string, unknown>
      >;
      expect(element.props).toEqual(
        expect.objectContaining({
          profileId: 'p1',
          firstName: 'Alice',
          hasLinkedinLinked: true,
          hasAlreadySharedWhatsapp: false,
        })
      );
    });

    it('passes hasAlreadySharedWhatsapp once WhatsApp was shared', async () => {
      mockedApi.getProfileShareText.mockResolvedValue({
        data: { text: 'x' },
      } as never);
      mockedApi.postProfileShare.mockResolvedValue({} as never);
      const { result } = setup();
      await act(() => result.current.handleWhatsappShare());
      act(() => result.current.handleLinkedinShare());

      const element = mockOpenModal.mock.calls[0][0] as ReactElement<
        Record<string, unknown>
      >;
      expect(element.props.hasAlreadySharedWhatsapp).toBe(true);
    });

    it('fetches the LinkedIn OAuth url for the profile through onTriggerOAuth', async () => {
      mockedApi.getLinkedinOAuthUrl.mockResolvedValue({
        data: { url: 'http://localhost/oauth' },
      } as never);
      const { result } = setup();
      act(() => result.current.handleLinkedinShare());
      const element = mockOpenModal.mock.calls[0][0] as ReactElement<{
        onTriggerOAuth: () => Promise<void>;
      }>;

      // jsdom cannot navigate (and location is not redefinable): it only
      // reports "not implemented: navigation" on the console.
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      await element.props.onTriggerOAuth();
      consoleError.mockRestore();

      expect(mockedApi.getLinkedinOAuthUrl).toHaveBeenCalledWith('p1');
    });
  });
});
