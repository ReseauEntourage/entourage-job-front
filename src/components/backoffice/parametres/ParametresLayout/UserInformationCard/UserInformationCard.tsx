import _ from 'lodash';
import React from 'react';
import { Card } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Tag } from 'src/components/utils/Tag';
import { GENDERS_FILTERS, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { findConstantFromValue } from 'src/utils';
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
          <LucidIcon name="User" />
          {` ${user.firstName} ${user.lastName}`}
        </li>
        <li>
          <LucidIcon name="User" />
          {findConstantFromValue(user.gender, GENDERS_FILTERS).label}
        </li>
        <li>
          <LucidIcon name="MessageCircle" />
          {user.email}
        </li>
        <li>
          <LucidIcon name="Phone" />
          {user.phone ? (
            <>{user.phone}</>
          ) : (
            <>Numéro de téléphone non renseigné</>
          )}
        </li>
        {user.role !== USER_ROLES.ADMIN && (
          <>
            <li>
              <LucidIcon name="MapPin" />
              {user.userProfile.department ? (
                <>{user.userProfile.department}</>
              ) : (
                <>Département non renseigné</>
              )}
            </li>
            {user.role === USER_ROLES.CANDIDATE && (
              <li>
                <LucidIcon name="House" />
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
