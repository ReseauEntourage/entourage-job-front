import React from 'react';
import { Grid, Img } from 'src/components/utils';

interface TimeLineProps {
  items: {
    text: string;
    icon: string;
  }[];
}

export const Timeline = ({ items }: TimeLineProps) => {
  return (
    <Grid
      middle
      gap="small"
      center
      childWidths={['1-3@m']}
      className="uk-background-default"
    >
      {items.map(({ text, icon }, index) => {
        return (
          <div key={index}>
            <div
              data-uk-scrollspy={`cls:uk-animation-slide-right; delay: ${
                200 + index * 200
              };`}
              className="uk-margin-medium-right uk-visible@m uk-flex uk-flex-column uk-flex-middle"
            >
              <div className="ent-timeline-number">{index + 1}</div>
              <div className="ent-timeline-arrow">
                <div className="uk-flex uk-flex-middle">
                  <div className="uk-margin-small-right uk-flex uk-flex-middle uk-flex-center">
                    <Img src={icon} width={25} height={25} alt={text} />
                  </div>
                  <span className="uk-text-center uk-text-bold">{text}</span>
                </div>
              </div>
            </div>
            <div
              className="uk-hidden@m"
              data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
            >
              <div className="ent-timeline-arrow ent-timeline-arrow-mobile">
                <div className="ent-timeline-number ent-timeline-number-mobile">
                  {index + 1}
                </div>
                <span className="uk-text-center uk-text-bold uk-padding-small uk-flex uk-flex-middle uk-flex-center">
                  <div className="uk-margin-small-right uk-flex uk-flex-middle uk-flex-center">
                    <Img src={icon} width={25} height={25} alt={text} />
                  </div>
                  {text}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </Grid>
  );
};
