import React, { Ref, useCallback, useImperativeHandle, useState } from 'react';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { FormFooter } from 'src/components/forms/FormFooter/FormFooter';
import { InputsContainer } from 'src/components/forms/fields/InputsContainer';
import { MultipleFields } from 'src/components/forms/fields/MultipleFields/MultipleFields';
import { Heading } from 'src/components/utils/Inputs';
import { Text } from 'src/components/utils/Inputs/Text';
import { AnyCantFix } from 'src/utils/Types';
import {
  ComponentException,
  ExtractFormSchemaValidation,
  FormField,
  FormSchema,
  isFormFieldGroup,
  isFormFieldInput,
  isFormFieldMultiple,
  isFormFieldRadio,
  isFormFieldText,
} from './FormSchema';
import { StyledForm } from './Forms.styles';
import { GenericField } from './fields/GenericField';

interface FormWithValidationProps<S extends FormSchema<AnyCantFix>> {
  formSchema: S;
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
  onCancel?: () => void;
  onSubmit: (
    values: ExtractFormSchemaValidation<S>,
    requestErrorCallback: (msg: string) => void
  ) => void;
  onError?: (values: ExtractFormSchemaValidation<S>) => void;
  submitText?: string;
  cancelText?: string;
  enterToSubmit?: boolean;
  innerRef?: Ref<{ resetForm: () => void }>;
  error?: string;
  noCompulsory?: boolean;
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
  innerRef,
  error: externalError,
  noCompulsory = false,
}: FormWithValidationProps<S>) {
  const { id: formId, fields } = formSchema;

  const [isLoading, setIsLoading] = useState(false);

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

  useImperativeHandle(innerRef, () => {
    return {
      resetForm: () => reset({} as ExtractFormSchemaValidation<S>),
    };
  });

  const onValidForm: SubmitHandler<ExtractFormSchemaValidation<S>> =
    useCallback(
      async (fieldValues) => {
        await onSubmit(fieldValues, (msg) => {
          setError(msg);
        });
      },
      [onSubmit]
    );

  const onErrorForm = useCallback(async () => {
    if (onError) {
      await onError(getValues());
    }
  }, [getValues, onError]);

  const handleSubmitOverride = useCallback(async () => {
    setIsLoading(true);
    await handleSubmit(onValidForm, onErrorForm)();
    setIsLoading(false);
  }, [handleSubmit, onErrorForm, onValidForm]);

  return (
    <>
      <StyledForm
        id={formId}
        data-testid="form-with-validation"
        onSubmit={handleSubmitOverride}
        onKeyDown={async (ev) => {
          if (enterToSubmit) {
            if (ev.key === 'Enter') {
              await handleSubmitOverride();
            }
          }
        }}
      >
        <fieldset>
          {fields.map(
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            (field: FormField<ExtractFormSchemaValidation<S>>, i) => {
              const shouldHide = field.hide
                ? field.hide(getValues, fieldOptions)
                : field.hidden;

              if (isFormFieldText(field)) {
                if (shouldHide) {
                  return null;
                }

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
                if (shouldHide) {
                  return null;
                }

                if (field.component === 'fieldgroup') {
                  const { fields: childrenFields } = field;

                  return (
                    <li key={i}>
                      <InputsContainer
                        fields={childrenFields.map((childrenField) => {
                          const shouldHideField = childrenField.hide
                            ? childrenField.hide(getValues)
                            : childrenField.hidden;

                          if (shouldHideField) {
                            return null;
                          }

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

                          return (
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
                          );
                        })}
                      />
                    </li>
                  );
                }
              }

              if (isFormFieldMultiple(field)) {
                if (shouldHide) {
                  return null;
                }

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

              if (isFormFieldInput(field)) {
                // Condition because Radio Async needs to be rendered to make request and check if it should be hidden or not
                if (!isFormFieldRadio(field) && shouldHide) {
                  return null;
                }
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
            }
          )}
        </fieldset>
      </StyledForm>
      <FormFooter
        error={error ?? externalError}
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        submitText={submitText}
        cancelText={cancelText}
        isLoadingOverride={isLoading}
        noCompulsory={noCompulsory}
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
