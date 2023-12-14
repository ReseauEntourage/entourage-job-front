import _ from 'lodash';
import React from 'react';
import EmailIcon from 'assets/icons/email.svg';
import GenderIcon from 'assets/icons/gender.svg';
import HomeIcon from 'assets/icons/home.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { UserWithUserCandidate } from 'src/api/types';
import { Card } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { USER_ROLES } from 'src/constants/users';
import { StyledInformationsPersonnelles } from './UserInformationCard.styles';

interface UserInformationCardProps {
  loadingPersonal: boolean;
  openCorrespondingModal: () => void;
  userData: UserWithUserCandidate;
  title: React.ReactNode;
}

export const UserInformationCard = ({
  loadingPersonal,
  openCorrespondingModal,
  userData,
  title,
}: UserInformationCardProps) => {
  return (
    <Card
      title={title}
      editCallback={openCorrespondingModal}
      isLoading={loadingPersonal}
    >
      {!loadingPersonal && (
        <StyledInformationsPersonnelles>
          <li>
            <UserIcon width={20} />
            {` ${userData.firstName} ${userData.lastName}`}
          </li>
          {userData.role !== USER_ROLES.ADMIN && (
            <li>
              <GenderIcon width={20} />
              {userData.gender === 0 ? 'Homme' : 'Femme'}
            </li>
          )}
          <li>
            <EmailIcon width={20} />
            {userData.email}
          </li>
          <li>
            <PhoneIcon width={20} />
            {userData.phone ? (
              <>{userData.phone}</>
            ) : (
              <>Numéro de téléphone non renseigné</>
            )}
          </li>
          <li>
            <HomeIcon width={20} />
            {userData.address ? (
              <>{userData.address}</>
            ) : (
              <>Adresse postale non renseignée</>
            )}
          </li>
          {userData.role === USER_ROLES.ADMIN && (
            <li>
              <Tag
                content={
                  userData.zone ? _.capitalize(userData.zone) : 'Non renseignée'
                }
              />
              {userData.adminRole && <>{_.capitalize(userData.adminRole)}</>}
            </li>
          )}
        </StyledInformationsPersonnelles>
      )}
    </Card>
  );
};
