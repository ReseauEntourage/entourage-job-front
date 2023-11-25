import { Slice } from '@reduxjs/toolkit';

export type SliceRootState<S extends Slice> = {
  [Key in S['name']]: ReturnType<S['getInitialState']>;
};
