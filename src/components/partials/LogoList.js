import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Carousel, Logo } from 'src/components/utils';

export const LogoList = ({ logos, carousel, padding, background }) => {
  const logosPerLine = Math.floor(logos.length / 3 + 1);

  if (carousel) {
    return (
      <Carousel
        containerClasses="uk-child-width-auto"
        pagination={false}
        padding={padding}
      >
        {logos.map(({ key, link, bis }) => {
          return (
            <div
              key={key}
              className="uk-margin-medium-left uk-margin-medium-right"
            >
              <Logo logoKey={key} link={link} bis={bis} />
            </div>
          );
        })}
      </Carousel>
    );
  }
  return (
    <div
      className={`${
        background ? 'uk-background-default' : ''
      } uk-border-rounded ${padding ? 'uk-padding-small' : ''}`}
    >
      <Grid
        childWidths={[`1-${logosPerLine <= 3 ? 3 : logosPerLine}@m`, 'auto']}
        match
        middle
        center
        gap="small"
        items={logos.map(({ key, link, bis }) => {
          return <Logo key={key} logoKey={key} link={link} bis={bis} />;
        })}
      />
    </div>
  );
};

LogoList.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      bis: PropTypes.bool,
    })
  ).isRequired,
  carousel: PropTypes.bool,
  padding: PropTypes.bool,
  background: PropTypes.bool,
};

LogoList.defaultProps = {
  carousel: false,
  padding: false,
  background: false,
};
