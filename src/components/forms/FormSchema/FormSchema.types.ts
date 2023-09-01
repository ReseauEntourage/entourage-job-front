import { ArrayPath, Path, UseFormGetValues } from 'react-hook-form';
import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import { FilterConstant } from 'src/constants/utils';
import { AnyCantFix, StrictUnion } from 'src/utils/Types';

export const FormComponents = {
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

export type IsArrayFilterConstant<T extends FilterConstant | FilterConstant[]> =
  T extends FilterConstant[] ? T : T[];

export type MultiFilterConstant<M extends boolean> = M extends true
  ? FilterConstant[]
  : FilterConstant;

export interface FormComponentValues<M extends boolean> {
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
  [FormComponents.HEADING]: never;
  [FormComponents.TEXT]: never;
  [FormComponents.FIELDGROUP]: never;
  [FormComponents.MULTIPLE_FIELDS]: never;
}

export type MultipleFieldValue = {
  [K in string]: FieldValue;
};

export type FormSchemaValidation = {
  [K in string]: FieldValue | MultipleFieldValue[];
};

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

export const RadioComponents = [
  FormComponents.RADIO,
  FormComponents.RADIO_ASYNC,
] as const;

export type RadioComponent = (typeof RadioComponents)[number];

export const TextComponents = [
  FormComponents.HEADING,
  FormComponents.TEXT,
] as const;
export type TextComponent = (typeof TextComponents)[number];

export const GroupComponents = [FormComponents.FIELDGROUP] as const;
export type GroupComponent = (typeof GroupComponents)[number];

export const MultipleComponents = [FormComponents.MULTIPLE_FIELDS] as const;

export type MultipleComponent = (typeof MultipleComponents)[number];

export type InputComponent =
  | TextInputComponent
  | CheckBoxComponent
  | SelectComponent
  | SelectRequestComponent
  | RadioComponent;

export type GetValueType<V extends FormSchemaValidation> = UseFormGetValues<V>;

interface FormFieldCommonProperties<
  V extends FormSchemaValidation,
  N extends Path<V> | ArrayPath<V | string> = Path<V>
> {
  id: N;
  name: N;
  hidden?: boolean;
  hide?: (
    getValue: GetValueType<V>,
    fieldOptions?: { [x: string]: RadioTypes[] }
  ) => boolean;
}

export interface Rule<
  V extends FormSchemaValidation,
  T extends InputComponent,
  M extends boolean
> {
  method: (fieldValue: FormComponentValues<M>[T], fieldValues: V) => boolean;
  message: string;
}

interface FormFieldInputCommonProperties<
  V extends FormSchemaValidation,
  T extends InputComponent,
  M extends boolean = boolean
> extends FormFieldCommonProperties<V, Path<V>> {
  isRequired?: boolean;
  rules?: Rule<V, T, M>[];
  title: string | JSX.Element | ((getValue: GetValueType<V>) => string);
  disabled?: boolean;
  disable?: (getValue: GetValueType<V>) => boolean;
  placeholder?: string;
  showLabel?: boolean;
}

export interface FormFieldTextInput<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, TextInputComponent> {
  component: TextInputComponent;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  maxLength?: number;
  min?: string;
  max?: string;
}

export interface FormFieldCheckBox<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, CheckBoxComponent> {
  component: CheckBoxComponent;
}

export interface FormFieldSelect<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, SelectComponent> {
  component: SelectComponent;
  fieldsToReset?: Path<V>[];
  options?: FilterConstant[];
}

export interface FormFieldRadio<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, RadioComponent> {
  component: RadioComponent;
  dynamicFilter?: (getValue: GetValueType<V>) => string;
  options?: RadioTypes[];
  loadOptions?: (
    callback: (options: RadioTypes[]) => void,
    inputValue?: string,
    getValue?: GetValueType<V>
  ) => Promise<void> | void;
  errorMessage?: string;
  limit?: number;
}

export interface FormFieldSelectRequestCommon<
  V extends FormSchemaValidation,
  M extends boolean
> extends FormFieldInputCommonProperties<V, SelectRequestComponent, M> {
  component: SelectRequestComponent;
  fieldsToReset?: Path<V>[];
  options?:
    | FilterConstant[]
    | ((getValue: GetValueType<V>) => FilterConstant[]);
  loadOptions?: (
    callback: (options: FilterConstant[]) => void,
    inputValue?: string,
    getValue?: GetValueType<V>
  ) => Promise<void> | void;
  openMenuOnClick?: boolean;
}

interface FormFieldSelectRequestMulti<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, true> {
  isMulti: true;
  maxChar?: number;
  maxItems?: number;
}

interface FormFieldSelectRequestSingle<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, false> {
  isMulti: false;
}

interface FormFieldSelectRequestMethod<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, boolean> {
  isMulti: (getValue: GetValueType<V>) => boolean;
}

// TODO fix type depending on isMulti, should be false when no isMulti property

/*
  type FormFieldSelectRequestOmit<V extends FormSchemaValidation> = Omit<
    FormFieldSelectRequestCommon<V, false>,
    'isMulti'
  >;
*/

export type FormFieldSelectRequest<V extends FormSchemaValidation> =
  StrictUnion<
    | FormFieldSelectRequestMulti<V>
    | FormFieldSelectRequestSingle<V>
    /*  | FormFieldSelectRequestOmit<V> */
    | FormFieldSelectRequestMethod<V>
  >;

export type FormFieldInput<V extends FormSchemaValidation> = StrictUnion<
  | FormFieldTextInput<V>
  | FormFieldCheckBox<V>
  | FormFieldRadio<V>
  | FormFieldSelect<V>
  | FormFieldSelectRequest<V>
>;

export interface FormFieldText<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V, string> {
  title: string | ((getValue: GetValueType<V>) => string);
  component: TextComponent;
}

export interface FormFieldMultiple<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V, ArrayPath<V>> {
  action: string;
  component: MultipleComponent;
  fields: FormFieldInput<V>[];
}

export interface FormFieldGroup<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V, string> {
  component: GroupComponent;
  fields: (FormFieldInput<V> | FormFieldText<V>)[];
}

type FormFieldNonInput<V extends FormSchemaValidation> =
  | FormFieldText<V>
  | FormFieldGroup<V>
  | FormFieldMultiple<V>;

export type FormField<V extends FormSchemaValidation> =
  | FormFieldInput<V>
  | FormFieldNonInput<V>;

export interface FormSchema<V extends FormSchemaValidation> {
  id: string;
  fields: FormField<V>[];
}

export type ExtractFormSchemaValidation<R extends FormSchema<AnyCantFix>> =
  R extends FormSchema<infer V extends FormSchemaValidation> ? V : never;
