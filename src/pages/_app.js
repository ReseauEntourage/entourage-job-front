// use modified version of UIkit because of bug where we can't touch scroll on Offcanvas

// eslint-disable-next-line import/order
import UIkit from 'src/styles/dist/js/uikit-fixed';
// eslint-disable-next-line import/order
import Icons from 'src/styles/dist/js/uikit-icons';

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'src/styles/styles.less';
import 'src/components/filters/SearchBar.less';
import 'src/components/backoffice/Toggle.less';
import 'src/components/modals/Modal/Modal.less';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';

import * as Sentry from '@sentry/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { SplashScreen } from 'src/components/SplashScreen';
import { ModalsListener } from 'src/components/modals/Modal';
import { OFFCANVAS_GUEST, OFFCANVAS_LOGGED } from 'src/constants/utils';
import { useMount } from 'src/hooks/utils';
import * as gtag from 'src/lib/gtag';
import { DataProvider } from 'src/store/DataProvider';
import { SharesCountProvider } from 'src/store/SharesCountProvider';
import { store } from 'src/store/store';

UIkit.use(Icons);

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

// eslint-disable-next-line react/prop-types
const Container = ({ Component, pageProps, err }) => {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const { events } = useRouter();
  useMount(() => {
    events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
    });

    setTimeout(() => {
      setFading(true);
    }, 1000);
  });

  useEffect(() => {
    if (fading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [fading]);

  return (
    <div
      style={{ height: loading ? '100vh' : 'inherit' }}
      className={`uk-inline uk-width-expand ${
        loading ? 'uk-overflow-hidden' : ''
      }`}
      id="main-container"
    >
      <SplashScreen loading={loading} fading={fading} />
      <Component {...pageProps} err={err} />
      <ModalsListener />
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const EntourageApp = ({ Component, pageProps, err }) => {
  const [shouldScrollToTop, setShouldScrollToTop] = useState(true);
  const { events, beforePopState } = useRouter();

  useEffect(() => {
    beforePopState(() => {
      setShouldScrollToTop(false);
      return true;
    });
  }, [beforePopState]);

  useEffect(() => {
    const scrollToTop = (url, { shallow }) => {
      // Fix because if offcanvas is open during route change, couldn't be opened anymore
      if (UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`)) {
        UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
      }
      if (UIkit.offcanvas(`#${OFFCANVAS_GUEST}`)) {
        UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
      }

      if (!shallow && shouldScrollToTop) {
        setShouldScrollToTop(true);
        document.getElementById('main-container').scrollTo(0, 0);
      }
    };
    events.on('routeChangeComplete', scrollToTop);
    return () => {
      events.off('routeChangeComplete', scrollToTop);
    };
  }, [events, shouldScrollToTop]);

  return (
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <Provider store={store}>
        <SharesCountProvider>
          <DataProvider>
            <Container Component={Component} pageProps={pageProps} err={err} />
          </DataProvider>
        </SharesCountProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

export default EntourageApp;
