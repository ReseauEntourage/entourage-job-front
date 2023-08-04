import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import { FilterConstant } from 'src/constants';
import { AnyCantFix, AnyToFix } from 'src/utils/Types';

const FormComponents = {
  DATEPICKER: 'datepicker',
  TEXT_INPUT: 'text-input',
  TEL_INPUT: 'tel-input',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  SELECT_SIMPLE: 'select-simple',
  SELECT: 'select',
  SELECT_CREATABLE: 'select-creatable',
  SELECT_ASYNC: 'select-async',
  RADIO: 'radio',
  RADIO_ASYNC: 'radio-async',
  HEADING: 'heading',
  TEXT: 'text',
  FIELDGROUP: 'fieldgroup',
  MULTIPLE_FIELDS: 'multiple-fields',
} as const;

export type FormComponent =
  (typeof FormComponents)[keyof typeof FormComponents];

export type FieldValue =
  | string
  | boolean
  | number
  | FilterConstant
  | FilterConstant[];

type MultiFilterConstant<M extends boolean> = M extends true
  ? FilterConstant[]
  : FilterConstant;

interface FormComponentValues<M extends boolean>
  extends Record<FormComponent, FieldValue> {
  [FormComponents.DATEPICKER]: string;
  [FormComponents.TEXT_INPUT]: string;
  [FormComponents.TEL_INPUT]: string;
  [FormComponents.TEXTAREA]: string;
  [FormComponents.CHECKBOX]: boolean;
  [FormComponents.SELECT_SIMPLE]: string | number;
  [FormComponents.SELECT]: MultiFilterConstant<M>;
  [FormComponents.SELECT_CREATABLE]: MultiFilterConstant<M>;
  [FormComponents.SELECT_ASYNC]: MultiFilterConstant<M>;
  [FormComponents.RADIO]: string | number;
  [FormComponents.RADIO_ASYNC]: string | number;
}

export const TextInputComponents = [
  FormComponents.DATEPICKER,
  FormComponents.TEXT_INPUT,
  FormComponents.TEL_INPUT,
  FormComponents.TEXTAREA,
] as const;

export type TextInputComponent = (typeof TextInputComponents)[number];

export const CheckBoxComponents = [FormComponents.CHECKBOX] as const;

export type CheckBoxComponent = (typeof CheckBoxComponents)[number];
export const SelectRequestComponents = [
  FormComponents.SELECT,
  FormComponents.SELECT_CREATABLE,
  FormComponents.SELECT_ASYNC,
] as const;

export type SelectRequestComponent = (typeof SelectRequestComponents)[number];

export const SelectComponents = [
  FormComponents.SELECT_SIMPLE,
  FormComponents.RADIO,
  FormComponents.RADIO_ASYNC,
] as const;

export type SelectComponent = (typeof SelectComponents)[number];

export const TextComponents = [
  FormComponents.HEADING,
  FormComponents.TEXT,
] as const;
export type TextComponent = (typeof TextComponents)[number];

export const GroupComponents = [FormComponents.FIELDGROUP] as const;
export type GroupComponent = (typeof GroupComponents)[number];

export const MultipleComponents = [FormComponents.MULTIPLE_FIELDS] as const;

export type MultipleComponent = (typeof MultipleComponents)[number];

type InputComponent =
  | TextInputComponent
  | CheckBoxComponent
  | SelectComponent
  | SelectRequestComponent;

interface FormFieldCommonProperties {
  id: string;
  name: string;
}

interface FormTypes {
  test: string;
}

export type FormType = keyof FormTypes;

// export type GetValueType<K extends FormType> = (name: K) => FormTypes[K];
export type GetValueType = (name: string) => AnyToFix;

interface Rule<T extends InputComponent, M extends boolean> {
  method: (
    fieldValue: FormComponentValues<M>[T],
    fieldValues: { [K in FormType]: FormTypes[K] }
  ) => boolean;
  args?: AnyToFix[];
  message: string;
}

