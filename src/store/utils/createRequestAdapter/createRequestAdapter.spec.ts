import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReduxRequestEvents } from '@/src/constants';
import { SliceRootState } from '../types';
import { createRequestAdapter, RequestState } from '.';

describe('createRequestAdapter', () => {
  function getSlice() {
    const loginRequestAdapter = createRequestAdapter('loginUser').withPayloads<
      { email: string; password: string },
      {
        token: string;
      },
      { reason: string }
    >();

    interface State {
      token: string | null;
      error: string | null;
      login: RequestState<typeof loginRequestAdapter>;
    }

    const initialState: State = {
      token: null,
      error: null,
      login: loginRequestAdapter.getInitialState(),
    };

    const authentication = createSlice({
      name: 'authentication',
      initialState,
      reducers: {
        ...loginRequestAdapter.getReducers<State>((state) => state.login, {
          loginUserSucceeded(state, action) {
            state.token = action.payload.token;
          },
          loginUserFailed(state, action) {
            state.error = action.payload.reason;
          },
        }),
      },
    });

    const store = configureStore({
      reducer: combineReducers({
        authentication: authentication.reducer,
      }),
    });

    type RootState = SliceRootState<typeof authentication>;

    const selectors = loginRequestAdapter.getSelectors<RootState>(
      (state) => state.authentication.login
    );

    return {
      authentication,
      loginRequestAdapter,
      selectors,
      store,
    };
  }

  it(`
    Given initial state
    Then status should be IDLE
      And isIdle should be true
      And isRequested should be false
      And isSucceeded should be false
      And isFailed should be false
  `, () => {
    const { selectors, store } = getSlice();

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.IDLE
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(true);
    expect(selectors.selectIsLoginUserRequested(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserSucceeded(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserFailed(store.getState())).toBe(false);
  });

  it(`
    Given a slice containing selectors
      And a store
      And authentication module
    When user dispatches requested action
    Then status should be REQUESTED
      And isIdle should be false
      And isRequested should be true
      And isSucceeded should be false
      And isFailed should be false
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(
      authentication.actions.loginUserRequested({ email: '', password: '' })
    );

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.REQUESTED
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserRequested(store.getState())).toBe(true);
    expect(selectors.selectIsLoginUserSucceeded(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserFailed(store.getState())).toBe(false);
  });

  it(`
    Given initial state
    When user dispatches succeeded action with token
    Then status should be SUCCEEDED
      And isIdle should be false
      And isRequested should be false
      And isSucceeded should be true
      And isFailed should be false
      Then token into state should equal to the dispatched token
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(
      authentication.actions.loginUserSucceeded({ token: 'myToken' })
    );

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.SUCCEEDED
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserRequested(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserSucceeded(store.getState())).toBe(true);
    expect(selectors.selectIsLoginUserFailed(store.getState())).toBe(false);
    expect(store.getState().authentication.token).toBe('myToken');
  });

  it(`
    Given initial state
    When user dispatches failed action with a reason
    Then status should be FAILED
      And isIdle should be false
      And isRequested should be false
      And isSucceeded should be false
      And isFailed should be true
      Then error into state should equal to the dispatched reason
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(
      authentication.actions.loginUserFailed({ reason: 'invalid credentials' })
    );

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.FAILED
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserRequested(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserSucceeded(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserFailed(store.getState())).toBe(true);
    expect(store.getState().authentication.error).toBe('invalid credentials');
  });

  it(`
    Given initial state
    When user dispatches requested action
      And user dispatch reset action
    Then status should be IDLE
      And isIdle should be true
      And isRequested should be false
      And isSucceeded should be false
      And isFailed should be false
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(
      authentication.actions.loginUserRequested({ email: '', password: '' })
    );
    store.dispatch(authentication.actions.loginUserReset());

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.IDLE
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(true);
    expect(selectors.selectIsLoginUserRequested(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserSucceeded(store.getState())).toBe(false);
    expect(selectors.selectIsLoginUserFailed(store.getState())).toBe(false);
  });

  it(`
    Given a store with a succeeded request
    When user dispatches reset action
    Then status should be IDLE again
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(authentication.actions.loginUserSucceeded({ token: 'x' }));
    store.dispatch(authentication.actions.loginUserReset());

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.IDLE
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(true);
  });

  it(`
    Given a store with a failed request
    When user dispatches reset action
    Then status should be IDLE again
  `, () => {
    const { selectors, authentication, store } = getSlice();

    store.dispatch(
      authentication.actions.loginUserFailed({ reason: 'network error' })
    );
    store.dispatch(authentication.actions.loginUserReset());

    expect(selectors.selectLoginUserStatus(store.getState())).toBe(
      ReduxRequestEvents.IDLE
    );
    expect(selectors.selectIsLoginUserIdle(store.getState())).toBe(true);
  });
});
