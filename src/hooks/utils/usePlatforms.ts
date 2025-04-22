import { useWindowWidth } from '@react-hook/window-size';
import MobileDetect from 'mobile-detect';
import { useEffect, useState } from 'react';
import { BREAKPOINTS } from 'src/constants/styles';
import { useSSRDataContext } from './useSSRDataContext';

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>();
  const { userAgent } = useSSRDataContext();
  const mobileDetect = new MobileDetect(userAgent);
  const userAgentIsDesktop = !mobileDetect.mobile() && !mobileDetect.tablet();

  const windowWidth = useWindowWidth();

  useEffect(() => {
    setIsDesktop(userAgentIsDesktop);

    setIsDesktop(windowWidth >= BREAKPOINTS.desktop);
  }, [userAgentIsDesktop, windowWidth]);

  return isDesktop;
}

export function useIsMobile() {
  return !useIsDesktop();
}
