import type { JSX } from 'react';
import { plateform } from 'src/utils/Device';
import { NavConnectedContentDesktop } from './NavConnectedContent.desktop';
import { NavConnectedContentMobile } from './NavConnectedContent.mobile';
import { NavConnectedContentProps } from './NavConnectedContent.types';

export const NavConnectedContent: (
  props: NavConnectedContentProps
) => JSX.Element = plateform({
  Desktop: NavConnectedContentDesktop,
  Mobile: NavConnectedContentMobile,
});
