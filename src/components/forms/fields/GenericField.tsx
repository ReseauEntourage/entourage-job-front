import React, { useCallback, useMemo } from 'react';
import {
  Control,
  useController,
  UseFormResetField,
  UseFormWatch,
  UseFormGetValues,
  Path,
} from 'react-hook-form';

import {
  ComponentException,
  ExtractFormSchemaValidation,
  FormFieldInput,
  FormSchema,
  isFormFieldRadio,
  isFormFieldSelect,
  isFormFieldSelectRequest,
  isFormFieldTextInput,
  mapFieldRules,
} from '../FormSchema';
import {
  CheckBox,
  DatePicker,
  PhoneInput,
  Radio,
  RadioAsync,
  Select,
  SelectAsync,
  SelectCreatable,
  SelectSimple,
  TextArea,
  TextInput,
} from 'src/components/utils/Inputs';
import { CommonInputProps } from 'src/components/utils/Inputs/Inputs.types';
import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';

import { AnyCantFix } from 'src/utils/Types';

interface GenericFieldProps<S extends FormSchema<AnyCantFix>> {
  formSchema: S;
  field: FormFieldInput<ExtractFormSchemaValidation<S>>;
  getValue: UseFormGetValues<ExtractFormSchemaValidation<S>>;
  fieldOptions?: {
    [K in string]: RadioTypes[];
  };
  updateFieldOptions?: (newFieldOption?: {
    [K in string]: RadioTypes[];
  }) => void;
  control: Control<ExtractFormSchemaValidation<S>>;
  resetField: UseFormResetField<ExtractFormSchemaValidation<S>>;
  watch: UseFormWatch<ExtractFormSchemaValidation<S>>;
}

export function GenericField<S extends FormSchema<AnyCantFix>>({
  field,
  formSchema,
  getValue,
  updateFieldOptions = () => {},
  fieldOptions = {},
  control,
  resetField,
  watch,
}: GenericFieldProps<S>) {
  const { id: formId } = formSchema;

  const rules = mapFieldRules<S, typeof field.component>(field.rules);

  const {
    field: { onChange, onBlur, value, name, ref },
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    rules: {
      required: field.isRequired ? 'Obligatoire' : false,
      ...(isFormFieldTextInput(field) && field.maxLength
        ? { maxLength: field.maxLength }
        : {}),
      validate: rules || {},
    },
  });

  watch();

  const onChangeCustom = useCallback(
    (updatedValue) => {
      if (isFormFieldSelect(field) || isFormFieldSelectRequest(field)) {
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

  const commonProps: CommonInputProps<
    ExtractFormSchemaValidation<S>[Path<ExtractFormSchemaValidation<S>>]
  > = useMemo(() => {
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
    return <CheckBox {...commonProps} />;
  }

  if (field.component === 'select-simple') {
    const { options } = field;

    return <SelectSimple {...commonProps} options={options} />;
  }

  if (isFormFieldSelectRequest(field)) {
    let isMulti: boolean;
    if ('isMulti' in field) {
      const isMultiDefined = field.isMulti || false;

      isMulti =
        typeof isMultiDefined === 'function'
          ? isMultiDefined(getValue)
          : isMultiDefined;
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
  }

  if (isFormFieldRadio(field)) {
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
            await field.loadOptions((radioOptions) => {
              updateFieldOptions({ [field.id]: radioOptions });
              callback(radioOptions);
            });
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
}
