import { OFFER_STATUS } from 'src/constants';

const mutateFormSchema = (schema, fields, id) => {
  const newSchema = {
    id: id ? schema.id + id : schema.id,
    fields: [...schema.fields],
    rules: [...schema.rules],
  };

  fields.map(({ fieldId, props }) => {
    const indexToUpdate = newSchema.fields.findIndex((field) => {
      return field.id === fieldId;
    });

    const fieldToUpdate = {
      ...newSchema.fields[indexToUpdate],
    };

    for (let i = 0; i < props.length; i += 1) {
      if (props[i].option) {
        const optionIndexToUpdate = fieldToUpdate.options.findIndex(
          (option) => {
            return option.value === props[i].option;
          }
        );
        fieldToUpdate.options[optionIndexToUpdate][props[i].propName] =
          props[i].value;
      } else {
        fieldToUpdate[props[i].propName] = props[i].value;
      }
    }

    newSchema.fields[indexToUpdate] = fieldToUpdate;

    return fieldToUpdate;
  });

  return newSchema;
};

const getAlternateDefaultOfferStatus = (offer = {}, userOpportunity = {}) => {
  if (offer.isPublic && OFFER_STATUS[0].recommended && OFFER_STATUS[0].public) {
    return userOpportunity.recommended
      ? OFFER_STATUS[0].recommended
      : OFFER_STATUS[0].public;
  }
  return OFFER_STATUS[0].label;
};

const mutateDefaultOfferStatus = (offer, userOpportunity) => {
  return [
    {
      ...OFFER_STATUS[0],
      label: getAlternateDefaultOfferStatus(offer, userOpportunity),
    },
    ...OFFER_STATUS.slice(1),
  ];
};

export { mutateFormSchema, mutateDefaultOfferStatus };
