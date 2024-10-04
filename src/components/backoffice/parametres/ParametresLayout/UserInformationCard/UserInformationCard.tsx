import _ from 'lodash';
import React from 'react';
import { Card } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Tag } from 'src/components/utils/Tag';
import {
  CANDIDATE_USER_ROLES,
  GENDERS_FILTERS,
  USER_ROLES,
} from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { findConstantFromValue, isRoleIncluded } from 'src/utils';
import {
  StyledInformationsPersonnellesList,
  StyledUserInformationCardTags,
} from './UserInformationCard.styles';
import { useOpenCorrespondingModal } from './useOpenModal';

interface UserInformationCardProps {
  title: React.ReactNode;
}

export const UserInformationCard = ({ title }: UserInformationCardProps) => {
  const user = useAuthenticatedUser();
  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  return (
    <Card
      title={title}
      editCallback={openCorrespondingModal}
      isMobileClosable
      isDefaultOpen
    >
      <StyledInformationsPersonnellesList>
        <li>
          <LucidIcon name="User" size={20} />
          {` ${user.firstName} ${user.lastName}`}
        </li>
        <li>
          <LucidIcon name="User" size={20} />
          {findConstantFromValue(user.gender, GENDERS_FILTERS).label}
        </li>
        <li>
          <LucidIcon name="MessageCircle" size={20} />
          {user.email}
        </li>
        <li>
          <LucidIcon name="Phone" size={20} />
          {user.phone ? (
            <>{user.phone}</>
          ) : (
            <>Numéro de téléphone non renseigné</>
          )}
        </li>
        {user.role !== USER_ROLES.ADMIN && (
          <>
            <li>
              <LucidIcon name="MapPin" size={20} />
              {user.userProfile.department ? (
                <>{user.userProfile.department}</>
              ) : (
                <>Département non renseigné</>
              )}
            </li>
            {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
              <li>
                <LucidIcon name="House" size={20} />
                {user.address ? (
                  <>{user.address}</>
                ) : (
                  <>Adresse postale non renseignée</>
                )}
              </li>
            )}
          </>
        )}
        {user.role === USER_ROLES.ADMIN && (
          <StyledUserInformationCardTags>
            <Tag
              content={user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
            />
            {user.adminRole && <Tag content={_.capitalize(user.adminRole)} />}
          </StyledUserInformationCardTags>
        )}
      </StyledInformationsPersonnellesList>
    </Card>
  );
};
