import { plateform } from 'src/utils/Device';
import HeaderConnectedContentMobile from './HeaderConnectedContent.mobile';
import HeaderConnectedContentDesktop from './HeaderConnectedContent.desktop';

export const HeaderConnectedContent = plateform({
  Desktop: HeaderConnectedContentDesktop,
  Mobile: HeaderConnectedContentMobile,
});
