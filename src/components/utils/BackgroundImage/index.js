import React, { useEffect, useState } from 'react';
import { StyledBackground } from 'src/components/utils/BackgroundImage/styles';
import Image from 'next/image';
import { BREAKPOINTS } from 'src/constants/styles';
import { isSSR } from 'src/utils/isSSR';
import PropTypes from 'prop-types';

const BackgroundImage = ({
  img,
  alt,
  children,
  imgMobile,
  mobileHeight,
  isHero,
}) => {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (!isSSR) {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.desktop);
    }
  }, [imgMobile]);
  return (
    <StyledBackground
      mobileHeight={mobileHeight}
      className={isHero ? 'top-banner' : ''}
    >
      <div
        className={`banner-container ${
          imgMobile && !isDesktop ? 'mobile-banner-container' : ''
        }`}
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

BackgroundImage.propTypes = {
  img: PropTypes.shape({}).isRequired,
  alt: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  imgMobile: PropTypes.oneOf(PropTypes.string, undefined),
  mobileHeight: PropTypes.oneOf(PropTypes.number, undefined),
  isHero: PropTypes.bool,
};

BackgroundImage.defaultProps = {
  imgMobile: undefined,
  mobileHeight: undefined,
  isHero: false,
};

export default BackgroundImage;
