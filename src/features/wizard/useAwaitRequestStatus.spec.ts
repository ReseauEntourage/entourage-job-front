import { configureStore, createSlice } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { ReduxRequestStatus } from './resolveWizardPhase';
import { useAwaitRequestStatus } from './useAwaitRequestStatus';

const makeStore = (initialStatus: ReduxRequestStatus) => {
  const slice = createSlice({
    name: 'test',
    initialState: { status: initialStatus },
    reducers: {
      setStatus(state, action: { payload: ReduxRequestStatus }) {
        state.status = action.payload;
      },
    },
  });
  const store = configureStore({ reducer: { test: slice.reducer } });
  return { store, setStatus: slice.actions.setStatus };
};

const selectStatus = (state: { test: { status: ReduxRequestStatus } }) =>
  state.test.status;

describe('useAwaitRequestStatus', () => {
  it('resolves immediately when the status is already settled', async () => {
    const { store } = makeStore(ReduxRequestEvents.SUCCEEDED);
    const { result } = renderHook(() => useAwaitRequestStatus(selectStatus), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });

    await expect(result.current()).resolves.toBe(ReduxRequestEvents.SUCCEEDED);
  });

  it('resolves once the status transitions to SUCCEEDED', async () => {
    const { store, setStatus } = makeStore(ReduxRequestEvents.REQUESTED);
    const { result } = renderHook(() => useAwaitRequestStatus(selectStatus), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });

    const pending = result.current();
    act(() => {
      store.dispatch(setStatus(ReduxRequestEvents.SUCCEEDED));
    });

    await expect(pending).resolves.toBe(ReduxRequestEvents.SUCCEEDED);
  });

  it('resolves once the status transitions to FAILED', async () => {
    const { store, setStatus } = makeStore(ReduxRequestEvents.REQUESTED);
    const { result } = renderHook(() => useAwaitRequestStatus(selectStatus), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });

    const pending = result.current();
    act(() => {
      store.dispatch(setStatus(ReduxRequestEvents.FAILED));
    });

    await expect(pending).resolves.toBe(ReduxRequestEvents.FAILED);
  });

  it('does not resolve while the status stays pending', async () => {
    const { store } = makeStore(ReduxRequestEvents.REQUESTED);
    const { result } = renderHook(() => useAwaitRequestStatus(selectStatus), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });

    let resolved = false;
    result.current().then(() => {
      resolved = true;
    });

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(resolved).toBe(false);
  });
});
