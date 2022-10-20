import { OFFER_STATUS } from 'src/constants';
import { findOfferStatus } from 'src/utils/Finding';

const updateField = (fieldToUpdate, props, i) => {
  const field = { ...fieldToUpdate };
  if (props[i].option) {
    const optionIndexToUpdate = field.options.findIndex((option) => {
      return option.value === props[i].option;
    });
    field.options[optionIndexToUpdate][props[i].propName] = props[i].value;
  } else {
    field[props[i].propName] = props[i].value;
  }
  return field;
};

const mutateFormSchema = (schema, fields, id) => {
  const newSchema = {
    id: id ? schema.id + id : schema.id,
    fields: [...schema.fields],
    rules: [...schema.rules],
  };

  fields.map(({ fieldId, props }) => {
    let childIndex = -1;
    const indexToUpdate = newSchema.fields.findIndex((field) => {
      if (field.id === fieldId) {
        return true;
      }
      if (field.component === 'fieldgroup') {
        const childIndexToUpdate = field.fields.findIndex((childField) => {
          return childField.id === fieldId;
        });
        if (childIndexToUpdate >= 0) {
          childIndex = childIndexToUpdate;
          return true;
        }
      }
      return false;
    });

    let fieldToUpdate = {
      ...newSchema.fields[indexToUpdate],
      fields: newSchema.fields[indexToUpdate].fields
        ? [...newSchema.fields[indexToUpdate].fields]
        : undefined,
    };

    for (let i = 0; i < props.length; i += 1) {
      if (childIndex > -1) {
        fieldToUpdate.fields[childIndex] = updateField(
          fieldToUpdate.fields[childIndex],
          props,
          i
        );
      } else {
        fieldToUpdate = updateField(fieldToUpdate, props, i);
      }
    }

    newSchema.fields[indexToUpdate] = fieldToUpdate;

    return fieldToUpdate;
  });

  return newSchema;
};

const getAlternateDefaultOfferStatus = (offer = {}, opportunityUser = {}) => {
  return findOfferStatus(
    OFFER_STATUS[0].value,
    offer.isPublic,
    opportunityUser.recommended
  ).label;
};

const mutateDefaultOfferStatus = (offer, opportunityUser) => {
  return [
    {
      ...OFFER_STATUS[0],
      label: getAlternateDefaultOfferStatus(offer, opportunityUser),
    },
    ...OFFER_STATUS.slice(1),
  ];
};

export { mutateFormSchema, mutateDefaultOfferStatus };
