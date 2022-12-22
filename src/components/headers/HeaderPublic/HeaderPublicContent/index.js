import { plateform } from 'src/utils/Device';
import HeaderPublicContentMobile from './HeaderPublicContent.mobile';
import HeaderPublicContentDesktop from './HeaderPublicContent.desktop';

export const HeaderPublicContent = plateform({
  Desktop: HeaderPublicContentDesktop,
  Mobile: HeaderPublicContentMobile,
});
