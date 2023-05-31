import React from 'react';
import PropTypes from 'prop-types';
import { ImageTitleContent } from './ImageTitleComponent';

export const ImageTitle = ({ id, title, text, img, cta }) => {
  const viewportMobileHeightWithoutHeader = 'calc(100vh - 80px)';
  const viewportHeightWithoutHeader = 'calc(75vh - 80px)';

  return (
    <div
      id={id}
      className="uk-background-muted uk-margin-remove uk-padding-remove "
    >
      <div
        style={{
          position: 'relative',
          height: viewportHeightWithoutHeader,
        }}
        className="uk-flex uk-flex-column uk-flex-center uk-box-shadow-medium uk-visible@m"
      >
        <ImageTitleContent title={title} text={text} img={img} cta={cta} />
      </div>
      <div
        style={{
          position: 'relative',
          height: viewportMobileHeightWithoutHeader,
        }}
        className="uk-flex uk-flex-column uk-flex-center uk-box-shadow-medium uk-hidden@m"
      >
        <ImageTitleContent title={title} text={text} img={img} cta={cta} />
      </div>
    </div>
  );
};

ImageTitle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  img: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    isExternal: PropTypes.bool,
    newTab: PropTypes.bool,
    dataTest: PropTypes.string,
  }),
};

ImageTitle.defaultProps = {
  text: undefined,
  cta: undefined,
};
