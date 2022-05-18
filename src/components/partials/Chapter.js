import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Section, Img } from 'src/components/utils';

export const Chapter = ({
  title,
  content,
  imgSrc,
  style,
  animate,
  direction,
  cta,
}) => {
  return (
    <Section
      container={direction !== 'column' ? 'large' : 'small'}
      style={style}
    >
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          {title}
        </h2>
        <Grid
          childWidths={[`1-${direction !== 'column' ? '2' : '1'}@m`]}
          center
          middle
          gap="large"
          className={`uk-flex ${
            direction === 'left' ? 'uk-flex-row-reverse' : 'uk-flex-row'
          }`}
        >
          <h4 className="uk-margin-remove-top">{content}</h4>
          {imgSrc && (
            <div className="uk-overflow-hidden uk-flex uk-flex-center uk-flex-middle">
              {animate ? (
                <div uk-scrollspy="cls: uk-animation-kenburns; delay: 200; target: > img;">
                  <Img
                    src={imgSrc}
                    width=""
                    height="600px"
                    alt=""
                    className="uk-animation-reverse uk-height-max-large"
                  />
                </div>
              ) : (
                <Img
                  src={imgSrc}
                  width=""
                  height="600px"
                  alt=""
                  className="uk-height-max-large"
                />
              )}
            </div>
          )}
        </Grid>
      </div>
      {cta && (
        <div className="uk-flex uk-flex-center uk-margin-small-top">{cta}</div>
      )}
    </Section>
  );
};

Chapter.propTypes = {
  title: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  imgSrc: PropTypes.string,
  style: PropTypes.oneOf(['muted', 'default']).isRequired,
  direction: PropTypes.oneOf(['left', 'right', 'column']).isRequired,
  animate: PropTypes.bool.isRequired,
  cta: PropTypes.element,
};

Chapter.defaultProps = {
  cta: undefined,
  imgSrc: undefined,
};
