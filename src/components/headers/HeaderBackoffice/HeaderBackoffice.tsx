import React from 'react';
import { StyledHeaderBackOffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Grid } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { usePendingMembers } from './usePendingMembers';

interface HeaderBackofficeProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  childrenBottom?: boolean;
  shouldDisplayAdminNotifications?: boolean;
  noSeparator?: boolean;
}

export const HeaderBackoffice = ({
  title,
  description,
  children,
  childrenBottom = false,
  shouldDisplayAdminNotifications = false,
  noSeparator = false,
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
      {shouldDisplayAdminNotifications ? (
        <div className="notif-container">
          <p>
            <Tag size="small" style="secondary" content={pendingMembersCount} />
            &nbsp; CV en attente de validation
          </p>
        </div>
      ) : (
        !noSeparator && <div className="simple-separator" />
      )}
    </StyledHeaderBackOffice>
  );
};
