import type { JSX } from 'react';
import { plateform } from 'src/utils/Device';
import { HeaderConnectedContentDesktop } from './HeaderConnectedContent.desktop';
import { HeaderConnectedContentMobile } from './HeaderConnectedContent.mobile';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';

export const HeaderConnectedContent: (
  props: HeaderConnectedContentProps
) => JSX.Element = plateform({
  Desktop: HeaderConnectedContentDesktop,
  Mobile: HeaderConnectedContentMobile,
});
