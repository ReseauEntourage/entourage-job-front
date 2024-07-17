import { useRouter } from 'next/router';
import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import {
  StyledSplashScreenContainer,
  SplashScreenProps,
} from './SplashScreen.styles';

export const SplashScreen = ({ loading, fading }: SplashScreenProps) => {
  const { asPath } = useRouter();

  return !asPath.includes('/pdf/') ? (
    <StyledSplashScreenContainer
      loading={loading}
      fading={fading} // fading was used for uk-animation-fade
    >
      <EntourageProLogoPrimary width={300} height={300} />
    </StyledSplashScreenContainer>
  ) : null;
};
