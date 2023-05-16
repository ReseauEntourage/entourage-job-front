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
  hasCta,
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

BackgroundImage.propTypes = {
  img: PropTypes.shape({}).isRequired,
  alt: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  imgMobile: PropTypes.shape({}).isRequired,
  mobileHeight: PropTypes.number,
  isHero: PropTypes.bool,
  hasCta: PropTypes.bool,
};

BackgroundImage.defaultProps = {
  mobileHeight: undefined,
  isHero: false,
  hasCta: false,
};

export default BackgroundImage;
