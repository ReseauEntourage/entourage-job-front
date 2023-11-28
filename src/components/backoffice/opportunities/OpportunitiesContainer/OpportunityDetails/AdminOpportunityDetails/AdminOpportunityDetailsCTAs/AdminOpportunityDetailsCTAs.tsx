import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import UIkit from 'uikit';
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
          candidateId,
          restOpportunity
        );
        await oppRefreshCallback();
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    [oppRefreshCallback]
  );

  const updateOpportunity = useCallback(
    async (opportunityId, opportunityToUpdate: Partial<OpportunityDto>) => {
      try {
        await Api.putOpportunity(opportunityId, opportunityToUpdate);
        await oppRefreshCallback();
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    [oppRefreshCallback]
  );

  const actions = {
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
      UIkit.notification("L'offre a bien été dupliquée", 'success');
      push(
        {
          pathname: `${currentPath}/${data.id}`,
          query: { tag: 'validated' },
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
            UIkit.notification("L'offre a bien été modifiée", 'success');
            await updateExternalOpportunity(opportunity.id, tmpOpportunity);
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
            UIkit.notification("L'offre a bien été recommandée", 'success');
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
            await updateOpportunity(opportunity.id, tmpOpportunity);
            UIkit.notification("L'offre a bien été modifiée", 'success');
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
            fetchOpportunities();
            UIkit.notification("L'offre a bien été archivée", 'success');
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
            fetchOpportunities();
            UIkit.notification("L'offre a bien été validée", 'success');
          }}
          title="Valider l'offre"
          buttonText="Valider l'offre"
          text={<p>Êtes vous sur de vouloir valider cette offre ? </p>}
        />
      );
    },
  };

  const [tag, setTag] = useState<AdminOffersTags>();

  useEffect(() => {
    setTag(getOpportunityCurrentTag(opportunity));
  }, [opportunity]);

  return (
    <StyledOpportunityCTAsContainer>
      {tag &&
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
