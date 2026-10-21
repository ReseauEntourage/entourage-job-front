import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { BackLink } from '../BackLink';

const mockBack = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('BackLink', () => {
  it('goes back in the history when the label is clicked', () => {
    render(<BackLink label="Retour" />);
    fireEvent.click(screen.getByText('Retour'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
