import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { ModalContext } from '../ModalContext';
import { HeaderModal } from '../ModalGeneric/HeaderModal';
import { ModalConfirm } from '../ModalGeneric/ModalConfirm';
import { ModalEdit } from '../ModalGeneric/ModalEdit';
import { ModalFooter } from '../ModalGeneric/ModalFooter/ModalFooter';
import { ModalGeneric } from '../ModalGeneric/ModalGeneric';
import { StepperModal } from '../ModalGeneric/StepperModal';

const mockForm = jest.fn();
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: { onCancel: () => void }) => {
    mockForm(props);
    return (
      <button type="button" onClick={props.onCancel}>
        cancel-form
      </button>
    );
  },
}));

const lastForm = () => mockForm.mock.calls[mockForm.mock.calls.length - 1][0];

const renderInModal = (ui: React.ReactElement, onClose = jest.fn()) => {
  const utils = render(
    <ModalContext.Provider value={{ onClose }}>{ui}</ModalContext.Provider>
  );
  return { onClose, ...utils };
};

beforeEach(() => {
  jest.clearAllMocks();
  Element.prototype.scrollTo = jest.fn();
});

describe('HeaderModal', () => {
  it('renders nothing without title and description', () => {
    const { container } = renderInModal(<HeaderModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows title and description with a close icon calling onClose', () => {
    const { onClose } = renderInModal(
      <HeaderModal title="Titre" description="Description" />
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the close icon when noCloseIcon is set', () => {
    renderInModal(<HeaderModal title="Titre" noCloseIcon />);
    expect(screen.queryByTestId('generic-close-modal')).toBeNull();
  });

  it('delegates closing to a custom handler, passing the context onClose', () => {
    const customOnClose = jest.fn();
    const { onClose } = renderInModal(
      <HeaderModal title="Titre" onClose={customOnClose} />
    );
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(customOnClose).toHaveBeenCalledWith(onClose);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('works with a description only', () => {
    renderInModal(<HeaderModal description="Seulement" />);
    expect(screen.getByText('Seulement')).toBeInTheDocument();
  });
});

describe('ModalFooter', () => {
  it('renders its actions', () => {
    render(
      <ModalFooter layout="end">
        <button>Ok</button>
      </ModalFooter>
    );
    expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
  });
});

describe('ModalGeneric', () => {
  it('renders header, children and footer', () => {
    renderInModal(
      <ModalGeneric title="Titre" footer={<button>Valider</button>}>
        <p>Corps</p>
      </ModalGeneric>
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Corps')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
  });

  it('has no bottom close button by default', () => {
    renderInModal(
      <ModalGeneric title="Titre">
        <p>Corps</p>
      </ModalGeneric>
    );
    // Only the header icon (aria-label "Fermer") is there, no text button.
    expect(screen.getAllByRole('button', { name: 'Fermer' })).toHaveLength(1);
    expect(screen.queryByText('Fermer')).toBeNull();
  });

  it('shows a labelled bottom close button when asked', () => {
    const { onClose } = renderInModal(
      <ModalGeneric title="Titre" withCloseButton buttonText="Compris">
        <p>Corps</p>
      </ModalGeneric>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Compris' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ModalConfirm', () => {
  it('confirms then closes', () => {
    const onConfirm = jest.fn();
    const { onClose } = renderInModal(
      <ModalConfirm
        title="Sûr ?"
        text="Vraiment"
        buttonText="Oui"
        onConfirm={onConfirm}
      >
        <p>Détails</p>
      </ModalConfirm>
    );
    expect(screen.getByText('Détails')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stays open after confirming when keepOpenOnConfirm is set', () => {
    const onConfirm = jest.fn();
    const { onClose } = renderInModal(
      <ModalConfirm buttonText="Oui" onConfirm={onConfirm} keepOpenOnConfirm />
    );
    fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('cancels without confirming', () => {
    const onConfirm = jest.fn();
    const { onClose } = renderInModal(
      <ModalConfirm buttonText="Oui" onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByTestId('modal-confirm-cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disables both buttons while loading', () => {
    const onConfirm = jest.fn();
    renderInModal(
      <ModalConfirm buttonText="Oui" onConfirm={onConfirm} isLoading />
    );
    expect(screen.getByTestId('modal-confirm-confirm')).toBeDisabled();
    expect(screen.getByTestId('modal-confirm-cancel')).toBeDisabled();
    fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('ModalEdit', () => {
  const schema = { id: 'x', fields: [] } as never;

  it('passes labels and defaults to the form', () => {
    renderInModal(
      <ModalEdit
        title="Éditer"
        formSchema={schema}
        onSubmit={jest.fn()}
        defaultValues={{ a: 1 } as never}
      />
    );
    expect(lastForm()).toMatchObject({
      submitText: 'Sauvegarder',
      cancelText: 'Annuler',
      defaultValues: { a: 1 },
      noCompulsory: false,
    });
  });

  it('calls onCancel then closes the modal when cancelling', () => {
    const onCancel = jest.fn();
    const { onClose } = renderInModal(
      <ModalEdit
        title="Éditer"
        formSchema={schema}
        onSubmit={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByText('cancel-form'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('forwards submitted fields with close and error callbacks', () => {
    const onSubmit = jest.fn();
    const { onClose } = renderInModal(
      <ModalEdit title="Éditer" formSchema={schema} onSubmit={onSubmit} />
    );
    const setError = jest.fn();
    lastForm().onSubmit({ a: 1 }, setError);
    expect(onSubmit).toHaveBeenCalledWith({ a: 1 }, onClose, setError);
  });

  it('gives a no-op close when there is no modal context', () => {
    const onSubmit = jest.fn();
    render(
      <ModalEdit title="Éditer" formSchema={schema} onSubmit={onSubmit} />
    );
    lastForm().onSubmit({}, jest.fn());
    const safeClose = onSubmit.mock.calls[0][1];
    expect(() => safeClose()).not.toThrow();
  });

  it('closes on next render when requested', () => {
    const { onClose } = renderInModal(
      <ModalEdit
        title="Éditer"
        formSchema={schema}
        onSubmit={jest.fn()}
        closeOnNextRender
      />
    );
    expect(onClose).toHaveBeenCalled();
  });
});

describe('StepperModal', () => {
  it('moves between steps and closes', () => {
    const { onClose } = renderInModal(
      <StepperModal
        title="Étapes"
        composers={[
          (close, next) => (
            <div>
              <p>Étape 1</p>
              <button onClick={next}>suivant</button>
              <button onClick={close}>fermer-1</button>
            </div>
          ),
          (close, _next, previous) => (
            <div>
              <p>Étape 2</p>
              <button onClick={previous}>précédent</button>
              <button onClick={close}>fermer-2</button>
            </div>
          ),
        ]}
      />
    );
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('suivant'));
    expect(screen.getByText('Étape 2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('précédent'));
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('suivant'));
    fireEvent.click(screen.getByText('fermer-2'));
    expect(onClose).toHaveBeenCalledTimes(1);
    // Closing rewinds the stepper to its first step.
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
  });

  it('rewinds and closes from the header close icon', () => {
    const { onClose } = renderInModal(
      <StepperModal
        title="Étapes"
        composers={[
          (_c, next) => <button onClick={next}>go</button>,
          () => <p>fin</p>,
        ]}
      />
    );
    fireEvent.click(screen.getByText('go'));
    expect(screen.getByText('fin')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('go')).toBeInTheDocument();
  });
});
