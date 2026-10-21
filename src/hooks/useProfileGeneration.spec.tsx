jest.mock('@/src/api');

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { PUSHER_CHANNELS, PUSHER_EVENTS } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { currentUserActions } from '@/src/use-cases/current-user';
import { useProfileGeneration } from './useProfileGeneration';

const mockChannel = { bind: jest.fn(), unbind: jest.fn() };
const mockPusher = {
  subscribe: jest.fn(() => mockChannel),
  unsubscribe: jest.fn(),
};
jest.mock('@/src/constants', () => ({
  ...jest.requireActual('@/src/constants'),
  getPusher: () => mockPusher,
}));

const mockedApi = getMockedApi();
const CHANNEL = `${PUSHER_CHANNELS.PROFILE_GENERATION}-u1`;

function setup(onProfileGenerated?: () => void, withUser = true) {
  const store = createTestStore();
  if (withUser) {
    store.dispatch(currentUserActions.fetchUserSucceeded({ id: 'u1' } as User));
  }
  const dispatch = jest.spyOn(store, 'dispatch');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useProfileGeneration({ onProfileGenerated }), {
    wrapper,
  });
  const emit = (payload: Record<string, unknown>) =>
    act(() => mockChannel.bind.mock.calls[0][1](payload));
  return { store, dispatch, emit, ...hook };
}

const notifications = (store: ReturnType<typeof createTestStore>) =>
  store.getState().notifications.notifications;

describe('useProfileGeneration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does not subscribe without a user', () => {
    setup(undefined, false);
    expect(mockPusher.subscribe).not.toHaveBeenCalled();
  });

  it('subscribes to the user channel and unsubscribes on unmount', () => {
    const { unmount } = setup();
    expect(mockPusher.subscribe).toHaveBeenCalledWith(CHANNEL);
    expect(mockChannel.bind).toHaveBeenCalledWith(
      PUSHER_EVENTS.PROFILE_GENERATION_COMPLETE,
      expect.any(Function)
    );

    unmount();
    expect(mockChannel.unbind).toHaveBeenCalledWith(
      PUSHER_EVENTS.PROFILE_GENERATION_COMPLETE
    );
    expect(mockPusher.unsubscribe).toHaveBeenCalledWith(CHANNEL);
  });

  describe('generateProfileFromCV', () => {
    it('is loading until the completion event arrives', async () => {
      mockedApi.getGenerateProfileFromCV.mockResolvedValue({
        status: 200,
        data: { jobId: 'job1' },
      } as never);
      const { result, emit } = setup();

      await act(() => result.current.generateProfileFromCV());
      expect(result.current.isLoading).toBe(true);

      emit({ success: true });
      expect(result.current.isLoading).toBe(false);
    });

    it('notifies an error on a non-200 response', async () => {
      mockedApi.getGenerateProfileFromCV.mockResolvedValue({
        status: 500,
      } as never);
      const { result, store } = setup();

      await act(() => result.current.generateProfileFromCV());

      expect(notifications(store)).toEqual([
        expect.objectContaining({ type: 'danger' }),
      ]);
    });

    it('notifies an error when the request throws', async () => {
      mockedApi.getGenerateProfileFromCV.mockRejectedValue(new Error('x'));
      const { result, store } = setup();

      await act(() => result.current.generateProfileFromCV());

      expect(notifications(store)).toEqual([
        expect.objectContaining({ type: 'danger' }),
      ]);
    });
  });

  describe('completion event', () => {
    it('on success: calls the callback, notifies and refreshes the profile', () => {
      const onProfileGenerated = jest.fn();
      const { emit, store, dispatch } = setup(onProfileGenerated);

      emit({ success: true });

      expect(onProfileGenerated).toHaveBeenCalledTimes(1);
      expect(notifications(store)).toEqual([
        expect.objectContaining({
          type: 'success',
          message: 'Votre profil a été généré avec succès !',
        }),
      ]);
      expect(dispatch).toHaveBeenCalledWith(
        currentUserActions.fetchCurrentProfileCompleteRequested()
      );
    });

    it('on error: notifies a danger message and skips the callback', () => {
      const onProfileGenerated = jest.fn();
      const { emit, store } = setup(onProfileGenerated);

      emit({ success: false, error: 'boom' });

      expect(onProfileGenerated).not.toHaveBeenCalled();
      expect(notifications(store)).toEqual([
        expect.objectContaining({ type: 'danger' }),
      ]);
    });

    it('ignores a cancelled generation silently', () => {
      const onProfileGenerated = jest.fn();
      const { emit, store } = setup(onProfileGenerated);

      emit({ success: false, reason: 'cancelled' });

      expect(onProfileGenerated).not.toHaveBeenCalled();
      expect(notifications(store)).toHaveLength(0);
    });
  });

  describe('cancelProfileGeneration', () => {
    it('cancels the running job and ignores a late completion', async () => {
      mockedApi.getGenerateProfileFromCV.mockResolvedValue({
        status: 200,
        data: { jobId: 'job1' },
      } as never);
      mockedApi.cancelGenerateProfileFromCV.mockResolvedValue({} as never);
      const onProfileGenerated = jest.fn();
      const { result, emit, store } = setup(onProfileGenerated);
      await act(() => result.current.generateProfileFromCV());

      await act(() => result.current.cancelProfileGeneration());

      expect(mockedApi.cancelGenerateProfileFromCV).toHaveBeenCalledWith(
        'job1'
      );
      expect(result.current.isLoading).toBe(false);

      emit({ success: true });
      expect(onProfileGenerated).not.toHaveBeenCalled();
      expect(notifications(store)).toHaveLength(0);
    });

    it('does not call the API when no job was started', async () => {
      const { result } = setup();
      await act(() => result.current.cancelProfileGeneration());
      expect(mockedApi.cancelGenerateProfileFromCV).not.toHaveBeenCalled();
    });

    it('swallows cancellation API errors', async () => {
      mockedApi.getGenerateProfileFromCV.mockResolvedValue({
        status: 200,
        data: { jobId: 'job1' },
      } as never);
      mockedApi.cancelGenerateProfileFromCV.mockRejectedValue(new Error('x'));
      const { result, store } = setup();
      await act(() => result.current.generateProfileFromCV());

      await act(() => result.current.cancelProfileGeneration());

      expect(notifications(store)).toHaveLength(0);
    });
  });
});
