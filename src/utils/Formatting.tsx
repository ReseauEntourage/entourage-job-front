import moment from 'moment/moment';
import React from 'react';
import { formReferingProfessionalInformation } from 'src/components/backoffice/referer/forms/formReferingProfessionalInformation';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formRegistrationCandidateProfessionalInformation } from 'src/components/registration/forms/formRegistrationCandidateProfessionalInformation';
import {
  OccupationsPrefixesType,
  OCCUPATIONS_PREFIXES,
  CONTRACTS,
} from 'src/constants';
import { findConstantFromValue } from './Finding';

export function formatParagraph(text: string, condense?: boolean) {
  if (text) {
    let formattedText = text;
    if (condense) formattedText = text.replace(/\n\n/g, '\n');
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

export function getOccupationsLinkingSentence(occupations) {
  return (
    <>
      {' '}
      {occupations[0].prefix === occupations[1].prefix
        ? 'ou'
        : `${occupations[1].prefix || occupations[1].prefix}`}{' '}
    </>
  );
}

export function addSpaceToPrefixIfNeeded(prefix) {
  if (!prefix) return '';
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
    ExtractFormSchemaValidation<
      | typeof formRegistrationCandidateProfessionalInformation
      | typeof formReferingProfessionalInformation
    >
  >
): {
  occupations: {
    prefix: OccupationsPrefixesType;
    name: string;
    order: number;
  }[];
  businessSectorIds: string[];
} => {
  let newOccupations = [] as {
    prefix: OccupationsPrefixesType;
    name: string;
    order: number;
  }[];
  if (values.occupation0) {
    newOccupations = [
      {
        prefix: OCCUPATIONS_PREFIXES[1].label,
        name: values.occupation0,
        order: 0,
      },
    ];
  }
  if (values.occupation1) {
    newOccupations = [
      ...newOccupations,
      {
        prefix: OCCUPATIONS_PREFIXES[1].label,
        name: values.occupation1,
        order: 1,
      },
    ];
  }
  let newBusinessSectorIds = [] as string[];
  if (values.businessSectorId0) {
    newBusinessSectorIds = [values.businessSectorId0.value];
  }
  if (values.businessSectorId1) {
    newBusinessSectorIds = [
      ...newBusinessSectorIds,
      values.businessSectorId1.value,
    ];
  }
  return {
    occupations: newOccupations,
    businessSectorIds: newBusinessSectorIds,
  };
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
