import React from 'react';
import { StyledHeaderBackOffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Grid } from 'src/components/utils';
import { BACKOFFICE_PAGES } from 'src/constants';
import { usePendingMembers } from './usePendingMembers';

interface HeaderBackofficeProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  childrenBottom?: boolean;
  page?: (typeof BACKOFFICE_PAGES)[keyof typeof BACKOFFICE_PAGES];
  noSeparator?: boolean;
}

const HeaderBackoffice = ({
  title,
  description,
  children,
  childrenBottom,
  page,
  noSeparator,
}: HeaderBackofficeProps) => {
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
      {page === BACKOFFICE_PAGES.CANDIDATES ? (
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

HeaderBackoffice.defaultProps = {
  children: undefined,
  childrenBottom: false,
  page: '',
  noSeparator: false,
};
export default HeaderBackoffice;
