import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import PlaceholderIllu from 'assets/icons/illu-bulle-question.svg';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { openModal } from 'src/components/modals/Modal';
import { Card } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import {
  AMBITIONS_PREFIXES,
  AmbitionsPrefixesType,
  BUSINESS_LINES,
  BusinessLineValue,
} from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import { ModalEditProfessionalInformation } from './ModalEditProfessionalInformation';
import { StyledProfessionalInformationList } from './ProfessionalInformationCard.styles';
import {
  checkData,
  getCandidateDefaultValues,
  getCoachDefaultValues,
} from './ProfessionalInformationCard.utils';

const uuidValue = uuid();

export const ProfessionalInformationCard = () => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;

  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    if (user) setHasData(checkData(user.userProfile, user.role));
  }, [user]);

  const openProfessionalInformationModal = useCallback(() => {
    if (!userProfile) return;
    openModal(
      role === USER_ROLES.COACH ? (
        <ModalEditProfessionalInformation
          title="Renseignez votre métier et les secteurs dans lesquels vous avez du réseau"
          description=""
          user={user}
          defaultValues={getCoachDefaultValues(userProfile)}
          formSchema={formEditCoachProfessionalInformation}
          getValuesToSend={(values) => {
            const networkBusinessLines = values.networkBusinessLines.map(
              ({ value }, i) => {
                return { name: value, order: i };
              }
            ) as { name: BusinessLineValue; order: number }[];
            const valuesToSend = {
              currentJob: values.currentJob,
              networkBusinessLines,
            };
            return valuesToSend;
          }}
        />
      ) : (
        <ModalEditProfessionalInformation
          title="Renseignez votre projet professionnel"
          description="Nous vous mettrons en relation avec des professionnels qui pourront vous aider"
          defaultValues={getCandidateDefaultValues(userProfile)}
          formSchema={formEditCandidateProfessionalInformation}
          user={user}
          getValuesToSend={(values) => {
            let newAmbitions = [] as {
              prefix: AmbitionsPrefixesType;
              name: string;
              order: number;
            }[];
            if (values.searchAmbition0) {
              newAmbitions = [
                {
                  prefix: AMBITIONS_PREFIXES[1].label,
                  name: values.searchAmbition0,
                  order: 0,
                },
              ];
            }
            if (values.searchAmbition1) {
              newAmbitions = [
                ...newAmbitions,
                {
                  prefix: AMBITIONS_PREFIXES[1].label,
                  name: values.searchAmbition1,
                  order: 1,
                },
              ];
            }
            let newBusinessLines = [] as {
              name: BusinessLineValue;
              order: number;
            }[];
            if (values.searchBusinessLine0) {
              newBusinessLines = [
                { name: values.searchBusinessLine0.value, order: 0 },
              ];
            }
            if (values.searchBusinessLine1) {
              newBusinessLines = [
                ...newBusinessLines,
                { name: values.searchBusinessLine1.value, order: 1 },
              ];
            }
            const valuesToSend = {
              searchAmbitions: newAmbitions,
              searchBusinessLines: newBusinessLines,
            };
            return valuesToSend;
          }}
        />
      )
    );
  }, [userProfile, role, user]);

  return (
    <Card
      title="Informations professionnelles"
      editCallback={openProfessionalInformationModal}
      isLoading={false}
      isMobileClosable
      isDefaultOpen
      dataTestId="parametres-professional-information-card"
    >
      {hasData ? (
        <StyledProfessionalInformationList>
          {role === USER_ROLES.COACH ? (
            <>
              {userProfile?.currentJob && (
                <li>
                  Je travaille comme <strong>{userProfile.currentJob}</strong>
                </li>
              )}
              {userProfile?.networkBusinessLines &&
                userProfile.networkBusinessLines.length > 0 && (
                  <li className="tag-container">
                    J&lsquo;ai du réseau dans :{' '}
                    {sortByOrder(userProfile.networkBusinessLines).map(
                      ({ name }) => (
                        <Tag
                          key={uuidValue}
                          content={
                            findConstantFromValue(name, BUSINESS_LINES).label
                          }
                        />
                      )
                    )}
                  </li>
                )}
            </>
          ) : (
            <>
              {userProfile?.searchAmbitions &&
                userProfile.searchAmbitions.length > 0 && (
                  <li data-testid="candidat-ambition-li">
                    Je souhaite travailler comme :{' '}
                    {sortByOrder(userProfile.searchAmbitions).map(
                      ({ name }, index) => (
                        <>
                          <strong key={index}>{name}</strong>
                          {index < userProfile.searchAmbitions.length - 1
                            ? ', '
                            : ''}
                        </>
                      )
                    )}
                  </li>
                )}
              {userProfile?.searchBusinessLines &&
                userProfile.searchBusinessLines.length > 0 && (
                  <li
                    className="tag-container"
                    data-testid="candidat-businessline-li"
                  >
                    Je recherche dans :{' '}
                    {sortByOrder(userProfile.searchBusinessLines).map(
                      ({ name }, index) => (
                        <Tag
                          key={index}
                          content={
                            findConstantFromValue(name, BUSINESS_LINES).label
                          }
                        />
                      )
                    )}
                  </li>
                )}
            </>
          )}
        </StyledProfessionalInformationList>
      ) : (
        <ParametresPlaceholder
          image={<PlaceholderIllu />}
          title={
            user.role === USER_ROLES.COACH
              ? 'Renseignez les secteurs dans lesquels vous avez du réseau professionnel'
              : 'Renseignez ici les secteurs et métiers que vous recherchez'
          }
          description={
            user.role === USER_ROLES.COACH
              ? 'Ces  informations nous permettent de vous mettre en relation plus facilement avec des personnes de la communauté que vous pourriez aider.'
              : 'Ces  informations nous permettent de vous mettre en relation plus facilement avec des personnes de la communauté qui pourraient vous donner un coup de pouce '
          }
          onClick={openProfessionalInformationModal}
        />
      )}
    </Card>
  );
};
