import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import FooterForm from 'src/components/forms/FooterForm';
import FormValidator from 'src/components/forms/FormValidator';
import GenericField from 'src/components/forms/GenericField';
import FieldGroup from 'src/components/forms/fields/FieldGroup';
import InputsContainer from 'src/components/forms/fields/InputsContainer/index';
import MultipleFields from 'src/components/forms/fields/MultipleFields';
import { getValueFromFormField } from 'src/utils/Finding';

interface FormWithValidationType {
  defaultValues?: any;
  onCancel?: () => void;
  onSubmit: (arg1: any, arg2: any) => void;
  onError?: (any) => void;
  formSchema: {
    id: string;
    fields: any;
    rules: any;
  };
  submitText?: string;
  cancelText?: string;
  enterToSubmit?: boolean;
  formId?: string;
}

/**
 * Permet de creer un formulaire avec la generation de ses champs et validations de champs
 * Regroupe les deux composants du fichier formWithValidationOld en stateless
 * - Plus lisible
 */
const FormWithValidation = forwardRef(
  (
    {
      formSchema: { id, rules, fields },
      defaultValues,
      submitText,
      cancelText,
      onSubmit,
      onCancel,
      enterToSubmit,
      onError,
      formId,
    }: FormWithValidationType,
    ref
  ) => {
    const validator = useMemo(() => {
      return new FormValidator(rules);
    }, [rules]);

    const [error, setError] = useState<string>();

    const [fieldValidations, setFieldValidations] = useState({});
    const [fieldValues, setFieldValues] = useState({});
    const [fieldOptions, setFieldOptions] = useState({});

    // fonction permettant de verifier une champs d'entré utilisateur
    const updateForm = useCallback(
      (args) => {
        let onChangeArgs = args;
        if (!Array.isArray(onChangeArgs)) {
          onChangeArgs = [onChangeArgs];
        }

        const tmpFieldValues = { ...fieldValues };
        const tmpFieldValidations = fieldValidations;
        for (let i = 0; i < onChangeArgs.length; i += 1) {
          const {
            target: { name, type, value, checked },
            isReset,
          } = onChangeArgs[i];

          /* Validators start */
          tmpFieldValues[name] = type === 'checkbox' ? checked : value;

          const validation = validator.validate(tmpFieldValues, fields); // envoie une copie des champs pour que le state ne soit pas altéré

          // enregistre la raison de la validation {isInvalid: boolean, message: string}
          if (validation[name] !== undefined && !isReset) {
            tmpFieldValidations[`valid_${name}`] = validation[name];
          }
          if (isReset) {
            delete tmpFieldValidations[`valid_${name}`];
          }
        }

        setFieldValues(tmpFieldValues); // enregistre la valeur du champs
        setFieldValidations(tmpFieldValidations);

        /* Validators end */
        setError('');
      },
      [fieldValidations, fieldValues, fields, validator]
    );

    const submitForm = useCallback(
      async (event) => {
        if (event) event.preventDefault();
        // Vérifie les champs avant soumission
        /* Validators control before submit */

        const validation = validator.validate(fieldValues, fields);
        const formattedFieldValues = Object.keys(fieldValues).reduce(
          (acc, curr) => {
            return {
              ...acc,
              [curr]: getValueFromFormField(fieldValues[curr]),
            };
          },
          {}
        );

        if (validation.isValid) {
          // Si les validators sont OK.
          await onSubmit(formattedFieldValues, (msg) => {
            return setError(msg);
          }); // c'est le props onsubmit de FormWithValidation
        } else {
          // erreur de validation
          const tmpFieldValidations = fieldValidations;
          Object.keys(validation).forEach((key) => {
            if (key !== 'isValid') {
              tmpFieldValidations[`valid_${key}`] = validation[key];
            }
          });
          setFieldValidations(tmpFieldValidations);
          setError('Un ou plusieurs champs sont invalides');
          await onError(fieldValues);
        }
      },
      [fieldValidations, fieldValues, fields, onError, onSubmit, validator]
    );

    const updateFieldOptions = useCallback(
      (fieldWithOptions) => {
        setFieldOptions({ ...fieldOptions, ...fieldWithOptions });
      },
      [fieldOptions]
    );

    const initializeForm = useCallback(() => {
      // on extrait les nom des champs
      const fieldsId = fields.reduce((acc, curr) => {
        if (
          curr.component === 'fieldgroup' ||
          curr.component === 'fieldgroup-new'
        ) {
          return [
            ...acc,
            ...curr.fields.map((field) => {
              return field.id;
            }),
          ];
        }
        return [...acc, curr.id];
      }, []);

      const validations = fieldsId.reduce((acc, value) => {
        return {
          ...acc,
          [`valid_${value}`]: undefined,
        };
      }, {});
      const values = fieldsId.reduce((acc, value) => {
        return {
          ...acc,
          [value]:
            Array.isArray(defaultValues[value]) &&
            defaultValues[value].length > 0
              ? defaultValues[value].map((item) => {
                  if (typeof item === 'string') {
                    return {
                      value: item,
                      label: item,
                    };
                  }
                  return item;
                })
              : defaultValues[value],
        };
      }, {});
      setFieldValues(values);
      setFieldValidations(validations);
    }, [defaultValues, fields]);

    useImperativeHandle(ref, () => {
      return {
        resetForm: initializeForm,
      };
    });

    useEffect(() => {
      initializeForm();
    }, [initializeForm]);

    return (
      <>
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-width-1-1 uk-child-width-1-1"
          data-uk-grid
          onSubmit={submitForm}
          data-testid="form-with-validation"
          onKeyDown={(ev) => {
            if (enterToSubmit) {
              if (ev.key === 'Enter') {
                submitForm(ev);
              }
            }
          }}
        >
          <fieldset className="uk-fieldset">
            {fields.map((value, i) => {
              if (value.component === 'fieldgroup') {
                const {
                  fields: childrenFields,
                  title,
                  id: childrenId,
                  childWidths,
                } = value;
                return (
                  <li key={i} hidden={!!value.hidden}>
                    <FieldGroup
                      // id={childrenId}
                      title={title}
                      childWidths={childWidths}
                      fields={childrenFields.map((field) => {
                        return !field.hidden ? (
                          <GenericField
                            data={field}
                            formId={id}
                            fieldOptions={fieldOptions}
                            value={fieldValues[field.id]}
                            onChange={updateForm}
                            updateFieldOptions={updateFieldOptions}
                            getValid={(name) => {
                              return fieldValidations[`valid_${name}`];
                            }}
                            getValue={(name) => {
                              return fieldValues[name];
                            }}
                          />
                        ) : null;
                      })}
                    />
                  </li>
                );
              }
              if (value.component === 'fieldgroup-new') {
                const {
                  fields: childrenFields,
                  title,
                  id: childrenId,
                  childWidths,
                } = value;

                const shouldHide = value.hide
                  ? value.hide((name) => {
                      return fieldValues[name];
                    })
                  : value.hidden;

                return (
                  !shouldHide && (
                    <li key={i}>
                      <InputsContainer
                        // id={childrenId}
                        // title={title}
                        // childWidths={childWidths}
                        // getValue={(name) => {
                        // return fieldValues[name];
                        // }}
                        fields={childrenFields.map((field) => {
                          const shouldHideField = field.hide
                            ? field.hide((name) => {
                                return fieldValues[name];
                              })
                            : field.hidden;

                          return !shouldHideField ? (
                            <GenericField
                              data={field}
                              formId={id}
                              value={fieldValues[field.id]}
                              onChange={updateForm}
                              fieldOptions={fieldOptions}
                              updateFieldOptions={updateFieldOptions}
                              getValid={(name) => {
                                return fieldValidations[`valid_${name}`];
                              }}
                              getValue={(name) => {
                                return fieldValues[name];
                              }}
                            />
                          ) : null;
                        })}
                      />
                    </li>
                  )
                );
              }
              if (value.component === 'multiple-fields') {
                const {
                  fields: childrenFields,
                  title,
                  action,
                  id: childrenId,
                  name: childrenName,
                  childWidths,
                } = value;
                return (
                  <li key={i} hidden={!!value.hidden}>
                    <MultipleFields
                      action={action}
                      // id={childrenId}
                      name={childrenName}
                      title={title}
                      childWidths={childWidths}
                      formId={id}
                      values={fieldValues[childrenName] || [{}]}
                      getValid={(name) => {
                        return fieldValidations[`valid_${name}`];
                      }}
                      getValue={(name) => {
                        return fieldValues[name];
                      }}
                      onChange={updateForm}
                      fields={childrenFields}
                    />
                  </li>
                );
              }

              return (
                <li key={i} hidden={!!value.hidden}>
                  <GenericField
                    data={value}
                    formId={id}
                    value={fieldValues[value.id]}
                    onChange={updateForm}
                    updateFieldOptions={updateFieldOptions}
                    fieldOptions={fieldOptions}
                    getValid={(name) => {
                      return fieldValidations[`valid_${name}`];
                    }}
                    getValue={(name) => {
                      return fieldValues[name];
                    }}
                  />
                </li>
              );
            })}
          </fieldset>
        </form>
        <FooterForm
          error={error}
          submitText={submitText}
          cancelText={cancelText}
          onSubmit={submitForm}
          formId={formId}
          onCancel={
            onCancel &&
            (() => {
              initializeForm();
              onCancel();
            })
          }
        />
      </>
    );
  }
);

FormWithValidation.defaultProps = {
  submitText: undefined,
  cancelText: undefined,
  defaultValues: {},
  onCancel: undefined,
  enterToSubmit: false,
  onError: null,
  formId: '',
};

export default FormWithValidation;
