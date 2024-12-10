import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { v4 as uuid } from 'uuid';
import { HiredDateModal, InterviewDateModel } from '../DateModals';
import { Api } from 'src/api';
import {
  allCTAs,
  CTAsByTab,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';
import { SendMailModalContent } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/SendMailModalContent';
import { StyledOpportunityCTAsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { renderSimpleSelectField } from 'src/components/forms/schemas/formSimpleSelectField';
import { openModal } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button } from 'src/components/utils/Button';
import { Contract, EVENT_TYPES, OFFER_STATUS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';

const uuidValue = uuid();

export const CandidateOpportunityDetailsCTAs = ({
  tab,
  event,
  OpportunityId,
  contract,
  isExternal,
  fetchOpportunities,
  oppRefreshCallback,
  candidateId,
}: {
  tab: number;
  event?: {
    label: string;
    value: string;
    date: string;
  };
  OpportunityId: string;
  contract: Contract;
  isExternal: boolean;
  fetchOpportunities: () => void;
  oppRefreshCallback: () => void;
  candidateId: string;
}) => {
  const dispatch = useDispatch();

  const updateOpportunityUser = useCallback(
    async (opportunityUser) => {
      await Api.putJoinOpportunity(opportunityUser);
      fetchOpportunities();
      oppRefreshCallback();

      // à gérer: update du statut de l'offre

      //   setOffer((prevOffer) => {
      //     return {
      //       ...prevOffer,
      //       opportunityUsers: data,
      //     };
      //   });
      //   await onOfferUpdated();
    },
    [
      // onOfferUpdated, setOffer
      oppRefreshCallback,
      fetchOpportunities,
    ]
  );

  const actions = useMemo(() => {
    return {
      updateToApplied: async () => {
        gaEvent(GA_TAGS.BACKOFFICE_CANDIDAT_VALIDER_CONTACTER_RECRUTEUR_CLIC);
        try {
          await updateOpportunityUser({
            OpportunityId,
            UserId: candidateId,
            status: OFFER_STATUS[1].value,
          });
          const date = moment().format('YYYY-MM-DD');
          await Api.postOpportunityUserEvent(OpportunityId, candidateId, {
            type: EVENT_TYPES.CONTACT,
            startDate: date,
            endDate: date,
            contract: { name: contract },
          });
          oppRefreshCallback();
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: "L'offre est bien passée au statut 'contactée'",
            })
          );
        } catch (e) {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la création de la structure",
            })
          );
        }
      },
      archive: async () => {
        openModal(
          <ModalConfirm
            onConfirm={async () => {
              await updateOpportunityUser({
                OpportunityId,
                UserId: candidateId,
                archived: true,
              });
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été abandonnée",
                })
              );
            }}
            title="Abandonner l'offre"
            buttonText="Abandonner l'offre"
            text={
              <>
                <p>Êtes vous sur de vouloir abandonner cette offre ? </p>
                <span>
                  Vous pourrez la retrouver à tout moment dans les offres
                  abandonnées
                </span>
              </>
            }
          />
        );
      },
      updateToHired: async () => {
        await updateOpportunityUser({
          OpportunityId,
          UserId: candidateId,
          status: OFFER_STATUS[3].value,
        });
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: "L'offre est bien passée au statut 'acceptée'",
          })
        );
        openModal(
          <HiredDateModal
            opportunityId={OpportunityId}
            candidateId={candidateId}
            contract={contract}
            callback={oppRefreshCallback}
          />
        );
      },
      addDateHired: () => {
        openModal(
          <HiredDateModal
            opportunityId={OpportunityId}
            candidateId={candidateId}
            contract={contract}
            callback={oppRefreshCallback}
          />
        );
      },
      updateToInterview: async () => {
        await updateOpportunityUser({
          OpportunityId,
          UserId: candidateId,
          status: OFFER_STATUS[2].value,
        });
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message:
              "L'offre est bien passée au statut 'en phrase d'entretien'",
          })
        );
        openModal(
          <InterviewDateModel
            opportunityId={OpportunityId}
            candidateId={candidateId}
            contract={contract}
            callback={oppRefreshCallback}
          />
        );
      },
      addDateInterview: () => {
        openModal(
          <InterviewDateModel
            opportunityId={OpportunityId}
            candidateId={candidateId}
            contract={contract}
            callback={oppRefreshCallback}
          />
        );
      },
      abandon: async () => {
        openModal(
          <ModalEdit
            title="Abandonner l'offre"
            description={
              <>
                <p>Êtes vous sur de vouloir abandonner cette offre ? </p>
                <span>
                  Vous pourrez la retrouver à tout moment dans les offres
                  abandonnées
                </span>
              </>
            }
            formSchema={renderSimpleSelectField<{ status: string }>(
              'abandon-offer-reason',
              'Sélectionner un motif dans la liste',
              [
                { value: 'archived', label: 'Je ne suis plus intéressé' },
                {
                  value: '3',
                  label:
                    "Le recruteur a donné une réponse négative avant l'entretien",
                },
                {
                  value: '4',
                  label:
                    "Le recruteur a donné une réponse négative après l'entretien",
                },
                { value: 'archived', label: 'Autre motif' },
              ],
              'status'
            )}
            defaultValues={{ status: '3' }}
            submitText="Abandonner l'offre"
            onSubmit={async ({ status }, closeModal) => {
              const queryParams: { archived?: boolean; status?: number } = {};
              if (status === 'archived') {
                queryParams.archived = true;
              } else {
                queryParams.status = parseInt(status, 10);
              }
              await updateOpportunityUser({
                OpportunityId,
                UserId: candidateId,
                ...queryParams,
              });
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été abandonnée",
                })
              );
              closeModal();
            }}
          />
        );
      },
      contactEmail: () => {
        openModal(
          <ModalGeneric title="Contacter l'entreprise">
            <SendMailModalContent
              OpportunityId={OpportunityId}
              fetchOpportunities={fetchOpportunities}
              candidateId={candidateId}
              onSubmit={async () => {
                const date = moment().format('YYYY-MM-DD');
                try {
                  await Api.postOpportunityUserEvent(
                    OpportunityId,
                    candidateId,
                    {
                      type: EVENT_TYPES.CONTACT,
                      startDate: date,
                      endDate: date,
                      contract: { name: contract },
                    }
                  );
                  fetchOpportunities();
                  oppRefreshCallback();
                } catch (e) {
                  dispatch(
                    notificationsActions.addNotification({
                      type: 'danger',
                      message:
                        "Une erreur s'est produite lors de la création de la structure",
                    })
                  );
                }
              }}
            />
          </ModalGeneric>
        );
      },
      contactRelance: () => {
        openModal(
          <ModalGeneric title="Contacter l'entreprise">
            <SendMailModalContent
              OpportunityId={OpportunityId}
              relance
              candidateId={candidateId}
              fetchOpportunities={fetchOpportunities}
              onSubmit={async () => {
                try {
                  const date = moment().format('YYYY-MM-DD');
                  await Api.postOpportunityUserEvent(
                    OpportunityId,
                    candidateId,
                    {
                      type: EVENT_TYPES.FOLLOWUP,
                      startDate: date,
                      endDate: date,
                      contract: { name: contract },
                    }
                  );
                  fetchOpportunities();
                  oppRefreshCallback();
                } catch (e) {
                  dispatch(
                    notificationsActions.addNotification({
                      type: 'danger',
                      message: "Une erreur s'est produite",
                    })
                  );
                }
              }}
            />
          </ModalGeneric>
        );
      },
    };
  }, [
    dispatch,
    updateOpportunityUser,
    fetchOpportunities,
    oppRefreshCallback,
    OpportunityId,
    contract,
    candidateId,
  ]);

  const disables = {
    contactRelance: () => {
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      return event.value === EVENT_TYPES.FOLLOWUP || isExternal;
    },
  };

  return (
    <StyledOpportunityCTAsContainer>
      {(tab || tab === 0) &&
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        CTAsByTab.find((CTAByTab) => {
          return CTAByTab.tab === tab;
        }).ctas.map((cta, key) => {
          const { color, className, action, text } = allCTAs[cta];
          return (
            <li key={`${key}-${uuidValue}`}>
              <Button
                disabled={disables[action] ? disables[action]() : false}
                size="small"
                color={color}
                style={className}
                onClick={actions[action]}
              >
                {text}
              </Button>
            </li>
          );
        })}
    </StyledOpportunityCTAsContainer>
  );
};
