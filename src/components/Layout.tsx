import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/head';
import { withRouter } from 'next/router';
import Script from 'next/script';
import React from 'react';
import { HeaderConnected } from 'src/components/headers/HeaderConnected';
import { HeaderPublic } from 'src/components/headers/HeaderPublic/HeaderPublic';
import { Footer } from 'src/components/partials/Footer';
import { selectNotifications } from 'src/use-cases/notifications';
import { addPrefix } from 'src/utils';
import { useSelector } from 'react-redux';
import { NotificationsContainer } from './utils/Notification';

interface LayoutProps extends WithRouterProps {
  children: React.ReactNode;
  title?: string;
  metaTitle?: string;
  metaImage?: string;
  metaDescription?: string;
  metaUrl?: string;
  metaType?: string;
  noIndex?: boolean;
  isBackoffice?: boolean;
}

export const Layout = withRouter<LayoutProps>(
  ({
    children,
    router,
    title = 'LinkedOut\xa0= partagez votre réseau avec ceux qui n’en ont pas',
    metaTitle = 'LinkedOut\xa0= partagez votre réseau avec ceux qui n’en ont pas',
    metaImage = `${process.env.SERVER_URL}/static/img/linkedout-preview-new.jpg`,
    metaDescription = "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.",
    metaUrl = process.env.SERVER_URL,
    metaType = 'website',
    noIndex = false,
    isBackoffice = false,
  }: LayoutProps) => {
    const isPDF = router.pathname.includes('/pdf/');
    const domain =
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      process.env.SERVER_URL.replace(/https:\/\/|http:\/\//g, '');

    // const notifications = useSelector(selectNotifications)

    return (
      <>
        <Head>
          <title>{title}</title>
          <link
            rel="icon"
            type="image/png"
            href={addPrefix('/static/img/fav.png')}
          />
          <link rel="canonical" href="https://www.linkedout.fr/" />
          {isPDF && (
            // eslint-disable-next-line @next/next/no-css-tags
            <link
              rel="stylesheet"
              type="text/css"
              href="/static/css/uikit.entourage.print.min.css"
              media="print"
            />
          )}
          {noIndex && <meta name="robots" content="noindex" />}
          <meta property="og:site_name" content="LinkedOut" />
          <meta property="og:description" content={metaDescription} />
          <meta name="description" content={metaDescription} />
          <meta property="og:image" content={metaImage} />
          <meta name="image" content={metaImage} />
          <meta property="og:type" content={metaType} />
          <meta property="og:title" content={title} />
          <meta property="og:url" content={metaUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:site" content="@R_Entourage" />
          <meta name="twitter:image" content={metaImage} />
          <meta name="fb:app_id" content={process.env.FB_APP_ID} />
          <meta
            name="facebook-domain-verification"
            content={process.env.FB_DOMAIN_VERIFICATION}
          />
        </Head>
        {!isPDF && <>{isBackoffice ? <HeaderConnected /> : <HeaderPublic />}</>}
        <NotificationsContainer/>
        {children}
        {!isPDF && !isBackoffice && <Footer />}
        {!isPDF && (
          <Script
            src={`https://tarteaucitron.io/load.js?domain=${domain}&uuid=${process.env.TARTEAUCITRON_UUID}`}
            strategy="afterInteractive"
          />
        )}
      </>
    );
  }
);
