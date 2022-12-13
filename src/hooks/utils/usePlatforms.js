import { useWindowWidth } from '@react-hook/window-size';
import MobileDetect from 'mobile-detect';
import { BREAKPOINTS } from 'src/constants/styles';
import { isSSR } from 'src/utils/isSSR';
import { useSSRDataContext } from './useSSRDataContext';

export function useIsDesktop() {
  const { userAgent } = useSSRDataContext();
  const mobileDetect = new MobileDetect(userAgent);
  const userAgentIsDesktop = !mobileDetect.mobile() && !mobileDetect.tablet();

  const windowWidth = useWindowWidth();

  if (isSSR) {
    return userAgentIsDesktop;
  }

  return windowWidth >= BREAKPOINTS.desktop;
}

export function useIsMobile() {
  return !useIsDesktop();
}
