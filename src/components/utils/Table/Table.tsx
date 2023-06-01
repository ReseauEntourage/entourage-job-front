import React from 'react';
import { StyledTable } from 'src/components/utils/Table/Table.styles';
import { useIsMobile } from 'src/hooks/utils';

interface TableProps {
  columns: JSX.Element[];
  body: JSX.Element[];
  dataTestId: string;
}

export function Table({ columns, body, dataTestId }: TableProps) {
  const isMobile = useIsMobile();

  return (
    <StyledTable isMobile={isMobile}>
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody data-testid={dataTestId}>{body}</tbody>
    </StyledTable>
  );
}
