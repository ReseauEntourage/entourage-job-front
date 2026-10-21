import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ProgramEligibilityAlert } from '../ProgramEligibilityAlert';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('ProgramEligibilityAlert', () => {
  it('reminds the eligibility criteria', () => {
    render(<ProgramEligibilityAlert />);
    expect(screen.getByText('Rappel des critères')).toBeInTheDocument();
    expect(
      screen.getByText(/Entourage Pro s'adresse aux personnes/)
    ).toBeInTheDocument();
  });
});
