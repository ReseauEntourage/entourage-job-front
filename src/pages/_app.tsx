// use modified version of UIkit because of bug where we can't touch scroll on Offcanvas
// eslint-disable-next-line import/order

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'src/styles/styles.less';
import 'src/components/filters/Filters.less';
import 'src/components/modals/Modal/Modal.less';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';

import { ModalsListener } from 'src/components/modals/Modal';
import { GA_TAGS } from 'src/constants/tags';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';
import { useMount } from 'src/hooks/utils';
import * as gtag from 'src/lib/gtag';
import { gaEventWithUser } from 'src/lib/gtag';
import { DataProvider } from 'src/store/DataProvider';
import { store } from 'src/store/store';
import { selectCurrentUser } from 'src/use-cases/current-user';

/** ************
 * This component is detached because it needs Redux content to work properly
 */
const RouteReadyComponent = ({ Component, pageProps }: AppProps) => {
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      gaEventWithUser(GA_TAGS.BACKOFFICE_OPEN.action, {
        userId: currentUser.id,
        zone: currentUser.zone,
        role: currentUser.role,
      });
    }
  }, [currentUser]);

  const { isCurrentRouteReady } = useAuthentication();
  return isCurrentRouteReady ? <Component {...pageProps} /> : null;
};

const EntourageApp = (props: AppProps) => {
  const [shouldScrollToTop, setShouldScrollToTop] = useState(true);
  const { events, beforePopState } = useRouter();

  useMount(() => {
    events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
    });
  });

  useEffect(() => {
    beforePopState(() => {
      setShouldScrollToTop(false);
      return true;
    });
  }, [beforePopState]);

  useEffect(() => {
    const scrollToTop = (_url, { shallow }) => {
      if (!shallow && shouldScrollToTop) {
        setShouldScrollToTop(true);
        document?.getElementById('body')?.scrollTo(0, 0);
      }
    };
    events.on('routeChangeComplete', scrollToTop);
    return () => {
      events.off('routeChangeComplete', scrollToTop);
    };
  }, [events, shouldScrollToTop]);

  return (
    <Provider store={store}>
      <DataProvider>
        <>
          <RouteReadyComponent {...props} />
          <ModalsListener />
        </>
      </DataProvider>
    </Provider>
  );
};

export default EntourageApp;