interface FormFieldInputCommonProperties<
  T extends InputComponent,
  M extends boolean = false
> extends FormFieldCommonProperties {
  isRequired?: boolean;
  rules?: Rule<T, M>[];
  title: string | JSX.Element | ((getValue: GetValueType) => string);
  disabled?: boolean;
  disable?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
  hide?: (getValue: GetValueType, fieldOptions?: AnyToFix) => boolean;
  placeholder?: string;
  showLabel?: boolean;
}

export interface FormFieldTextInput
  extends FormFieldInputCommonProperties<TextInputComponent> {
  component: TextInputComponent;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  maxLength?: number;
  min?: string;
  max?: string;
}

export interface FormFieldCheckBox
  extends FormFieldInputCommonProperties<CheckBoxComponent> {
  component: CheckBoxComponent;
}

export interface FormFieldSelect<K extends FilterConstant[] = AnyToFix>
  extends FormFieldInputCommonProperties<SelectComponent> {
  component: SelectComponent;
  dynamicFilter?: (getValue: GetValueType) => string;
  fieldsToReset?: string[];
  options?: K;
  loadOptions?: (
    callback: (options: FilterConstant[] | RadioTypes[]) => void,
    inputValue?: string,
    getValue?: GetValueType
  ) => Promise<void> | void;
  errorMessage?: string;
  limit?: number;
}
export interface FormFieldSelectRequestCommon<
  K extends FilterConstant[],
  M extends boolean
> extends FormFieldInputCommonProperties<SelectRequestComponent, M> {
  component: SelectRequestComponent;
  fieldsToReset?: string[];
  options?: K;
  loadOptions?: (
    callback: (options: FilterConstant[] | RadioTypes[]) => void,
    inputValue?: string,
    getValue?: GetValueType
  ) => Promise<void> | void;
  openMenuOnClick?: boolean;
  isMulti?: boolean | ((getValue: (name: string) => AnyToFix) => boolean);
}

// TODO fix type depending on is Multi
interface FormFieldSelectRequestMulti<K extends FilterConstant[]>
  extends FormFieldSelectRequestCommon<K, true> {
  isMulti?: true;
}

interface FormFieldSelectRequestSingle<K extends FilterConstant[]>
  extends FormFieldSelectRequestCommon<K, false> {
  isMulti?: false;
}

export type FormFieldSelectRequest<K extends FilterConstant[] = AnyToFix> =
  | FormFieldSelectRequestMulti<K>
  | FormFieldSelectRequestSingle<K>

export type FormFieldInput =
  | FormFieldTextInput
  | FormFieldCheckBox
  | FormFieldSelect
  | FormFieldSelectRequest;

export interface FormFieldText extends FormFieldCommonProperties {
  id: string;
  name: string;
  title: string | ((getValue: GetValueType) => string);
  component: TextComponent;
  hide?: (getValue: GetValueType, fieldOptions?: AnyToFix) => boolean;
  hidden?: boolean;
}

export interface FormFieldMultiple extends FormFieldCommonProperties {
  id: string;
  name: string;
  action: string;
  component: MultipleComponent;
  fields: FormFieldInput[];
  hide?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
}

export interface FormFieldGroup extends FormFieldCommonProperties {
  component: GroupComponent;
  fields: (FormFieldInput | FormFieldText)[];
  hide?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
}

export type FormField =
  | FormFieldInput
  | FormFieldText
  | FormFieldMultiple
  | FormFieldGroup;

export interface FormSchema {
  id: string;
  fields: FormField[];
}

const test: FormFieldSelectRequest = {
  component: undefined,
  id: '',
  name: '',
  options: undefined,
  title: undefined,
  isMulti: true,
  rules: [
    {
      method: (fieldValue) => {
        return true;
      },
      message: 'oui',
    },
  ],
};
