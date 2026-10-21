import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CloseButton } from '../CloseButton';

describe('CloseButton', () => {
  it('is an accessible button named "Fermer"', () => {
    render(<CloseButton dataTestId="close" />);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    expect(screen.getByTestId('close')).toBeInTheDocument();
  });

  it('calls onClick', () => {
    const onClick = jest.fn();
    render(<CloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
