import React from 'react';
import PropTypes from 'prop-types';
import { addPrefix } from 'src/utils';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const ImageTitleContent = ({ title, text, img, cta, secondCta }) => {
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
        uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;"
        className="uk-flex uk-flex-column uk-flex-left uk-position-relative uk-width-1-2@m uk-padding-large uk-padding-remove-vertical"
      >
        <h1 className="uk-text-left uk-text-bold">{title}</h1>
        {text && (
          <h4 className="uk-text-left uk-margin-remove-vertical">
            <mark className="mark-small">{text}</mark>
          </h4>
        )}
        {(cta || secondCta) && (
          <div className="uk-flex uk-flex-wrap">
            {cta && (
              <div className="uk-flex uk-margin-small-right uk-margin-small-top">
                <Button
                  onClick={cta.onClick}
                  href={cta.href}
                  style="secondary"
                  className={cta.className}
                  newTab={cta.newTab}
                  isExternal={cta.isExternal}
                >
                  {cta.label}&nbsp;
                  <IconNoSSR name="chevron-right" />
                </Button>
              </div>
            )}
            {secondCta && (
              <div className="uk-flex uk-light uk-margin-small-top ">
                <Button
                  onClick={secondCta.onClick}
                  href={secondCta.href}
                  style="secondary"
                  className={secondCta.className}
                  newTab={secondCta.newTab}
                  isExternal={secondCta.isExternal}
                >
                  {secondCta.label}&nbsp;
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
  }),
  secondCta: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    isExternal: PropTypes.bool,
    newTab: PropTypes.bool,
  }),
};

ImageTitleContent.defaultProps = {
  text: undefined,
  cta: undefined,
  secondCta: undefined,
};

const ImageTitle = ({ id, title, text, img, cta, secondCta }) => {
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
        <ImageTitleContent
          title={title}
          text={text}
          img={img}
          cta={cta}
          secondCta={secondCta}
        />
      </div>
      <div
        style={{
          position: 'relative',
          height: viewportMobileHeightWithoutHeader,
        }}
        className="uk-flex uk-flex-column uk-flex-center uk-box-shadow-medium uk-hidden@m"
      >
        <ImageTitleContent
          title={title}
          text={text}
          img={img}
          cta={cta}
          secondCta={secondCta}
        />
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
  }),
  secondCta: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    isExternal: PropTypes.bool,
    newTab: PropTypes.bool,
  }),
};

ImageTitle.defaultProps = {
  text: undefined,
  cta: undefined,
  secondCta: undefined,
};

export default ImageTitle;
