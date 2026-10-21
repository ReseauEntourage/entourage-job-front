import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Subtitle } from '../../Subtitle/Subtitle';
import { BulletListElement } from '../BulletListElement';
import { CheckListElement } from '../CheckListElement';
import { List } from '../List';
import { WarningListElement } from '../WarningListElement';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('Lists', () => {
  it('renders every kind of element inside a list', () => {
    const { container } = render(
      <List>
        <BulletListElement>Point</BulletListElement>
        <CheckListElement>Validé</CheckListElement>
        <WarningListElement>Attention</WarningListElement>
      </List>
    );
    expect(screen.getByText('Point')).toBeInTheDocument();
    expect(screen.getByText('Validé')).toBeInTheDocument();
    expect(screen.getByText('Attention')).toBeInTheDocument();
    // Check and warning elements carry an icon
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
});

describe('Subtitle', () => {
  it('renders its text', () => {
    render(<Subtitle center>Sous-titre</Subtitle>);
    expect(screen.getByText('Sous-titre')).toBeInTheDocument();
  });
});
