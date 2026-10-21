import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { useIsMobile } from '@/src/hooks/utils';
import { Modal } from '../Modal';
import { ModalContext, useModalContext } from '../ModalContext';
import { ModalsListener, openModal } from '../openModal';

jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));

const mockUseIsMobile = useIsMobile as jest.Mock;

const renderInContext = (ui: React.ReactElement, onClose = jest.fn()) => {
  render(
    <ModalContext.Provider value={{ onClose }}>{ui}</ModalContext.Provider>
  );
  return onClose;
};

beforeEach(() => {
  mockUseIsMobile.mockReturnValue(false);
  Element.prototype.scrollTo = jest.fn();
});

describe('Modal', () => {
  it('renders its children in a dialog', () => {
    renderInContext(
      <Modal id="my-modal" size="small">
        <p>Contenu</p>
      </Modal>
    );
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    expect(screen.getByTestId('my-modal')).toBeInTheDocument();
  });

  it('exposes the aria label as the dialog name', () => {
    renderInContext(
      <Modal id="m" size="small" ariaLabel="Ma modale">
        <p>Contenu</p>
      </Modal>
    );
    expect(
      screen.getByRole('dialog', { name: 'Ma modale' })
    ).toBeInTheDocument();
  });

  it('shows a close button only when asked, which closes the modal', () => {
    const { unmount } = render(
      <ModalContext.Provider value={{ onClose: jest.fn() }}>
        <Modal id="m" size="small">
          <p>Contenu</p>
        </Modal>
      </ModalContext.Provider>
    );
    expect(screen.queryByLabelText('Fermer')).toBeNull();
    unmount();

    const onClose = renderInContext(
      <Modal id="m" size="small" withCloseButton>
        <p>Contenu</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Fermer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = renderInContext(
      <Modal id="m" size="small">
        <p>Contenu</p>
      </Modal>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes immediately when closeOnNextRender is set', () => {
    const onClose = renderInContext(
      <Modal id="m" size="small" closeOnNextRender>
        <p>Contenu</p>
      </Modal>
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on a backdrop click on desktop', () => {
    const onClose = renderInContext(
      <Modal id="m" size="small">
        <p>Contenu</p>
      </Modal>
    );
    const overlay = document.querySelector('.ReactModal__Overlay');
    fireEvent.click(overlay as Element);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on a backdrop click on mobile', () => {
    mockUseIsMobile.mockReturnValue(true);
    const onClose = renderInContext(
      <Modal id="m" size="small" variant="sheet">
        <p>Contenu</p>
      </Modal>
    );
    fireEvent.click(document.querySelector('.ReactModal__Overlay') as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks the body scroll while open and restores it on unmount', () => {
    const { unmount } = render(
      <ModalContext.Provider value={{ onClose: jest.fn() }}>
        <Modal id="m" size="small">
          <p>Contenu</p>
        </Modal>
      </ModalContext.Provider>
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  ['small', 'medium', 'large', 'expand'].forEach((size) => {
    it(`renders with the "${size}" size`, () => {
      renderInContext(
        <Modal id="m" size={size as never} fillHeight>
          <p>Contenu</p>
        </Modal>
      );
      expect(screen.getByText('Contenu')).toBeInTheDocument();
    });
  });
});

describe('useModalContext', () => {
  const Probe = () => {
    const { onClose } = useModalContext();
    return <button onClick={onClose}>probe</button>;
  };

  it('returns the provided context', () => {
    const onClose = jest.fn();
    render(
      <ModalContext.Provider value={{ onClose }}>
        <Probe />
      </ModalContext.Provider>
    );
    fireEvent.click(screen.getByText('probe'));
    expect(onClose).toHaveBeenCalled();
  });

  it('returns an empty context outside a provider', () => {
    render(<Probe />);
    fireEvent.click(screen.getByText('probe'));
    expect(screen.getByText('probe')).toBeInTheDocument();
  });
});

describe('openModal and ModalsListener', () => {
  const Closable = ({ label }: { label: string }) => {
    const { onClose } = useModalContext();
    return (
      <div>
        <p>{label}</p>
        <button onClick={onClose}>close-{label}</button>
      </div>
    );
  };

  it('renders every opened modal and closes them independently', () => {
    render(<ModalsListener />);
    act(() => {
      openModal(<Closable label="un" />);
      openModal(<Closable label="deux" />);
    });
    expect(screen.getByText('un')).toBeInTheDocument();
    expect(screen.getByText('deux')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close-un'));
    expect(screen.queryByText('un')).toBeNull();
    expect(screen.getByText('deux')).toBeInTheDocument();
  });

  it('stops listening once unmounted', () => {
    const { unmount } = render(<ModalsListener />);
    unmount();
    expect(() => {
      openModal(<Closable label="ghost" />);
    }).not.toThrow();
    expect(screen.queryByText('ghost')).toBeNull();
  });
});
