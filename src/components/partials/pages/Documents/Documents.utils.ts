import { User } from 'src/api/types';
import { DocumentNameType } from 'src/constants';

export const isReadDocument = (
  userReadDocuments: User['readDocuments'],
  documentName: DocumentNameType
) => {
  return userReadDocuments?.some(
    (document) => document.documentName === documentName
  );
};
