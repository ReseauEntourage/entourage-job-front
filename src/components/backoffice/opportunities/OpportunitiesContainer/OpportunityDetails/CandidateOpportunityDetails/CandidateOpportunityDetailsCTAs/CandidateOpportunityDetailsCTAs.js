import React, { useCallback, useContext } from 'react';
import Api from 'src/api/index.ts';
import {
  allCTAs,
  CTAsByTab,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';
import Button from 'src/components/utils/Button';
import { StyledOppCTAsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAS.styles';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { OFFER_STATUS } from 'src/constants';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
// import renderSimpleDatePickerField from 'src/components/forms/schema/formSimpleDatePicker';
import renderSimpleSelectField from 'src/components/forms/schema/formSimpleSelectField';
import { UserContext } from 'src/components/store/UserProvider';
import ModalConfirm from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';

const CandidateOpportunityDetailsCTAs = ({
  tab,
  OpportunityId,
  fetchOpportunities,
}) => {
  const { user } = useContext(UserContext);

  console.log(OpportunityId);
  const updateOpportunityUser = useCallback(
    async (opportunityUser) => {
      const { data } = await Api.putJoinOpportunity(opportunityUser);
      console.log(data);
      fetchOpportunities();




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
      fetchOpportunities,
    ]
  );

  const actions = {
    updateToApplied: async () => {
      gaEvent(GA_TAGS.BACKOFFICE_CANDIDAT_VALIDER_CONTACTER_RECRUTEUR_CLIC);
      await updateOpportunityUser({
        OpportunityId,
        UserId: user.id,
        status: OFFER_STATUS[1].value,
      });
    },
    archive: async () => {
      openModal(
        <ModalConfirm
          onConfirm={async () => {
            await updateOpportunityUser({
              OpportunityId,
              UserId: user.id,
              archived: true,
            });
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
        UserId: user.id,
        status: OFFER_STATUS[3].value,
      });
    },
    updateToInterview: async () => {
      await updateOpportunityUser({
        OpportunityId,
        UserId: user.id,
        status: OFFER_STATUS[2].value,
      });
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
          formSchema={renderSimpleSelectField(
            'Sélectionner un motif dans la liste',
            [
              { value: 'archived', label: 'Je ne suis plus intéressé' },
              {
                value: '3',
                label:
                  "Le recruteur a donné un réponse négative avant l'entretien",
              },
              {
                value: '4',
                label:
                  "Le recruteur a donné un réponse négative après l'entretien",
              },
              { value: 'archived', label: 'Autre motif' },
            ]
          )}
          //   defaultValues={{ catchphrase }}
          formId="abandon-offer-reason"
          submitText="Abandonner l'offre"
          onSubmit={async (selectedReason, closeModal) => {
            const queryParams = {};
            if (selectedReason.select === 'archived') {
              queryParams.archived = true;
            } else {
              queryParams.status = selectedReason.select * 1;
            }
            await updateOpportunityUser({
              OpportunityId,
              UserId: user.id,
              ...queryParams,
            });
            closeModal();
          }}
        />
      );
    },



    //   openModal(
    //     <ModalEdit
    //       title="Félicitation vous avez décroché un emploi"
    //       formSchema={renderSimpleDatePickerField("Date d'entretien")}
    //     //   defaultValues={{ catchphrase }}
    //       formId="update-to-hired-datepicker"
    //       onSubmit={async (fields, closeModal) => {
    //         console.log(fields);
    //         // await updateOpportunityUser({
    //         //     OpportunityId,
    //         //     status: OFFER_STATUS[1].value,
    //         //   });
    //         // closeModal();
    //         // await onChange({
    //         //   ...fields,
    //         // });
    //       }}
    //     />
    //   );
    // },
  };

  return (
    <StyledOppCTAsContainer>
      {(tab || tab === 0) &&
        CTAsByTab.find((CTAByTab) => {
          return CTAByTab.tab === tab;
        }).ctas.map((cta) => {
          const { color, className, action, text } = allCTAs[cta];
          return (
            <li key={uuid}>
              <Button color={color} style={className} onClick={actions[action]}>
                {text}
              </Button>
            </li>
          );
        })}
    </StyledOppCTAsContainer>
  );
};

CandidateOpportunityDetailsCTAs.propTypes = {
  tab: PropTypes.number.isRequired,
  OpportunityId: PropTypes.string.isRequired,
  fetchOpportunities: PropTypes.func.isRequired,
};

export default CandidateOpportunityDetailsCTAs;
