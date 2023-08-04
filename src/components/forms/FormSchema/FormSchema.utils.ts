import {
  CheckBoxComponent,
  CheckBoxComponents,
  FormComponent,
  FormField,
  FormFieldCheckBox,
  FormFieldGroup,
  FormFieldMultiple,
  FormFieldSelect, FormFieldSelectRequest,
  FormFieldText,
  FormFieldTextInput,
  GroupComponent,
  GroupComponents,
  MultipleComponent,
  MultipleComponents,
  SelectComponent,
  SelectComponents,
  SelectRequestComponent,
  SelectRequestComponents,
  TextComponent,
  TextComponents,
  TextInputComponent,
  TextInputComponents
} from "./FormSchema.types";

export function isFormFieldTextInput(
  field: FormField
): field is FormFieldTextInput {
  return TextInputComponents.includes(field.component as TextInputComponent);
}

export function isFormFieldCheckbox(
  field: FormField
): field is FormFieldCheckBox {
  return CheckBoxComponents.includes(field.component as CheckBoxComponent);
}

export function isFormFieldSelect(field: FormField): field is FormFieldSelect {
  return SelectComponents.includes(field.component as SelectComponent);
}

export function isFormFieldSelectRequest(
  field: FormField
): field is FormFieldSelectRequest {
  return SelectRequestComponents.includes(
    field.component as SelectRequestComponent
  );
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
