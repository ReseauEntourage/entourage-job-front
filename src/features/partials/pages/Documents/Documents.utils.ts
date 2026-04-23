import { ReadDocumentItem } from 'src/api/types';
import { DocumentNameType } from 'src/constants';

export const isReadDocument = (
  userReadDocuments: ReadDocumentItem[] | undefined,
  documentName: DocumentNameType
) => {
  return userReadDocuments?.some(
    (document) => document.documentName === documentName
  );
};
