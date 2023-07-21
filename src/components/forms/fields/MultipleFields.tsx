import React, { useCallback } from 'react';
import { Button, ButtonIcon, Icon } from 'src/components/utils';
import { usePrevious } from 'src/hooks/utils';
import { AnyToFix } from 'src/utils/Types';
import { FieldGroup } from './FieldGroup';

interface MultipleFieldsProps {
  formId: string;
  title: string;
  action?: string;
  values: AnyToFix[];
  fields: AnyToFix[];
  childWidths: string[];
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
  title,
  fields,
  childWidths,
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
      {title ? (
        <p
          className="uk-form-label"
          style={{
            paddingLeft: '0px',
            color: '#f66b28',
            opacity: '.8',
            fontSize: '0.8rem',
            transform: 'translateY(-26px)',
            transition: '0.8s',
          }}
        >
          {title}
        </p>
      ) : null}
      {values.map((item, index) => {
        return (
          <div key={index} className="uk-flex uk-flex-between@m uk-flex-middle">
            <div className="uk-flex-1">
              <FieldGroup
                index={index}
                values={item}
                onFieldChange={onFieldChange}
                fields={fields}
                childWidths={childWidths}
                getValid={(fieldName) => {
                  if (
                    prevLength &&
                    (values.length === prevLength ||
                      values.length < prevLength ||
                      index < values.length - 1)
                  ) {
                    return getValid(fieldName);
                  }
                }}
                getValue={getValue}
                formId={formId}
                parentName={name}
              />
            </div>
            <div style={{ width: 26, marginRight: -26 }}>
              {index === values.length - 1 && index !== 0 && (
                <ButtonIcon
                  className="uk-margin-small-left"
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
            </div>
          </div>
        );
      })}
      <div className="uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-left uk-margin-small-bottom"
          style="text"
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
          <span className="uk-margin-small-right">{action}</span>
          <Icon name="plus" ratio={0.8} />
        </Button>
      </div>
    </div>
  );
};
