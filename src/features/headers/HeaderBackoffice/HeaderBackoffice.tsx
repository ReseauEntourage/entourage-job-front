import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { StyledHeaderBackOffice } from './HeaderBackoffice.styles';

interface HeaderBackofficeProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  noSeparator?: boolean;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export const HeaderBackoffice = ({
  title,
  description,
  children,
  cta,
  noSeparator = false,
}: HeaderBackofficeProps) => {
  return (
    <StyledHeaderBackOffice.Container>
      <StyledHeaderBackOffice.LeftColumn>
        <H1 title={title} />
        {description && <Text size="large">{description}</Text>}
      </StyledHeaderBackOffice.LeftColumn>
      <StyledHeaderBackOffice.RightColumn>
        {cta && (
          <Button variant="secondary" onClick={cta.onClick}>
            {cta.label}
          </Button>
        )}
      </StyledHeaderBackOffice.RightColumn>
      <div>{children}</div>
      {!noSeparator && <div className="simple-separator" />}
    </StyledHeaderBackOffice.Container>
  );
};
