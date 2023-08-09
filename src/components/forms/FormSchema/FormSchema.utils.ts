import {
  CheckBoxComponent,
  CheckBoxComponents,
  FormComponent,
  FormField,
  FormFieldCheckBox,
  FormFieldGroup,
  FormFieldMultiple,
  FormFieldRadio,
  FormFieldSelect,
  FormFieldSelectRequest,
  FormFieldText,
  FormFieldTextInput,
  FormSchemaValidation,
  GroupComponent,
  GroupComponents,
  MultipleComponent,
  MultipleComponents,
  RadioComponent,
  RadioComponents,
  SelectComponent,
  SelectComponents,
  SelectRequestComponent,
  SelectRequestComponents,
  TextComponent,
  TextComponents,
  TextInputComponent,
  TextInputComponents,
} from './FormSchema.types';

export function isFormFieldTextInput<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldTextInput<S> {
  return TextInputComponents.includes(field.component as TextInputComponent);
}

export function isFormFieldCheckbox<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldCheckBox<S> {
  return CheckBoxComponents.includes(field.component as CheckBoxComponent);
}

export function isFormFieldSelect<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldSelect<S> {
  return SelectComponents.includes(field.component as SelectComponent);
}

export function isFormFieldRadio<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldRadio<S> {
  return RadioComponents.includes(field.component as RadioComponent);
}

export function isFormFieldSelectRequest<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldSelectRequest<S> {
  return SelectRequestComponents.includes(
    field.component as SelectRequestComponent
  );
}

export function isFormFieldText<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldText<S> {
  return TextComponents.includes(field.component as TextComponent);
}

export function isFormFieldGroup<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldGroup<S> {
  return GroupComponents.includes(field.component as GroupComponent);
}

export function isFormFieldMultiple<S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldMultiple<S> {
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
