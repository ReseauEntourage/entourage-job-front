import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/head';
import { withRouter } from 'next/router';
import Script from 'next/script';
import React from 'react';
import { HeaderConnected } from 'src/components/headers/HeaderConnected';
import { HeaderPublic } from 'src/components/headers/HeaderPublic/HeaderPublic';
import { openModal } from 'src/components/modals/Modal';
import { EntourageProModal } from 'src/components/modals/PopupModal/EntourageProModal';
import { Footer } from 'src/components/partials/Footer';
import { NotificationsContainer } from 'src/components/utils/Notification';
import { STORAGE_KEYS } from 'src/constants';
import { useMount } from 'src/hooks/utils';
import { addPrefix } from 'src/utils';

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
    title = 'Entourage Pro\xa0= partagez votre réseau avec ceux qui n’en ont pas',
    metaTitle = 'Entourage Pro\xa0= partagez votre réseau avec ceux qui n’en ont pas',
    metaImage = `${process.env.SERVER_URL}/static/img/entourage-pro-preview.jpg`,
    metaDescription = "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec Entourage Pro, faites don de votre visibilité. Un partage peut tout changer.",
    metaUrl = process.env.SERVER_URL,
    metaType = 'website',
    noIndex = false,
    isBackoffice = false,
  }: LayoutProps) => {
    const isPDF = router.pathname.includes('/pdf/');
    const domain = process.env.SERVER_URL?.replace(/https:\/\/|http:\/\//g, '');
    useMount(() => {
      const entourageProModalClosed = localStorage.getItem(
        STORAGE_KEYS.ENTOURAGE_PRO_MODAL_CLOSED
      );
      if (!entourageProModalClosed && !isPDF) {
        setTimeout(() => {
          openModal(<EntourageProModal />);
        }, 1500);
      }
    });
    return (
      <>
        <Head>
          <title>{title}</title>
          <link
            rel="icon"
            type="image/svg+xml"
            href={addPrefix('/static/img/favicon.svg')}
          />
          <link rel="canonical" href="https://www.entourage-pro.fr/" />
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
          <meta property="og:site_name" content="Entourage Pro" />
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
        <NotificationsContainer />
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
