import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Heading } from '../utils/Inputs';
import { FormFooter } from 'src/components/forms/FormFooter/FormFooter';
import { GenericField } from 'src/components/forms/fields/GenericField';
import { InputsContainer } from 'src/components/forms/fields/InputsContainer';
import { MultipleFields } from 'src/components/forms/fields/MultipleFields/MultipleFields';
import { AnyToFix } from 'src/utils/Types';

interface FormWithValidationProps {
  defaultValues?: AnyToFix; // to be typed
  onCancel?: () => void;
  onSubmit: (arg1: AnyToFix, arg2: AnyToFix) => void; // to be typed
  onError?: (any) => void;
  formSchema: {
    id: string;
    fields: AnyToFix; // to be typed
    rules: AnyToFix; // to be typed
  };
  submitText?: string;
  cancelText?: string;
  enterToSubmit?: boolean;
  formId?: string;
}

/**
 * Permet de creer un formulaire avec la generation de ses champs et validations de champs
 * Regroupe les deux composants du fichier formWithValidationOld en stateless
 * - Plus lisible
 */
export const FormWithValidation = forwardRef(
  (
    {
      formSchema: { id, rules, fields },
      defaultValues,
      submitText,
      cancelText,
      onSubmit,
      onCancel,
      enterToSubmit,
      onError,
      formId,
    }: FormWithValidationProps,
    ref
  ) => {
    const [error, setError] = useState<string>();
    const [fieldOptions, setFieldOptions] = useState({});

    const updateFieldOptions = useCallback(
      (fieldWithOptions) => {
        setFieldOptions({ ...fieldOptions, ...fieldWithOptions });
      },
      [fieldOptions]
    );

    const { handleSubmit, control, reset, getValues } = useForm({
      defaultValues,
    });

    useImperativeHandle(ref, () => {
      return {
        resetForm: reset,
      };
    });

    const onValidForm = useCallback(
      (formValues) => {
        return onSubmit(formValues, (msg) => {
          setError(msg);
        });
      },
      [onSubmit]
    );

    const onErrorForm = useCallback(() => {
      return onError(getValues());
    }, [getValues, onError]);

    return (
      <>
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-width-1-1 uk-child-width-1-1"
          data-uk-grid
          data-testid="form-with-validation"
          onKeyDown={(ev) => {
            if (enterToSubmit) {
              if (ev.key === 'Enter') {
                handleSubmit(() => onValidForm(ev), onErrorForm);
              }
            }
          }}
        >
          <fieldset className="uk-fieldset">
            {fields.map((value, i) => {
              const shouldHide = value.hide
                ? value.hide((name) => {
                    return getValues(name);
                  })
                : value.hidden;

              if (shouldHide) {
                return null;
              }

              if (value.component === 'heading') {
                return (
                  <Heading id={`${formId}-${value.id}`} title={value.title} />
                );
              }
              if (value.component === 'text') {
                return (
                  <p
                    id={`${formId}-${value.id}`}
                    data-testid={`${formId}-${value.id}`}
                  >
                    {value.title}
                  </p>
                );
              }
              if (value.component === 'dynamic-text') {
                return (
                  <p
                    id={`${formId}-${value.id}`}
                    data-testid={`${formId}-${value.id}`}
                  >
                    {value.title(getValue)}
                  </p>
                );
              }
              if (value.component === 'fieldgroup') {
                const { fields: childrenFields } = value;

                return (
                  !shouldHide && (
                    <li key={i}>
                      <InputsContainer
                        fields={childrenFields.map((field) => {
                          const shouldHideField = field.hide
                            ? field.hide((name) => {
                                return getValues(name);
                              })
                            : field.hidden;

                          return !shouldHideField ? (
                            <GenericField
                              control={control}
                              data={field}
                              formId={id}
                              fieldOptions={fieldOptions}
                              updateFieldOptions={updateFieldOptions}
                              getValue={(name) => {
                                return getValues(name);
                              }}
                            />
                          ) : null;
                        })}
                      />
                    </li>
                  )
                );
              }
              if (value.component === 'multiple-fields') {
                const {
                  fields: multipleFields,
                  action,
                  name: multipleFieldsName,
                } = value;
                return (
                  <li key={i}>
                    <MultipleFields
                      control={control}
                      action={action}
                      name={multipleFieldsName}
                      formId={id}
                      getValue={(name) => {
                        return getValues(name);
                      }}
                      fields={multipleFields}
                    />
                  </li>
                );
              }

              return (
                <li key={i}>
                  <GenericField
                    control={control}
                    data={value}
                    formId={id}
                    updateFieldOptions={updateFieldOptions}
                    fieldOptions={fieldOptions}
                    getValue={(name) => {
                      return getValues(name);
                    }}
                  />
                </li>
              );
            })}
          </fieldset>
        </form>
        <FormFooter
          error={error}
          submitText={submitText}
          cancelText={cancelText}
          onSubmit={handleSubmit(onValidForm, onErrorForm)}
          formId={formId}
          onCancel={
            onCancel &&
            (() => {
              reset();
              onCancel();
            })
          }
        />
      </>
    );
  }
);

FormWithValidation.defaultProps = {
  submitText: undefined,
  cancelText: undefined,
  defaultValues: {},
  onCancel: undefined,
  enterToSubmit: false,
  onError: null,
  formId: '',
};
