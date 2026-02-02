import React, { useCallback, useMemo, useState } from 'react';
import {
  Control,
  Path,
  useController,
  UseFormGetValues,
  UseFormResetField,
  UseFormWatch,
} from 'react-hook-form';

import { Alert } from '@/src/components/ui/Alert';
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
  FileInput,
} from '@/src/components/ui/Inputs';
import { CommonInputProps } from '@/src/components/ui/Inputs/Inputs.types';
import { RadioTypes } from '@/src/components/ui/Inputs/Radio/Radio.types';
import {
  SelectCard,
  SelectCardType,
} from '@/src/components/ui/Inputs/SelectCard';

import {
  SelectList,
  SelectListType,
  SelectListAsync,
} from '@/src/components/ui/Inputs/SelectList';
import {
  ComponentException,
  ExtractFormSchemaValidation,
  FormFieldInput,
  FormSchema,
  isFormFieldRadio,
  isFormFieldSelect,
  isFormFieldSelectGraphic,
  isFormFieldSelectRequest,
  isFormFieldTextInput,
  mapFieldRules,
  Rule,
} from '../FormSchema';
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
  showError?: boolean;
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
  showError = true,
}: GenericFieldProps<S>) {
  const { id: formId } = formSchema;

  let rules = field.rules
    ? mapFieldRules<S, typeof field.component>(
        field.rules as Rule<
          ExtractFormSchemaValidation<S>,
          typeof field.component,
          boolean
        >[]
      )
    : {};

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
      ...(isFormFieldTextInput(field) && field.minLength
        ? {
            minLength: {
              value: field.minLength,
              message: `${field.minLength} caractères minimum`,
            },
          }
        : {}),
      validate: rules || {},
    },
  });

  const allWatch = watch();

  const onChangeCustom = useCallback(
    (updatedValue) => {
      if (isFormFieldSelect(field) || isFormFieldSelectRequest(field)) {
        if (field.fieldsToReset) {
          for (let i = 0; i < field.fieldsToReset.length; i += 1) {
            resetField(field.fieldsToReset[i], {
              defaultValue: undefined,
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
      error: showError ? error : undefined,
      onChange: onChangeCustom,
      onBlur,
      disabled: field.disable ? field.disable(getValue) : field.disabled,
      hidden: field.hide ? field.hide(getValue) : field.hidden,
      inputRef: ref,
      placeholder:
        typeof field.placeholder === 'function'
          ? field.placeholder(getValue)
          : field.placeholder,
      showLabel: field.showLabel,
      showOptional: field.showOptional,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    field,
    error,
    formId,
    getValue,
    name,
    onBlur,
    onChangeCustom,
    ref,
    showError,
    value,
    allWatch,
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

  if (field.component === 'file-input') {
    return (
      <FileInput
        {...commonProps}
        accept={field.accept}
        fileType={field.fileType}
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

  if (field.component === 'checkbox-alert') {
    return (
      <Alert icon={null}>
        <div style={{ marginTop: 15 }}>
          <CheckBox {...commonProps} />
        </div>
      </Alert>
    );
  }

  if (field.component === 'select-simple') {
    const { options } = field;

    return <SelectSimple {...commonProps} options={options} />;
  }

  if (isFormFieldSelectRequest(field)) {
    const isMulti =
      typeof field.isMulti === 'function'
        ? field.isMulti(getValue)
        : field.isMulti;

    const options =
      (typeof field.options === 'function'
        ? field.options(getValue)
        : field.options) || [];

    const placeholder =
      typeof field.placeholder === 'function'
        ? field.placeholder(getValue)
        : field.placeholder;

    if (field.component === 'select') {
      return (
        <Select
          {...commonProps}
          placeholder={placeholder}
          isMulti={isMulti}
          options={options}
          openMenuOnClick={field.openMenuOnClick}
        />
      );
    }

    if (field.component === 'select-creatable') {
      return (
        <SelectCreatable
          {...commonProps}
          placeholder={placeholder}
          isMulti={isMulti}
          options={options}
          openMenuOnClick={field.openMenuOnClick}
          maxChar={field.maxChar}
          maxItems={field.maxItems}
          setIsMaxItemsReached={setIsMaxItemsReached}
          loadOptions={
            field.loadOptions
              ? async (callback, inputValue) => {
                  if (field.loadOptions) {
                    await field.loadOptions(callback, inputValue, getValue);
                  }
                }
              : undefined
          }
        />
      );
    }

    if (field.component === 'select-async') {
      return (
        <SelectAsync
          {...commonProps}
          placeholder={placeholder}
          isMulti={isMulti}
          openMenuOnClick={field.openMenuOnClick}
          loadOptions={async (callback, inputValue) => {
            if (field.loadOptions) {
              await field.loadOptions(callback, inputValue, getValue);
            }
          }}
        />
      );
    }
  }

  if (isFormFieldSelectGraphic(field)) {
    if (field.component === 'select-list') {
      return (
        <SelectList
          key={field.name}
          {...commonProps}
          isMulti={field.isMulti}
          options={
            (typeof field.options === 'function'
              ? field.options(getValue)
              : field.options) as SelectListType[]
          }
        />
      );
    }
    if (field.component === 'select-list-async') {
      return (
        <SelectListAsync
          key={field.name}
          {...commonProps}
          isMulti={field.isMulti}
          loadOptions={async (callback) => {
            if (field.loadOptions) {
              await field.loadOptions(callback);
            }
          }}
        />
      );
    }
    if (field.component === 'select-card') {
      return (
        <SelectCard
          {...commonProps}
          isMulti={field.isMulti}
          optionsToDisable={
            field.optionsToDisable
              ? field.optionsToDisable(getValue)
              : undefined
          }
          options={
            (typeof field.options === 'function'
              ? field.options(getValue)
              : field.options) as SelectCardType[]
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
          subtitle={field.subtitle || ''}
          options={field.options || []}
          optionsToDisable={
            field.optionsToDisable
              ? field.optionsToDisable(getValue)
              : undefined
          }
          filter={
            field.dynamicFilter ? field.dynamicFilter(getValue) : undefined
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
          errorMessage={field.errorMessage}
          loadOptions={async (callback) => {
            if (field.loadOptions) {
              await field.loadOptions((radioOptions) => {
                updateFieldOptions({ [field.id]: radioOptions });
                callback(radioOptions);
              });
            }
          }}
          filter={
            field.dynamicFilter ? field.dynamicFilter(getValue) : undefined
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
