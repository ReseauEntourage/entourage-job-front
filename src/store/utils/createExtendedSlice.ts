/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Slice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { OmitFirst, Selectors as SelectorsBase } from './types';

function* defaultSaga() {
  // ...
}

export function createExtendedSlice<
  InternalSlice extends Slice,
  MainSaga extends Saga,
  ExtraSelectors extends SelectorsBase
>(options: {
  slice: InternalSlice;
  extraSelectors?: ExtraSelectors;
  saga?: MainSaga;
}) {
  type SliceName = InternalSlice['name'];
  type SliceState = ReturnType<InternalSlice['getInitialState']>;

  const { saga = defaultSaga, extraSelectors, slice } = options;

  function getInitialRootState() {
    return {
      [slice.name]: slice.getInitialState(),
    } as { [Key in SliceName]: SliceState };
  }

  const unformattedMergedSelectors = {
    ...(slice.selectors as NonNullable<InternalSlice['selectors']>),
    ...(extraSelectors as NonNullable<ExtraSelectors>),
  };

  type UnformattedMergedSelectors = typeof unformattedMergedSelectors;

  const mergedSelectors = unformattedMergedSelectors as unknown as {
    [SelectorName in keyof UnformattedMergedSelectors]: (
      state: Record<string, any>,
      ...args: OmitFirst<Parameters<UnformattedMergedSelectors[SelectorName]>>
    ) => ReturnType<UnformattedMergedSelectors[SelectorName]>;
  };

  type ActionsFromCaseReducers = Extract<
    InternalSlice['actions'],
    Record<string, { type: any }>
  >;

  return {
    actions: slice.actions as ActionsFromCaseReducers,
    slice,
    selectors: mergedSelectors,
    getInitialRootState,
    saga,
  };
}

export type SliceRootState<S extends Slice> = {
  [Key in S['name']]: ReturnType<S['getInitialState']>;
};
