const mockGenericField = jest.fn();
jest.mock('@/src/features/forms/fields/GenericField', () => ({
  GenericField: (props: any) => {
    mockGenericField(props);
    return (
      <button
        data-testid="field"
        onClick={() => props.updateFieldOptions({ foo: ['bar'] })}
      />
    );
  },
}));

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ProfileCompletionSchemaField } from './ProfileCompletionSchemaField';

const schema = { id: 'schema', fields: [] } as any;
const field = { id: 'f', name: 'f', component: 'text-input' } as any;

let submit: () => Promise<void>;

function Harness({ showError }: { showError?: boolean }) {
  const methods = useForm<any>();
  submit = methods.handleSubmit(() => {}) as any;
  return (
    <FormProvider {...methods}>
      <ProfileCompletionSchemaField
        formSchema={schema}
        field={field}
        showError={showError}
      />
    </FormProvider>
  );
}

const lastProps = () => mockGenericField.mock.calls.at(-1)![0];

describe('ProfileCompletionSchemaField', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => cleanup());

  it('plugs the generic field into the surrounding form', () => {
    render(<Harness />);
    const props = lastProps();
    expect(props.formSchema).toBe(schema);
    expect(props.field).toBe(field);
    expect(props.control).toBeDefined();
    expect(typeof props.getValue).toBe('function');
    expect(typeof props.resetField).toBe('function');
    expect(typeof props.watch).toBe('function');
  });

  it('hides the errors until the form has been submitted once', async () => {
    render(<Harness />);
    expect(lastProps().showError).toBe(false);
    await act(async () => {
      await submit();
    });
    expect(lastProps().showError).toBe(true);
  });

  it('lets the parent force the display of the errors', () => {
    const { rerender } = render(<Harness showError />);
    expect(lastProps().showError).toBe(true);
    rerender(<Harness showError={false} />);
    expect(lastProps().showError).toBe(false);
  });

  it('accumulates the options of the async fields', () => {
    render(<Harness />);
    expect(lastProps().fieldOptions).toEqual({});
    fireEvent.click(screen.getByTestId('field'));
    expect(lastProps().fieldOptions).toEqual({ foo: ['bar'] });
    act(() => lastProps().updateFieldOptions(undefined));
    expect(lastProps().fieldOptions).toEqual({ foo: ['bar'] });
  });
});
