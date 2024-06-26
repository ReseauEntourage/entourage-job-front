// use modified version of UIkit because of bug where we can't touch scroll on Offcanvas
// eslint-disable-next-line import/order

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'src/styles/styles.less';
import 'src/components/filters/SearchBar.less';
import 'src/components/modals/Modal/Modal.less';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';

// import * as Sentry from '@sentry/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { SplashScreen } from 'src/components/SplashScreen';
import { ModalsListener } from 'src/components/modals/Modal';
// import { OFFCANVAS_GUEST, OFFCANVAS_LOGGED } from 'src/constants/utils';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';
import { useMount } from 'src/hooks/utils';
import * as gtag from 'src/lib/gtag';
import { DataProvider } from 'src/store/DataProvider';
import { store } from 'src/store/store';

// sentry is only commented untill we're sure we won't use it again
// Sentry.init({
//   enabled: process.env.NODE_ENV === 'production',
//   dsn: process.env.SENTRY_DSN,
// });

/** ************
 * This component is detached because it needs Redux content to work properly
 */
const RouteReadyComponent = ({ Component, pageProps }: AppProps) => {
  const { isCurrentRouteReady } = useAuthentication();
  return isCurrentRouteReady ? <Component {...pageProps} /> : null;
};

const EntourageApp = (props: AppProps) => {
  const [shouldScrollToTop, setShouldScrollToTop] = useState(true);
  const { events, beforePopState } = useRouter();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useMount(() => {
    events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
    });

    setTimeout(() => {
      setFading(true); // if animation still okay => should be deleted
    }, 1000);
  });

  useEffect(() => {
    beforePopState(() => {
      setShouldScrollToTop(false);
      return true;
    });
  }, [beforePopState]);

  useEffect(() => {
    const scrollToTop = (_url, { shallow }) => {
      //* ************** */
      /* this part should be removed if no bug is detected */

      // Fix because if offcanvas is open during route change, couldn't be opened anymore
      //  if (UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`)) {
      //   UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
      // }
      // if (UIkit.offcanvas(`#${OFFCANVAS_GUEST}`)) {
      //   UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
      // }
      //* ************** */

      if (!shallow && shouldScrollToTop) {
        setShouldScrollToTop(true);
        document?.getElementById('main-container')?.scrollTo(0, 0);
      }
    };
    events.on('routeChangeComplete', scrollToTop);
    return () => {
      events.off('routeChangeComplete', scrollToTop);
    };
  }, [events, shouldScrollToTop]);

  useEffect(() => {
    if (fading) {
      setTimeout(() => {
        setLoading(false); // if animation still okay => should be deleted
      }, 500);
    }
  }, [fading]);

  return (
    // <Sentry.ErrorBoundary fallback="An error has occurred">
    <Provider store={store}>
      <DataProvider>
        <div
          style={{
            height: loading ? '100vh' : 'inherit',
            overflow: loading ? 'hidden' : 'auto',
            display: 'inline-block',
            position: 'relative',
            maxWidth: '100%',
            verticalAlign: 'middle',
            backfaceVisibility: 'hidden',
            flex: '1 1',
            minWidth: '1px',
            boxSizing: 'border-box',
            width: '100%',
          }}
          id="main-container"
        >
          <SplashScreen loading={loading} fading={fading} />
          <RouteReadyComponent {...props} />
          <ModalsListener />
        </div>
      </DataProvider>
    </Provider>
    // </Sentry.ErrorBoundary>
  );
};

export default EntourageApp;
