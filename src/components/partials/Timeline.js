import React from 'react';
import { Grid, Img } from 'src/components/utils';
import PropTypes from 'prop-types';

const Timeline = ({ items }) => {
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
              uk-scrollspy={`cls:uk-animation-slide-right; delay: ${
                200 + index * 200
              };`}
              className="uk-margin-medium-right uk-visible@m uk-flex uk-flex-column uk-flex-middle"
            >
              <div className="ent-timeline-number">{index + 1}</div>
              <div className="ent-timeline-arrow">
                <div className="uk-flex uk-flex-middle">
                  <Img
                    src={icon}
                    width="25x"
                    height="25px"
                    alt={text}
                    className="uk-margin-small-right"
                  />
                  <span className="uk-text-center uk-text-bold">{text}</span>
                </div>
              </div>
            </div>
            <div
              className="uk-hidden@m"
              uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
            >
              <div className="ent-timeline-arrow ent-timeline-arrow-mobile">
                <div className="ent-timeline-number ent-timeline-number-mobile">
                  {index + 1}
                </div>
                <span className="uk-text-center uk-text-bold uk-padding-small uk-flex uk-flex-middle uk-flex-center">
                  <Img
                    src={icon}
                    width="25x"
                    height="25px"
                    alt={text}
                    className="uk-margin-small-right"
                  />
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

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    })
  ).isRequired,
};

export default Timeline;
