import React from 'react';
import { StyledBackground } from 'src/components/utils/BackgroundImage/BackgroundImage.styles';
import { Img } from 'src/components/utils/Img';
import { useIsDesktop } from 'src/hooks/utils';

export interface BackgroundImageProps {
  img: string;
  imgMobile: string;
  alt: string;
  children: React.ReactNode;
  mobileHeight?: number;
  isHero?: boolean;
  hasCta?: boolean;
}

export const BackgroundImage = ({
  img,
  alt,
  children,
  imgMobile,
  mobileHeight,
  isHero,
  hasCta,
}: BackgroundImageProps) => {
  const isDesktop = useIsDesktop();

  return (
    <StyledBackground
      mobileHeight={mobileHeight}
      className={isHero ? 'top-banner' : ''}
    >
      <div
        className={`banner-container ${
          imgMobile && !isDesktop ? 'mobile-banner-container' : ''
        } ${hasCta ? 'hasCta' : ''}
        `}
      >
        <div className="banner-content">{children}</div>
        <div className="banner">
          <Img src={isDesktop ? img : imgMobile || img} cover alt={alt} />
        </div>
      </div>
    </StyledBackground>
  );
};
