import React from 'react';
import {
  ArrayPath,
  Control,
  FieldArray,
  Path,
  useFieldArray,
  UseFormGetValues,
  UseFormResetField,
  UseFormWatch,
} from 'react-hook-form';
import { GenericField } from '../GenericField';
import { InputsContainer } from '../InputsContainer';
import {
  FormFieldInput,
  FormSchema,
  ExtractFormSchemaValidation,
} from 'src/components/forms/FormSchema/FormSchema.types';
import { Button, ButtonIcon } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { useMount } from 'src/hooks/utils';
import { AnyCantFix } from 'src/utils/Types';
import {
  StyledMultipleFieldAddButtonContainer,
  StyledMultipleFieldButtonLabel,
  StyledMultipleFieldContainer,
  StyledTrashButtonContainer,
} from './MultipleFields.styles';

interface MultipleFieldsProps<S extends FormSchema<AnyCantFix>> {
  formSchema: S;
  action?: string;
  fields: FormFieldInput<ExtractFormSchemaValidation<S>>[];
  name: ArrayPath<ExtractFormSchemaValidation<S>>;
  getValue: UseFormGetValues<ExtractFormSchemaValidation<S>>;
  control: Control<ExtractFormSchemaValidation<S>>;
  resetField: UseFormResetField<ExtractFormSchemaValidation<S>>;
  watch: UseFormWatch<ExtractFormSchemaValidation<S>>;
}

export function MultipleFields<S extends FormSchema<AnyCantFix>>({
  control,
  formSchema,
  name,
  fields: formFields,
  getValue,
  action = 'Ajouter',
  resetField,
  watch,
}: MultipleFieldsProps<S>) {
  const { fields, append, remove } = useFieldArray<
    ExtractFormSchemaValidation<S>
  >({ control, name });

  // To add the first empty one
  useMount(() => {
    if (!fields || fields.length === 0) {
      append(
        formFields.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: null,
          };
        }, {}) as FieldArray<
          ExtractFormSchemaValidation<S>,
          ArrayPath<ExtractFormSchemaValidation<S>>
        >
      );
    }
  });

  return (
    <div>
      {fields.map((items, index) => {
        return (
          <StyledMultipleFieldContainer key={items.id}>
            <InputsContainer
              fields={formFields.map((field) => {
                const nbString = index !== 0 ? ` n°${index + 1}` : '';
                const title =
                  typeof field.title === 'function'
                    ? field.title(getValue)
                    : field.title;

                const numberedField = {
                  ...field,
                  id: `${name}-${index}-${field.id}` as Path<
                    ExtractFormSchemaValidation<S>
                  >,
                  name: `${name}.${index}.${field.name}` as Path<
                    ExtractFormSchemaValidation<S>
                  >,
                  title:
                    typeof title === 'string' && title.indexOf('*') > -1
                      ? title.replace('*', `${nbString}*`)
                      : title + nbString,
                };
                return (
                  <GenericField
                    formSchema={formSchema}
                    watch={watch}
                    resetField={resetField}
                    field={numberedField}
                    getValue={getValue}
                    control={control}
                  />
                );
              })}
            />
            <StyledTrashButtonContainer>
              {index === fields.length - 1 && index !== 0 && (
                <ButtonIcon
                  icon={<LucidIcon name="Trash" />}
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                />
              )}
            </StyledTrashButtonContainer>
          </StyledMultipleFieldContainer>
        );
      })}
      <StyledMultipleFieldAddButtonContainer>
        <Button
          variant="default"
          onClick={() => {
            append(
              formFields.reduce((acc, curr) => {
                return {
                  ...acc,
                  [curr.name]: null,
                };
              }, {}) as FieldArray<
                ExtractFormSchemaValidation<S>,
                ArrayPath<ExtractFormSchemaValidation<S>>
              >
            );
          }}
        >
          <StyledMultipleFieldButtonLabel>
            {action}
          </StyledMultipleFieldButtonLabel>
          <LucidIcon name="Plus" />
        </Button>
      </StyledMultipleFieldAddButtonContainer>
    </div>
  );
}
