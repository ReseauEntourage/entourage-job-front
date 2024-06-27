/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

/* eslint-disable @typescript-eslint/naming-convention */

import { Action } from '@reduxjs/toolkit';

expect.extend({
  toHaveDispatchedAction(
    target: { mock: { dispatchedActions: Action[] } },
    expectedAction
  ) {
    if (!Array.isArray(target?.mock?.dispatchedActions)) {
      throw new Error(
        'toHaveDispatchedAction target is not a store. Do not forget to use mockStore()'
      );
    }

    const { dispatchedActions } = target.mock;

    const expectedActionTypeAsString =
      typeof expectedAction === 'string' ? expectedAction : null;
    const expectedActionTypeAsFunction =
      typeof expectedAction === 'function'
        ? expectedAction.type.toString()
        : null;

    const expectedActionType =
      expectedActionTypeAsString || expectedActionTypeAsFunction;

    const payload = {
      isNot: this.isNot,
    };

    if (expectedActionType) {
      const isActionTypeDispatched = dispatchedActions.some(
        (action) => action.type === expectedActionType
      );

      if (isActionTypeDispatched) {
        return {
          pass: true,
          message: () => `
            \n ${this.utils.matcherHint(
              'toHaveDispatchedAction',
              undefined,
              undefined,
              payload
            )}
            \n Expected: ${this.utils.printExpected(expectedActionType)}
            \n Received: ${this.utils.printReceived(
              dispatchedActions.map((action) => action.type)
            )}
          `,
        };
      }

      return {
        pass: false,
        message: () => `
        \n ${this.utils.matcherHint(
          'toHaveDispatchedAction',
          undefined,
          undefined,
          payload
        )}
          \n Expected: ${this.utils.printExpected(expectedActionType)}
          \n Received: ${this.utils.printReceived(
            dispatchedActions.map((action) => action.type)
          )}
          \n
        `,
      };
    }

    const shouldAssertActionAsObject = typeof expectedAction === 'object';

    if (shouldAssertActionAsObject) {
      const isActionDispatched = dispatchedActions.some((action) => {
        return this.equals(expectedAction, action);
      });

      if (isActionDispatched) {
        return {
          pass: true,
          message: () => `
          \n ${this.utils.matcherHint(
            'toHaveDispatchedAction',
            undefined,
            undefined,
            payload
          )}
            \n Expected: ${this.utils.printExpected(expectedAction)}
            \n Received: ${this.utils.printReceived(dispatchedActions)}
        `,
        };
      }

      return {
        pass: false,
        message: () => `
        \n ${this.utils.matcherHint(
          'toHaveDispatchedAction',
          undefined,
          undefined,
          payload
        )}
          \n Expected: ${this.utils.printExpected(expectedAction)}
          \n Received: ${this.utils.printReceived(dispatchedActions)}
          \n
        `,
      };
    }

    return {
      pass: false,
      message: () => this.utils.printReceived(`Invalid parameters`),
    };
  },
});
