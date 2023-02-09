import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';
import { StyledHeaderBackOffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { BACKOFFICE_PAGES } from 'src/constants';
import { usePendingMembers } from './usePendingMembers';

const HeaderBackoffice = ({
  title,
  description,
  children,
  childrenBottom,
  page,
  noSeparator,
}) => {
  const { pendingMembersCount } = usePendingMembers();
  return (
    <StyledHeaderBackOffice>
      <Grid
        gap="small"
        column={childrenBottom}
        eachWidths={['expand@m', 'auto@m']}
      >
        <div>
          <h2 className="uk-text-bold">{title}</h2>
          <p className="uk-text-lead">{description}</p>
        </div>
        <div>{children}</div>
      </Grid>
      {page === 'candidates' ? (
        <div className="notif-container">
          <p>
            <div className="uk-badge uk-margin-small-left">
              {pendingMembersCount}
            </div>
            CV en attente de validation
          </p>
        </div>
      ) : (
        !noSeparator && <div className="simple-separator" />
      )}
    </StyledHeaderBackOffice>
  );
};
HeaderBackoffice.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  childrenBottom: PropTypes.bool,
  page: PropTypes.oneOf(['', ...BACKOFFICE_PAGES]),
  noSeparator: PropTypes.bool,
};
HeaderBackoffice.defaultProps = {
  children: undefined,
  childrenBottom: false,
  page: '',
  noSeparator: false,
};
export default HeaderBackoffice;
