import React from 'react';
import { StyledHeaderBackOffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Grid } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';

interface HeaderBackofficeProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  childrenBottom?: boolean;
  noSeparator?: boolean;
}

export const HeaderBackoffice = ({
  title,
  description,
  children,
  childrenBottom = false,
  noSeparator = false,
}: HeaderBackofficeProps) => {
  return (
    <StyledHeaderBackOffice>
      <Grid
        gap="small"
        column={childrenBottom}
        eachWidths={['expand@m', 'auto@m']}
      >
        <div>
          <H1 title={title} />
          <p className="uk-text-lead">{description}</p>
        </div>
        <div>{children}</div>
      </Grid>
      {!noSeparator && <div className="simple-separator" />}
    </StyledHeaderBackOffice>
  );
};
