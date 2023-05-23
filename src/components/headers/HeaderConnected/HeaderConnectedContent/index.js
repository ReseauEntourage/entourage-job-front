import { plateform } from 'src/utils/Device';
import HeaderConnectedContentMobile from './HeaderConnectedContent.mobile.tsx';
import HeaderConnectedContentDesktop from './HeaderConnectedContent.desktop.tsx';

export const HeaderConnectedContent = plateform({
  Desktop: HeaderConnectedContentDesktop,
  Mobile: HeaderConnectedContentMobile,
});
