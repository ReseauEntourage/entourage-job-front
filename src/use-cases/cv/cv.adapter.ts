import { CV } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchCVAdapter = createRequestAdapter('fetchCV').withPayloads<
  void,
  CV
>();

export const generateProfileFromCVAdapter = createRequestAdapter(
  'generateProfileFromCV'
).withPayloads<void>();
