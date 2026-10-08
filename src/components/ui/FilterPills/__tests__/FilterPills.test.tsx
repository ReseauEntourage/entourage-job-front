import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { FilterPills } from '../FilterPills';

const OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'coach', label: 'Coachs' },
  { value: 'candidate', label: 'Candidats' },
];

const renderPills = (value = 'all', onChange = jest.fn()) => {
  render(
    <FilterPills
      options={OPTIONS}
      value={value}
      onChange={onChange}
      ariaLabel="Rôle"
      idPrefix="role"
    />
  );
  return onChange;
};

describe('FilterPills', () => {
  it('is a radio group where only the checked pill is tabbable', () => {
    renderPills('coach');
    expect(
      screen.getByRole('radiogroup', { name: 'Rôle' })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Coachs' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Coachs' })).toHaveAttribute(
      'tabindex',
      '0'
    );
    expect(screen.getByRole('radio', { name: 'Tous' })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('picks a value on click', () => {
    const onChange = renderPills();
    fireEvent.click(screen.getByRole('radio', { name: 'Candidats' }));
    expect(onChange).toHaveBeenCalledWith('candidate');
  });

  it('moves the choice with the arrow keys, wrapping around', () => {
    const onChange = renderPills('all');
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('coach');
    expect(screen.getByRole('radio', { name: 'Coachs' })).toHaveFocus();
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('candidate');
  });
});
