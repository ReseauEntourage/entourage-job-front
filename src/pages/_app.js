/* eslint-disable react/prop-types */

// use modified version of UIkit because of bug where we can't touch scroll on Offcanvas
import UIkit from 'src/styles/dist/js/uikit-fixed';
import Icons from 'src/styles/dist/js/uikit-icons';

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'src/styles/styles.less';
import 'src/components/forms/Forms.less';
import 'src/components/backoffice/Toggle.less';
import 'src/components/headers/Header.less';
import 'src/components/partials/HireCTA.less';
import 'src/components/modals/Modal/Modal.less';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';
import UserProvider from 'src/components/store/UserProvider';
import DataProvider from 'src/components/store/DataProvider';

import SharesCountProvider from 'src/components/store/SharesCountProvider';

import * as gtag from 'src/lib/gtag';
import SplashScreen from 'src/components/SplashScreen';
import { useMount } from 'src/hooks/utils';
import { ModalsListener } from 'src/components/modals/Modal';

UIkit.use(Icons);

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

const Container = ({ Component, pageProps, err }) => {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useMount(() => {
    Router.events.on('routeChangeComplete', (url) => {
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
      style={{ height: '100vh' }}
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

const EntourageApp = ({ Component, pageProps, err }) => {
  const { events } = useRouter();

  useEffect(() => {
    const scrollToTop = (url, { shallow }) => {
      if (!shallow) {
        document.getElementById('main-container').scrollTo(0, 0);
      }
    };
    events.on('routeChangeComplete', scrollToTop);
    return () => {
      events.off('routeChangeComplete', scrollToTop);
    };
  }, [events]);

  return (
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <SharesCountProvider>
        <DataProvider>
          <UserProvider>
            <Container Component={Component} pageProps={pageProps} err={err} />
          </UserProvider>
        </DataProvider>
      </SharesCountProvider>
    </Sentry.ErrorBoundary>
  );
};

export default EntourageApp;
