import React, { useCallback, useMemo, useState } from 'react';
import {
  Control,
  Path,
  useController,
  UseFormGetValues,
  UseFormResetField,
  UseFormWatch,
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

import { SelectList } from 'src/components/utils/Inputs/SelectList';
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

  let rules = mapFieldRules<S, typeof field.component>(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    field.rules
  );
  const [isMaxLinesReached, setIsMaxLinesReached] = useState<boolean>();
  const [isMaxItemsReached, setIsMaxItemsReached] = useState<boolean>();

  if (field.maxLines) {
    rules = {
      ...rules,
      maxLines: () =>
        !isMaxLinesReached || 'Vous avez dépassé le nombre de lignes maximum',
    };
  }

  if (field.maxItems) {
    rules = {
      ...rules,
      maxItems: () =>
        !isMaxItemsReached || "Vous avez dépassé le nombre d'élements maximum",
    };
  }

  const {
    field: { onChange, onBlur, value, name, ref },
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    rules: {
      required: field.isRequired ? 'Obligatoire' : false,
      ...(isFormFieldTextInput(field) && field.maxLength
        ? {
            maxLength: {
              value: field.maxLength,
              message: `${field.maxLength} caractères maximum`,
            },
          }
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
            resetField(field.fieldsToReset[i], {
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              defaultValue: null,
            });
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

  if (field.component === 'datepicker') {
    return <DatePicker {...commonProps} min={field.min} max={field.max} />;
  }

  if (field.component === 'text-input') {
    return (
      <TextInput
        {...commonProps}
        type={field.type}
        maxLength={field.maxLength}
      />
    );
  }

  if (field.component === 'tel-input') {
    return <PhoneInput {...commonProps} />;
  }

  if (field.component === 'textarea') {
    return (
      <TextArea
        {...commonProps}
        maxLines={field.maxLines}
        maxLength={field.maxLength}
        setIsMaxLinesReached={setIsMaxLinesReached}
      />
    );
  }

  if (field.component === 'checkbox') {
    return <CheckBox {...commonProps} />;
  }

  if (field.component === 'select-simple') {
    const { options } = field;

    return (
      <SelectSimple
        {...commonProps}
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        options={options}
      />
    );
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
          isMulti={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            isMulti
          }
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          options={
            typeof field.options === 'function'
              ? field.options(getValue)
              : field.options
          }
          openMenuOnClick={field.openMenuOnClick}
        />
      );
    }

    if (field.component === 'select-creatable') {
      return (
        <SelectCreatable
          {...commonProps}
          isMulti={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            isMulti
          }
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          options={
            typeof field.options === 'function'
              ? field.options(getValue)
              : field.options
          }
          openMenuOnClick={field.openMenuOnClick}
          maxChar={field.maxChar}
          maxItems={field.maxItems}
          setIsMaxItemsReached={setIsMaxItemsReached}
        />
      );
    }

    if (field.component === 'select-async') {
      return (
        <SelectAsync
          {...commonProps}
          isMulti={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            isMulti
          }
          openMenuOnClick={field.openMenuOnClick}
          loadOptions={(callback, inputValue) =>
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            field.loadOptions(callback, inputValue, getValue)
          }
        />
      );
    }

    if (field.component === 'select-list') {
      return (
        <SelectList
          {...commonProps}
          isMulti={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            isMulti
          }
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          options={
            typeof field.options === 'function'
              ? field.options(getValue)
              : field.options
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
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          options={field.options}
          filter={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            field.dynamicFilter(getValue)
          }
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
            await // @ts-expect-error after enable TS strict mode. Please, try to fix it
            field.loadOptions((radioOptions) => {
              updateFieldOptions({ [field.id]: radioOptions });
              callback(radioOptions);
            });
          }}
          filter={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            field.dynamicFilter(getValue)
          }
          hidden={
            field.hide ? field.hide(getValue, fieldOptions) : field.hidden
          }
        />
      );
    }
  }

  throw new ComponentException(field.component);
}
