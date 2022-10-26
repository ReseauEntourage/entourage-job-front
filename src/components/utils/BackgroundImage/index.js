import React, { useEffect, useState } from 'react';
import { StyledBackground } from 'src/components/utils/BackgroundImage/styles';
import Image from 'next/image';
import { BREAKPOINTS } from 'src/constants/styles';
import PropTypes from 'prop-types';
import useWindowSize from 'src/hooks/useWindowSize';

const BackgroundImage = ({
  img,
  alt,
  children,
  imgMobile,
  mobileHeight,
  isHero,
}) => {
  const { width } = useWindowSize();
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    setIsDesktop(width >= BREAKPOINTS.desktop);
  }, [imgMobile, width]);
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
