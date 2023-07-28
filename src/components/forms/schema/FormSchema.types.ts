import { FilterConstant } from 'src/constants';
import { AnyCantFix, AnyToFix } from 'src/utils/Types';

type InputComponent =
  | 'datepicker'
  | 'text-input'
  | 'tel-input'
  | 'textarea'
  | 'checkbox';

type SelectComponent =
  | 'select-simple'
  | 'select'
  | 'select-creatable'
  | 'select-async'
  | 'radio'
  | 'radio-async';

type TextComponent = 'heading' | 'text';
type GroupComponent = 'fieldgroup';
type MultipleComponent = 'multiple-fields';

interface FormFieldInput {
  id: string;
  name: string;
  title: string | JSX.Element;
  placeholder?: string;
  showLabel?: boolean;
  component: InputComponent;
  type?: 'text' | 'email' | 'password';
  rows?: number;
  maxLines?: { lines: number; width: number };
  min?: string;
  max?: string;
  disabled?: boolean;
  disable?: (getValue: (name: string) => AnyToFix) => boolean;
  hidden?: boolean;
  hide?: (
    getValue: (name: string) => AnyToFix,
    fieldOptions?: AnyToFix
  ) => boolean;
}

interface FormFieldSelect<T extends FilterConstant[] = AnyCantFix> {
  id: string;
  name: string;
  title: string;
  dynamicTitle?: (getValue: (name: string) => AnyToFix) => string;
  placeholder?: string;
  showLabel?: boolean;
  component: SelectComponent;
  disabled?: boolean;
  disable?: (getValue: (name: string) => AnyToFix) => boolean;
  hidden?: boolean;
  hide?: (
    getValue: (name: string) => AnyToFix,
    fieldOptions?: AnyToFix
  ) => boolean;
  dynamicFilter?: (getValue: (name: string) => AnyToFix) => string;
  fieldsToReset?: string[];
  options?: T;
  loadOptions?:
    | ((
        inputValue: AnyToFix,
        callback: (options: FilterConstant[]) => void
      ) => Promise<void> | void)
    | (() => Promise<T[]>);
  isMulti?: boolean;
  openMenuOnClick?: boolean;
  errorMessage?: string;
  limit?: number;
}

interface FormFieldText {
  id: string;
  title: string;
  dynamicTitle?: (getValue: (name: string) => AnyToFix) => string;
  component: TextComponent;
  hide?: (
    getValue: (name: string) => AnyToFix,
    fieldOptions: AnyToFix
  ) => boolean;
}

interface FormFieldMultiple {
  id: string;
  name: string;
  action: string;
  component: MultipleComponent;
  fields: (FormFieldInput | FormFieldSelect | FormFieldText)[];
}

interface FormFieldGroup {
  id: string;
  hidden?: boolean;
  ide?: (getValue: (name: string) => AnyToFix) => boolean;
  component: GroupComponent;
  fields: (FormFieldInput | FormFieldSelect | FormFieldText)[];
}

type FormField =
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
