import React from 'react';
import PropTypes from 'prop-types';
import { addPrefix } from 'src/utils';

const ImageTitle = ({ id, title, text, img, cta }) => {
  return (
    <div
      id={id}
      className="uk-background-muted uk-margin-remove uk-padding-remove "
    >
      <div
        style={{
          position: 'relative',
          height: '75vh',
        }}
        className="uk-flex uk-flex-column uk-flex-center uk-box-shadow-medium"
      >
        <div
          className="uk-background-cover uk-background-center"
          style={{
            backgroundImage: `url("${addPrefix(img)}")`,
            backgroundPosition: 'center',
            position: 'absolute',
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
          }}
        />
        <div
          uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;"
          className="uk-flex uk-flex-column uk-flex-left uk-position-relative uk-width-1-2@m uk-padding-large uk-padding-remove-vertical"
        >
          <h1
            className="uk-text-left uk-text-bold"
            style={{
              color: 'black',
              textShadow: '0px 0px 18px white',
            }}
          >
            {title}
          </h1>
          {text && (
            <h4
              className="uk-text-left uk-margin-remove-vertical"
              style={{
                color: 'black',
                textShadow: '0px 0px 18px white',
              }}
            >
              {text}
            </h4>
          )}
          {cta && <div className="uk-flex uk-margin-small-top">{cta}</div>}
        </div>
      </div>
    </div>
  );
};

ImageTitle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  img: PropTypes.string.isRequired,
  cta: PropTypes.element,
};

ImageTitle.defaultProps = {
  text: undefined,
  cta: undefined,
};

export default ImageTitle;
