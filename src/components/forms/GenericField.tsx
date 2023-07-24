import React, { ChangeEvent, useCallback } from 'react';
import { SimpleLink } from 'src/components/utils';
import {
  CheckBox,
  useCheckBox,
  DatePicker,
  Heading,
  PhoneInput,
  Radio,
  RadioAsync,
  SelectSimple,
  Select,
  SelectAsync,
  TextArea,
  SelectCreatable,
  TextInput,
} from 'src/components/utils/Inputs';

import { EXTERNAL_LINKS, FilterConstant } from 'src/constants';
import { AnyToFix } from 'src/utils/Types';

interface GenericFieldProps {
  data: AnyToFix;
  formId: string;
  value: FilterConstant | FilterConstant[] | string | boolean | number;
  onChange: (e: ChangeEvent | ChangeEvent[]) => void;
  getValid: (name: string) =>
    | {
        isInvalid: boolean;
        message: string;
      }
    | undefined;
  getValue: (
    name: string
  ) => FilterConstant | FilterConstant[] | string | boolean;
  fieldOptions?: AnyToFix;
  updateFieldOptions?: (newFieldOption?: { [K in string]: AnyToFix }) => void;
}

export const GenericField = ({
  data,
  formId,
  value,
  onChange,
  getValid,
  getValue,
  updateFieldOptions = () => {
    return null;
  },
  fieldOptions = {},
}: GenericFieldProps) => {
  const onChangeCustom = useCallback(
    (event) => {
      let events = [event];
      if (data.fieldsToReset) {
        events = [
          ...events,
          ...data.fieldsToReset.map((field) => {
            return {
              target: { name: field, value: undefined },
              isReset: true,
            };
          }),
        ];
      }
      onChange(events);
    },
    [data.fieldsToReset, onChange]
  );

  const { checked, handleCheckBox } = useCheckBox(() => {}, null, data.checked);

  const parseValueToReturnSelect = useCallback(
    (event) => {
      onChangeCustom({
        target: {
          name: data.name,
          value: event,
          type: data.type,
        },
      });
    },
    [data.name, data.type, onChangeCustom]
  );

  // For Select Components

  const isMultiDefined = data.isMulti || false;

  const isMulti =
    typeof isMultiDefined === 'function'
      ? isMultiDefined(getValue)
      : isMultiDefined;

  const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

  switch (data.component) {
    case 'datepicker': {
      return (
        <DatePicker
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value as string}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          min={data.min}
          max={data.max}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }
    case 'text-input': {
      return (
        <TextInput
          id={`${formId}-${data.id}`}
          valid={getValid(data.name)}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          onChange={onChangeCustom}
          type={data.type}
          name={data.name}
          value={value as string}
          placeholder={data.placeholder}
          showLabel={data.showLabel}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }
    case 'tel-input': {
      return (
        <PhoneInput
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value as string}
          valid={getValid(data.name)}
          onChange={parseValueToReturnSelect}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
          autocomplete={data.autocomplete}
          placeholder={data.placeholder}
          showLabel={data.showLabel}
        />
      );
    }

    case 'select-simple':
      let { options } = data;
      if (data.generate) {
        const { max, min, type, placeholder } = data.generate;
        if (type === 'inc') {
          options = Array(max - min)
            .fill(min)
            .map((_, i) => {
              if (i === 0) return { value: null, text: placeholder };
              return { value: min + i, text: min + i };
            });
        }
        if (type === 'dec') {
          options = Array(max - min)
            .fill(max)
            .map((_, i) => {
              if (i === 0) return { value: null, text: placeholder };
              return { value: max - i, text: max - i };
            });
        }
      }

      return (
        <SelectSimple
          id={`${formId}-${data.id}`}
          // placeholder={data.placeholder}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value as string | number}
          options={options}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          showLabel={data.showLabel}
          // disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );

    case 'textarea': {
      return (
        <TextArea
          id={`${formId}-${data.id}`}
          name={data.name}
          maxLines={data.maxLines}
          onChange={onChangeCustom}
          value={value as string}
          valid={getValid(data.name)}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
        />
      );
    }
    case 'checkbox': {
      return (
        <CheckBox
          valid={getValid(data.name)}
          onChange={() => {
            handleCheckBox();
            onChangeCustom({
              target: {
                name: data.name,
                type: 'checkbox',
                value: !checked, // opposite of the previous value
                checked: !checked,
              },
            });
          }}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          value={checked}
          name={data.name}
          id={`${formId}-${data.id}`}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
        />
      );
    }
    case 'cgu': {
      return (
        <CheckBox
          id={`${formId}-${data.id}`}
          name={data.name}
          title={
            <span>
              J&apos;accepte les{' '}
              <SimpleLink
                isExternal
                target="_blank"
                href={EXTERNAL_LINKS.LEGAL_MENTIONS}
              >
                CGU
              </SimpleLink>
            </span>
          }
          value={value as boolean}
          valid={getValid(data.name)}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
          onChange={() => {
            handleCheckBox();
            onChangeCustom({
              target: {
                name: data.name,
                type: 'checkbox',
                value: !checked, // opposite of the previous value
                checked: !checked,
              },
            });
          }}
        />
      );
    }

    // Select Components
    case 'select': {
      return (
        <Select
          id={`${formId}-${data.id}`}
          isMulti={isMulti}
          value={value as FilterConstant | FilterConstant[]}
          options={data.options}
          placeholder={
            data.dynamicTitle ? data.dynamicTitle(getValue) : data.title
          }
          onChange={parseValueToReturnSelect}
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={shouldHide}
          valid={getValid(data.name)}
          openMenuOnClick={data.openMenuOnClick || true}
        />
      );
    }

    case 'select-creatable': {
      return (
        <SelectCreatable
          id={`${formId}-${data.id}`}
          isMulti={isMulti}
          value={value as FilterConstant | FilterConstant[]}
          options={data.options}
          placeholder={
            data.dynamicTitle ? data.dynamicTitle(getValue) : data.title
          }
          onChange={parseValueToReturnSelect}
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={shouldHide}
          valid={getValid(data.name)}
          openMenuOnClick={data.openMenuOnClick || true}
        />
      );
    }
    case 'select-async': {
      return (
        <SelectAsync
          id={`${formId}-${data.id}`}
          cacheOptions={data.cacheOptions}
          defaultOptions={data.defaultOptions}
          value={value as FilterConstant | FilterConstant[]}
          isMulti={isMulti}
          placeholder={
            data.dynamicTitle ? data.dynamicTitle(getValue) : data.title
          }
          noOptionsMessage={data.noOptionsMessage}
          loadingMessage={data.loadingMessage}
          loadOptions={
            data.loadOptions
              ? (inputValue, callback) =>
                  data.loadOptions(inputValue, callback, getValue)
              : () => {}
          }
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={shouldHide}
          onChange={parseValueToReturnSelect}
          valid={getValid(data.name)}
          openMenuOnClick={data.openMenuOnClick || true}
        />
      );
    }

    case 'radio': {
      return (
        <Radio
          limit={data.limit}
          options={data.options}
          id={`${formId}-${data.id}`}
          name={data.name}
          legend={data.title}
          onChange={onChangeCustom}
          filter={data.dynamicFilter(getValue)}
          hidden={data.hide ? data.hide(getValue, fieldOptions) : data.hidden}
          value={value as string}
        />
      );
    }
    case 'radio-async': {
      return (
        <RadioAsync
          limit={data.limit}
          loadOptions={async () => {
            const radioOptions = await data.loadOptions();
            updateFieldOptions({ [data.id]: radioOptions });
            return radioOptions;
          }}
          id={`${formId}-${data.id}`}
          name={data.name}
          legend={data.title}
          onChange={onChangeCustom}
          filter={data.dynamicFilter(getValue)}
          errorMessage={data.errorMessage}
          hidden={data.hide ? data.hide(getValue, fieldOptions) : data.hidden}
          value={value as string}
        />
      );
    }

    case 'heading': {
      if (data.hide && data.hide(getValue, fieldOptions)) {
        return null;
      }
      return <Heading id={`${formId}-${data.id}`} title={data.title} />;
    }
    case 'text': {
      if (data.hide && data.hide(getValue, fieldOptions)) {
        return null;
      }
      return (
        <p id={`${formId}-${data.id}`} data-testid={`${formId}-${data.id}`}>
          {data.title}
        </p>
      );
    }
    case 'dynamic-text': {
      if (data.hide && data.hide(getValue, fieldOptions)) {
        return null;
      }
      return (
        <p id={`${formId}-${data.id}`} data-testid={`${formId}-${data.id}`}>
          {data.title(getValue)}
        </p>
      );
    }
    default:
      throw `Component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
  }
};
