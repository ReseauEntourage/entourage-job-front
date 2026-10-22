const mockFormWithValidation = jest.fn();

jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: unknown) => {
    mockFormWithValidation(props);
    return <div data-testid="form" />;
  },
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { FormSchema } from '@/src/features/forms/FormSchema';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import { FormWithValidationSync } from './FormWithValidationSync';

const formSchema = { id: 'schema', fields: [] } as unknown as FormSchema<any>;

describe('FormWithValidationSync', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the form without footer and forwards its props', () => {
    const onSubmit = jest.fn();
    const formRef = { current: null };
    render(
      <FormWithValidationSync
        formSchema={formSchema}
        defaultValues={{ a: 1 }}
        onSubmit={onSubmit}
        formRef={formRef}
      />
    );

    expect(screen.getByTestId('form')).toBeTruthy();
    expect(mockFormWithValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        formSchema,
        defaultValues: { a: 1 },
        onSubmit,
        noFooter: true,
        innerRef: formRef,
      })
    );
  });

  it('subscribes to watch() on mount and unsubscribes on unmount', () => {
    const unsubscribe = jest.fn();
    const watch = jest.fn().mockReturnValue({ unsubscribe });
    const onWatch = jest.fn();
    const formRef = {
      current: { watch } as unknown as FormWithValidationRef,
    };
    const { unmount } = render(
      <FormWithValidationSync
        formSchema={formSchema}
        onSubmit={jest.fn()}
        onWatch={onWatch}
        formRef={formRef}
      />
    );

    expect(watch).toHaveBeenCalledWith(onWatch);
    expect(unsubscribe).not.toHaveBeenCalled();
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('does not subscribe without onWatch', () => {
    const watch = jest.fn();
    const formRef = {
      current: { watch } as unknown as FormWithValidationRef,
    };
    render(
      <FormWithValidationSync
        formSchema={formSchema}
        onSubmit={jest.fn()}
        formRef={formRef}
      />
    );

    expect(watch).not.toHaveBeenCalled();
  });

  it('tolerates an unmounted form ref', () => {
    const { unmount } = render(
      <FormWithValidationSync
        formSchema={formSchema}
        onSubmit={jest.fn()}
        onWatch={jest.fn()}
        formRef={{ current: null }}
      />
    );

    expect(() => unmount()).not.toThrow();
  });
});
