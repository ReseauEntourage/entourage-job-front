/* eslint-disable react/prop-types */
import UIkit from 'uikit';
import Icons from 'src/styles/dist/js/uikit-icons';

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'src/styles/styles.less';
import 'src/components/forms/Forms.less';
import 'src/components/backoffice/Toggle.less';
import 'src/components/headers/Header.less';
import 'src/components/partials/HireCTA.less';
import 'src/components/modals/Modal/Modal.less';

import React, { useEffect, useState } from 'react';
import Router from 'next/router';
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
      style={{ height: loading ? '100vh' : 'inherit' }}
      className="uk-inline uk-width-expand uk-overflow-hidden"
    >
      <SplashScreen loading={loading} fading={fading} />
      <Component {...pageProps} err={err} />
      <ModalsListener />
    </div>
  );
};

const EntourageApp = ({ Component, pageProps, err }) => {
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
