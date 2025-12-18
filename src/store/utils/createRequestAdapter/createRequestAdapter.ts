import { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { upperFirst } from 'lodash';
import { ReduxRequestEvents } from 'src/constants';

function toCapitalize<T extends string>(value: T) {
  return upperFirst(value) as Capitalize<T>;
}

export function createRequestAdapter<T extends string>(name: T) {
  type Status = (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

  type InitialState = {
    status: Status;
  };

  function withPayloads<Requested = void, Succeeded = void, Failed = void>() {
    type Reducers<S = any> = {
      [Key in `${T}Requested`]: CaseReducer<S, PayloadAction<Requested>>;
    } & {
      [Key in `${T}Succeeded`]: CaseReducer<S, PayloadAction<Succeeded>>;
    } & {
      [Key in `${T}Failed`]: CaseReducer<S, PayloadAction<Failed>>;
    } & {
      [Key in `${T}Reset`]: CaseReducer<S, PayloadAction>;
    };

    const selectIsIdleKey = `selectIs${toCapitalize(name)}Idle` as const;
    const selectIsRequestedKey = `selectIs${toCapitalize(
      name
    )}Requested` as const;
    const selectIsSucceededKey = `selectIs${toCapitalize(
      name
    )}Succeeded` as const;
    const selectIsFailedKey = `selectIs${toCapitalize(name)}Failed` as const;
    const selectStatusKey = `select${toCapitalize(name)}Status` as const;

    type SelectorsKey =
      | typeof selectIsIdleKey
      | typeof selectIsRequestedKey
      | typeof selectIsSucceededKey
      | typeof selectIsFailedKey;

    type SelectStatusKey = typeof selectStatusKey;

    type Selectors = {
      [Key in SelectorsKey]: (state: any) => boolean;
    } & {
      [Key in SelectStatusKey]: (state: any) => Status;
    };

    const requestedActionKey = `${name}Requested`;
    const succeededActionKey = `${name}Succeeded`;
    const failedActionKey = `${name}Failed`;
    const resetActionKey = `${name}Reset`;

    function getReducers<State, ReducersCase = Reducers<State>>(
      selectState: (state: State) => InitialState,
      reducers: Partial<ReducersCase> = {}
    ) {
      return {
        [requestedActionKey]: (
          state: State,
          action: PayloadAction<Requested>
        ) => {
          selectState(state).status = ReduxRequestEvents.REQUESTED;

          if (reducers[requestedActionKey]) {
            reducers[requestedActionKey](state, action);
          }
        },
        [succeededActionKey]: (
          state: State,
          action: PayloadAction<Succeeded>
        ) => {
          selectState(state).status = ReduxRequestEvents.SUCCEEDED;

          if (reducers[succeededActionKey]) {
            reducers[succeededActionKey](state, action);
          }
        },
        [failedActionKey]: (state: State, action: PayloadAction<Failed>) => {
          selectState(state).status = ReduxRequestEvents.FAILED;

          if (reducers[failedActionKey]) {
            reducers[failedActionKey](state, action);
          }
        },
        [resetActionKey]: (state: State, action: PayloadAction<Failed>) => {
          selectState(state).status = ReduxRequestEvents.IDLE;

          if (reducers[resetActionKey]) {
            reducers[resetActionKey](state, action);
          }
        },
      } as Reducers;
    }

    function getInitialState() {
      return {
        status: ReduxRequestEvents.IDLE,
      } as InitialState;
    }

    function getSelectors<State extends Record<string, Record<string, any>>>(
      selectState: (state: State) => InitialState
    ) {
      function selectStatus(state: any) {
        return selectState(state).status;
      }

      function createSelectorIsStatus(status: Status) {
        return (state: any) => {
          return selectStatus(state) === status;
        };
      }

      return {
        [selectIsIdleKey]: createSelectorIsStatus(ReduxRequestEvents.IDLE),
        [selectIsRequestedKey]: createSelectorIsStatus(
          ReduxRequestEvents.REQUESTED
        ),
        [selectIsSucceededKey]: createSelectorIsStatus(
          ReduxRequestEvents.SUCCEEDED
        ),
        [selectIsFailedKey]: createSelectorIsStatus(ReduxRequestEvents.FAILED),
        [selectStatusKey]: selectStatus,
      } as Selectors;
    }

    return {
      getReducers,
      getInitialState,
      getSelectors,
    };
  }

  return {
    withPayloads,
  };
}

export type RequestState<T extends { getInitialState: () => any }> = ReturnType<
  T['getInitialState']
>;
