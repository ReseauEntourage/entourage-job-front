import { createRequestAdapter } from 'src/store/utils';

export const generateProfileFromCVAdapter = createRequestAdapter(
  'generateProfileFromCV'
).withPayloads<void>();
