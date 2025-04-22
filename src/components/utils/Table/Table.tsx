import React, { type JSX } from 'react';
import { StyledTable } from 'src/components/utils/Table/Table.styles';

interface TableProps {
  columns: JSX.Element[];
  body: JSX.Element[];
  dataTestId?: string;
}

export function Table({ columns, body, dataTestId }: TableProps) {
  return (
    <StyledTable>
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody data-testid={dataTestId}>{body}</tbody>
    </StyledTable>
  );
}
