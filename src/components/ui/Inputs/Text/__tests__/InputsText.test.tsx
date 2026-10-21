import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Text } from '../Text';

describe('Inputs Text', () => {
  it('renders the title with its id as test id', () => {
    render(<Text id="intro" title="Bienvenue" />);
    expect(screen.getByTestId('intro')).toHaveTextContent('Bienvenue');
  });
});
