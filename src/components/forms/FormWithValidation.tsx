import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { FormFooter } from 'src/components/forms/FormFooter/FormFooter';
import { GenericField } from 'src/components/forms/fields/GenericField';
import { InputsContainer } from 'src/components/forms/fields/InputsContainer';
import { MultipleFields } from 'src/components/forms/fields/MultipleFields/MultipleFields';
import { Heading } from 'src/components/utils/Inputs';
import { Text } from 'src/components/utils/Inputs/Text';
import { getValueFromFormField } from 'src/utils';
import { AnyToFix } from 'src/utils/Types';
import {
  ComponentException,
  FormSchema,
  isFormFieldGroup,
  isFormFieldTextInput,
  isFormFieldMultiple,
  isFormFieldSelect,
  isFormFieldText,
} from './FormSchema';
import { StyledForm } from './Forms.styles';

interface FormWithValidationProps<S> {
  defaultValues?: AnyToFix; // to be typed
  onCancel?: () => void;
  onSubmit: (arg1: AnyToFix, arg2: AnyToFix) => void; // to be typed
  onError?: (any) => void;
  formSchema: FormSchema<S>;
  submitText?: string;
  cancelText?: string;
  enterToSubmit?: boolean;
}

export const FormWithValidation = forwardRef<
  { resetForm: () => void },
  FormWithValidationProps<S>
>(
  (
    {
      formSchema,
      defaultValues = {},
      submitText,
      cancelText,
      onSubmit,
      onCancel,
      enterToSubmit = false,
      onError,
    }: FormWithValidationProps<S>,
    ref
  ) => {
    const { id: formId, fields } = formSchema;

    const [error, setError] = useState<string>();
    const [fieldOptions, setFieldOptions] = useState({});

    const updateFieldOptions = useCallback(
      (fieldWithOptions) => {
        setFieldOptions({ ...fieldOptions, ...fieldWithOptions });
      },
      [fieldOptions]
    );

    const { handleSubmit, control, reset, getValues, resetField, watch } =
      useForm<S>({
        defaultValues,
        shouldUnregister: true,
      });

    useImperativeHandle(ref, () => {
      return {
        resetForm: reset,
      };
    });

    const onValidForm = useCallback(
      (formValues) => {
        const mutatedFormValues = Object.keys(formValues).reduce(
          (acc, curr) => {
            return {
              ...acc,
              [curr]: getValueFromFormField(formValues[curr]),
            };
          },
          {}
        );
        onSubmit(mutatedFormValues, (msg) => {
          setError(msg);
        });
      },
      [onSubmit]
    );

    const onErrorForm = useCallback(() => {
      if (onError) {
        onError(getValues());
      }
    }, [getValues, onError]);

    return (
      <>
        <StyledForm
          id={formId}
          data-testid="form-with-validation"
          onKeyDown={(ev) => {
            if (enterToSubmit) {
              if (ev.key === 'Enter') {
                handleSubmit(() => onValidForm(ev), onErrorForm);
              }
            }
          }}
        >
          <fieldset>
            {fields.map((field, i) => {
              const shouldHide = field.hide
                ? field.hide((name) => {
                    return getValues(name);
                  })
                : field.hidden;

              if (shouldHide) {
                return null;
              }

              if (isFormFieldText(field)) {
                const title =
                  typeof field.title === 'function'
                    ? field.title(getValues)
                    : field.title;
                if (field.component === 'heading') {
                  return (
                    <Heading
                      id={`${formId}-${field.id}`}
                      title={title}
                      key={i}
                    />
                  );
                }
                if (field.component === 'text') {
                  return (
                    <Text id={`${formId}-${field.id}`} title={title} key={i} />
                  );
                }
              }

              if (isFormFieldGroup(field)) {
                if (field.component === 'fieldgroup') {
                  const { fields: childrenFields } = field;

                  return (
                    !shouldHide && (
                      <li key={i}>
                        <InputsContainer
                          fields={childrenFields.map((childrenField) => {
                            const shouldHideField = childrenField.hide
                              ? childrenField.hide((name) => {
                                  return getValues(name);
                                })
                              : childrenField.hidden;

                            if (isFormFieldText(childrenField)) {
                              const title =
                                typeof childrenField.title === 'function'
                                  ? childrenField.title(getValues)
                                  : childrenField.title;

                              if (childrenField.component === 'text') {
                                return (
                                  <Text
                                    id={`${formId}-${childrenField.id}`}
                                    title={title}
                                    key={i}
                                  />
                                );
                              }
                              throw new ComponentException(
                                childrenField.component,
                                field.component
                              );
                            }

                            return !shouldHideField ? (
                              <GenericField
                                watch={watch}
                                resetField={resetField}
                                control={control}
                                field={childrenField}
                                formId={formId}
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
              }

              if (isFormFieldMultiple(field)) {
                if (field.component === 'multiple-fields') {
                  const {
                    fields: multipleFields,
                    action,
                    name: multipleFieldsName,
                  } = field;
                  return (
                    <li key={i}>
                      <MultipleFields
                        watch={watch}
                        resetField={resetField}
                        control={control}
                        action={action}
                        name={multipleFieldsName}
                        formId={formId}
                        getValue={(name) => {
                          return getValues(name);
                        }}
                        fields={multipleFields}
                      />
                    </li>
                  );
                }
              }

              if (isFormFieldTextInput(field) || isFormFieldSelect(field)) {
                return (
                  <li key={i}>
                    <GenericField
                      watch={watch}
                      resetField={resetField}
                      control={control}
                      field={field}
                      formId={formId}
                      updateFieldOptions={updateFieldOptions}
                      fieldOptions={fieldOptions}
                      getValue={(name) => {
                        return getValues(name);
                      }}
                    />
                  </li>
                );
              }

              throw new ComponentException(field.component);
            })}
          </fieldset>
        </StyledForm>
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
