import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { IlluCandidatFolder } from '@/assets/icons/icons';
import { openModal } from '@/src/components/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { currentUserActions } from '@/src/use-cases/current-user';
import { ProfilePartCard } from '../Card/Card/Card';
import { Api } from 'src/api';
import { Text } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { DocumentItem } from './DocumentItem/DocumentItem';
import { StyledDocumentList } from './ProfileDocuments.styles';
import { ProfileDocumentsModalEdit } from './ProfileDocumentsModalEdit';

export interface ProfileDocumentsProps {
  userId: string;
  linkedinUrl?: string | null;
  hasExternalCv?: boolean | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileDocuments = ({
  isEditable = false,
  userId,
  linkedinUrl,
  hasExternalCv,
  smallCard = false,
}: ProfileDocumentsProps) => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);

  const isCompleted = useMemo(
    () => !!linkedinUrl || !!hasExternalCv,
    [hasExternalCv, linkedinUrl]
  );

  const openEditModal = useCallback(() => {
    openModal(
      <ProfileDocumentsModalEdit
        dispatchOnSubmit={(fields) => {
          if (fields.linkedinUrl !== linkedinUrl) {
            updateUserProfile({
              linkedinUrl: fields.linkedinUrl || null,
            });
          }
          if (fields.externalCv && fields.externalCv[0]) {
            const formData = new FormData();
            formData.append('file', fields.externalCv[0]);
            dispatch(currentUserActions.uploadExternalCvRequested(formData));
          }
        }}
        linkedinUrl={linkedinUrl || ''}
      />
    );
  }, [dispatch, linkedinUrl, updateUserProfile]);

  const removeLinkedinUrl = useCallback(() => {
    updateUserProfile({
      linkedinUrl: null,
    });
  }, [updateUserProfile]);

  if (!isEditable && !isCompleted) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Liens et documents"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaCallback={isEditable ? openEditModal : undefined}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            Vous n’avez pas encore ajouté votre lien LinkedIn, votre CV ou
            autres documents
          </Text>
        ),
        icon: <IlluCandidatFolder />,
      }}
    >
      <StyledDocumentList>
        {linkedinUrl && (
          <DocumentItem
            type="LinkedIn"
            onRemove={isEditable ? removeLinkedinUrl : undefined}
            onClick={() => {
              window.open(linkedinUrl, '_blank');
            }}
          />
        )}
        {hasExternalCv && isEditable && (
          <DocumentItem
            type="CVPerso"
            onRemove={
              isEditable
                ? () => {
                    dispatch(currentUserActions.deleteExternalCvRequested());
                  }
                : undefined
            }
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
