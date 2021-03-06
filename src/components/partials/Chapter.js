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
  smallTitle,
}) => {
  return (
    <Section style={style}>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-overflow-hidden">
        {!smallTitle && (
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
            {title}
          </h2>
        )}
        <Grid
          childWidths={[`1-${direction !== 'column' ? '2' : '1'}@m`]}
          center
          middle
          gap="large"
          className={`uk-flex ${
            direction === 'left' ? 'uk-flex-row-reverse' : 'uk-flex-row'
          }`}
        >
          <div
            uk-scrollspy={
              animate
                ? `cls:uk-animation-slide-${
                    direction === 'left' ? 'right' : 'left'
                  }; delay: 200;`
                : ''
            }
          >
            {smallTitle && (
              <h2 className="uk-text-bold uk-text-left uk-margin-medium-bottom uk-margin-remove-top">
                {title}
              </h2>
            )}
            <p className="uk-margin-remove-top uk-margin-remove-bottom">
              {content}
            </p>
            {cta && (
              <div className="uk-flex uk-flex-center uk-margin-medium-top">
                {cta}
              </div>
            )}
          </div>
          {imgSrc && (
            <div
              className="uk-flex uk-flex-center uk-flex-middle"
              uk-scrollspy="cls:uk-animation-fade; delay: 200;"
            >
              <Img
                src={imgSrc}
                alt=""
                className="uk-height-max-large uk-box-shadow-medium uk-border-rounded"
              />
            </div>
          )}
        </Grid>
      </div>
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
  smallTitle: PropTypes.bool,
};

Chapter.defaultProps = {
  cta: undefined,
  imgSrc: undefined,
  smallTitle: false,
};
