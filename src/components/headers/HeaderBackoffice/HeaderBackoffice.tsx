import React from 'react';
import { StyledHeaderBackOffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Text, Grid } from 'src/components/utils';
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
          <Text size="large">{description}</Text>
        </div>
        <div>{children}</div>
      </Grid>
      {!noSeparator && <div className="simple-separator" />}
    </StyledHeaderBackOffice>
  );
};
