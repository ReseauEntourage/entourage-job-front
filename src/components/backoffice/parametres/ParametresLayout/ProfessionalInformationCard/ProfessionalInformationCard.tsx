import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import UIkit from 'uikit';
import PlaceholderIllu from 'assets/icons/illu-bulle-question.svg';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { Api } from 'src/api';
import { formEditCareerPath } from 'src/components/forms/schemas/formEditCareerPath';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
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
import { authenticationActions } from 'src/use-cases/authentication';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import { StyledProfessionalInformationList } from './ProfessionalInformationCard.styles';
import {
  checkData,
  getCandidateDefaultValues,
  getCoachDefaultValues,
} from './ProfessionalInformationCard.utils';

export const ProfessionalInformationCard = () => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;
  const dispatch = useDispatch();

  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    if (user) setHasData(checkData(user));
  }, [user]);

  const submitForm = useCallback(
    async (values, closeModal) => {
      try {
        await Api.putUserProfile(user.id, values);
        closeModal();
        dispatch(
          authenticationActions.setUser({
            ...user,
            userProfile: {
              ...user.userProfile,
              ...values,
            },
          })
        );
        UIkit.notification(
          'Vos informations professionnelles ont bien été mises à jour',
          'success'
        );
      } catch (error) {
        console.error(error);
        UIkit.notification(
          "Une erreur c'est produite lors de la mise à jour de vos informations professionnelles",
          'danger'
        );
      }
    },
    [user, dispatch]
  );

  const openProfessionalInformationModal = useCallback(() => {
    if (!userProfile) return;
    openModal(
      role === USER_ROLES.COACH ? (
        <ModalEdit
          title="Renseignez votre métier et les secteurs dans lesquels vous avez du réseau"
          defaultValues={getCoachDefaultValues(userProfile)}
          formSchema={formEditCoachProfessionalInformation}
          onSubmit={(values, closeModal) => {
            const networkBusinessLines = values.networkBusinessLines.map(
              ({ value }, i) => {
                return { name: value, order: i };
              }
            ) as { name: BusinessLineValue; order: number }[];
            const valuesToSend = {
              currentJob: values.currentJob,
              networkBusinessLines,
            };
            submitForm(valuesToSend, closeModal);
          }}
        />
      ) : (
        <ModalEdit
          title="Renseignez votre projet professionnel"
          defaultValues={getCandidateDefaultValues(userProfile)}
          formSchema={formEditCareerPath}
          onSubmit={(values, closeModal) => {
            let newAmbitions = [] as {
              prefix: AmbitionsPrefixesType;
              name: string;
              order: number;
            }[];
            if (values.ambition0) {
              newAmbitions = [
                {
                  prefix: AMBITIONS_PREFIXES[1].label,
                  name: values.ambition0,
                  order: 0,
                },
              ];
            }
            if (values.ambition1) {
              newAmbitions = [
                ...newAmbitions,
                {
                  prefix: AMBITIONS_PREFIXES[1].label,
                  name: values.ambition1,
                  order: 1,
                },
              ];
            }
            let newBusinessLines = [] as {
              name: BusinessLineValue;
              order: number;
            }[];
            if (values.businessLine0) {
              newBusinessLines = [
                { name: values.businessLine0.value, order: 0 },
              ];
            }
            if (values.businessLine1) {
              newBusinessLines = [
                ...newBusinessLines,
                { name: values.businessLine1.value, order: 1 },
              ];
            }
            const valuesToSend = {
              searchAmbitions: newAmbitions,
              searchBusinessLines: newBusinessLines,
            };
            submitForm(valuesToSend, closeModal);
          }}
        />
      )
    );
  }, [userProfile, role, submitForm]);

  return (
    <Card
      title="Informations professionnelles"
      editCallback={openProfessionalInformationModal}
      isLoading={false}
      isMobileClosable
      isDefaultOpen
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
          ) : (
            <>
              {userProfile?.searchAmbitions &&
                userProfile.searchAmbitions.length > 0 && (
                  <li>
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
                  <li>
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
