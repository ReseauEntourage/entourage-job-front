import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Alert } from '../Alert';
import { AlertType } from '../Alert.types';

describe('Alert', () => {
  it('renders the title and the children', () => {
    render(
      <Alert title="Attention" dataTestId="alert">
        Contenu du message
      </Alert>
    );
    expect(screen.getByText('Attention')).toBeInTheDocument();
    expect(screen.getByText('Contenu du message')).toBeInTheDocument();
  });

  it('shows no close button unless closable', () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose without triggering onClick when the close button is clicked', () => {
    const onClose = jest.fn();
    const onClick = jest.fn();
    render(
      <Alert closable onClose={onClose} clickable onClick={onClick}>
        Message
      </Alert>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick only when clickable', () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <Alert dataTestId="alert" onClick={onClick}>
        Message
      </Alert>
    );
    fireEvent.click(screen.getByTestId('alert'));
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Alert dataTestId="alert" onClick={onClick} clickable>
        Message
      </Alert>
    );
    fireEvent.click(screen.getByTestId('alert'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a custom icon', () => {
    render(
      <Alert type={AlertType.Error} icon={<i data-testid="custom-icon" />}>
        Erreur
      </Alert>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders no icon for types without a default icon', () => {
    const { container } = render(
      <Alert type={AlertType.Success}>Reussi</Alert>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders the default info icon for the info type', () => {
    const { container } = render(<Alert type={AlertType.Info}>Info</Alert>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
