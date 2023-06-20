import PropTypes from 'prop-types';
import React from 'react';
import { Button, IconNoSSR } from 'src/components/utils';
import { addPrefix } from 'src/utils';

export const ImageTitleContent = ({ title, text, img, cta }) => {
  return (
    <>
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
        data-uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;"
        className="uk-flex uk-flex-column uk-flex-left uk-position-relative uk-width-2-3@m uk-width-1-2@xl uk-padding-large uk-padding-remove-vertical"
      >
        <h1 className="uk-text-left uk-text-bold">{title}</h1>
        {text && (
          <h4 className="uk-text-left uk-margin-remove-vertical">
            <mark className="mark-small">{text}</mark>
          </h4>
        )}
        {cta && (
          <div className="uk-flex uk-flex-wrap">
            {cta && (
              <div className="uk-flex uk-margin-small-right uk-margin-small-top">
                <Button
                  onClick={cta.onClick}
                  href={cta.href}
                  style="secondary"
                  className={`${cta.className || ''} banner-btn`}
                  newTab={cta.newTab}
                  isExternal={cta.isExternal}
                  dataTestId={cta.dataTest}
                >
                  {cta.label}&nbsp;
                  <IconNoSSR name="chevron-right" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

ImageTitleContent.propTypes = {
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

ImageTitleContent.defaultProps = {
  text: undefined,
  cta: undefined,
};
