/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

/* eslint-disable @typescript-eslint/naming-convention */

import { Action } from '@reduxjs/toolkit';

expect.extend({
  toHaveDispatchedActionTimes(
    target: { mock: { dispatchedActions: Action[] } },
    times: number,
    expectedAction
  ) {
    if (!Array.isArray(target?.mock?.dispatchedActions)) {
      throw new Error(
        'toHaveDispatchedActionTimes target is not a store. Do not forget to use mockStore()'
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
      const nbOfActionTypedDispatched = dispatchedActions.filter(
        (action) => action.type === expectedActionType
      );

      const isActionTypeDispatched = nbOfActionTypedDispatched.length === times;

      if (isActionTypeDispatched) {
        return {
          pass: true,
          message: () => `
            \n ${this.utils.matcherHint(
              'toHaveDispatchedActionTimes',
              'store',
              `'${expectedActionType}', ${times.toString()}`,
              payload
            )}
            \n Expected calls count: ${this.utils.printExpected(times)}
            \n Received calls count: ${this.utils.printReceived(
              nbOfActionTypedDispatched.length
            )}
          `,
        };
      }

      return {
        pass: false,
        message: () => `
        \n ${this.utils.matcherHint(
          'toHaveDispatchedActionTimes',
          'store',
          `'${expectedActionType}', ${times.toString()}`,
          payload
        )}
          \n Expected calls count: ${this.utils.printExpected(times)}
          \n Received calls count: ${this.utils.printReceived(
            nbOfActionTypedDispatched.length
          )}
          \n
        `,
      };
    }

    const shouldAssertActionAsObject = typeof expectedAction === 'object';

    if (shouldAssertActionAsObject) {
      const nbOfActionDispatched = dispatchedActions.filter((action) => {
        return this.equals(expectedAction, action);
      });

      const isActionDispatched = nbOfActionDispatched.length === times;

      if (isActionDispatched) {
        return {
          pass: true,
          message: () => `
          \n ${this.utils.matcherHint(
            'toHaveDispatchedActionTimes',
            'store',
            `${JSON.stringify(expectedAction)}, ${times.toString()}`,
            payload
          )}
            \n Expected calls count: ${this.utils.printExpected(times)}
            \n Received calls count: ${this.utils.printReceived(
              nbOfActionDispatched.length
            )}
        `,
        };
      }

      const actionWithSameType = dispatchedActions.filter((action) => {
        return this.equals(expectedAction.type, action.type);
      });

      return {
        pass: false,
        message: () => `
        \n ${this.utils.matcherHint(
          'toHaveDispatchedActionTimes',
          'store',
          `${JSON.stringify(expectedAction)}, ${times.toString()}`,
          payload
        )}
          \n Expected calls count: ${this.utils.printExpected(times)}
          \n Received calls count: ${this.utils.printReceived(
            nbOfActionDispatched.length
          )}
          \n ${
            !actionWithSameType.length
              ? ''
              : `Received actions: ${
                  actionWithSameType.length &&
                  this.utils.printReceived(actionWithSameType)
                }`
          }
        `,
      };
    }

    return {
      pass: false,
      message: () => this.utils.printReceived(`Invalid parameters`),
    };
  },
});
