// Every input is stubbed: this spec checks how GenericField maps a schema
// field onto the matching input (props, change handling, validation rules).
jest.mock('@/src/components/ui/Inputs', () => {
  const stub = (kind: string) => {
    const Stub = (props: any) => (
      <div data-testid={`stub-${kind}`}>
        <span data-testid={`${kind}-title`}>{String(props.title ?? '')}</span>
        <span data-testid={`${kind}-error`}>{props.error?.message ?? ''}</span>
        <span data-testid={`${kind}-hidden`}>{String(!!props.hidden)}</span>
        <span data-testid={`${kind}-disabled`}>{String(!!props.disabled)}</span>
        <span data-testid={`${kind}-options`}>
          {JSON.stringify(props.options ?? null)}
        </span>
        <span data-testid={`${kind}-multi`}>{String(props.isMulti)}</span>
        <span data-testid={`${kind}-disabledOptions`}>
          {JSON.stringify(props.optionsToDisable ?? null)}
        </span>
        <span data-testid={`${kind}-filter`}>{String(props.filter)}</span>
        <button
          data-testid={`${kind}-change`}
          onClick={() => props.onChange((globalThis as any).__nextValue)}
        />
        <button
          data-testid={`${kind}-load`}
          onClick={() =>
            props.loadOptions &&
            props.loadOptions((globalThis as any).__cb, 'query')
          }
        />
        <button
          data-testid={`${kind}-maxlines`}
          onClick={() => props.setIsMaxLinesReached?.(true)}
        />
      </div>
    );
    return Stub;
  };
  return {
    CheckBox: stub('checkbox'),
    DatePicker: stub('datepicker'),
    PhoneInput: stub('tel'),
    Radio: stub('radio'),
    RadioAsync: stub('radio-async'),
    Select: stub('select'),
    SelectAsync: stub('select-async'),
    SelectCreatable: stub('select-creatable'),
    SelectSimple: stub('select-simple'),
    TextArea: stub('textarea'),
    TextInput: stub('text'),
    FileInput: stub('file'),
  };
});
jest.mock('@/src/components/ui/Inputs/SelectList', () => {
  const stub = (kind: string) => {
    const Stub = (props: any) => (
      <div data-testid={`stub-${kind}`}>
        <span data-testid={`${kind}-options`}>
          {JSON.stringify(props.options ?? null)}
        </span>
        <button
          data-testid={`${kind}-load`}
          onClick={() => props.loadOptions((globalThis as any).__cb)}
        />
      </div>
    );
    return Stub;
  };
  return {
    SelectList: stub('select-list'),
    SelectListAsync: stub('select-list-async'),
  };
});

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
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema } from '../FormSchema';
import { GenericField } from './GenericField';

const schema = { id: 'frm', fields: [] } as unknown as FormSchema<any>;

let latestForm: ReturnType<typeof useForm<any>>;

function Harness({
  field,
  fieldOptions,
  updateFieldOptions,
  showError,
  defaultValues,
  resetFieldSpy,
}: {
  field: any;
  fieldOptions?: any;
  updateFieldOptions?: any;
  showError?: boolean;
  defaultValues?: any;
  resetFieldSpy?: jest.Mock;
}) {
  const form = useForm<any>({ defaultValues });
  latestForm = form;
  return (
    <GenericField
      formSchema={schema}
      field={field}
      control={form.control}
      resetField={resetFieldSpy ?? form.resetField}
      watch={form.watch}
      getValue={form.getValues}
      fieldOptions={fieldOptions}
      updateFieldOptions={updateFieldOptions}
      showError={showError}
    />
  );
}

const setNext = (v: unknown) => {
  (globalThis as any).__nextValue = v;
};

