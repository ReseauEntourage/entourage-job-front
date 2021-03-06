import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import FooterForm from 'src/components/utils/FooterForm';
import FormValidator from 'src/components/forms/FormValidator';
import GenericField from 'src/components/forms/GenericField';
import FieldGroup from 'src/components/forms/fields/FieldGroup';
import MultipleFields from 'src/components/forms/fields/MultipleFields';
import { getValueFromFormField } from 'src/utils';

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
      onSubmit,
      onCancel,
      enterToSubmit,
      onError,
    },
    ref
  ) => {
    const validator = new FormValidator(rules);

    const [error, setError] = useState();

    const [fieldValidations, setFieldValidations] = useState({});
    const [fieldValues, setFieldValues] = useState({});

    // fonction permettant de verifier une champs d'entré utilisateur
    const updateForm = (args) => {
      let onChangeArgs = args;
      if (!Array.isArray(onChangeArgs)) {
        onChangeArgs = [onChangeArgs];
      }

      const tmpFieldValues = { ...fieldValues };
      const tmpFieldValidations = fieldValidations;
      for (let i = 0; i < onChangeArgs.length; i += 1) {
        const {
          target: { name, type, value, checked, selectedIndex },
        } = onChangeArgs[i];

        let fieldValue;
        if (type === 'checkbox') {
          fieldValue = checked;
          // TODO replace type select-one
        } else if (type === 'select-one' && selectedIndex === 0) {
          fieldValue = null; // si on est sur le placeholder ( option sans valeur )
        } else fieldValue = value;

        /* Validators start */
        tmpFieldValues[name] = fieldValue;

        const validation = validator.validate(tmpFieldValues); // envoie une copie des champs pour que le state ne soit pas altéré

        // enregistre la raison de la validation {isInvalid: boolean, message: string}
        if (validation[name] !== undefined) {
          tmpFieldValidations[`valid_${name}`] = validation[name];
        }
      }

      setFieldValues(tmpFieldValues); // enregistre la valeur du champs
      setFieldValidations(tmpFieldValidations);

      /* Validators end */
      setError('');
    };

    const submitForm = async (event) => {
      if (event) event.preventDefault();
      // Vérifie les champs avant soumission
      /* Validators control before submit */
      const validation = validator.validate(fieldValues);

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
        console.error(validation);
      }
    };

    const initializeForm = useCallback(() => {
      // on extrait les nom des champs
      const fieldsId = fields.reduce((acc, curr) => {
        if (curr.component === 'fieldgroup') {
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
                      id={childrenId}
                      title={title}
                      childWidths={childWidths}
                      fields={childrenFields.map((field) => {
                        return !field.hidden ? (
                          <GenericField
                            data={field}
                            formId={id}
                            value={fieldValues[field.id]}
                            onChange={updateForm}
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
                      id={childrenId}
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
          onSubmit={submitForm}
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

FormWithValidation.propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape()),
    rules: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  submitText: PropTypes.string,
  enterToSubmit: PropTypes.bool,
};

FormWithValidation.defaultProps = {
  submitText: undefined,
  defaultValues: {},
  onCancel: undefined,
  enterToSubmit: false,
  onError: () => {},
};

export default FormWithValidation;
