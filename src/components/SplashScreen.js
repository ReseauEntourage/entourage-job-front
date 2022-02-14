import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Image from 'next/image';
import logo from 'public/static/img/linkedout_logo_orange_small.png';

const SplashScreen = () => {
  return (
    <div
      style={{
        height: '100vh',
        zIndex: 9999,
      }}
      className="uk-position-cover uk-background-default uk-flex uk-flex-column uk-flex-center uk-flex-middle"
    >
      <div style={{ opacity: 0 }} className="uk-animation-fade">
        <Image src={logo} alt="LinkedOut by Entourage" />
      </div>
    </div>
  );
};

SplashScreen.propTypes = {};

SplashScreen.defaultProps = {};

const SplashScreenContainer = ({ loading, fading }) => {
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
      <SplashScreen />
    </div>
  ) : null;
};

SplashScreenContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  fading: PropTypes.bool.isRequired,
};

SplashScreenContainer.defaultProps = {};

export default SplashScreenContainer;

export const SplashScreenNoSSR = dynamic(
  () => {
    return import('src/components/SplashScreen');
  },
  {
    ssr: false,
  }
);
