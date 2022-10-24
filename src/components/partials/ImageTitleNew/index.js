import React from 'react';
import { StyledImageTitle } from 'src/components/partials/ImageTitleNew/styles';
import BackgroundImage from 'src/components/utils/BackgroundImage';
import { Container } from 'src/components/utils/containers';
import { PropTypes } from 'prop-types';

const ImageTitle = ({ title, description, img, imgMobile }) => {
  return (
    <BackgroundImage img={img} imgMobile={imgMobile} alt="aider linkedout">
      <Container>
        <StyledImageTitle>
          <h1>{title}</h1>
          <p>{description}</p>
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
};

ImageTitle.defaultProps = {
  imgMobile: undefined,
};

export default ImageTitle;
