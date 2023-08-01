import {
  FormComponent,
  FormField,
  FormFieldGroup,
  FormFieldInput,
  FormFieldMultiple,
  FormFieldSelect,
  FormFieldText,
  GroupComponent,
  GroupComponents,
  InputComponent,
  InputComponents,
  MultipleComponent,
  MultipleComponents,
  SelectComponent,
  SelectComponents,
  TextComponent,
  TextComponents,
} from './FormSchema.types';

export function isFormFieldInput(field: FormField): field is FormFieldInput {
  return InputComponents.includes(field.component as InputComponent);
}

export function isFormFieldSelect(field: FormField): field is FormFieldSelect {
  return SelectComponents.includes(field.component as SelectComponent);
}

export function isFormFieldText(field: FormField): field is FormFieldText {
  return TextComponents.includes(field.component as TextComponent);
}

export function isFormFieldGroup(field: FormField): field is FormFieldGroup {
  return GroupComponents.includes(field.component as GroupComponent);
}

export function isFormFieldMultiple(
  field: FormField
): field is FormFieldMultiple {
  return MultipleComponents.includes(field.component as MultipleComponent);
}

export class ComponentException extends Error {
  constructor(component: FormComponent, parent?: FormComponent) {
    if (parent) {
      super(`Component ${component} can not be child of ${parent}`);
    } else {
      super(`Component ${component} does not exist`);
    }
  }
}
