import { FieldPathValue, Path, Validate } from 'react-hook-form';
import { AnyCantFix } from 'src/utils/Types';
import {
  CheckBoxComponent,
  CheckBoxComponents,
  CheckBoxAlertComponents,
  CheckBoxAlertComponent,
  ExtractFormSchemaValidation,
  FormComponent,
  FormComponentValues,
  FormField,
  FormFieldCheckBox,
  FormFieldCheckBoxAlert,
  FormFieldGroup,
  FormFieldMultiple,
  FormFieldRadio,
  FormFieldSelect,
  FormFieldSelectGraphic,
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
  SelectGraphicComponent,
  SelectGraphicComponents,
  SelectRequestComponent,
  SelectRequestComponents,
  TextComponent,
  TextComponents,
  TextInputComponent,
  TextInputComponents,
  FormFieldFile,
  ReactNodeComponents,
  ReactNodeComponent,
  FormFieldReactNode,
} from './FormSchema.types';

export const mapFieldRules = <
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
> => {
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

  return {};
};

export const isFormFieldTextInput = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldTextInput<S> => {
  return TextInputComponents.includes(field.component as TextInputComponent);
};

const isFormFieldCheckbox = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldCheckBox<S> => {
  return CheckBoxComponents.includes(field.component as CheckBoxComponent);
};

const isFormFieldCheckboxAlert = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldCheckBoxAlert<S> => {
  return CheckBoxAlertComponents.includes(
    field.component as CheckBoxAlertComponent
  );
};

export const isFormFieldSelect = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldSelect<S> => {
  return SelectComponents.includes(field.component as SelectComponent);
};

export const isFormFieldRadio = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldRadio<S> => {
  return RadioComponents.includes(field.component as RadioComponent);
};

export const isFormFieldSelectRequest = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldSelectRequest<S> => {
  return SelectRequestComponents.includes(
    field.component as SelectRequestComponent
  );
};

export const isFormFieldSelectGraphic = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldSelectGraphic<S> => {
  return SelectGraphicComponents.includes(
    field.component as SelectGraphicComponent
  );
};

const isFormFieldFile = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldFile<S> => {
  return field.component === 'file-input';
};

export const isFormFieldInput = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is
  | FormFieldRadio<S>
  | FormFieldTextInput<S>
  | FormFieldCheckBox<S>
  | FormFieldCheckBoxAlert<S>
  | FormFieldSelect<S>
  | FormFieldSelectRequest<S>
  | FormFieldSelectGraphic<S>
  | FormFieldFile<S> => {
  return (
    isFormFieldTextInput(field) ||
    isFormFieldCheckbox(field) ||
    isFormFieldCheckboxAlert(field) ||
    isFormFieldRadio(field) ||
    isFormFieldSelect(field) ||
    isFormFieldSelectRequest(field) ||
    isFormFieldSelectGraphic(field) ||
    isFormFieldFile(field)
  );
};

export const isFormFieldText = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldText<S> => {
  return TextComponents.includes(field.component as TextComponent);
};

export const isFormFieldReactNode = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldReactNode<S> => {
  return ReactNodeComponents.includes(field.component as ReactNodeComponent);
};

export const isFormFieldGroup = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldGroup<S> => {
  return GroupComponents.includes(field.component as GroupComponent);
};

export const isFormFieldMultiple = <S extends FormSchemaValidation>(
  field: FormField<S>
): field is FormFieldMultiple<S> => {
  return MultipleComponents.includes(field.component as MultipleComponent);
};

export class ComponentException extends Error {
  constructor(component: FormComponent, parent?: FormComponent) {
    if (parent) {
      super(`Component ${component} can not be child of ${parent}`);
    } else {
      super(`Component ${component} does not exist`);
    }
  }
}
