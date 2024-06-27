/* eslint-disable no-param-reassign */
import { configureStore } from '@reduxjs/toolkit';

describe('toHaveDispatchedAction', () => {
  function createDispatchedActionsMiddleware() {
    const dispatchedActions: unknown[] = [];

    function dispatchedActionsMiddleware() {
      return (next: (action: unknown) => unknown) => (action: unknown) => {
        dispatchedActions.push(action);

        return next(action);
      };
    }

    return {
      dispatchedActionsMiddleware,
      dispatchedActions,
    };
  }

  function mockStore(
    store: ReturnType<typeof configureStore>,
    dispatchedActions: unknown[]
  ) {
    // @ts-expect-error mock doesn't exist in store
    // this is only used for jest matcher
    store.mock = {
      dispatchedActions,
    };
  }

  function anyAction() {
    return {
      type: 'ANY_ACTION_TYPE',
      payload: {
        name: 'John',
      },
    };
  }

  function badAction() {
    return {
      type: 'BAD_ACTION_TYPE',
      payload: {
        name: 'Max',
      },
    };
  }

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    const { dispatchedActions, dispatchedActionsMiddleware } =
      createDispatchedActionsMiddleware();

    store = configureStore({
      reducer: () => null,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dispatchedActionsMiddleware),
    });

    mockStore(store, dispatchedActions);
  });

  it(`
    Given store with mock
    When action with type ANY_ACTION_TYPE is dispatched
    Then store should have ANY_ACTION_TYPE dispatched
      And store shoudn't have BAD_ACTION_TYPE dispatched
  `, () => {
    store.dispatch(anyAction());

    expect(store).toHaveDispatchedAction('ANY_ACTION_TYPE');
    expect(store).toHaveDispatchedAction(anyAction());

    expect(store).not.toHaveDispatchedAction('BAD_ACTION_TYPE');
    expect(store).not.toHaveDispatchedAction(badAction());
  });
});
