import {
  createAxiosError,
  createIsTooManyRequests,
  createUnauthorizedError,
} from 'src/api/axiosErrors';
import { createFakeUser } from 'src/api/fake-entities/createUser';
import { mockApiSuccess, mockApiError } from 'src/api/testUtils';
import { STORAGE_KEYS } from 'src/constants';
import { configureTestingStore } from 'src/store/utils/configureTestingStore';
import { authentication } from '.';

describe('Authentication', () => {
  it(`
    Given ACCESS_TOKEN_FROM_LOCAL_STORAGE is set into local storage
    Then access token should be equal to ACCESS_TOKEN_FROM_LOCAL_STORAGE
  `, async () => {
    const accessToken = 'ACCESS_TOKEN_FROM_LOCAL_STORAGE';

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    const store = configureTestingStore({
      slices: [authentication],
    });

    expect(authentication.selectors.selectAccessToken(store.getState())).toBe(
      accessToken
    );
  });

  it(`
    Given post auth login is set to return ACCESS_TOKEN_FROM_SERVER
    When the user dispatchs loginRequested with email and password
    Then access token should be equal to TOKEN
  `, async () => {
    const accessToken = 'ACCESS_TOKEN_FROM_SERVER';
    const user = createFakeUser();

    const postAuthLoginPromise = mockApiSuccess('postAuthLogin', {
      data: {
        token: accessToken,
        user,
      },
    });

    const store = configureTestingStore({
      slices: [authentication],
    });

    store.dispatch(
      authentication.actions.loginRequested({
        email: 'john.doe@domain.com',
        password: 'abc',
      })
    );

    await postAuthLoginPromise();

    expect(authentication.selectors.selectAccessToken(store.getState())).toBe(
      accessToken
    );
  });

  describe('Login Errors', () => {
    it(`
      Given post auth login is set to failed with too many request error
      When the user dispatchs loginRequested with email and password
      Then login error should be RATE_LIMIT
    `, async () => {
      const postAuthLoginPromise = mockApiError(
        'postAuthLogin',
        createIsTooManyRequests()
      );

      const store = configureTestingStore({
        slices: [authentication],
      });

      store.dispatch(
        authentication.actions.loginRequested({
          email: 'john.doe@domain.com',
          password: 'abc',
        })
      );

      try {
        await postAuthLoginPromise();
      } catch {
        // ...
      }

      expect(authentication.selectors.selectLoginError(store.getState())).toBe(
        'RATE_LIMIT'
      );
    });

    it(`
      Given post auth login is set to failed with UNVERIFIED_EMAIL
      When the user dispatchs loginRequested with email and password
      Then login error should be rate limit
    `, async () => {
      const postAuthLoginPromise = mockApiError(
        'postAuthLogin',
        createUnauthorizedError({ message: 'UNVERIFIED_EMAIL' })
      );

      const store = configureTestingStore({
        slices: [authentication],
      });

      store.dispatch(
        authentication.actions.loginRequested({
          email: 'john.doe@domain.com',
          password: 'abc',
        })
      );

      try {
        await postAuthLoginPromise();
      } catch {
        // ...
      }

      expect(authentication.selectors.selectLoginError(store.getState())).toBe(
        'UNVERIFIED_EMAIL'
      );
    });

    it(`
      Given post auth login is set to fail with undetermined error
      When the user dispatchs loginRequested with email and password
      Then login error should be rate limit
        And store should have dispatched loginFailed
    `, async () => {
      const postAuthLoginPromise = mockApiError(
        'postAuthLogin',
        createAxiosError()
      );

      const store = configureTestingStore({
        slices: [authentication],
      });

      store.dispatch(
        authentication.actions.loginRequested({
          email: 'john.doe@domain.com',
          password: 'abc',
        })
      );

      try {
        await postAuthLoginPromise();
      } catch {
        // ...
      }

      expect(authentication.selectors.selectLoginError(store.getState())).toBe(
        'INVALID_CREDENTIALS'
      );
      expect(store).toHaveDispatchedAction(authentication.actions.loginFailed);
    });
  });
});
