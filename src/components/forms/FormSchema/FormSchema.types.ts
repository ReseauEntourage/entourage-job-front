import { Path, UseFormGetValues } from 'react-hook-form';
import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import { FilterConstant } from 'src/constants';
import { AnyCantFix } from 'src/utils/Types';

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

type MultiFilterConstant<M extends boolean> = M extends true
  ? FilterConstant[]
  : M extends false
  ? FilterConstant
  : FilterConstant | FilterConstant[];

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

// TODO remove boolean
// export type FormComponent = keyof FormComponentValues<boolean>;

export type FormSchemaValidation = {
  [K in string]: FieldValue;
};

type FormFieldName<V extends FormSchemaValidation> = keyof V & string;

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

type InputComponent =
  | TextInputComponent
  | CheckBoxComponent
  | SelectComponent
  | SelectRequestComponent;

// export type FormFieldName = keyof S & string;

export type GetValueType<V extends FormSchemaValidation> = UseFormGetValues<V>;

interface FormFieldCommonProperties<V extends FormSchemaValidation> {
  id: Path<V>;
  name: Path<V>;
  hidden?: boolean;
  hide?: (
    getValue: GetValueType<V>,
    fieldOptions?: { [x: string]: RadioTypes[] }
  ) => boolean;
}

interface Rule<
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
> extends FormFieldCommonProperties<V> {
  isRequired?: boolean;
  rules?: Rule<V, T, M>[];
  title: string | JSX.Element | ((getValue: GetValueType<V>) => string);
  disabled?: boolean;
  disable?: (getValue: GetValueType<V>) => boolean;
  placeholder?: string;
  showLabel?: boolean;
}

export type CheckIfValueIsCompatible<
  F,
  T extends InputComponent
> = F extends FormComponentValues<boolean>[T] ? T : never;
/*
type CanExtend<A, B> = A extends B ? true : false;

type FieldValueCanExtendComponentValue<
  FieldValue,
  ComponentValue extends FormComponentValues<boolean>
> = CanExtend<FieldValue, ComponentValue>; */

export interface FormFieldTextInput<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, TextInputComponent> {
  component: CheckIfValueIsCompatible<V[Path<V>], TextInputComponent>;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  maxLength?: number;
  min?: string;
  max?: string;
}

export interface FormFieldCheckBox<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, CheckBoxComponent> {
  component: CheckIfValueIsCompatible<V[Path<V>], CheckBoxComponent>;
}

export interface FormFieldSelect<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, SelectComponent> {
  component: CheckIfValueIsCompatible<V[Path<V>], SelectComponent>;
  fieldsToReset?: Path<V>[];
  options?: FilterConstant[] | Readonly<FilterConstant>;
}

export interface FormFieldRadio<V extends FormSchemaValidation>
  extends FormFieldInputCommonProperties<V, RadioComponent> {
  component: CheckIfValueIsCompatible<V[Path<V>], RadioComponent>;
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
  component: CheckIfValueIsCompatible<V[Path<V>], SelectRequestComponent>;
  fieldsToReset?: Path<V>[];
  options?: FilterConstant[];
  loadOptions?: (
    callback: (options: FilterConstant[]) => void,
    inputValue?: string,
    getValue?: GetValueType<V>
  ) => Promise<void> | void;
  openMenuOnClick?: boolean;
}

// TODO fix type depending on is Multi
interface FormFieldSelectRequestMulti<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, true> {
  isMulti: true;
}

interface FormFieldSelectRequestSingle<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, false> {
  isMulti: false;
}

interface FormFieldSelectRequestMethod<V extends FormSchemaValidation>
  extends FormFieldSelectRequestCommon<V, boolean> {
  isMulti: (getValue: GetValueType<V>) => boolean;
}

type FormFieldSelectRequestOmit<V extends FormSchemaValidation> = Omit<
  FormFieldSelectRequestCommon<V, false>,
  'isMulti'
>;

export type FormFieldSelectRequest<V extends FormSchemaValidation> =
  | FormFieldSelectRequestMulti<V>
  | FormFieldSelectRequestSingle<V>
  | FormFieldSelectRequestOmit<V>
  | FormFieldSelectRequestMethod<V>;

export type FormFieldInput<V extends FormSchemaValidation> =
  | FormFieldTextInput<V>
  | FormFieldCheckBox<V>
  | FormFieldRadio<V>
  | FormFieldSelect<V>
  | FormFieldSelectRequest<V>;

export interface FormFieldText<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V> {
  title: string | ((getValue: GetValueType<V>) => string);
  component: TextComponent;
}

export interface FormFieldMultiple<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V> {
  action: string;
  component: MultipleComponent;
  fields: FormFieldInput<V>[];
}

export interface FormFieldGroup<V extends FormSchemaValidation>
  extends FormFieldCommonProperties<V> {
  component: GroupComponent;
  fields: (FormFieldInput<V> | FormFieldText<V>)[];
}

export type FormField<V extends FormSchemaValidation> =
  | FormFieldInput<V>
  | FormFieldText<V>
  | FormFieldMultiple<V>
  | FormFieldGroup<V>;

export interface FormSchema<V extends FormSchemaValidation> {
  id: string;
  fields: FormField<V>[];
}

export type ExtractFormSchemaValidation<R extends FormSchema<AnyCantFix>> =
  R extends FormSchema<infer V extends FormSchemaValidation> ? V : never;

/*

export type FormSchemaValidation<V extends FormSchema> = {
  [K in S['fields'][number]['name']]: FormComponentValues<boolean>[Extract<
    S['fields'][number],
    { name: K }
  >['component']];

};
*/

/* export type FormSchemaComponent<R> = R extends FormSchema<
  infer S extends SchemaComponents
>
  ? S
  : never; */
