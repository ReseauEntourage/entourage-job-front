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
import { Button, ButtonIcon, Icon } from 'src/components/utils';
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
  const { fields, append, remove } = useFieldArray({ control, name });

  // To add the first empty one
  useMount(() =>
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
    )
  );

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
                  id: `${name}.${index}.${field.id}` as Path<
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
                  name="trash"
                  ratio={0.8}
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
          style="custom-text"
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
          <Icon name="plus" ratio={0.8} />
        </Button>
      </StyledMultipleFieldAddButtonContainer>
    </div>
  );
}
