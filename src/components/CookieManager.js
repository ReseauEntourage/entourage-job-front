/* eslint-disable @next/next/no-img-element */

import Script from 'next/script';
import React from 'react';

const CookieManager = () => {
  return (
    <>
      {/* Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          tarteaucitron.user.gtagUa = '${process.env.GA_TRACKING_ID}';
          tarteaucitron.user.gtagMore = function () { };
            (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
        `}
      </Script>
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
