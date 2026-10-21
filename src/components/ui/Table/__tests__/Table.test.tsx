import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Table } from '../Table';

describe('Table', () => {
  it('renders column headers and body rows', () => {
    render(
      <Table
        dataTestId="body"
        columns={[<th key="a">Nom</th>, <th key="b">Rôle</th>]}
        body={[
          <tr key="1">
            <td>Marie</td>
            <td>Coach</td>
          </tr>,
        ]}
      />
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByTestId('body')).toHaveTextContent('MarieCoach');
  });
});
