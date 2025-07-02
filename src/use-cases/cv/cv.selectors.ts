import { generateProfileFromCVAdapter } from './cv.adapter';
import { RootState } from './cv.slice';

export const generateProfileFromCVSelectors =
  generateProfileFromCVAdapter.getSelectors<RootState>(
    (state) => state.cv.generateProfileFromCV
  );
