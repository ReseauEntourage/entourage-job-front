import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import { FilterConstant } from 'src/constants';
import { AnyToFix } from 'src/utils/Types';

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
  : M extends false
  ? FilterConstant
  : FilterConstant | FilterConstant[];

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

// export type FormFieldName<S> = keyof S & string;

interface FormFieldCommonProperties<S> {
  id: S;
  name: S;
}

// export type GetValueType = (name: FormFieldName<S>) => S[FormFieldName<S>];

export type GetValueType = (name: string) => AnyToFix;

interface Rule<T extends InputComponent, S, M extends boolean> {
  method: (fieldValue: FormComponentValues<M>[T], fieldValues: S) => boolean;
  args?: AnyToFix[];
  message: string;
}

interface FormFieldInputCommonProperties<
  T extends InputComponent,
  S,
  M extends boolean = boolean
> extends FormFieldCommonProperties<S> {
  isRequired?: boolean;
  rules?: Rule<T, S, M>[];
  title: string | JSX.Element | ((getValue: GetValueType) => string);
  disabled?: boolean;
  disable?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
  hide?: (getValue: GetValueType, fieldOptions?: AnyToFix) => boolean;
  placeholder?: string;
  showLabel?: boolean;
}

export interface FormFieldTextInput<S>
  extends FormFieldInputCommonProperties<TextInputComponent, S> {
  component: TextInputComponent;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  maxLength?: number;
  min?: string;
  max?: string;
}

export interface FormFieldCheckBox<S>
  extends FormFieldInputCommonProperties<CheckBoxComponent, S> {
  component: CheckBoxComponent;
}

export interface FormFieldSelect<S>
  extends FormFieldInputCommonProperties<SelectComponent, S> {
  component: SelectComponent;
  dynamicFilter?: (getValue: GetValueType) => string;
  fieldsToReset?: string[];
  options?: FilterConstant[];
  loadOptions?: (
    callback: (options: FilterConstant[] | RadioTypes[]) => void,
    inputValue?: string,
    getValue?: GetValueType
  ) => Promise<void> | void;
  errorMessage?: string;
  limit?: number;
}
export interface FormFieldSelectRequestCommon<S, M extends boolean>
  extends FormFieldInputCommonProperties<SelectRequestComponent, S, M> {
  component: SelectRequestComponent;
  fieldsToReset?: string[];
  options?: FilterConstant[];
  loadOptions?: (
    callback: (options: FilterConstant[] | RadioTypes[]) => void,
    inputValue?: string,
    getValue?: GetValueType
  ) => Promise<void> | void;
  openMenuOnClick?: boolean;
}

// TODO fix type depending on is Multi
interface FormFieldSelectRequestMulti<S>
  extends FormFieldSelectRequestCommon<S, true> {
  isMulti: true;
}

interface FormFieldSelectRequestSingle<S>
  extends FormFieldSelectRequestCommon<S, false> {
  isMulti: false;
}

interface FormFieldSelectRequestMethod<S>
  extends FormFieldSelectRequestCommon<S, boolean> {
  isMulti: (getValue: (name: string) => AnyToFix) => boolean;
}

type FormFieldSelectRequestOmit<S> = Omit<
  FormFieldSelectRequestCommon<S, false>,
  'isMulti'
>;

export type FormFieldSelectRequest<S> =
  | FormFieldSelectRequestMulti<S>
  | FormFieldSelectRequestSingle<S>
  | FormFieldSelectRequestOmit<S>
  | FormFieldSelectRequestMethod<S>;

export type FormFieldInput<S> =
  | FormFieldTextInput<S>
  | FormFieldCheckBox<S>
  | FormFieldSelect<S>
  | FormFieldSelectRequest<S>;

export interface FormFieldText<S> extends FormFieldCommonProperties<S> {
  title: string | ((getValue: GetValueType) => string);
  component: TextComponent;
  hide?: (getValue: GetValueType, fieldOptions?: AnyToFix) => boolean;
  hidden?: boolean;
}

export interface FormFieldMultiple<S> extends FormFieldCommonProperties<S> {
  action: string;
  component: MultipleComponent;
  fields: FormFieldInput<S>[];
  hide?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
}

export interface FormFieldGroup<S> extends FormFieldCommonProperties<S> {
  component: GroupComponent;
  fields: (FormFieldInput<S> | FormFieldText<S>)[];
  hide?: (getValue: GetValueType) => boolean;
  hidden?: boolean;
}

export type FormField<S> =
  | FormFieldInput<S>
  | FormFieldText<S>
  | FormFieldMultiple<S>
  | FormFieldGroup<S>;

export interface FormSchema {
  id: string;
  fields: FormField<string>[];
}
