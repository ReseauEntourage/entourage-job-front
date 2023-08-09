import React, { Ref, useCallback, useImperativeHandle, useState } from 'react';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { FormFooter } from 'src/components/forms/FormFooter/FormFooter';
import { GenericField } from 'src/components/forms/fields/GenericField';
import { InputsContainer } from 'src/components/forms/fields/InputsContainer';
import { MultipleFields } from 'src/components/forms/fields/MultipleFields/MultipleFields';
import { Heading } from 'src/components/utils/Inputs';
import { Text } from 'src/components/utils/Inputs/Text';
import { AnyCantFix } from 'src/utils/Types';
import {
  ComponentException,
  FormSchema,
  isFormFieldGroup,
  isFormFieldTextInput,
  isFormFieldMultiple,
  isFormFieldSelect,
  isFormFieldText,
  ExtractFormSchemaValidation,
} from './FormSchema';
import { StyledForm } from './Forms.styles';

interface FormWithValidationProps<S extends FormSchema<AnyCantFix>> {
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
  onCancel?: () => void;
  onSubmit: (
    values: ExtractFormSchemaValidation<S>,
    requestErrorCallback: (msg: string) => void
  ) => void;
  onError?: (values: ExtractFormSchemaValidation<S>) => void;
  formSchema: S;
  submitText?: string;
  cancelText?: string;
  enterToSubmit?: boolean;
  ref?: Ref<{ resetForm: () => void }>;
}

export function FormWithValidation<S extends FormSchema<AnyCantFix>>({
  formSchema,
  defaultValues,
  submitText,
  cancelText,
  onSubmit,
  onCancel,
  enterToSubmit = false,
  onError,
  ref,
}: FormWithValidationProps<S>) {
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
    useForm<ExtractFormSchemaValidation<S>>({
      defaultValues,
      shouldUnregister: true,
    });

  useImperativeHandle(ref, () => {
    return {
      resetForm: reset,
    };
  });

  const onValidForm: SubmitHandler<ExtractFormSchemaValidation<S>> =
    useCallback(
      (formValues) => {
        /*   const mutatedFormValues = Object.keys(formValues).reduce(
          (acc, curr) => {
            return {
              ...acc,
              [curr]: getValueFromFormField(formValues[curr]),
            };
          },
          {}
        ); */
        onSubmit(formValues, (msg) => {
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
              ? field.hide(getValues)
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
                  <Heading id={`${formId}-${field.id}`} title={title} key={i} />
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
                            ? childrenField.hide(getValues)
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
                              formSchema={formSchema}
                              watch={watch}
                              resetField={resetField}
                              control={control}
                              field={childrenField}
                              fieldOptions={fieldOptions}
                              updateFieldOptions={updateFieldOptions}
                              getValue={getValues}
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
                      formSchema={formSchema}
                      watch={watch}
                      resetField={resetField}
                      control={control}
                      action={action}
                      name={multipleFieldsName}
                      getValue={getValues}
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
                    formSchema={formSchema}
                    watch={watch}
                    resetField={resetField}
                    control={control}
                    field={field}
                    updateFieldOptions={updateFieldOptions}
                    fieldOptions={fieldOptions}
                    getValue={getValues}
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
