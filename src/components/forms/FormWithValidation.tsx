import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Heading } from '../utils/Inputs';
import { FooterForm } from 'src/components/forms/FooterForm';
import FormValidator from 'src/components/forms/FormValidator';
import { GenericField } from 'src/components/forms/GenericField';
import { InputsContainer } from 'src/components/forms/fields/InputsContainer';
import { MultipleFields } from 'src/components/forms/fields/MultipleFields/MultipleFields';
import { getValueFromFormField } from 'src/utils/Finding';
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
              if (value.component === 'heading') {
                if (value.hide && value.hide(getValue, fieldOptions)) {
                  return null;
                }
                return (
                  <Heading id={`${formId}-${value.id}`} title={value.title} />
                );
              }
              if (value.component === 'text') {
                if (value.hide && value.hide(getValue, fieldOptions)) {
                  return null;
                }
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
                if (value.hide && value.hide(getValue, fieldOptions)) {
                  return null;
                }
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
                /*  const { fields: childrenFields } = value;

                const shouldHide = value.hide
                  ? value.hide((name) => {
                      return fieldValues[name];
                    })
                  : value.hidden;

                return (
                  !shouldHide && (
                    <li key={i}>
                      <InputsContainer
                        fields={childrenFields.map((field) => {
                          const shouldHideField = field.hide
                            ? field.hide((name) => {
                                return fieldValues[name];
                              })
                            : field.hidden;

                          return !shouldHideField ? (
                            <GenericField
                              data={field}
                              formId={id}
                              value={fieldValues[field.id]}
                              onChange={updateForm}
                              fieldOptions={fieldOptions}
                              updateFieldOptions={updateFieldOptions}
                              getValid={(name) => {
                                return fieldValidations[`valid_${name}`];
                              }}
                              getValue={(name) => {
                                return fieldValues[name];
                              }}
                            />
                          ) : null;
                        })}
                      />
                    </li>
                  )
                ); */
                return null;
              }
              if (value.component === 'multiple-fields') {
                /*  const {
                  fields: childrenFields,
                  action,
                  name: childrenName,
                } = value;
                return (
                  <li key={i} hidden={!!value.hidden}>
                    <MultipleFields
                      action={action}
                      name={childrenName}
                      formId={id}
                      values={fieldValues[childrenName] || [{}]}
                      getValid={(name) => {
                        return fieldValidations[`valid_${name}`];
                      }}
                      getValue={(name) => {
                        return fieldValues[name];
                      }}
                      onChange={updateForm}
                      fields={childrenFields}
                    />
                  </li>
                ); */
                return null;
              }

              return (
                <li key={i} hidden={!!value.hidden}>
                  <GenericField
                    control={control}
                    data={value}
                    formId={id}
                    // updateFieldOptions={updateFieldOptions}
                    //   fieldOptions={fieldOptions}
                    getValue={(name) => {
                      return getValues(name);
                    }}
                  />
                </li>
              );
            })}
          </fieldset>
        </form>
        <FooterForm
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
