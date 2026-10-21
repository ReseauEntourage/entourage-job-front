import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ModalToggle } from './ModalToggle';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
const mockOnClose = jest.fn();
jest.mock('@/src/features/modals/Modal', () => ({
  useModalContext: () => ({ onClose: mockOnClose }),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric', () => ({
  ModalGeneric: ({ title, description, children }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('ModalToggle', () => {
  const onToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks for confirmation with the given title and description', () => {
    render(
      <ModalToggle
        id="x"
        modalTitle="Désactiver ?"
        modalDescription="Sûr ?"
        onToggle={onToggle}
      />
    );

    expect(screen.getByText('Désactiver ?')).toBeInTheDocument();
    expect(screen.getByText('Sûr ?')).toBeInTheDocument();
    expect(screen.getByText('oui')).toBeInTheDocument();
  });

  it('toggles then closes when confirmed, with a custom confirmation label', () => {
    render(
      <ModalToggle
        id="x"
        modalTitle="t"
        modalConfirmation="Désactiver"
        onToggle={onToggle}
      />
    );
    fireEvent.click(screen.getByTestId('test-confirm-x'));

    expect(screen.getByText('Désactiver')).toBeInTheDocument();
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes without toggling when cancelled', () => {
    render(<ModalToggle id="x" modalTitle="t" onToggle={onToggle} />);
    fireEvent.click(screen.getByText('Annuler'));

    expect(onToggle).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
