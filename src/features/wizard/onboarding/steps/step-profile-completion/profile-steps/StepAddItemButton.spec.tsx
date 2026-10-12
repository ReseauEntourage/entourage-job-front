jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import { StepAddItemButton } from './StepAddItemButton';

describe('StepAddItemButton', () => {
  it('renders the empty card with its label and help text', () => {
    render(
      <StepAddItemButton
        variant="empty"
        label="Ajouter une expérience"
        helpText="Poste, structure et dates."
        onClick={jest.fn()}
      />
    );
    expect(
      screen.getByRole('button', { name: /Ajouter une expérience/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Poste, structure et dates.')).toBeInTheDocument();
  });

  it('renders the inline row without help text', () => {
    render(
      <StepAddItemButton
        variant="inline"
        label="Ajouter une autre expérience"
        onClick={jest.fn()}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Ajouter une autre expérience' })
    ).toBeInTheDocument();
  });

  (['empty', 'inline'] as const).forEach((variant) => {
    it(`calls onClick when the ${variant} variant is clicked`, () => {
      const onClick = jest.fn();
      render(
        <StepAddItemButton
          variant={variant}
          label="Ajouter"
          onClick={onClick}
        />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
