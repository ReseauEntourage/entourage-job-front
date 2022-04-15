import React, { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Footer from 'src/components/Footer';
import Header from 'src/components/headers/Header';
import HeaderConnected from 'src/components/headers/HeaderConnected';
import { addPrefix } from 'src/utils';
import Script from 'next/script';
import CookieManager from 'src/components/CookieManager';

const Layout = ({
  children,
  title,
  metaTitle,
  metaImage,
  metaDescription,
  metaUrl,
  metaType,
  router,
  noIndex,
  isBackoffice,
}) => {
  const [cookieManagerReady, setCookieManagerReady] = useState(false);
  const isPDF = router.asPath.includes('/pdf/');
  const domain = process.env.SERVER_URL.replace(/https:\/\/|http:\/\//g, '');

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
      {!isPDF && (
        <>
          {isBackoffice ? (
            <HeaderConnected />
          ) : (
            router.asPath !== '/' && <Header isHome={false} />
          )}
        </>
      )}
      {children}
      {!isPDF && !isBackoffice && <Footer />}

      <Script
        src={`https://tarteaucitron.io/load.js?domain=${domain}&uuid=0e7dccd2edb0f870afc26ab86d989e93ef6da0a9`}
        strategy="afterInteractive"
        onLoad={() => {
          setCookieManagerReady(true);
        }}
        onError={(err) => {
          console.error(err);
        }}
      />
      {cookieManagerReady && <CookieManager />}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaImage: PropTypes.string,
  metaDescription: PropTypes.string,
  metaUrl: PropTypes.string,
  metaType: PropTypes.string,
  router: PropTypes.shape({
    asPath: PropTypes.string,
  }).isRequired,
  noIndex: PropTypes.bool,
  isBackoffice: PropTypes.bool,
};

Layout.defaultProps = {
  title: 'LinkedOut\xa0: partagez votre réseau avec ceux qui n’en ont pas',
  metaTitle: 'LinkedOut\xa0: partagez votre réseau avec ceux qui n’en ont pas',
  metaImage: `${process.env.SERVER_URL}/static/img/linkedout-preview-new.jpg`,
  metaDescription:
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.",
  metaUrl: process.env.SERVER_URL,
  metaType: 'website',
  noIndex: false,
  isBackoffice: false,
};
export default withRouter(Layout);