describe('GenericField', () => {
  beforeEach(() => {
    (globalThis as any).__cb = jest.fn();
    setNext('new');
  });
  afterEach(() => cleanup());

  [
    ['datepicker', 'datepicker'],
    ['text-input', 'text'],
    ['tel-input', 'tel'],
    ['textarea', 'textarea'],
    ['checkbox', 'checkbox'],
    ['file-input', 'file'],
    ['select-simple', 'select-simple'],
    ['select', 'select'],
    ['select-creatable', 'select-creatable'],
    ['select-async', 'select-async'],
    ['select-list', 'select-list'],
    ['select-list-async', 'select-list-async'],
    ['radio', 'radio'],
    ['radio-async', 'radio-async'],
  ].forEach(([component, kind]) => {
    it(`renders the ${component} input`, () => {
      render(
        <Harness
          field={{
            id: 'f',
            name: 'f',
            component,
            title: 'Titre',
            isMulti: false,
            options: [{ value: 'a', label: 'A' }],
          }}
        />
      );
      expect(screen.getByTestId(`stub-${kind}`)).toBeInTheDocument();
    });
  });

  it('wraps the checkbox-alert in an alert', () => {
    render(
      <Harness
        field={{ id: 'f', name: 'f', component: 'checkbox-alert', title: 'T' }}
      />
    );
    expect(screen.getByTestId('stub-checkbox')).toBeInTheDocument();
  });

  it('throws for an unknown component', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Harness field={{ id: 'f', name: 'f', component: 'nope' }} />)
    ).toThrow();
    spy.mockRestore();
  });

  it('resolves function titles, disabled and hidden flags from the form values', () => {
    render(
      <Harness
        defaultValues={{ other: 'x' }}
        field={{
          id: 'f',
          name: 'f',
          component: 'text-input',
          title: (getValue: any) => `Titre ${getValue('other')}`,
          disable: (getValue: any) => getValue('other') === 'x',
          hide: () => false,
        }}
      />
    );
    expect(screen.getByTestId('text-title')).toHaveTextContent('Titre x');
    expect(screen.getByTestId('text-disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('text-hidden')).toHaveTextContent('false');
  });

  it('writes the changed value into the form', () => {
    render(<Harness field={{ id: 'f', name: 'f', component: 'text-input' }} />);
    fireEvent.click(screen.getByTestId('text-change'));
    expect(latestForm.getValues('f')).toBe('new');
  });

  it('resets the dependent fields when a select changes', () => {
    const resetFieldSpy = jest.fn();
    render(
      <Harness
        resetFieldSpy={resetFieldSpy}
        field={{
          id: 'f',
          name: 'f',
          component: 'select',
          isMulti: false,
          options: [],
          fieldsToReset: ['child', 'other'],
        }}
      />
    );
    fireEvent.click(screen.getByTestId('select-change'));
    expect(resetFieldSpy).toHaveBeenCalledWith('child', {
      defaultValue: undefined,
    });
    expect(resetFieldSpy).toHaveBeenCalledWith('other', {
      defaultValue: undefined,
    });
    expect(latestForm.getValues('f')).toBe('new');
  });

  it('shows the required error and hides it when showError is false', async () => {
    const field = {
      id: 'f',
      name: 'f',
      component: 'text-input',
      isRequired: true,
    };
    const { rerender } = render(<Harness field={field} />);
    await act(async () => {
      await latestForm.trigger();
    });
    expect(screen.getByTestId('text-error')).toHaveTextContent('Obligatoire');
    rerender(<Harness field={field} showError={false} />);
    expect(screen.getByTestId('text-error')).toHaveTextContent('');
  });

  it('refuses an unfinished or impossible date before the schema rules', async () => {
    const rule = jest.fn(() => true);
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'datepicker',
          rules: [{ method: rule, message: 'rule' }],
        }}
      />
    );
    setNext('14/03');
    fireEvent.click(screen.getByTestId('datepicker-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    await waitFor(() =>
      expect(screen.getByTestId('datepicker-error')).toHaveTextContent(
        "Date incomplète. Saisissez le jour, le mois et l'année."
      )
    );
    expect(rule).not.toHaveBeenCalled();

    setNext('31/02/1990');
    fireEvent.click(screen.getByTestId('datepicker-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    await waitFor(() =>
      expect(screen.getByTestId('datepicker-error')).toHaveTextContent(
        "Cette date n'existe pas. Vérifiez le jour et le mois."
      )
    );
  });

  it('accepts a real date and an empty optional date', async () => {
    render(<Harness field={{ id: 'f', name: 'f', component: 'datepicker' }} />);
    setNext('1990-02-28');
    fireEvent.click(screen.getByTestId('datepicker-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    expect(screen.getByTestId('datepicker-error')).toHaveTextContent('');
    setNext('');
    fireEvent.click(screen.getByTestId('datepicker-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    expect(screen.getByTestId('datepicker-error')).toHaveTextContent('');
  });

  it('validates the maximum number of lines reported by the textarea', async () => {
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'textarea',
          maxLines: { lines: 2, width: 10 },
        }}
      />
    );
    fireEvent.click(screen.getByTestId('textarea-maxlines'));
    await act(async () => {
      await latestForm.trigger();
    });
    await waitFor(() =>
      expect(screen.getByTestId('textarea-error')).toHaveTextContent(
        'Vous avez dépassé le nombre de lignes maximum'
      )
    );
  });

  it('validates the maximum number of selected items', async () => {
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-creatable',
          isMulti: true,
          maxItems: 1,
        }}
      />
    );
    setNext([{ value: 'a' }, { value: 'b' }]);
    fireEvent.click(screen.getByTestId('select-creatable-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    await waitFor(() =>
      expect(screen.getByTestId('select-creatable-error')).toHaveTextContent(
        "Vous avez dépassé le nombre d'élements maximum"
      )
    );
    setNext([{ value: 'a' }]);
    fireEvent.click(screen.getByTestId('select-creatable-change'));
    await act(async () => {
      await latestForm.trigger();
    });
    await waitFor(() =>
      expect(screen.getByTestId('select-creatable-error')).toHaveTextContent('')
    );
  });

  it('passes static, function and default options to select inputs', () => {
    const { rerender } = render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select',
          isMulti: () => true,
          options: (getValue: any) => [{ value: getValue('k') ?? 'dyn' }],
        }}
      />
    );
    expect(screen.getByTestId('select-multi')).toHaveTextContent('true');
    expect(screen.getByTestId('select-options')).toHaveTextContent(
      '[{"value":"dyn"}]'
    );
    rerender(
      <Harness
        field={{ id: 'f', name: 'f', component: 'select', isMulti: false }}
      />
    );
    expect(screen.getByTestId('select-options')).toHaveTextContent('[]');
  });

  it('delegates loadOptions for select-creatable and select-async', async () => {
    const loadOptions = jest.fn();
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-async',
          isMulti: false,
          loadOptions,
        }}
      />
    );
    fireEvent.click(screen.getByTestId('select-async-load'));
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
    expect(loadOptions).toHaveBeenCalledWith(
      (globalThis as any).__cb,
      'query',
      expect.any(Function)
    );
  });

  it('only gives select-creatable a loader when the field defines one', () => {
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-creatable',
          isMulti: false,
        }}
      />
    );
    fireEvent.click(screen.getByTestId('select-creatable-load'));
    expect((globalThis as any).__cb).not.toHaveBeenCalled();
  });

  it('computes select-list options and loads async options', async () => {
    const loadOptions = jest.fn();
    const { unmount } = render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-list',
          isMulti: false,
          options: () => [{ value: 'z', label: 'Z' }],
        }}
      />
    );
    expect(screen.getByTestId('select-list-options')).toHaveTextContent(
      '[{"value":"z","label":"Z"}]'
    );
    unmount();

    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-list-async',
          isMulti: false,
          loadOptions,
        }}
      />
    );
    fireEvent.click(screen.getByTestId('select-list-async-load'));
    await waitFor(() =>
      expect(loadOptions).toHaveBeenCalledWith((globalThis as any).__cb)
    );
  });

  it('does not fail when a select-list-async has no loader', async () => {
    render(
      <Harness
        field={{
          id: 'f',
          name: 'f',
          component: 'select-list-async',
          isMulti: false,
        }}
      />
    );
    fireEvent.click(screen.getByTestId('select-list-async-load'));
    await act(async () => {});
    expect((globalThis as any).__cb).not.toHaveBeenCalled();
  });

  it('passes radio options, disabled options, filter and hide with field options', () => {
    render(
      <Harness
        fieldOptions={{ f: [1] }}
        field={{
          id: 'f',
          name: 'f',
          component: 'radio',
          options: [{ value: 'a' }],
          subtitle: 'Sous-titre',
          optionsToDisable: () => [{ option: 'a', message: 'no' }],
          dynamicFilter: () => 'filtre',
          hide: (_g: any, opts: any) => opts?.f?.length === 1,
        }}
      />
    );
    expect(screen.getByTestId('radio-options')).toHaveTextContent(
      '[{"value":"a"}]'
    );
    expect(screen.getByTestId('radio-disabledOptions')).toHaveTextContent(
      '[{"option":"a","message":"no"}]'
    );
    expect(screen.getByTestId('radio-filter')).toHaveTextContent('filtre');
    expect(screen.getByTestId('radio-hidden')).toHaveTextContent('true');
  });

  it('records the loaded radio-async options through updateFieldOptions', async () => {
    const updateFieldOptions = jest.fn();
    const loadOptions = jest.fn((cb) => cb([{ value: 'r' }]));
    render(
      <Harness
        updateFieldOptions={updateFieldOptions}
        field={{
          id: 'rad',
          name: 'rad',
          component: 'radio-async',
          loadOptions,
          dynamicFilter: () => 'flt',
        }}
      />
    );
    expect(screen.getByTestId('radio-async-filter')).toHaveTextContent('flt');
    fireEvent.click(screen.getByTestId('radio-async-load'));
    await waitFor(() =>
      expect(updateFieldOptions).toHaveBeenCalledWith({
        rad: [{ value: 'r' }],
      })
    );
    expect((globalThis as any).__cb).toHaveBeenCalledWith([{ value: 'r' }]);
  });
});
