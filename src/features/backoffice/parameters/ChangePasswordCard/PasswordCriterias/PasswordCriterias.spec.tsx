import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { PasswordCriterias } from './PasswordCriterias';

describe('PasswordCriterias', () => {
  it('lists the four password rules', () => {
    render(<PasswordCriterias />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(
      screen.getByText('Doit contenir au moins 8 caractères')
    ).toBeInTheDocument();
    expect(screen.getByText('Doit contenir des chiffres')).toBeInTheDocument();
    expect(
      screen.getByText(/Doit contenir des caractères spéciaux/)
    ).toBeInTheDocument();
  });

  it('can render a bare list without the styled wrapper', () => {
    const { container } = render(<PasswordCriterias bare />);
    expect(container.querySelector('ul')).toHaveStyle({ margin: '0' });
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
