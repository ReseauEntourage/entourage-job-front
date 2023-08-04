import React from 'react';
import {
  Control,
  useFieldArray,
  UseFormResetField,
  UseFormWatch,
} from 'react-hook-form';
import { GenericField } from '../GenericField';
import { InputsContainer } from '../InputsContainer';
import {
  FormFieldInput,
  FormFieldSelect,
  GetValueType,
} from 'src/components/forms/FormSchema/FormSchema.types';
import { Button, ButtonIcon, Icon } from 'src/components/utils';
import { useMount } from 'src/hooks/utils';
import { AnyToFix } from 'src/utils/Types';
import {
  StyledMultipleFieldAddButtonContainer,
  StyledMultipleFieldButtonLabel,
  StyledMultipleFieldContainer,
  StyledTrashButtonContainer,
} from './MultipleFields.styles';

interface MultipleFieldsProps {
  formId: string;
  action?: string;
  fields: (FormFieldInput | FormFieldSelect)[];
  name: string;
  getValue: GetValueType;
  control: Control;
  resetField: UseFormResetField<AnyToFix>;
  watch: UseFormWatch<AnyToFix>;
}

export const MultipleFields = ({
  control,
  name,
  fields: formFields,
  getValue,
  formId,
  action = 'Ajouter',
  resetField,
  watch,
}: MultipleFieldsProps) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  // To add the first empty one
  useMount(() =>
    append(
      formFields.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.name]: null,
        };
      }, {})
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
                  id: `${name}.${index}.${field.id}`,
                  name: `${name}.${index}.${field.name}`,
                  title:
                    typeof title === 'string' && title.indexOf('*') > -1
                      ? title.replace('*', `${nbString}*`)
                      : title + nbString,
                };
                return (
                  <GenericField
                    watch={watch}
                    resetField={resetField}
                    field={numberedField}
                    formId={formId}
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
              }, {})
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
};
