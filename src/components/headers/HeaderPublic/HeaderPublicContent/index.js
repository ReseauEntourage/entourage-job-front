import { plateform } from 'src/utils/Device';
import HeaderPublicContentDesktop from './HeaderPublicContent.desktop';
import HeaderPublicContentMobile from './HeaderPublicContent.mobile';

export const HeaderPublicContent = plateform({
  Desktop: HeaderPublicContentDesktop,
  Mobile: HeaderPublicContentMobile,
});
