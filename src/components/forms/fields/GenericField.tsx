import React, { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { CommonInputProps } from '../../utils/Inputs/Inputs.types';
import { SimpleLink } from 'src/components/utils';
import {
  CheckBox,
  DatePicker,
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
  getValue: (
    name: string
  ) => FilterConstant | FilterConstant[] | string | boolean;
  fieldOptions?: AnyToFix;
  updateFieldOptions?: (newFieldOption?: { [K in string]: AnyToFix }) => void;
  control: Control;
}

export const GenericField = ({
  data,
  formId,
  getValue,
  updateFieldOptions = () => {},
  fieldOptions = {},
  control,
}: GenericFieldProps) => {
  const {
    field: { onChange, onBlur, value, name, ref },
    fieldState: { error },
  } = useController({
    name: data.name,
    control,
    rules: { required: 'Obligatoire' },
  });

  console.log(error);

  const commonProps: CommonInputProps = useMemo(() => {
    return {
      id: `${formId}-${data.id}`,
      name,
      title: data.dynamicTitle ? data.dynamicTitle(getValue) : data.title,
      value,
      error,
      onChange,
      onBlur,
      disabled: data.disable ? data.disable(getValue) : data.disabled,
      hidden: data.hide ? data.hide(getValue) : data.hidden,
      inputRef: ref,
      placeholder: data.placeholder,
      showLabel: data.showLabel,
    };
  }, [data, error, formId, getValue, name, onBlur, onChange, ref, value]);

  // TODO MANAGE RESET OF FIELDS ON CHANGE OTHER FIELDS
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

  // For Select Components

  const isMultiDefined = data.isMulti || false;

  const isMulti =
    typeof isMultiDefined === 'function'
      ? isMultiDefined(getValue)
      : isMultiDefined;

  if (data.component === 'datepicker') {
    return <DatePicker {...commonProps} min={data.min} max={data.max} />;
  }

  if (data.component === 'text-input') {
    return <TextInput {...commonProps} type={data.type} />;
  }

  if (data.component === 'tel-input') {
    return <PhoneInput {...commonProps} autocomplete={data.autocomplete} />;
  }

  if (data.component === 'select-simple') {
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

    return <SelectSimple {...commonProps} options={options} />;
  }

  if (data.component === 'textarea') {
    return <TextArea {...commonProps} maxLength={data.maxLength} />;
  }

  if (data.component === 'checkbox') {
    return <CheckBox {...commonProps} value={value} />;
  }

  if (data.component === 'cgu') {
    return (
      <CheckBox
        {...commonProps}
        value={value}
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
      />
    );
  }

  // Select Components
  if (data.component === 'select') {
    return (
      <Select
        {...commonProps}
        isMulti={isMulti}
        options={data.options}
        openMenuOnClick={data.openMenuOnClick}
      />
    );
  }

  if (data.component === 'select-creatable') {
    return (
      <SelectCreatable
        {...commonProps}
        isMulti={isMulti}
        options={data.options}
        openMenuOnClick={data.openMenuOnClick}
      />
    );
  }

  if (data.component === 'select-async') {
    return (
      <SelectAsync
        {...commonProps}
        isMulti={isMulti}
        openMenuOnClick={data.openMenuOnClick}
        cacheOptions={data.cacheOptions}
        defaultOptions={data.defaultOptions}
        noOptionsMessage={data.noOptionsMessage}
        loadingMessage={data.loadingMessage}
        loadOptions={
          data.loadOptions
            ? (inputValue, callback) =>
                data.loadOptions(inputValue, callback, getValue)
            : () => {}
        }
      />
    );
  }

  if (data.component === 'radio') {
    return (
      <Radio
        {...commonProps}
        options={data.options}
        filter={data.dynamicFilter(getValue)}
        hidden={data.hide ? data.hide(getValue, fieldOptions) : data.hidden}
      />
    );
  }

  if (data.component === 'radio-async') {
    return (
      <RadioAsync
        {...commonProps}
        loadOptions={async () => {
          const radioOptions = await data.loadOptions();
          updateFieldOptions({ [data.id]: radioOptions });
          return radioOptions;
        }}
        filter={data.dynamicFilter(getValue)}
        hidden={data.hide ? data.hide(getValue, fieldOptions) : data.hidden}
      />
    );
  }

  throw new Error(`Component ${data.component} does not exist`);
};
