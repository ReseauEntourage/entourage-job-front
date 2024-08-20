import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { v4 as uuid } from 'uuid';
import { Api } from 'src/api';
import {
  AdminOpportunityWithOpportunityUsers,
  ExternalOpportunityDto,
  OpportunityDto,
} from 'src/api/types';
import { StyledOpportunityCTAsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { formEditExternalOpportunityAsAdmin } from 'src/components/forms/schemas/formEditExternalOpportunity';
import { formEditOpportunity } from 'src/components/forms/schemas/formEditOpportunity';
import { formRecommendCandidate } from 'src/components/forms/schemas/formRecommendCandidate';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button } from 'src/components/utils';
import { AdminOffersTags, BUSINESS_LINES } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { notificationsActions } from 'src/use-cases/notifications';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import {
  allCTAs,
  CTAsByTag,
  getCandidatesToShowInInput,
  getOpportunityCurrentTag,
} from './AdminOpportunityDetailsCTAs.utils';

const uuidValue = uuid();

interface AdminOpportunityDetailsCTAsProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
  fetchOpportunities: () => void;
  oppRefreshCallback: () => void;
}

export const AdminOpportunityDetailsCTAs = ({
  opportunity,
  fetchOpportunities,
  oppRefreshCallback,
}: AdminOpportunityDetailsCTAsProps) => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const queryParamsOpportunities = useQueryParamsOpportunities();

  const sortedBusinessLines =
    opportunity.businessLines && opportunity.businessLines.length > 0
      ? sortByOrder(opportunity.businessLines)
      : null;

  const defaultBusinessLines =
    sortedBusinessLines?.map((businessLineObject) => {
      return findConstantFromValue(businessLineObject.name, BUSINESS_LINES);
    }) || undefined;

  const currentPath = '/backoffice/admin/offres';

  const updateExternalOpportunity = useCallback(
    async (
      opportunityId: string,
      opportunityToUpdate: Partial<ExternalOpportunityDto>
    ) => {
      const { candidateId, ...restOpportunity } = opportunityToUpdate;
      try {
        await Api.putExternalOpportunity(
          opportunityId,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          candidateId,
          restOpportunity
        );
        await oppRefreshCallback();
      } catch (err) {
        console.error(err);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Une erreur est survenue',
          })
        );
      }
    },
    [oppRefreshCallback, dispatch]
  );

  const updateOpportunity = useCallback(
    async (opportunityId, opportunityToUpdate: Partial<OpportunityDto>) => {
      try {
        await Api.putOpportunity(opportunityId, opportunityToUpdate);
        await oppRefreshCallback();
      } catch (err) {
        console.error(err);

        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Une erreur est survenue',
          })
        );
      }
    },
    [oppRefreshCallback, dispatch]
  );

  const afterActionCallback = useCallback(async () => {
    await fetchOpportunities();
    push(
      {
        pathname: `${currentPath}`,
        query: queryParamsOpportunities,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }, [fetchOpportunities, push, queryParamsOpportunities]);

  const actions = useMemo(() => {
    return {
      duplicateOpportunity: async () => {
        const {
          id,
          opportunityUsers,
          createdBy,
          createdAt,
          updatedAt,
          isArchived,
          isValidated,
          ...restOpportunity
        } = opportunity;
        const { data } = await Api.postOpportunity({
          ...restOpportunity,
          title: `${restOpportunity.title} (copie)`,
          isAdmin: true,
          date: moment().toISOString(),
          isCopy: true,
        });
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: "L'offre a bien été dupliquée",
          })
        );
        push(
          {
            pathname: `${currentPath}/${data.id}`,
            query: { ...queryParamsOpportunities, tag: 'pending' },
          },
          undefined,
          {
            shallow: true,
            scroll: false,
          }
        );
        await fetchOpportunities();
      },
      editExternalOpportunity: () => {
        openModal(
          <ModalEdit
            title={<>Modification de l&apos;offre d&apos;emploi</>}
            formSchema={formEditExternalOpportunityAsAdmin}
            submitText="Mettre à jour"
            defaultValues={{
              ...opportunity,
              status: opportunity.opportunityUsers[0]?.status,
              businessLines: defaultBusinessLines,
              department: findConstantFromValue(
                opportunity.department,
                DEPARTMENTS_FILTERS
              ),
            }}
            onSubmit={async (fields, closeModal) => {
              const tmpOpportunity = {
                ...fields,
                startOfContract: fields.startOfContract || null,
                endOfContract: fields.endOfContract || null,
                candidateId: opportunity.opportunityUsers[0]?.UserId,
                department: fields.department.value,
                businessLines: fields.businessLines
                  ? fields.businessLines.map((businessLine, index) => {
                      return {
                        name: businessLine.value,
                        order: index,
                      };
                    })
                  : [],
              };
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été modifiée",
                })
              );
              await updateExternalOpportunity(
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                opportunity.id,
                tmpOpportunity
              );
              closeModal();
            }}
          />
        );
      },
      recommendOpportunity: () => {
        openModal(
          <ModalEdit
            title={<>Recommander une offre</>}
            formSchema={formRecommendCandidate}
            onSubmit={async (fields, closeModal) => {
              const tmpOpportunity = {
                candidatesIds:
                  fields.candidatesIds?.map((candidateId) => {
                    return typeof candidateId === 'object'
                      ? candidateId.value
                      : candidateId;
                  }) || [],
              };
              await updateOpportunity(opportunity.id, tmpOpportunity);
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été recommandée",
                })
              );
              closeModal();
            }}
          />
        );
      },
      editOpportunity: () => {
        openModal(
          <ModalEdit
            title={<>Modification de l&apos;offre d&apos;emploi</>}
            formSchema={formEditOpportunity}
            submitText="Mettre à jour"
            defaultValues={{
              ...opportunity,
              candidatesIds: getCandidatesToShowInInput(opportunity),
              businessLines: defaultBusinessLines,
              department: findConstantFromValue(
                opportunity.department,
                DEPARTMENTS_FILTERS
              ),
              shouldSendNotifications: true,
            }}
            onSubmit={async (fields, closeModal) => {
              const tmpOpportunity = {
                ...fields,
                message: fields.isPublic ? null : fields.message,
                startOfContract: fields.startOfContract || null,
                endOfContract: fields.endOfContract || null,
                recruiterPhone: fields.recruiterPhone || null,
                department: fields.department.value,
                candidatesIds:
                  fields.candidatesIds?.map((candidateId) => {
                    return typeof candidateId === 'object'
                      ? candidateId.value
                      : candidateId;
                  }) || [],
                businessLines: fields.businessLines
                  ? fields.businessLines.map((businessLine, index) => {
                      return {
                        name: businessLine.value,
                        order: index,
                      };
                    })
                  : [],
              };
              await updateOpportunity(
                opportunity.id,
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                tmpOpportunity
              );
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été modifiée",
                })
              );
              closeModal();
            }}
          />
        );
      },
      archiveOpportunity: () => {
        openModal(
          <ModalConfirm
            onConfirm={async () => {
              await updateOpportunity(opportunity.id, {
                isArchived: true,
              });
              await afterActionCallback();
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été archivée",
                })
              );
            }}
            title="Archiver l'offre"
            buttonText="Archiver l'offre"
            text={
              <>
                <p>Êtes vous sur de vouloir archiver cette offre ? </p>
                <span>
                  Vous pourrez la retrouver à tout moment dans les offres
                  archivées
                </span>
              </>
            }
          />
        );
      },
      validateOpportunity: () => {
        openModal(
          <ModalConfirm
            onConfirm={async () => {
              await updateOpportunity(opportunity.id, {
                isValidated: true,
              });
              await afterActionCallback();
              dispatch(
                notificationsActions.addNotification({
                  type: 'success',
                  message: "L'offre a bien été validée",
                })
              );
            }}
            title="Valider l'offre"
            buttonText="Valider l'offre"
            text={<p>Êtes vous sur de vouloir valider cette offre ? </p>}
          />
        );
      },
    };
  }, [
    dispatch,
    opportunity,
    updateExternalOpportunity,
    updateOpportunity,
    afterActionCallback,
    defaultBusinessLines,
    fetchOpportunities,
    push,
    queryParamsOpportunities,
  ]);

  const [tag, setTag] = useState<AdminOffersTags>();

  useEffect(() => {
    setTag(getOpportunityCurrentTag(opportunity));
  }, [opportunity]);

  return (
    <StyledOpportunityCTAsContainer>
      {tag &&
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        CTAsByTag.find((CTAByTag) => {
          return CTAByTag.tag === tag;
        }).ctas.map((cta, key) => {
          const { color, className, action, text } = allCTAs[cta];
          return (
            <li key={`${key}-${uuidValue}`}>
              <Button
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
