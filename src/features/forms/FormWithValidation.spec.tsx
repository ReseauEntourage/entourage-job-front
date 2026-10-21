import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { createRef } from 'react';
import { FormSchema } from './FormSchema';
import {
  FormWithValidation,
  FormWithValidationRef,
} from './FormWithValidation';

const type = (testId: string, value: string) =>
  fireEvent.change(screen.getByTestId(testId), { target: { value } });

const baseSchema = {
  id: 'f',
  fields: [
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      title: 'Nom',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'city',
      name: 'city',
      component: 'text-input',
      title: 'Ville',
      maxLength: 5,
      minLength: 2,
    },
  ],
} as unknown as FormSchema<any>;

describe('FormWithValidation', () => {
  afterEach(() => cleanup());

  it('submits the typed values when the form is valid', async () => {
    const onSubmit = jest.fn();
    render(<FormWithValidation formSchema={baseSchema} onSubmit={onSubmit} />);
    type('f-name', 'Alice');
    type('f-city', 'Lyon');
    fireEvent.click(screen.getByTestId('form-confirm-f'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Alice', city: 'Lyon' });
  });

  it('shows validation errors and calls onError instead of onSubmit', async () => {
    const onSubmit = jest.fn();
    const onError = jest.fn();
    render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={onSubmit}
        onError={onError}
      />
    );
    type('f-city', 'x');
    fireEvent.click(screen.getByTestId('form-confirm-f'));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('Obligatoire')).toBeInTheDocument();
    expect(await screen.findByText('2 caractères minimum')).toBeInTheDocument();
  });

  it('displays the error passed to the request error callback', async () => {
    const onSubmit = jest.fn((_values, cb) => cb('Serveur indisponible'));
    render(<FormWithValidation formSchema={baseSchema} onSubmit={onSubmit} />);
    type('f-name', 'Alice');
    fireEvent.click(screen.getByTestId('form-confirm-f'));
    expect(await screen.findByText('Serveur indisponible')).toBeInTheDocument();
  });

  it('shows the external error when no internal error is set', () => {
    render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={jest.fn()}
        error="Erreur externe"
      />
    );
    expect(screen.getByText('Erreur externe')).toBeInTheDocument();
  });

  it('applies default values, footer texts and cancel behaviour', () => {
    const onCancel = jest.fn();
    render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={jest.fn()}
        defaultValues={{ name: 'Bob' }}
        submitText="Valider"
        cancelText="Fermer"
        onCancel={onCancel}
        noCompulsory
      />
    );
    expect(screen.getByTestId('f-name')).toHaveValue('Bob');
    expect(screen.getByText('Valider')).toBeInTheDocument();
    expect(screen.queryByText('* : Mentions obligatoires')).toBeNull();
    fireEvent.click(screen.getByText('Fermer'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders no footer when noFooter is set', () => {
    render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={jest.fn()}
        noFooter
      />
    );
    expect(screen.queryByTestId('form-confirm-f')).toBeNull();
  });

  it('submits on Enter only when enterToSubmit is enabled', async () => {
    const onSubmit = jest.fn();
    const { rerender } = render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={onSubmit}
        defaultValues={{ name: 'Alice' }}
      />
    );
    fireEvent.keyDown(screen.getByTestId('f-name'), { key: 'Enter' });
    await act(async () => {});
    expect(onSubmit).not.toHaveBeenCalled();

    rerender(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={onSubmit}
        defaultValues={{ name: 'Alice' }}
        enterToSubmit
      />
    );
    fireEvent.keyDown(screen.getByTestId('f-name'), { key: 'Enter' });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it('exposes submit, resetForm, watch and setFieldError through the ref', async () => {
    const ref = createRef<FormWithValidationRef>();
    const onSubmit = jest.fn();
    render(
      <FormWithValidation
        formSchema={baseSchema}
        onSubmit={onSubmit}
        innerRef={ref}
        noFooter
      />
    );

    let ok: boolean | undefined;
    await act(async () => {
      ok = await ref.current!.submit();
    });
    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    type('f-name', 'Alice');
    await act(async () => {
      ok = await ref.current!.submit();
    });
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const watcher = jest.fn();
    const subscription = ref.current!.watch(watcher);
    type('f-city', 'Nice');
    expect(watcher).toHaveBeenCalled();
    subscription.unsubscribe();

    act(() => ref.current!.setFieldError('city', 'Ville invalide'));
    await waitFor(() =>
      expect(screen.getByText('Ville invalide')).toBeInTheDocument()
    );

    act(() => ref.current!.resetForm());
    await waitFor(() => expect(screen.getByTestId('f-name')).toHaveValue(''));
  });

  it('renders text, heading and react-node fields and honours hide/hidden', () => {
    const schema = {
      id: 'g',
      fields: [
        { id: 'h', name: 'h', component: 'heading', title: 'Mon titre' },
        {
          id: 't',
          name: 't',
          component: 'text',
          title: (getValue: any) => `Dyn ${String(getValue('x'))}`,
        },
        {
          id: 'n',
          name: 'n',
          component: 'react-node',
          reactNode: <span>noeud</span>,
        },
        {
          id: 'h2',
          name: 'h2',
          component: 'text',
          title: 'Caché',
          hidden: true,
        },
        {
          id: 'n2',
          name: 'n2',
          component: 'react-node',
          reactNode: <span>noeud caché</span>,
          hide: () => true,
        },
        {
          id: 'x',
          name: 'x',
          component: 'text-input',
          title: 'X',
          hidden: true,
        },
      ],
    } as unknown as FormSchema<any>;
    render(<FormWithValidation formSchema={schema} onSubmit={jest.fn()} />);
    expect(screen.getByText('Mon titre')).toBeInTheDocument();
    expect(screen.getByText('Dyn undefined')).toBeInTheDocument();
    expect(screen.getByText('noeud')).toBeInTheDocument();
    expect(screen.queryByText('Caché')).toBeNull();
    expect(screen.queryByText('noeud caché')).toBeNull();
    expect(screen.queryByTestId('g-x')).toBeNull();
  });

  it('renders a fieldgroup with visible children and skips hidden ones', () => {
    const schema = {
      id: 'g',
      fields: [
        {
          id: 'grp',
          name: 'grp',
          component: 'fieldgroup',
          fields: [
            { id: 'a', name: 'a', component: 'text-input', title: 'A' },
            { id: 'b', name: 'b', component: 'text-input', hidden: true },
            { id: 'lbl', name: 'lbl', component: 'text', title: 'Libellé' },
          ],
        },
        {
          id: 'hiddenGrp',
          name: 'hiddenGrp',
          component: 'fieldgroup',
          hidden: true,
          fields: [{ id: 'c', name: 'c', component: 'text-input' }],
        },
      ],
    } as unknown as FormSchema<any>;
    render(<FormWithValidation formSchema={schema} onSubmit={jest.fn()} />);
    expect(screen.getByTestId('g-a')).toBeInTheDocument();
    expect(screen.queryByTestId('g-b')).toBeNull();
    expect(screen.getByText('Libellé')).toBeInTheDocument();
    expect(screen.queryByTestId('g-c')).toBeNull();
  });

  it('throws for a text child whose component is not supported in a group', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const schema = {
      id: 'g',
      fields: [
        {
          id: 'grp',
          name: 'grp',
          component: 'fieldgroup',
          fields: [{ id: 'hd', name: 'hd', component: 'heading', title: 'H' }],
        },
      ],
    } as unknown as FormSchema<any>;
    expect(() =>
      render(<FormWithValidation formSchema={schema} onSubmit={jest.fn()} />)
    ).toThrow();
    spy.mockRestore();
  });

  it('throws for an unknown component', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const schema = {
      id: 'g',
      fields: [{ id: 'z', name: 'z', component: 'unknown' }],
    } as unknown as FormSchema<any>;
    expect(() =>
      render(<FormWithValidation formSchema={schema} onSubmit={jest.fn()} />)
    ).toThrow();
    spy.mockRestore();
  });

  it('lets the user add and remove rows in multiple-fields', async () => {
    const schema = {
      id: 'm',
      fields: [
        {
          id: 'items',
          name: 'items',
          component: 'multiple-fields',
          action: 'Ajouter un truc',
          fields: [
            {
              id: 'label',
              name: 'label',
              component: 'text-input',
              title: 'Label*',
            },
          ],
        },
      ],
    } as unknown as FormSchema<any>;
    const onSubmit = jest.fn();
    render(<FormWithValidation formSchema={schema} onSubmit={onSubmit} />);

    // the first empty row is added on mount
    expect(screen.getByTestId('m-items-0-label')).toBeInTheDocument();
    expect(screen.queryByTestId('m-items-1-label')).toBeNull();

    fireEvent.click(screen.getByText('Ajouter un truc'));
    expect(await screen.findByTestId('m-items-1-label')).toBeInTheDocument();

    type('m-items-0-label', 'un');
    type('m-items-1-label', 'deux');
    fireEvent.click(screen.getByTestId('form-confirm-m'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({
      items: [{ label: 'un' }, { label: 'deux' }],
    });

    // only the last row (index > 0) has a remove button
    const buttons = document.querySelectorAll('button');
    const trash = Array.from(buttons).find(
      (b) => b.querySelector('svg') && b.textContent === ''
    );
    expect(trash).toBeDefined();
    fireEvent.click(trash!);
    await waitFor(() =>
      expect(screen.queryByTestId('m-items-1-label')).toBeNull()
    );
  });

  it('wires checkbox, select-simple and textarea fields through the generic field', async () => {
    const schema = {
      id: 'k',
      fields: [
        {
          id: 'ok',
          name: 'ok',
          component: 'checkbox',
          title: 'Accepter',
          isRequired: true,
        },
        {
          id: 'color',
          name: 'color',
          component: 'select-simple',
          title: 'Couleur',
          options: [
            { value: 'r', label: 'Rouge' },
            { value: 'b', label: 'Bleu' },
          ],
        },
        {
          id: 'bio',
          name: 'bio',
          component: 'textarea',
          title: 'Bio',
          maxLength: 20,
        },
        {
          id: 'blocked',
          name: 'blocked',
          component: 'text-input',
          title: 'Bloqué',
          disable: () => true,
        },
        {
          id: 'rule',
          name: 'rule',
          component: 'text-input',
          title: 'Règle',
          rules: [{ method: (v: string) => v !== 'bad', message: 'Interdit' }],
        },
      ],
    } as unknown as FormSchema<any>;
    const onSubmit = jest.fn();
    render(<FormWithValidation formSchema={schema} onSubmit={onSubmit} />);

    expect(screen.getByTestId('k-blocked')).toBeDisabled();

    type('k-rule', 'bad');
    fireEvent.click(screen.getByTestId('form-confirm-k'));
    expect(await screen.findByText('Interdit')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    type('k-rule', 'good');
    fireEvent.click(screen.getByLabelText('Accepter'));
    fireEvent.click(screen.getByTestId('form-confirm-k'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({ ok: true, rule: 'good' })
    );
  });
});
