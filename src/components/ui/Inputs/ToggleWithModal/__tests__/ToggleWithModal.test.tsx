import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { ToggleWithModal } from '../ToggleWithModal';

jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({ onClose: jest.fn() }),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: () => null,
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric', () => ({
  ModalGeneric: () => null,
}));

const getToggle = () => screen.getByTestId('test-toggle-x');
const openedElement = () => (openModal as jest.Mock).mock.calls[0][0];

describe('ToggleWithModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows title and subtitle', () => {
    render(
      <ToggleWithModal
        id="x"
        title="Visible"
        subtitle={<em>Détail</em>}
        isToggled={false}
        onToggle={jest.fn()}
      />
    );
    expect(screen.getByText('Visible')).toBeInTheDocument();
    expect(screen.getByText('Détail')).toBeInTheDocument();
    expect(getToggle()).not.toBeChecked();
  });

  it('toggles directly when there is no modal', async () => {
    const onToggle = jest.fn();
    render(<ToggleWithModal id="x" isToggled={false} onToggle={onToggle} />);
    fireEvent.click(getToggle());
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true));
    expect(openModal).not.toHaveBeenCalled();
  });

  it('toggles off directly even when a modal is configured', async () => {
    const onToggle = jest.fn();
    render(
      <ToggleWithModal
        id="x"
        isToggled
        modal={{ title: 'Confirmer' }}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getToggle());
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(false));
    expect(openModal).not.toHaveBeenCalled();
  });

  it('opens a custom modal element when turning on', () => {
    const onToggle = jest.fn();
    const modal = <div>Modal custom</div>;
    render(
      <ToggleWithModal
        id="x"
        isToggled={false}
        modal={modal}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getToggle());
    expect(openModal).toHaveBeenCalledWith(modal);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('opens a confirmation modal that toggles on confirmation', () => {
    const onToggle = jest.fn();
    render(
      <ToggleWithModal
        id="x"
        isToggled={false}
        modal={{ title: 'Confirmer', confirmationText: 'Valider' }}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getToggle());
    expect(openModal).toHaveBeenCalledTimes(1);
    const element = openedElement();
    expect(element.props).toEqual(
      expect.objectContaining({
        modalTitle: 'Confirmer',
        modalConfirmation: 'Valider',
        id: 'x',
      })
    );
    element.props.onToggle();
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('opens an edit modal with a form schema and submits through onToggle', async () => {
    const onToggle = jest.fn();
    render(
      <ToggleWithModal
        id="x"
        isToggled={false}
        modal={{ title: 'Edition' }}
        formSchema={{ id: 'f' } as never}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getToggle());
    const element = openedElement();
    expect(element.props.title).toBe('Edition');
    expect(element.props.submitText).toBe('oui');

    const onClose = jest.fn();
    await element.props.onSubmit({ a: 1 }, onClose);
    expect(onToggle).toHaveBeenCalledWith(true, { a: 1 }, onClose);
  });

  it('logs and swallows an error raised by onToggle in the edit modal', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onToggle = jest.fn().mockRejectedValue(new Error('boom'));
    render(
      <ToggleWithModal
        id="x"
        isToggled={false}
        modal={{ title: 'Edition' }}
        formSchema={{} as never}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getToggle());
    await expect(
      openedElement().props.onSubmit({}, jest.fn())
    ).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
