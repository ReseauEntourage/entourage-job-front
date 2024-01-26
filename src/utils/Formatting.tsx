import moment from 'moment/moment';
import React from 'react';
import { CONTRACTS } from 'src/constants';
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
}