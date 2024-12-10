import type { JSX } from 'react';
import { plateform } from 'src/utils/Device';
import { HeaderPublicContentDesktop } from './HeaderPublicContent.desktop';
import { HeaderPublicContentMobile } from './HeaderPublicContent.mobile';
import { HeaderPublicContentProps } from './HeaderPublicContent.types';

export const HeaderPublicContent: (
  props: HeaderPublicContentProps
) => JSX.Element = plateform({
  Desktop: HeaderPublicContentDesktop,
  Mobile: HeaderPublicContentMobile,
});
