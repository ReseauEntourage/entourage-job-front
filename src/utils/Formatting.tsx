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

const LINK_PATTERN =
  /(\b((https?:\/\/)?(www\.)?[\w-]+(\.[\w.-]+)+(:\d+)?(\/[^\s]*)?))/gi;

/**
 * Detects web addresses and returns React nodes instead of an HTML string: the
 * text is never interpreted as markup (no `dangerouslySetInnerHTML`),
 * only web addresses become links, opened in a new tab. Line breaks are kept
 * as is and rendered by the container (`white-space: pre-line`).
 */
export const linkifyToNodes = (content: string): React.ReactNode[] => {
  if (!content) {
    return [];
  }
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  content.replace(LINK_PATTERN, (url: string, ...args) => {
    const offset = args[args.length - 2] as number;
    if (offset > lastIndex) {
      nodes.push(content.slice(lastIndex, offset));
    }
    const href = /^https?:\/\//i.test(url) ? url : `http://${url}`;
    nodes.push(
      <a
        key={`${offset}-${url}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {url}
      </a>
    );
    lastIndex = offset + url.length;
    return url;
  });
  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }
  return nodes;
};
