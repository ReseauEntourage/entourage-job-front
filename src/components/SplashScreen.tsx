import { useRouter } from 'next/router';
import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';

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
        <EntourageProLogoPrimary width={300} height={300} />
      </div>
    </div>
  );
};

export const SplashScreen = ({
  loading,
  fading,
}: {
  loading: boolean;
  fading: boolean;
}) => {
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
