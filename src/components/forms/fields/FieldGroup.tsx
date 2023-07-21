import React, { ChangeEvent, memo, useMemo } from 'react';
import { GenericField } from '../GenericField';
import { Grid } from 'src/components/utils';
import { AnyToFix } from 'src/utils/Types';

interface FieldGroupProps {
  index: number;
  parentName: string;
  values: AnyToFix[];
  fields: AnyToFix[];
  childWidths: string[];
  formId: string;
  onFieldChange: (event: ChangeEvent | ChangeEvent[], index: number) => void;
  getValid: (name: string) =>
    | {
        isInvalid: boolean;
        message: string;
      }
    | undefined;
  getValue: (name: string) => AnyToFix;
}

export const FieldGroup = memo(
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
  }: FieldGroupProps) => {
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
