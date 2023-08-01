import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import { FilterConstant } from 'src/constants';
import { AnyCantFix, AnyToFix } from 'src/utils/Types';

export const InputComponents = [
  'datepicker',
  'text-input',
  'tel-input',
  'textarea',
  'checkbox',
] as const;

export type InputComponent = (typeof InputComponents)[number];

export const SelectComponents = [
  'select-simple',
  'select',
  'select-creatable',
  'select-async',
  'radio',
  'radio-async',
] as const;
export type SelectComponent = (typeof SelectComponents)[number];

export const TextComponents = ['heading', 'text'] as const;
export type TextComponent = (typeof TextComponents)[number];

export const GroupComponents = ['fieldgroup'] as const;
export type GroupComponent = (typeof GroupComponents)[number];

export const MultipleComponents = ['multiple-fields'] as const;

export type MultipleComponent = (typeof MultipleComponents)[number];

export type FormComponent =
  | InputComponent
  | SelectComponent
  | TextComponent
  | GroupComponent
  | MultipleComponent;

interface FormFieldCommonProperties {
  id: string;
  name: string;
}

interface FormFieldInputCommonProperties extends FormFieldCommonProperties {
  isRequired?: boolean;
  title:
    | string
    | JSX.Element
    | ((getValue: (name: string) => AnyToFix) => string);
  disabled?: boolean;
  disable?: (getValue: (name: string) => AnyToFix) => boolean;
  hidden?: boolean;
  hide?: (
    getValue: (name: string) => AnyToFix,
    fieldOptions?: AnyToFix
  ) => boolean;
  placeholder?: string;
  showLabel?: boolean;
}

export interface FormFieldInput extends FormFieldInputCommonProperties {
  component: InputComponent;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  min?: string;
  max?: string;
}

export interface FormFieldSelect<T extends FilterConstant[] = AnyCantFix>
  extends FormFieldInputCommonProperties {
  component: SelectComponent;
  dynamicFilter?: (getValue: (name: string) => AnyToFix) => string;
  fieldsToReset?: string[];
  options?: T;
  loadOptions?: (
    callback: (options: FilterConstant[] | RadioTypes[]) => void,
    inputValue?: string,
    getValue?: (name: string) => AnyToFix
  ) => Promise<void> | void;
  isMulti?: boolean | ((getValue: (name: string) => AnyToFix) => boolean);
  openMenuOnClick?: boolean;
  errorMessage?: string;
  limit?: number;
}

export interface FormFieldText extends FormFieldCommonProperties {
  id: string;
  name: string;
  title: string | ((getValue: (name: string) => AnyToFix) => string);
  component: TextComponent;
  hide?: (
    getValue: (name: string) => AnyToFix,
    fieldOptions?: AnyToFix
  ) => boolean;
  hidden?: boolean;
}

export interface FormFieldMultiple extends FormFieldCommonProperties {
  id: string;
  name: string;
  action: string;
  component: MultipleComponent;
  fields: (FormFieldInput | FormFieldSelect)[];
  hide?: (getValue: (name: string) => AnyToFix) => boolean;
  hidden?: boolean;
}

export interface FormFieldGroup extends FormFieldCommonProperties {
  component: GroupComponent;
  fields: (FormFieldInput | FormFieldSelect | FormFieldText)[];
  hide?: (getValue: (name: string) => AnyToFix) => boolean;
  hidden?: boolean;
}

export type FormField =
  | FormFieldInput
  | FormFieldSelect
  | FormFieldText
  | FormFieldMultiple
  | FormFieldGroup;

interface FormRule {}

export interface FormSchema {
  id: string;
  fields: FormField[];
  rules: AnyToFix; // to be typed
}
