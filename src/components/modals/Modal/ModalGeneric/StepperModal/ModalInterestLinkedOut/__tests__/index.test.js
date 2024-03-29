/* eslint react/destructuring-assignment: 0 */
/* eslint react/prop-types: 0 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { ModalInterestLinkedOut } from '../ModalInterestLinkedOut';
import { Api } from 'src/api';
import { ModalsListener, openModal } from 'src/components/modals/Modal';
import { BREAKPOINTS } from 'src/constants/styles';

jest.mock('@react-hook/window-size', () => {
  return {
    useWindowWidth: () => BREAKPOINTS.desktop,
  };
});

jest.mock('src/components/forms/schemas/formInterestLinkedOut', () => {
  return {
    formInterestLinkedOut: {
      id: 'form-interest',
      fields: [],
    },
  };
});
jest.mock('react-modal');
jest.mock('src/api/index');
jest.mock('src/components/modals/Modal', () => {
  const modalModule = jest.requireActual('src/components/modals/Modal');
  return {
    ...modalModule,
    Modal: (props) => {
      return <div>{props.children}</div>;
    },
  };
});

describe('Modal Interest Entourage Pro', () => {
  Api.postContactContactUs.mockResolvedValue({});
  it('should render and next on submit, then close', async () => {
    const { container } = render(
      <div>
        <div
          data-testid="open-button"
          onClick={() => {
            openModal(<ModalInterestLinkedOut />);
          }}
        />
        <ModalsListener />
      </div>
    );
    expect(container).toBeDefined();

    const openBtn = screen.getByTestId('open-button');
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
    expect(openBtn).toBeDefined();

    // open
    fireEvent.click(openBtn);
    const genericModal = screen.queryByTestId('modal-generic');
    expect(genericModal).toBeInTheDocument();
    const form = screen.queryByTestId('form-with-validation');
    expect(form).toBeInTheDocument();

    // submit and next
    fireEvent.submit(form);
    await waitFor(() => {
      return expect(Api.postContactContactUs).toHaveBeenCalled();
    });
    expect(screen.getByTestId('success-modal-content'));

    // close
    fireEvent.click(screen.getByTestId('success-close-modal'));
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
  });

  it('should render and close', () => {
    const { container } = render(
      <div>
        <div
          data-testid="open-button"
          onClick={() => {
            openModal(<ModalInterestLinkedOut />);
          }}
        />
        <ModalsListener />
      </div>
    );
    expect(container).toBeDefined();

    const openBtn = screen.getByTestId('open-button');
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
    expect(openBtn).toBeDefined();

    // open
    fireEvent.click(openBtn);
    const genericModal = screen.queryByTestId('modal-generic');
    expect(genericModal).toBeInTheDocument();
    const form = screen.queryByTestId('form-with-validation');
    expect(form).toBeInTheDocument();

    // close
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(screen.queryByTestId('modal-generic')).not.toBeInTheDocument();
  });
});
