import React from 'react';
import { Grid } from 'src/components/utils';
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
      {items.map(({ text }, index) => {
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
                <span className="uk-text-center uk-text-bold">{text}</span>
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
                <span className="uk-text-center uk-text-bold">{text}</span>
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
