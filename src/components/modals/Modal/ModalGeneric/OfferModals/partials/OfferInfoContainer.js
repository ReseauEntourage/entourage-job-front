import { Grid } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon.tsx';
import PropTypes from 'prop-types';
import React from 'react';

export const OfferInfoContainer = ({ icon, title, children }) => {
  if (!children) {
    children = [];
  } else if (!children.map) {
    children = [children];
  }

  return (
    <Grid gap="small" eachWidths={['auto', 'expand']}>
      {icon ? <IconNoSSR name={icon} /> : <div className="uk-margin-left" />}
      <div>
        {title ? <span className="uk-text-bold">{title}</span> : undefined}
        <Grid gap="collapse" childWidths={['1-1']}>
          {children}
        </Grid>
      </div>
    </Grid>
  );
};

OfferInfoContainer.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    ),
  ]),
};

OfferInfoContainer.defaultProps = {
  title: undefined,
  icon: undefined,
  children: [],
};
