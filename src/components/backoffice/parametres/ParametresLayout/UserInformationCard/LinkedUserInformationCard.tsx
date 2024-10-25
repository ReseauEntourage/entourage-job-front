import React from 'react';
import { useSelector } from 'react-redux';
import EmailIcon from 'assets/icons/email.svg';
import HomeIcon from 'assets/icons/home.svg';
import LinkIcon from 'assets/icons/link.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { CVPreferences } from '../CVPreferences';
import { Card, SimpleLink } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { selectLinkedUser } from 'src/use-cases/current-user';
import { getUserCandidateFromCoach } from 'src/utils/Finding';
import { StyledInformationsPersonnellesList } from './UserInformationCard.styles';

export const LinkedUserInformationCard = ({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) => {
  const user = useAuthenticatedUser();
  const linkedUser = useSelector(selectLinkedUser);

  if (!linkedUser) {
    return (
      <Card
        title={`Information du${
          user.role === USER_ROLES.COACH ? ' candidat' : ' coach'
        }`}
      >
        Aucun membre lié
      </Card>
    );
  }
  const userCandidat = getUserCandidateFromCoach(user, linkedUser.id);

  // si membre lié ou non
  const cardContent = (
    <>
      <StyledInformationsPersonnellesList>
        <li>
          <UserIcon />
          <span>{`${linkedUser.firstName} ${linkedUser.lastName}`}</span>
        </li>
        {!linkedUser.deletedAt && (
          <>
            <li>
              <SimpleLink
                href={`mailto:${linkedUser.email}`}
                isExternal
                target="_blank"
              >
                <EmailIcon />
                <span data-testid="linkeduser-email-span">
                  {linkedUser.email}
                </span>
              </SimpleLink>
            </li>
            {linkedUser.phone ? (
              <li>
                <SimpleLink href={`tel:${linkedUser.phone}`} isExternal>
                  <PhoneIcon /> <span>{linkedUser.phone}</span>
                </SimpleLink>
              </li>
            ) : (
              <li>
                <PhoneIcon />
                <span className="uk-text-italic">
                  Numéro de téléphone non renseigné
                </span>
              </li>
            )}
            {user.role === USER_ROLES.COACH &&
              (linkedUser.address ? (
                <li>
                  <HomeIcon /> <span>{linkedUser.address}</span>
                </li>
              ) : (
                <li>
                  <HomeIcon />{' '}
                  <span className="uk-text-italic">
                    Adresse postale non renseignée
                  </span>
                </li>
              ))}
            {user.role === USER_ROLES.COACH && userCandidat && (
              <SimpleLink
                className="uk-link-muted"
                target="_blank"
                href={`/cv/${userCandidat.url}`}
              >
                <li>
                  <LinkIcon width={20} height={20} />
                  <span className="uk-text-italic">{userCandidat.url}</span>
                </li>
              </SimpleLink>
            )}
          </>
        )}
      </StyledInformationsPersonnellesList>
      {!isAdmin &&
        user.role === USER_ROLES.COACH &&
        userCandidat &&
        !linkedUser.deletedAt && (
          <StyledInformationsPersonnellesList>
            <li>
              <H5 color="primaryBlue" title="Informations sur le CV" />
            </li>
            <CVPreferences
              userRole={user.role}
              candidatId={linkedUser.id}
              candidat={userCandidat}
            />
          </StyledInformationsPersonnellesList>
        )}
    </>
  );

  return (
    <Card
      title={`Information du${
        user.role === USER_ROLES.COACH ? ' candidat' : ' coach'
      }`}
      key={linkedUser.id}
      isMobileClosable
    >
      {cardContent}
    </Card>
  );
};
