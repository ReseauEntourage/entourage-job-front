/* eslint-disable @next/next/no-img-element */

import Script from 'next/script';
import React from 'react';
import { EXTERNAL_LINKS } from 'src/constants';

export const TAC_CDN_URL = 'https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.9.6';

const tarteaucitronOptions = {
  privacyUrl: EXTERNAL_LINKS.LEGAL_MENTIONS /* Privacy policy url */,
  bodyPosition:
    'bottom' /* or top to bring it as first element for accessibility */,

  hashtag: '#cookies' /* Open the panel with this hashtag */,
  cookieName: 'tarteaucitron' /* Cookie name */,

  orientation: 'popup' /* Banner position (top - bottom - middle - popup) */,

  groupServices: false /* Group services by category */,

  showAlertSmall: false /* Show the small banner on bottom right */,
  cookieslist: false /* Show the cookie list */,

  showIcon: false /* Show cookie icon to manage cookies */,
  // "iconSrc": "", /* Optionnal: URL or base64 encoded image */
  // iconPosition: 'BottomRight' /* Position of the icon between BottomRight, BottomLeft, TopRight and TopLeft */,

  adblocker: false /* Show a Warning if an adblocker is detected */,

  DenyAllCta: true /* Show the deny all button */,
  AcceptAllCta: true /* Show the accept all button when highPrivacy on */,
  highPrivacy: true /* HIGHLY RECOMMANDED Disable auto consent */,

  handleBrowserDNTRequest: false /* If Do Not Track == 1, disallow all */,

  removeCredit: true /* Remove credit link */,
  moreInfoLink: true /* Show more info link */,
  useExternalCss: false /* If false, the tarteaucitron.css file will be loaded */,

  // "cookieDomain": ".my-multisite-domaine.fr", /* Shared cookie for subdomain website */

  readmoreLink:
    '' /* Change the default readmore link pointing to tarteaucitron.io */,

  mandatory: true /* Show a message about mandatory cookies */,
};

const tarteaucitronCustomText = {
  alertBigPrivacy:
    'Entourage et ses partenaires utilisent des cookies afin de recueillir certaines informations stockées sur votre terminal.\n\n' +
    'Ces cookies permettent d’assurer le fonctionnement du site, de réaliser des statistiques d’audience et de fréquentation afin d’améliorer nos services et de vous proposer de la publicité personnalisée.\n\n' +
    'Entourage conserve votre choix pendant 6 mois. Vous pouvez changer d’avis à tout moment en cliquant sur le lien « Gestion des cookies » en bas de chaque page de notre site.',
  disclaimer:
    'Vous pouvez paramétrer vos choix ici concernant les cookies déposés par Entourage ou ses partenaires sur le site www.linkedout.fr.',
  mandatoryText:
    "Il s'agit des cookies nécessaires au fonctionnement du site et aux services essentiels qui en font partie intégrante. Ils vous permettent d’utiliser les principales fonctionnalités du site (par exemple, l’accès à votre compte). Ces cookies ne relèvent pas d’un choix et ne peuvent pas être refusés.",
  mandatoryTitle: 'Cookies nécessaires',
  ads: {
    title: 'Cookies de publicité personnalisée',
    details:
      'Ces cookies permettent de personnaliser votre parcours sur ce site, en y affichant des publicités et des communications commerciales personnalisées en fonction des votre navigation et de votre profil. Le refus de ces cookies n’a pas d’impact sur l’utilisation du site.',
  },
  analytic: {
    title: 'Cookies de mesure d’audience',
    details:
      'Il s’agit des cookies permettant de connaître l’utilisation, les volumes de fréquentation et d’utilisation ainsi que les performances du site. Ces cookies permettent à Entourage d’améliorer l’intérêt et la qualité des services proposés. Le refus de ces cookies n’a pas d’impact sur l’utilisation du site.',
  },
};

const tarteaucitronForceLanguage = 'fr';
const tarteaucitronExpireInDay = true;
const tarteaucitronForceExpire = 182.5;

const CookieManager = () => {
  return (
    <>
      <Script id="tarteaucitron-script" strategy="afterInteractive">
        {`
          tarteaucitronForceCDN = '${TAC_CDN_URL}';
          tarteaucitronCustomText = ${JSON.stringify(tarteaucitronCustomText)};
          tarteaucitronExpireInDay = ${tarteaucitronExpireInDay};
          tarteaucitronForceExpire = ${tarteaucitronForceExpire};
          tarteaucitronForceLanguage = '${tarteaucitronForceLanguage}';
          tarteaucitron.init(${JSON.stringify(tarteaucitronOptions)});
        `}
      </Script>
      {/* Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          tarteaucitron.user.gtagUa = '${process.env.GA_TRACKING_ID}';
          tarteaucitron.user.gtagMore = function () { };
            (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
        `}
      </Script>
      {/*  Google Tag Manager
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          tarteaucitron.user.googletagmanagerId = '${process.env.GTM_TRACKING_ID}';
          (tarteaucitron.job = tarteaucitron.job || []).push('googletagmanager');
        `}
      </Script>
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_TRACKING_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript> */}
      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-analytics" strategy="afterInteractive">
        {`
          tarteaucitron.user.linkedininsighttag = '${process.env.LINKEDIN_PARTNER_ID}';
          (tarteaucitron.job = tarteaucitron.job || []).push('linkedininsighttag');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${process.env.LINKEDIN_PARTNER_ID}&fmt=gif`}
        />
      </noscript>
      {/* Facebook Pixel */}
      <Script strategy="afterInteractive" id="facebook-analytics">
        {`
          tarteaucitron.user.facebookpixelId = '${process.env.FB_PIXEL_ID}'; tarteaucitron.user.facebookpixelMore = function () { /* add here your optionnal facebook pixel function */ };
          (tarteaucitron.job = tarteaucitron.job || []).push('facebookpixel');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${process.env.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default CookieManager;
