import Link from 'next/link';
import React from 'react';
import { Spinner } from '@/src/components/utils/Spinner';
import { CompanyRecruitementAlertEditModal } from '../CompanyRecruitementAlertModal/CompanyRecruitementAlertEditModal';
import { RecruitementAlert } from 'src/api/types';
import { Button, ImgProfile, LucidIcon } from 'src/components/utils';
import {
  StyledAlertHeader,
  StyledBadgesContainer,
  StyledCandidatesInfo,
  StyledCandidatesAvatars,
  StyledCandidatesCount,
  StyledViewCandidatesLink,
  StyledBadge,
  ButtonContainer,
  StyledCompanyRecruitementAlertContainer,
  StyledAvatar,
  StyledSpinnerContainer,
} from './CompanyRecruitementAlertContent.styles';
import { useCompanyRecruitementAlertContent } from './useCompanyRecruitementAlertContent';

interface CompanyRecruitementAlertContentProps {
  alert: RecruitementAlert;
}

export const CompanyRecruitementAlertContent = ({
  alert,
}: CompanyRecruitementAlertContentProps) => {
  const {
    title,
    badgesStringList,
    isLoadingMatching,
    candidates,
    handleDelete,
    handleEdit,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateAlert,
    alertData,
  } = useCompanyRecruitementAlertContent(alert);

  return (
    <StyledCompanyRecruitementAlertContainer>
      <StyledAlertHeader>
        <h3>{title}</h3>
        <ButtonContainer>
          <Button variant="secondary" size="small" onClick={handleEdit}>
            <LucidIcon name="Pencil" size={20} />
          </Button>
          <Button variant="secondary" size="small" onClick={handleDelete}>
            <LucidIcon name="Trash2" size={20} fill="transparent" />
          </Button>
        </ButtonContainer>
      </StyledAlertHeader>

      <StyledBadgesContainer>
        {badgesStringList.map((badge, index) => (
          <StyledBadge key={index + badge}>{badge}</StyledBadge>
        ))}
      </StyledBadgesContainer>

      <StyledCandidatesInfo>
        {isLoadingMatching ? (
          <StyledSpinnerContainer>
            <Spinner />
          </StyledSpinnerContainer>
        ) : (
          <>
            {candidates.length > 0 && (
              <StyledCandidatesAvatars>
                {candidates.map((candidate, index) => (
                  <StyledAvatar key={index}>
                    <ImgProfile
                      user={candidate}
                      size={30}
                      hasPicture={candidate?.hasPicture || false}
                    />
                  </StyledAvatar>
                ))}
              </StyledCandidatesAvatars>
            )}
            <StyledCandidatesCount>
              {candidates.length
                ? `${candidates.length} personnes correspondent à votre recherche.`
                : 'Aucune personne ne correspond à votre recherche.'}
            </StyledCandidatesCount>
          </>
        )}
        {candidates.length > 0 && (
          <Link href={`/backoffice/alerte-candidats/${alert.id}`} passHref>
            <StyledViewCandidatesLink>
              Voir les candidats
            </StyledViewCandidatesLink>
          </Link>
        )}
      </StyledCandidatesInfo>

      <CompanyRecruitementAlertEditModal
        alert={alertData}
        onSubmit={handleUpdateAlert}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
    </StyledCompanyRecruitementAlertContainer>
  );
};
