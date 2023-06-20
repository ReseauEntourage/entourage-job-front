import { plateform } from 'src/utils/Device';
import HeaderConnectedContentDesktop from './HeaderConnectedContent.desktop';
import HeaderConnectedContentMobile from './HeaderConnectedContent.mobile';

export const HeaderConnectedContent = plateform({
  Desktop: HeaderConnectedContentDesktop,
  Mobile: HeaderConnectedContentMobile,
});
