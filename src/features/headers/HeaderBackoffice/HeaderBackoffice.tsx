import React from 'react';
import { Text, Grid } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { StyledHeaderBackOffice } from './HeaderBackoffice.styles';

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
