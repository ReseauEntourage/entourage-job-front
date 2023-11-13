import React from 'react';

import { Grid, Section, Img } from 'src/components/utils';

interface ChapterProps {
  title: React.ReactNode;
  content: React.ReactNode;
  imgSrc?: string;
  style: 'muted' | 'default';
  direction: 'left' | 'right' | 'column';
  animate: boolean;
  cta?: React.ReactNode;
  smallTitle?: boolean;
}

export const Chapter = ({
  title,
  content,
  imgSrc,
  style,
  animate,
  direction,
  cta,
  smallTitle,
}: ChapterProps) => {
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
            data-uk-scrollspy={
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
            {cta && <div className="uk-flex uk-margin-medium-top">{cta}</div>}
          </div>
          {imgSrc && (
            <div
              className="uk-height-large uk-flex uk-flex-center uk-flex-middle uk-box-shadow-medium uk-border-rounded uk-cover-container"
              data-uk-scrollspy="cls:uk-animation-fade; delay: 200;"
            >
              <Img src={imgSrc} cover alt="" />
            </div>
          )}
        </Grid>
      </div>
    </Section>
  );
};

Chapter.defaultProps = {
  cta: undefined,
  imgSrc: undefined,
  smallTitle: false,
};
