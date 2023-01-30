import React from 'react';
import ReactSelect, { components } from 'react-select';
import AsyncSelectNew from 'src/components/utils/Inputs/SelectAsync';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'src/components/forms/fields/DatePicker';
import Select from 'src/components/forms/fields/Select';
import Textarea from 'src/components/forms/fields/Textarea';
import Checkbox from 'src/components/forms/fields/Checkbox';
import Input from 'src/components/forms/fields/Input';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import PhoneInput from 'src/components/forms/fields/PhoneInput';
import { StyledFormHeading } from 'src/components/forms/Forms.styles';

import CheckBoxNew from 'src/components/utils/Inputs/Checkbox';
import DatepickerNew from 'src/components/utils/Inputs/Datepicker';
import SelectNew from 'src/components/utils/Inputs/Select';
import TextareaNew from 'src/components/utils/Inputs/TextArea';
import TextInputNew from 'src/components/utils/Inputs/TextInput';

let debounceTimeoutId;

const GenericField = ({
  data,
  formId,
  value,
  onChange,
  getValid,
  getValue,
}) => {
  const onChangeCustom = (event) => {
    let events = [event];
    if (data.fieldsToReset) {
      events = [
        ...events,
        ...data.fieldsToReset.map((field) => {
          return {
            target: { name: field, value: undefined, selectedIndex: 0 },
          };
        }),
      ];
    }
    onChange(events);
  };

  const parseValueToReturnSelect = (event) => {
    onChangeCustom({
      target: {
        name: data.name,
        value: event,
        type: data.type,
      },
    });
  };

  switch (data.component) {
    case 'input': {
      return (
        <Input
          id={`${formId}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
          type={data.type}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
          autocomplete={data.autocomplete}
          min={data.min}
          max={data.max}
        />
      );
    }
    case 'tel': {
      return (
        <PhoneInput
          id={`${formId}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
          type={data.type}
          valid={getValid(data.name)}
          onChange={parseValueToReturnSelect}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
          autocomplete={data.autocomplete}
        />
      );
    }
    case 'datepicker': {
      return (
        <DatePicker
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
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          onChange={onChangeCustom}
          type={data.type}
          name={data.name}
        />
      );
    }

    case 'select-new':
    case 'select': {
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

      let valueToUse = value;
      if (!valueToUse) valueToUse = options[0].value;

      if (data.component === 'select') {
        return (
          <Select
            id={`${formId}-${data.id}`}
            placeholder={data.placeholder}
            name={data.name}
            title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
            value={valueToUse}
            options={options}
            valid={getValid(data.name)}
            onChange={onChangeCustom}
            disabled={data.disable ? data.disable(getValue) : data.disabled}
            hidden={data.hide ? data.hide(getValue) : data.hidden}
          />
        );
      }
      return (
        <SelectNew
          id={`${formId}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          // value={valueToUse}
          options={options}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          // disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }

    case 'textarea-new': {
      return (
        <TextareaNew
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
        />
      );
    }
    case 'textarea': {
      return (
        <Textarea
          id={`${formId}-${data.id}`}
          name={data.name}
          row={data.row}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          type={data.type}
          value={value}
          placeholder={data.placeholder}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
          maxLength={data.maxLength}
        />
      );
    }
    case 'checkbox-new': {
      return (
        <CheckBoxNew
          handleClick={onChangeCustom}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          value={value}
          checked={data.checked}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
        />
      );
    }
    case 'checkbox': {
      return (
        <Checkbox
          id={`${formId}-${data.id}`}
          name={data.name}
          title={data.dynamicTitle ? data.dynamicTitle(getValue) : data.title}
          value={value}
          valid={getValid(data.name)}
          onChange={onChangeCustom}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }
    case 'cgu': {
      return (
        <Checkbox
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
          onChange={onChangeCustom}
          disabled={data.disable ? data.disable(getValue) : data.disabled}
          hidden={data.hide ? data.hide(getValue) : data.hidden}
        />
      );
    }
    case 'select-request-async': {
      let valueToUse = null;
      if (value) {
        if (data.isMulti) {
          valueToUse = value.every((v) => {
            return typeof v === 'object';
          })
            ? value
            : getValue(value);
        } else {
          valueToUse = typeof value === 'string' ? getValue(value) : value;
        }
      }

      console.log(data); 

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
          <AsyncSelect
            id={`${formId}-${data.id}`}
            cacheOptions={
              data.cacheOptions === undefined ? true : data.cacheOptions
            }
            isClearable
            defaultOptions
            value={valueToUse}
            isMulti={data.isMulti}
            placeholder={data.placeholder || 'Sélectionnez...'}
            noOptionsMessage={
              data.noOptionsMessage ||
              (() => {
                return `Aucun résultat`;
              })
            }
            loadOptions={(inputValue, callback) => {
              clearTimeout(debounceTimeoutId);
              debounceTimeoutId = setTimeout(() => {
                return data.loadOptions(inputValue, callback, getValue);
              }, 1000);
            }}
            isDisabled={data.disable ? data.disable(getValue) : false}
            isHidden={data.hide ? data.hide(getValue) : false}
            onChange={parseValueToReturnSelect}
            openMenuOnClick={data.openMenuOnClick ?? true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
      );
    }
    case 'select-request-async-new': {
      let valueToUse = null;
      if (value) {
        if (data.isMulti) {
          valueToUse = value.every((v) => {
            return typeof v === 'object';
          })
            ? value
            : getValue(value);
        } else {
          valueToUse = typeof value === 'string' ? getValue(value) : value;
        }
      };


      // const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

      return (
        <div>
          <AsyncSelectNew
            id={`${formId}-${data.id}`}
            cacheOptions={
              data.cacheOptions === undefined ? true : data.cacheOptions
            }
            isClearable
            defaultOptions
            value={valueToUse}
            isMulti={data.isMulti}
            placeholder={data.placeholder || 'Sélectionnez...'}
            noOptionsMessage={
              data.noOptionsMessage ||
              (() => {
                return `Aucun résultat`;
              })
            }
            loadOptions={(inputValue, callback) => {
              clearTimeout(debounceTimeoutId);
              debounceTimeoutId = setTimeout(() => {
                return data.loadOptions(inputValue, callback, getValue);
              }, 1000);
            }}
            isDisabled={data.disable ? data.disable(getValue) : false}
            isHidden={data.hide ? data.hide(getValue) : false}
            onChange={parseValueToReturnSelect}
            openMenuOnClick={data.openMenuOnClick ?? true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
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
            openMenuOnClick={data.openMenuOnClick ?? true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
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
            openMenuOnClick={data.openMenuOnClick ?? true}
          />
          <FormValidatorErrorMessage validObj={getValid(data.name)} />
        </div>
      );
    }

    case 'heading': {
      return <StyledFormHeading>{data.title}</StyledFormHeading>;
    }
    case 'text': {
      return (
        <p className="uk-margin-top uk-text-bold uk-text-italic">
          {data.title}
        </p>
      );
    }
    default:
      throw `component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
  }
};

GenericField.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({})),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({}),
      PropTypes.string,
    ])
  ).isRequired,
  formId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
  onChange: PropTypes.func.isRequired,
  getValid: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

GenericField.defaultProps = {
  value: undefined,
};

export default GenericField;
