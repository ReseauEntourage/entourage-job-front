import { FieldPathValue, Path, Validate } from 'react-hook-form';
import { AnyCantFix } from 'src/utils/Types';
import {
  CheckBoxComponent,
  CheckBoxComponents,
  ExtractFormSchemaValidation,
  FormComponent,
  FormComponentValues,
  FormField,
  FormFieldCheckBox,
  FormFieldGroup,
  FormFieldMultiple,
  FormFieldRadio,
  FormFieldSelect,
  FormFieldSelectRequest,
  FormFieldText,
  FormFieldTextInput,
  FormSchema,
  FormSchemaValidation,
  GroupComponent,
  GroupComponents,
  InputComponent,
  MultipleComponent,
  MultipleComponents,
  RadioComponent,
  RadioComponents,
  Rule,
  SelectComponent,
  SelectComponents,
  SelectRequestComponent,
  SelectRequestComponents,
  TextComponent,
  TextComponents,
  TextInputComponent,
  TextInputComponents,
} from './FormSchema.types';

export function mapFieldRules<
  S extends FormSchema<AnyCantFix>,
  T extends InputComponent
>(
  fieldRules: Rule<ExtractFormSchemaValidation<S>, T, boolean>[]
): Record<
  string,
  Validate<
    FieldPathValue<
      ExtractFormSchemaValidation<S>,
      Path<ExtractFormSchemaValidation<S>>
    >,
    ExtractFormSchemaValidation<S>
  >
> {
  if (fieldRules) {
    let rules = {} as Record<
      string,
      Validate<
        FieldPathValue<
          ExtractFormSchemaValidation<S>,
          Path<ExtractFormSchemaValidation<S>>
        >,
        ExtractFormSchemaValidation<S>
      >
    >;
    for (let i = 0; i < fieldRules.length; i += 1) {
      rules = {
        ...rules,
        [`rule${i}`]: (
          fieldValue: FormComponentValues<boolean>[T],
          fieldValues: ExtractFormSchemaValidation<S>
        ) => {
          return (
            fieldRules[i].method(fieldValue, fieldValues) ||
            fieldRules[i].message
          );
        },
      };
    }
    return rules;
  }

  // @ts-expect-error after enable TS strict mode. Please, try to fix it
  return null;
}

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

export function isFormFieldInput<S extends FormSchemaValidation>(
  field: FormField<S>
): field is
  | FormFieldSelectRequest<S>
  | FormFieldRadio<S>
  | FormFieldTextInput<S>
  | FormFieldCheckBox<S>
  | FormFieldSelect<S> {
  return (
    isFormFieldTextInput(field) ||
    isFormFieldCheckbox(field) ||
    isFormFieldSelect(field) ||
    isFormFieldRadio(field) ||
    isFormFieldSelectRequest(field)
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
