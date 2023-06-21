import PropTypes from 'prop-types';
import React, { memo, useCallback, useMemo } from 'react';
import GenericField from 'src/components/forms/GenericField';
import { Grid, Button, ButtonIcon, IconNoSSR } from 'src/components/utils';
import { usePrevious } from 'src/hooks/utils';

const FieldGroup = memo(
  ({
    index,
    values,
    fields,
    childWidths,
    formId,
    getValid,
    getValue,
    onFieldChange,
    parentName,
  }) => {
    const items = useMemo(() => {
      return fields.map((field) => {
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
          <div>
            <GenericField
              data={numberedField}
              formId={formId}
              value={values[numberedField.name]}
              onChange={(event) => {
                return onFieldChange(event, index);
              }}
              getValid={(name) => {
                // TODO make generic for different kinds of validation
                const validObj = getValid(parentName);
                if (validObj) {
                  return !values[name] ? validObj : undefined;
                }
                return validObj;
              }}
              getValue={() => {
                return getValue(parentName);
              }}
            />
          </div>
        );
      });
    }, [
      fields,
      formId,
      getValid,
      getValue,
      index,
      onFieldChange,
      parentName,
      values,
    ]);

    return (
      <>
        <Grid
          className="uk-visible@m"
          eachWidths={childWidths}
          childWidths={!childWidths ? [`1-${fields.length}`] : undefined}
          middle
          gap="small"
          items={items}
        />
        <Grid
          className="uk-hidden@m"
          eachWidths={childWidths}
          childWidths={!childWidths ? [`1-${fields.length}`] : undefined}
          middle
          gap="collapse"
          items={items}
        />
      </>
    );
  }
);

FieldGroup.propTypes = {
  index: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  childWidths: PropTypes.arrayOf(PropTypes.string).isRequired,
  formId: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  getValid: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

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
  action,
}) => {
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
                    values.length === prevLength ||
                    values.length < prevLength ||
                    index < values.length - 1
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
          <IconNoSSR name="plus" ratio={0.8} />
        </Button>
      </div>
    </div>
  );
};

MultipleFields.propTypes = {
  title: PropTypes.string,
  action: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  childWidths: PropTypes.arrayOf(PropTypes.string),
  formId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getValid: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

MultipleFields.defaultProps = {
  title: undefined,
  childWidths: undefined,
  action: 'Ajouter',
};
