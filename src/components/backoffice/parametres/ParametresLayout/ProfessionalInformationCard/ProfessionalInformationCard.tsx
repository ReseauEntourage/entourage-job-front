import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import PlaceholderIllu from 'assets/icons/illu-bulle-question.svg';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { openModal } from 'src/components/modals/Modal';
import { Card, Img, Text } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { Tag } from 'src/components/utils/Tag';
import { BUSINESS_LINES } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  findConstantFromValue,
  formatCareerPathSentence,
  formatNetworkBusinessLines,
  sortByOrder,
} from 'src/utils';
import { ModalEditProfessionalInformation } from './ModalEditProfessionalInformation';
import {
  StyledProfessionalInformationImgContainer,
  StyledProfessionalInformationLinkedinContainer,
  StyledProfessionalInformationList,
} from './ProfessionalInformationCard.styles';
import {
  checkData,
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from './ProfessionalInformationCard.utils';

const uuidValue = uuid();

export const ProfessionalInformationCard = () => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;

  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    setHasData(
      checkData({
        currentJob: userProfile?.currentJob,
        networkBusinessLines: userProfile?.networkBusinessLines,
        searchAmbitions: userProfile?.searchAmbitions,
        searchBusinessLines: userProfile?.searchBusinessLines,
        role,
      })
    );
  }, [
    role,
    userProfile.currentJob,
    userProfile.networkBusinessLines,
    userProfile.searchAmbitions,
    userProfile.searchBusinessLines,
  ]);

  const openProfessionalInformationModal = useCallback(() => {
    if (!userProfile) return;
    openModal(
      role === UserRoles.COACH ? (
        <ModalEditProfessionalInformation
          title="Renseignez votre métier et les secteurs dans lesquels vous avez du réseau"
          description=""
          user={user}
          defaultValues={getCoachDefaultProfessionalValues(userProfile)}
          formSchema={formEditCoachProfessionalInformation}
          getValuesToSend={(values) => {
            const networkBusinessLines = formatNetworkBusinessLines(
              values.networkBusinessLines
            );
            return {
              currentJob: values.currentJob,
              networkBusinessLines,
              linkedinUrl: values.linkedinUrl,
            };
          }}
        />
      ) : (
        <ModalEditProfessionalInformation
          title="Renseignez votre projet professionnel"
          description="Nous vous mettrons en relation avec des professionnels qui pourront vous aider"
          defaultValues={getCandidateDefaultProfessionalValues(userProfile)}
          formSchema={formEditCandidateProfessionalInformation}
          user={user}
          getValuesToSend={(values) => {
            return {
              ...formatCareerPathSentence(values),
              linkedinUrl: values.linkedinUrl,
            };
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
          {role === UserRoles.COACH ? (
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
                      ({ name }, index) => (
                        <Tag
                          key={`${uuidValue}-${name}-${index}`}
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
                        <div key={`${uuidValue}-${name}-${index}`}>
                          <strong>{name}</strong>
                          {userProfile.searchAmbitions &&
                            index !== userProfile.searchAmbitions?.length - 1 &&
                            ', '}
                        </div>
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
                          key={`${uuidValue}-${name}-${index}`}
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

          <H5 title="Votre profil Linkedin" />
          {userProfile?.linkedinUrl ? (
            <Text>{userProfile.linkedinUrl}</Text>
          ) : (
            <StyledProfessionalInformationLinkedinContainer>
              <StyledProfessionalInformationImgContainer>
                <Img
                  src="/static/img/illustrations/illu-partage-rs.png"
                  alt="Réseaux sociaux"
                  height={45}
                  width={45}
                />
              </StyledProfessionalInformationImgContainer>
              <Text>
                Ajoutez-le à votre profil pour que les membres puissent le
                découvrir !
              </Text>
            </StyledProfessionalInformationLinkedinContainer>
          )}
        </StyledProfessionalInformationList>
      ) : (
        <ParametresPlaceholder
          image={<PlaceholderIllu />}
          title={
            user.role === UserRoles.COACH
              ? 'Renseignez les secteurs dans lesquels vous avez du réseau professionnel'
              : 'Renseignez ici les secteurs et métiers que vous recherchez'
          }
          description={
            user.role === UserRoles.COACH
              ? 'Ces  informations nous permettent de vous mettre en relation plus facilement avec des personnes de la communauté que vous pourriez aider.'
              : 'Ces  informations nous permettent de vous mettre en relation plus facilement avec des personnes de la communauté qui pourraient vous donner un coup de pouce '
          }
          onClick={openProfessionalInformationModal}
        />
      )}
    </Card>
  );
};
