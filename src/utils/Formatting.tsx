import moment from 'moment/moment';
import React from 'react';
import { formOnboardingCandidateJob } from 'src/components/backoffice/onboarding/Onboarding/Forms/schemas/formOnboardingCandidateJob';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import {
  AmbitionsPrefixesType,
  AMBITIONS_PREFIXES,
  BusinessLineValue,
  CONTRACTS,
} from 'src/constants';
import { FilterConstant } from 'src/constants/utils';
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

export function getAmbitionsLinkingSentence(ambitions) {
  return (
    <>
      {' '}
      {ambitions[0].prefix === ambitions[1].prefix
        ? 'ou'
        : `${ambitions[1].prefix || ambitions[1].prefix}`}{' '}
    </>
  );
}

export function addSpaceToPrefixIfNeeded(prefix) {
  if (!prefix) return '';
  return prefix.includes("'") ? prefix : `${prefix} `;
}

export function buildBusinessLineForSentence({ label, prefix }) {
  const separator = 'et ';
  if (Array.isArray(prefix)) {
    let mutatedLabel = '';
    const splittedLabel = label.split(separator);
    for (let i = 1; i < splittedLabel.length; i += 1) {
      mutatedLabel +=
        separator + addSpaceToPrefixIfNeeded(prefix[i]) + splittedLabel[i];
    }
    return (
      addSpaceToPrefixIfNeeded(prefix[0]) + splittedLabel[0] + mutatedLabel
    );
  }
  return addSpaceToPrefixIfNeeded(prefix) + label;
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

export const formatNetworkBusinessLines = (
  networkBusinessLines: FilterConstant<BusinessLineValue>[]
): { name: BusinessLineValue; order: number }[] => {
  return networkBusinessLines.map(({ value }, i) => {
    return { name: value, order: i };
  });
};

export const formatCareerPathSentence = (
  values: Partial<ExtractFormSchemaValidation<typeof formOnboardingCandidateJob>>
): {
  searchAmbitions: {
    prefix: AmbitionsPrefixesType;
    name: string;
    order: number;
  }[];
  searchBusinessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
} => {
  let newAmbitions = [] as {
    prefix: AmbitionsPrefixesType;
    name: string;
    order: number;
  }[];
  if (values.searchAmbition0) {
    newAmbitions = [
      {
        prefix: AMBITIONS_PREFIXES[1].label,
        name: values.searchAmbition0,
        order: 0,
      },
    ];
  }
  if (values.searchAmbition1) {
    newAmbitions = [
      ...newAmbitions,
      {
        prefix: AMBITIONS_PREFIXES[1].label,
        name: values.searchAmbition1,
        order: 1,
      },
    ];
  }
  let newBusinessLines = [] as {
    name: BusinessLineValue;
    order: number;
  }[];
  if (values.searchBusinessLine0) {
    newBusinessLines = [{ name: values.searchBusinessLine0.value, order: 0 }];
  }
  if (values.searchBusinessLine1) {
    newBusinessLines = [
      ...newBusinessLines,
      { name: values.searchBusinessLine1.value, order: 1 },
    ];
  }
  return {
    searchAmbitions: newAmbitions,
    searchBusinessLines: newBusinessLines,
  };
};
