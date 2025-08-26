import type { JSX } from 'react';
import { plateform } from 'src/utils/Device';
import { NavPublicContentDesktop } from './NavPublicContent.desktop';
import { NavPublicContentMobile } from './NavPublicContent.mobile';
import { NavPublicContentProps } from './NavPublicContent.types';

export const NavPublicContent: (props: NavPublicContentProps) => JSX.Element =
  plateform({
    Desktop: NavPublicContentDesktop,
    Mobile: NavPublicContentMobile,
  });
