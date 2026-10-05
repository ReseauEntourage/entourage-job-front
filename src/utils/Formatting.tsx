import React from 'react';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { formReferingProfessionalInformation } from '@/src/features/backoffice/referer/forms/formReferingProfessionalInformation';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';

export function formatParagraph(text: string, condense?: boolean) {
  if (text) {
    let formattedText = text;
    if (condense) {
      formattedText = text.replace(/\n\n/g, '\n');
    }
    return formattedText.split('\n').reduce(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      (acc, item, key, arr) => {
        if (key < arr.length && key > 0) {
          return [...acc, <br key={key} />, item];
        }
        return [...acc, item];
      },
      []
    );
  }
  return text;
}

export const formatCareerPathSentence = (
  values: Partial<
    ExtractFormSchemaValidation<typeof formReferingProfessionalInformation>
  >
): UserProfileSectorOccupation[] => {
  const sectorOccupation0 = {
    businessSectorId: values.businessSectorId0?.value,
    businessSector: {
      id: values.businessSectorId0?.value,
      name: values.businessSectorId0?.label,
    },
    occupation: {
      name: values.occupation0,
    },
    order: 0,
  } as UserProfileSectorOccupation;

  const sectorOccupation1 = {
    businessSectorId: values.businessSectorId1?.value,
    businessSector: {
      id: values.businessSectorId1?.value,
      name: values.businessSectorId1?.label,
    },
    occupation: {
      name: values.occupation1,
    },
    order: 1,
  } as UserProfileSectorOccupation;

  return [sectorOccupation0, sectorOccupation1].filter((sectorOccupation) => {
    return (
      !!sectorOccupation.businessSectorId || !!sectorOccupation.occupation?.name
    );
  });
};
