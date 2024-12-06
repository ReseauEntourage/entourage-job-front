/* eslint react/destructuring-assignment: 0 */
/* eslint react/prop-types: 0 */
import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';
import '@testing-library/jest-dom';

import { ModalConfirm } from '../ModalConfirm';
import { ModalsListener, openModal } from 'src/components/modals/Modal';
import { BREAKPOINTS } from 'src/constants/styles';

jest.mock('@react-hook/window-size', () => {
  return {
    useWindowWidth: () => BREAKPOINTS.desktop,
  };
});

jest.mock('react-modal');

jest.mock('src/components/modals/Modal', () => {
  const modalModule = jest.requireActual('src/components/modals/Modal');
  return {
    ...modalModule,
    Modal: ({ children }) => {
      return <div>{children}</div>;
    },
  };
});

describe('Modal Confirm', () => {
  const defaultProps = {
    onConfirm: () => {},
    text: 'Confirm text',
    title: 'Confirm title',
    children: <div />,
    buttonText: 'button text',
  };

  it('should render without modal, open the modal and close on confirm', () => {
    const { container } = render(
      <div>
        <div
          data-testid="open-button"
          onClick={() => {
            openModal(<ModalConfirm {...defaultProps} />);
          }}
        />
        <ModalsListener />
      </div>
    );
    expect(container).toBeDefined();
    const openBtn = screen.getByTestId('open-button');
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
    expect(openBtn).toBeDefined();
    fireEvent.click(openBtn);
    const genericModal = screen.queryByTestId('modal-generic');
    expect(genericModal).toBeInTheDocument();
    const confirmBtn = screen.getByText(defaultProps.buttonText);
    fireEvent.click(confirmBtn);
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
  });

  it('should close on cancel button', () => {
    const { container } = render(
      <div>
        <div
          data-testid="open-button"
          onClick={() => {
            openModal(<ModalConfirm {...defaultProps} />);
          }}
        />
        <ModalsListener />
      </div>
    );
    expect(container).toBeDefined();
    const openBtn = screen.getByTestId('open-button');
    fireEvent.click(openBtn);
    const cancelBtn = screen.getByTestId('modal-confirm-cancel');
    fireEvent.click(cancelBtn);
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
  });
});
