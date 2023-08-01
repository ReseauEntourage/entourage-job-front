import React, { useCallback, useMemo } from 'react';
import {
  Control,
  useController,
  UseFormResetField,
  UseFormWatch,
} from 'react-hook-form';

import {
  FormFieldInput,
  FormFieldSelect,
} from '../FormSchema/FormSchema.types';
import {
  ComponentException,
  isFormFieldInput,
  isFormFieldSelect,
} from '../FormSchema/FormSchema.utils';
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
import { CommonInputProps } from 'src/components/utils/Inputs/Inputs.types';

import { FilterConstant } from 'src/constants';
import { AnyToFix } from 'src/utils/Types';

interface GenericFieldProps {
  field: FormFieldInput | FormFieldSelect;
  formId: string;
  getValue: (
    name: string
  ) => FilterConstant | FilterConstant[] | string | boolean;
  fieldOptions?: AnyToFix;
  updateFieldOptions?: (newFieldOption?: { [K in string]: AnyToFix }) => void;
  control: Control;
  resetField: UseFormResetField<AnyToFix>;
  watch: UseFormWatch<AnyToFix>;
}

export const GenericField = ({
  field,
  formId,
  getValue,
  updateFieldOptions = () => {},
  fieldOptions = {},
  control,
  resetField,
  watch,
}: GenericFieldProps) => {
  const {
    field: { onChange, onBlur, value, name, ref },
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    rules: { required: !field.isRequired ? 'Obligatoire' : false },
  });

  watch();

  const onChangeCustom = useCallback(
    (updatedValue) => {
      if (isFormFieldSelect(field)) {
        if (field.fieldsToReset) {
          for (let i = 0; i < field.fieldsToReset.length; i += 1) {
            resetField(field.fieldsToReset[i]);
          }
        }
      }
      onChange(updatedValue);
    },
    [field, onChange, resetField]
  );

  const commonProps: CommonInputProps = useMemo(() => {
    return {
      id: `${formId}-${field.id}`,
      name,
      title:
        typeof field.title === 'function' ? field.title(getValue) : field.title,
      value,
      error,
      onChange: onChangeCustom,
      onBlur,
      disabled: field.disable ? field.disable(getValue) : field.disabled,
      hidden: field.hide ? field.hide(getValue) : field.hidden,
      inputRef: ref,
      placeholder: field.placeholder,
      showLabel: field.showLabel,
    };
  }, [
    field,
    error,
    formId,
    getValue,
    name,
    onBlur,
    onChangeCustom,
    ref,
    value,
  ]);

  if (commonProps.hidden) {
    return null;
  }

  if (isFormFieldInput(field)) {
    if (field.component === 'datepicker') {
      return <DatePicker {...commonProps} min={field.min} max={field.max} />;
    }

    if (field.component === 'text-input') {
      return <TextInput {...commonProps} type={field.type} />;
    }

    if (field.component === 'tel-input') {
      return <PhoneInput {...commonProps} />;
    }

    if (field.component === 'textarea') {
      return <TextArea {...commonProps} maxLines={field.maxLines} />;
    }

    if (field.component === 'checkbox') {
      return <CheckBox {...commonProps} value={value} />;
    }
  }

  if (isFormFieldSelect(field)) {
    const isMultiDefined = field.isMulti || false;

    const isMulti =
      typeof isMultiDefined === 'function'
        ? isMultiDefined(getValue)
        : isMultiDefined;

    if (field.component === 'select-simple') {
      const { options } = field;

      return <SelectSimple {...commonProps} options={options} />;
    }

    if (field.component === 'select') {
      return (
        <Select
          {...commonProps}
          isMulti={isMulti}
          options={field.options}
          openMenuOnClick={field.openMenuOnClick}
        />
      );
    }

    if (field.component === 'select-creatable') {
      return (
        <SelectCreatable
          {...commonProps}
          isMulti={isMulti}
          options={field.options}
          openMenuOnClick={field.openMenuOnClick}
        />
      );
    }

    if (field.component === 'select-async') {
      return (
        <SelectAsync
          {...commonProps}
          isMulti={isMulti}
          openMenuOnClick={field.openMenuOnClick}
          loadOptions={(callback, inputValue) =>
            field.loadOptions(callback, inputValue, getValue)
          }
        />
      );
    }

    if (field.component === 'radio') {
      return (
        <Radio
          {...commonProps}
          options={field.options}
          filter={field.dynamicFilter(getValue)}
          hidden={
            field.hide ? field.hide(getValue, fieldOptions) : field.hidden
          }
        />
      );
    }

    if (field.component === 'radio-async') {
      return (
        <RadioAsync
          {...commonProps}
          loadOptions={async (callback) => {
            const radioOptions = await field.loadOptions(callback);
            updateFieldOptions({ [field.id]: radioOptions });
            return radioOptions;
          }}
          filter={field.dynamicFilter(getValue)}
          hidden={
            field.hide ? field.hide(getValue, fieldOptions) : field.hidden
          }
        />
      );
    }
  }

  throw new ComponentException(field.component);
};
