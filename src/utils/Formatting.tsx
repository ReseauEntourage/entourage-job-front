import moment from 'moment/moment';
import React from 'react';
import { formReferingProfessionalInformation } from '@/src/features/backoffice/referer/forms/formReferingProfessionalInformation';
import { UserProfileSectorOccupation } from 'src/api/types';
import { CONTRACTS } from 'src/constants';
import { ExtractFormSchemaValidation } from 'src/features/forms/FormSchema';
import { findConstantFromValue } from './Finding';

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

export function addSpaceToPrefixIfNeeded(prefix) {
  if (!prefix) {
    return '';
  }
  return prefix.includes("'") ? prefix : `${prefix} `;
}

export function buildContractLabel(
  contract: string,
  endOfContract?: string | null,
  startOfContract?: string
) {
  let dates = '';
  if (startOfContract || endOfContract) {
    dates += ` - `;
    if (startOfContract) {
      if (endOfContract) {
        dates += `du ${moment(startOfContract).format('DD/MM/YYYY')} au `;
      } else {
        dates += `à partir du ${moment(startOfContract).format('DD/MM/YYYY')}`;
      }
    } else {
      dates += `jusqu'au `;
    }

    if (endOfContract) {
      dates += `${moment(endOfContract).format('DD/MM/YYYY')}`;
    }
  }

  return `${findConstantFromValue(contract, CONTRACTS)?.label}${dates}`;
}

export const limitChar = (string: string, limit: number) => {
  if (string.length > limit) {
    return `${string.slice(0, limit)}...`;
  }
  return string;
};

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

export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const linkify = (content: string): string => {
  const urlPattern =
    /(\b((https?:\/\/)?(www\.)?[\w-]+(\.[\w.-]+)+(:\d+)?(\/[^\s]*)?))/gi;

  return content.replace(urlPattern, (url) => {
    let normalizedUrl = url;

    if (!/^https?:\/\//i.test(url)) {
      normalizedUrl = `http://${url}`;
    }

    // Escape special characters to prevent XSS attacks
    const safeUrl = escapeHtml(normalizedUrl);
    const safeDisplayUrl = escapeHtml(url);

    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeDisplayUrl}</a>`;
  });
};
