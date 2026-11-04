import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { TextInput } from '../TextInput';

const baseProps = {
  id: 'title',
  name: 'title',
  title: 'Titre',
  value: 'abc',
  onChange: jest.fn(),
};

describe('TextInput', () => {
  it('shows the hint and the counter together', () => {
    render(<TextInput {...baseProps} maxLength={10} hint="Une aide" />);
    expect(screen.getByText('Une aide')).toBeInTheDocument();
    expect(screen.getByText('7 caractère(s) restant(s)')).toBeInTheDocument();
  });

  it('shows the hint without a counter', () => {
    render(<TextInput {...baseProps} hint="Une aide" />);
    expect(screen.getByText('Une aide')).toBeInTheDocument();
  });

  it('keeps showing the error next to the hint', () => {
    render(
      <TextInput
        {...baseProps}
        hint="Une aide"
        error={{ type: 'required', message: 'Requis' }}
      />
    );
    expect(screen.getByText('Requis')).toBeInTheDocument();
    expect(screen.getByText('Une aide')).toBeInTheDocument();
  });

  it('shows no footer without hint, limit or error', () => {
    render(<TextInput {...baseProps} />);
    expect(screen.queryByText(/restant/)).not.toBeInTheDocument();
  });
});
