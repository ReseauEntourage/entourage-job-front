import React, { useCallback, useMemo } from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { Api } from 'src/api';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { DocumentItem } from './DocumentItem/DocumentItem';
import { StyledDocumentList } from './ProfileDocuments.styles';

export interface ProfileDocumentsProps {
  userId: string;
  linkedinUrl?: string | null;
  hasExternalCv?: boolean | null;
  entourageProCv?: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileDocuments = ({
  isEditable = false,
  userId,
  linkedinUrl,
  hasExternalCv,
  entourageProCv,
  smallCard = false,
}: ProfileDocumentsProps) => {
  const isCompleted = useMemo(
    () => !!linkedinUrl || !!entourageProCv || !!hasExternalCv,
    [entourageProCv, hasExternalCv, linkedinUrl]
  );
  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Liens et documents"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      smallCard={smallCard}
    >
      <StyledDocumentList>
        {linkedinUrl && (
          <DocumentItem
            type="LinkedIn"
            onRemove={isEditable ? () => {} : undefined}
            onClick={() => {
              window.open(linkedinUrl, '_blank');
            }}
          />
        )}
        {entourageProCv && (
          <DocumentItem
            type="CVPro"
            onRemove={isEditable ? () => {} : undefined}
            onClick={() => {
              gaEvent(GA_TAGS.BACKOFFICE_MEMBER_PROFILE_VIEWCV_PRO_CLIC);
              window.open(`/cv/${entourageProCv}`, '_blank');
            }}
          />
        )}
        {hasExternalCv && (
          <DocumentItem
            type="CVPerso"
            onRemove={isEditable ? () => {} : undefined}
            onClick={() => {
              gaEvent(GA_TAGS.BACKOFFICE_MEMBER_PROFILE_VIEWCV_PERSO_CLIC);
              Api.getExternalCvByUser(userId).then((response) => {
                const externalCvUrl = response.data;
                window.open(externalCvUrl.url, '_blank');
              });
            }}
          />
        )}
      </StyledDocumentList>
    </ProfilePartCard>
  );
};
