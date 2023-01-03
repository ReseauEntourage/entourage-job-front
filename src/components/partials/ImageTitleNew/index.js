import React from 'react';
import { StyledImageTitle } from 'src/components/partials/ImageTitleNew/styles';
import BackgroundImage from 'src/components/utils/BackgroundImage';
import { Container } from 'src/components/utils/containers';
import { PropTypes } from 'prop-types';

const ImageTitle = ({ title, description, img, imgMobile, alt }) => {
  return (
    <BackgroundImage img={img} imgMobile={imgMobile} alt={alt} isHero>
      <Container>
        <StyledImageTitle>
          <h1 data-uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;">
            {title}
          </h1>
          <p data-uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;">
            {description}
          </p>
        </StyledImageTitle>
      </Container>
    </BackgroundImage>
  );
};

ImageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  imgMobile: PropTypes.oneOf(PropTypes.string, undefined),
  alt: PropTypes.string,
};

ImageTitle.defaultProps = {
  imgMobile: undefined,
  alt: '',
};

export default ImageTitle;
