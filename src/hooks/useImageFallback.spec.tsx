jest.mock('@/src/api');

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  currentUserActions,
  updateUserProfilePictureSelectors,
} from '@/src/use-cases/current-user';
import { useImageFallback } from './useImageFallback';

const mockedApi = getMockedApi();

describe('useImageFallback', () => {
  const env = process.env;
  const expectedUrl = (id: string) =>
    `https://s3.test/images/${id}.profile.jpg`;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_AWSS3_URL = 'https://s3.test/';
    process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY = 'images/';
  });
  afterEach(() => {
    process.env = env;
    jest.clearAllMocks();
  });

  const setup = (props: { userId: string; hasPicture?: boolean }) => {
    const store = createTestStore();
    const hook = renderHook((p) => useImageFallback(p), {
      initialProps: props,
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      ),
    });
    return { store, ...hook };
  };

  it('has no image when the user has no picture', () => {
    expect(
      setup({ userId: 'u1', hasPicture: false }).result.current.urlImg
    ).toBeNull();
    expect(setup({ userId: 'u1' }).result.current.urlImg).toBeNull();
  });

  it('builds the S3 url when the user has a picture', () => {
    expect(
      setup({ userId: 'u1', hasPicture: true }).result.current.urlImg
    ).toBe(expectedUrl('u1'));
  });

  it('follows a change of user id', () => {
    const { result, rerender } = setup({ userId: 'u1', hasPicture: true });
    rerender({ userId: 'u2', hasPicture: true });
    expect(result.current.urlImg).toBe(expectedUrl('u2'));
  });

  it('shows the picture once a new one has been uploaded', async () => {
    mockedApi.postProfileImage.mockResolvedValue({} as never);
    const { result, store } = setup({ userId: 'u1', hasPicture: false });
    expect(result.current.urlImg).toBeNull();

    act(() => {
      store.dispatch(
        currentUserActions.updateUserProfilePictureRequested({
          profileImage: new Blob(['x']),
        })
      );
    });
    await act(flushPromises);

    expect(
      updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus(
        store.getState()
      )
    ).toBe('SUCCEEDED');
    expect(result.current.urlImg).toBe(expectedUrl('u1'));
  });
});
