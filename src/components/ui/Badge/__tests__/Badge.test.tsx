import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Badge, BadgeVariant } from '../Badge';

describe('Badge', () => {
  it('renders its content and test id', () => {
    render(
      <Badge variant={BadgeVariant.Primary} dataTestId="badge">
        Nouveau
      </Badge>
    );
    expect(screen.getByTestId('badge')).toHaveTextContent('Nouveau');
  });

  it('calls onClick when provided', () => {
    const onClick = jest.fn();
    render(
      <Badge variant={BadgeVariant.Orange} onClick={onClick}>
        Cliquable
      </Badge>
    );
    fireEvent.click(screen.getByText('Cliquable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicked without onClick', () => {
    render(<Badge variant={BadgeVariant.Highlight}>Statique</Badge>);
    expect(() => fireEvent.click(screen.getByText('Statique'))).not.toThrow();
  });
});
