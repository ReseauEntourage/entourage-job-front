import React, { useCallback } from 'react';
import { GenericField } from '../../GenericField';
import { InputsContainer } from '../InputsContainer';
import { Button, ButtonIcon, Icon } from 'src/components/utils';
import { usePrevious } from 'src/hooks/utils';
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
  values: AnyToFix[];
  fields: AnyToFix[];
  name: string;
  onChange: (e: {
    target: {
      name: string;
      value: AnyToFix;
      type: string;
    };
  }) => void;
  getValid: (name: string) => {
    isInvalid: boolean;
    message: string;
  };
  getValue: (name: string) => AnyToFix;
}

export const MultipleFields = ({
  name,
  fields,
  getValid,
  getValue,
  values,
  onChange,
  formId,
  action = 'Ajouter',
}: MultipleFieldsProps) => {
  const onFieldChange = useCallback(
    (event, index) => {
      let onChangeArgs = event;
      if (!Array.isArray(onChangeArgs)) {
        onChangeArgs = [onChangeArgs];
      }
      for (let i = 0; i < onChangeArgs.length; i += 1) {
        const {
          target: { name: fieldName, value },
        } = onChangeArgs[i];

        const currentValue = values || [];

        const valueToUpdate = [...currentValue];
        valueToUpdate[index] = {
          ...(valueToUpdate[index] || {}),
          [fieldName]: value,
        };

        onChange({
          target: {
            name,
            value: valueToUpdate,
            type: 'multiple-fields',
          },
        });
      }
    },
    [name, onChange, values]
  );

  const prevLength = usePrevious(values.length);

  return (
    <div>
      {values.map((item, index) => {
        return (
          <StyledMultipleFieldContainer key={index}>
            <InputsContainer
              fields={fields.map((field) => {
                const getValidChild = (fieldName) => {
                  if (
                    prevLength &&
                    (item.length === prevLength ||
                      item.length < prevLength ||
                      index < item.length - 1)
                  ) {
                    return getValid(fieldName);
                  }
                };
                const nbString = index !== 0 ? ` n°${index + 1}*` : '*';
                const numberedField = {
                  ...field,
                  id: field.id + index,
                  title:
                    field.title.indexOf('*') > -1
                      ? field.title.replace('*', nbString)
                      : (field.title += nbString),
                };
                return (
                  <GenericField
                    data={numberedField}
                    formId={formId}
                    value={item[numberedField.name]}
                    onChange={(event) => {
                      return onFieldChange(event, index);
                    }}
                    getValid={(childName) => {
                      // TODO make generic for different kinds of validation
                      const validObj = getValidChild(name);
                      if (validObj) {
                        return !item[childName] ? validObj : undefined;
                      }
                      return validObj;
                    }}
                    getValue={() => {
                      return getValue(name);
                    }}
                  />
                );
              })}
            />
            <StyledTrashButtonContainer>
              {index === values.length - 1 && index !== 0 && (
                <ButtonIcon
                  name="trash"
                  ratio={0.8}
                  onClick={() => {
                    if (values.length > 1) {
                      onChange({
                        target: {
                          name,
                          value: [...values.slice(0, -1)],
                          type: 'multiple-fields',
                        },
                      });
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
            onChange({
              target: {
                name,
                value: [...values, {}],
                type: 'multiple-fields',
              },
            });
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
