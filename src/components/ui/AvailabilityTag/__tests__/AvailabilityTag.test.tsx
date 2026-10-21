import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { AvailabilityTag } from '../AvailabilityTag';

describe('AvailabilityTag', () => {
  it('says "Disponible" when available', () => {
    render(<AvailabilityTag isAvailable />);
    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  it('says "Indisponible" otherwise', () => {
    render(<AvailabilityTag isAvailable={false} />);
    expect(screen.getByText('Indisponible')).toBeInTheDocument();
  });

  it('calls onClick when provided', () => {
    const onClick = jest.fn();
    render(<AvailabilityTag isAvailable onClick={onClick} />);
    fireEvent.click(screen.getByText('Disponible'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
