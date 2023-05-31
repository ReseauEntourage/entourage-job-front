import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { ImgNoSSR } from 'src/components/utils/Img.tsx';

const SplashScreenContent = () => {
  return (
    <div
      style={{
        height: '100vh',
        zIndex: 9999,
      }}
      className="uk-position-cover uk-background-default uk-flex uk-flex-column uk-flex-center uk-flex-middle"
    >
      <div
        style={{ opacity: 0 }}
        className="uk-animation-fade uk-animation-fast"
      >
        <ImgNoSSR
          src="/static/img/linkedout_logo_orange_small.png"
          alt="LinkedOut by Entourage"
          className="uk-width-medium uk-margin-medium-bottom"
        />
      </div>
    </div>
  );
};

export const SplashScreen = ({ loading, fading }) => {
  const { asPath } = useRouter();

  return !asPath.includes('/pdf/') ? (
    <div
      style={{
        height: '100vh',
        zIndex: 9999,
      }}
      className={`${loading ? 'uk-visible' : 'uk-hidden'} ${
        fading ? 'uk-animation-fade uk-animation-reverse' : ''
      } uk-position-cover uk-background-default`}
    >
      <SplashScreenContent />
    </div>
  ) : null;
};

SplashScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  fading: PropTypes.bool.isRequired,
};

export const SplashScreenNoSSR = dynamic(
  () => {
    return import('src/components/SplashScreen').then((mod) => {
      return mod.SplashScreenContainer;
    });
  },
  {
    ssr: false,
  }
);
