import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { StyledBackground } from 'src/components/utils/BackgroundImage/BackgroundImage.styles';
import { useIsDesktop } from 'src/hooks/utils';

interface BackgroundImageProps {
  img: string | StaticImageData;
  alt: string;
  children: React.ReactNode;
  imgMobile: string | StaticImageData;
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
          {isDesktop ? (
            <Image
              src={img}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              alt={alt}
            />
          ) : (
            <Image
              src={imgMobile || img}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              alt={alt}
            />
          )}
        </div>
      </div>
    </StyledBackground>
  );
};

BackgroundImage.defaultProps = {
  mobileHeight: undefined,
  isHero: false,
  hasCta: false,
};
