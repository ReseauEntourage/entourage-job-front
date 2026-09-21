jest.mock('@/src/api');

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { RecapSuggestedMessage } from './RecapSuggestedMessage';

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. MessagingWaitingReplyBanner.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockedApi = getMockedApi();

// Far beyond any plausible `keepUnusedDataFor`, and deliberately not
// hard-coding the library's default so the test survives a change to it.
const WELL_PAST_CACHE_GC = 10 * 60 * 1000;

const RECOMMENDATION = {
  publicProfile: {
    id: 'coach-42',
    firstName: 'Jane',
    lastName: 'Doe',
    role: UserRoles.COACH,
    sectorOccupations: [],
    nudges: [],
  },
} as any;

const preloadedCurrentUser = {
  currentUser: {
    user: {
      id: 'candidate-1',
      firstName: 'Awa',
      role: UserRoles.CANDIDATE,
    },
    profile: { sectorOccupations: [], nudges: [] },
  },
} as any;

describe('RecapSuggestedMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * This screen builds `participantIds[]` from the recommended profile, not
   * from the messaging slice's new-conversation draft, so it was never
   * affected by the cache-collection bug. This test pins that independence:
   * users could send their onboarding message however slowly they wrote it,
   * which is why some of them managed a first contact and then failed on
   * every one after.
   */
  it('sends the suggested message however long the user takes to write it', () => {
    jest.useFakeTimers();
    try {
      const store = createTestStore(preloadedCurrentUser);

      render(
        <Provider store={store}>
          <RecapSuggestedMessage
            recommendation={RECOMMENDATION}
            onSend={() => {}}
          />
        </Provider>
      );

      jest.advanceTimersByTime(WELL_PAST_CACHE_GC);
      fireEvent.click(
        screen.getByTestId('wizard-match-recap-send-suggested-message')
      );

      expect(mockedApi.postMessage).toHaveBeenCalledTimes(1);
      const formData = mockedApi.postMessage.mock.calls[0][0] as FormData;
      expect(formData.getAll('participantIds[]')).toEqual(['coach-42']);
    } finally {
      jest.useRealTimers();
    }
  });
});
