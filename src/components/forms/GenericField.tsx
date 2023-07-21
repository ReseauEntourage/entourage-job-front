import React, { ChangeEvent, useCallback } from 'react';
import ReactSelect, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { SimpleLink } from 'src/components/utils';

import {
  CheckBox as CheckBoxNew,
  useCheckBox,
} from 'src/components/utils/Inputs/CheckBox';
import { DatePicker as DatePickerNew } from 'src/components/utils/Inputs/Datepicker';
import { Heading } from 'src/components/utils/Inputs/Heading';
import { PhoneInput as PhoneInputNew } from 'src/components/utils/Inputs/PhoneInput';
import {
  Radio as RadioNew,
  RadioAsync as RadioAsyncNew,
} from 'src/components/utils/Inputs/Radio';
import { Select as SelectNew } from 'src/components/utils/Inputs/Select';
import { SelectAsync as AsyncSelectNew } from 'src/components/utils/Inputs/SelectAsync';
import { TextArea as TextAreaNew } from 'src/components/utils/Inputs/TextArea';
import { TextInput as TextInputNew } from 'src/components/utils/Inputs/TextInput';
import { EXTERNAL_LINKS } from 'src/constants';
import { AnyToFix } from 'src/utils/Types';

interface GenericFieldProps {
  data: AnyToFix;
  formId: string;
  value: AnyToFix;
  onChange: (e: ChangeEvent | ChangeEvent[]) => void;
  getValid: (name: string) =>
    | {
        isInvalid: boolean;
        message: string;
      }
    | undefined;
  getValue: (name: string) => AnyToFix;
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

  switch (data.component) {
    case 'datepicker-new': {
      return (
        <DatePickerNew
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
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
        <TextInputNew
          id={`${formId}-${data.id}`}
          valid={getValid(data.name)}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          onChange={onChangeCustom}
          type={data.type}
          name={data.name}
          value={value}
          placeholder={data.placeholder}
          showLabel={data.showLabel}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }
    case 'tel-input': {
      return (
        <PhoneInputNew
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
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

    case 'select-new':
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
        <SelectNew
          id={`${formId}-${data.id}`}
          // placeholder={data.placeholder}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
          options={options}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          showLabel={data.showLabel}
          // disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );

    case 'textarea-new': {
      return (
        <TextAreaNew
          id={`${formId}-${data.id}`}
          name={data.name}
          maxLines={data.maxLines}
          onChange={onChangeCustom}
          value={value}
          valid={getValid(data.name)}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
        />
      );
    }
    case 'checkbox-new': {
      return (
        <CheckBoxNew
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
        <CheckBoxNew
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
          value={value}
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
    case 'select-request-async-new': {
      const isMultiDefined = data.isMulti || false;

      const isMulti =
        typeof isMultiDefined === 'function'
          ? isMultiDefined(getValue)
          : isMultiDefined;

      const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

      return (
        <AsyncSelectNew
          id={`${formId}-${data.id}`}
          cacheOptions={data.cacheOptions}
          defaultOptions={data.defaultOptions}
          value={value}
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
    case 'select-request': {
      const shouldHide = data.hide ? data.hide(getValue) : data.hidden;
      return (
        <div
          className={`uk-padding-small ${
            getValid(data.name) !== undefined ? 'uk-padding-remove-bottom' : ''
          } uk-padding-remove-left uk-padding-remove-right ${
            shouldHide ? ' uk-hidden' : ''
          }`}
          style={{ marginBottom: 8 }}
        >
          {(data.title || data.dynamicTitle) && (
            <label className="uk-form-label" htmlFor={`${formId}-${data.id}`}>
              {data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
            </label>
          )}
          <ReactSelect
            id={`${formId}-${data.id}`}
            isMulti={data.isMulti}
            name={data.name}
            value={value}
            options={data.options}
            className="basic-multi-select"
            isClearable
            classNamePrefix="select"
            placeholder={data.placeholder || 'Sélectionnez...'}
            noOptionsMessage={
              data.noOptionsMessage ||
              (() => {
                return `Aucun résultat`;
              })
            }
            onChange={parseValueToReturnSelect}
            isDisabled={data.disable ? data.disable(getValue) : false}
            isHidden={data.hide ? data.hide(getValue) : false}
            openMenuOnClick={data.openMenuOnClick || true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
      );
    }
    case 'radio-new': {
      return (
        <RadioNew
          limit={data.limit}
          options={data.options}
          id={`${formId}-${data.id}`}
          name={data.name}
          legend={data.title}
          onChange={onChangeCustom}
          filter={data.dynamicFilter(getValue)}
          hidden={data.hide ? data.hide(getValue, fieldOptions) : data.hidden}
          value={value}
        />
      );
    }
    case 'radio-async-new': {
      return (
        <RadioAsyncNew
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
          value={value}
        />
      );
    }
    case 'select-request-creatable': {
      const hasOptions = data.options && data.options.length > 0;

      const DropdownIndicator = (props) => {
        return <components.DropdownIndicator {...props} />;
      };

      const customComponents = {
        DropdownIndicator: hasOptions ? DropdownIndicator : null,
      };
      const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

      return (
        <div
          className={`uk-padding-small ${
            getValid(data.name) !== undefined ? 'uk-padding-remove-bottom' : ''
          } uk-padding-remove-left uk-padding-remove-right ${
            shouldHide ? ' uk-hidden' : ''
          }`}
        >
          {(data.title || data.dynamicTitle) && (
            <label className="uk-form-label" htmlFor={`${formId}-${data.id}`}>
              {data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
            </label>
          )}
          <CreatableSelect
            id={`${formId}-${data.id}`}
            components={customComponents}
            formatCreateLabel={(userInput) => {
              return `Créer "${userInput}"`;
            }}
            isClearable
            isMulti={data.isMulti}
            name={data.name}
            value={value}
            options={data.options}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder={
              data.placeholder ||
              (hasOptions ? 'Sélectionnez...' : 'Saisissez...')
            }
            noOptionsMessage={
              data.noOptionsMessage ||
              (() => {
                return hasOptions ? `Aucun résultat` : 'Saisissez un élement';
              })
            }
            onChange={parseValueToReturnSelect}
            isDisabled={data.disable ? data.disable(getValue) : false}
            isHidden={data.hide ? data.hide(getValue) : false}
            openMenuOnClick={data.openMenuOnClick || true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
      );
    }

    case 'heading': {
      if (data.hide && data.hide(getValue, fieldOptions)) {
        return null;
      }
      return <Heading id={`${formId}-${data.id}`} title={data.title} />;
    }
    case 'text-new': {
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
