import validator from 'validator';
import { getValueFromFormField } from 'src/utils';

export default class FormValidator {
  constructor(validations) {
    // validations is an array of rules specific to a form
    this.validations = validations;
  }

  validate(state) {
    const fieldValues = JSON.parse(JSON.stringify(state));
    // start out assuming valid
    const validation = this.valid();
    // for each validation rule
    this.validations.forEach((rule) => {
      // if the field isn't already marked invalid by an earlier rule
      if (!validation[rule.field].isInvalid) {
        // determine the field value, the method to invoke and
        // optional args from the rule definition
        const fieldValue = getValueFromFormField(
          fieldValues[rule.field] ? fieldValues[rule.field] : ''
        );

        const args = rule.args || [];
        const validationMethod =
          typeof rule.method === 'string'
            ? validator[rule.method]
            : rule.method;
        // call the validationMethod with the current field value
        // as the first argument, any additional arguments, and the
        // whole state as a final argument. If the result doesn't
        // match the rule.validWhen property, then modify the
        // validation object for the field and set the isValid
        // field to false

        let isValid;
        try {
          console.log(fieldValue, ...args, fieldValues);
          isValid =
            validationMethod(fieldValue, ...args, fieldValues) !==
            rule.validWhen;
        } catch (e) {
          console.log(e);
          console.log(`Stringify validation fallback, reason: '${e.message}'`);
          isValid =
            validationMethod(fieldValue.toString(), ...args, fieldValues) !==
            rule.validWhen;
        }
        if (isValid) {
          validation[rule.field] = {
            isInvalid: true,
            message: rule.message,
          };
          validation.isValid = false;
        }
      }
    });
    return validation;
  }

  // create a validation object for a valid form
  valid() {
    const validation = {};

    this.validations.map((rule) => {
      return (validation[rule.field] = { isInvalid: false, message: '' });
    });
    return { isValid: true, ...validation };
  }
}
