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

  function anyAction(name = 'John') {
    return {
      type: 'ANY_ACTION_TYPE',
      payload: {
        name,
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
    When action is dispatched twice with name set to John
    Then store should have the dispatched action twice with 'John'
      And store shouldn't have dispatched action once
      And store shouldn't have dispatched twice with 'Max'
  `, () => {
    store.dispatch(anyAction('John'));
    store.dispatch(anyAction('John'));

    expect(store).toHaveDispatchedActionTimes(2, anyAction());
    expect(store).toHaveDispatchedActionTimes(2, 'ANY_ACTION_TYPE');

    expect(store).not.toHaveDispatchedActionTimes(1, anyAction());
    expect(store).not.toHaveDispatchedActionTimes(1, 'ANY_ACTION_TYPE');

    expect(store).not.toHaveDispatchedActionTimes(2, anyAction('Max'));
  });
});
