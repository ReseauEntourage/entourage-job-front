import React, { useContext, useRef, useState, useEffect } from 'react';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Button } from 'src/components/utils';
import { USER_ROLES, OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import {
  getCandidateIdFromCoachOrCandidate,
  mutateFormSchema,
} from 'src/utils';
import moment from 'moment';
import { UserContext } from 'src/components/store/UserProvider';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import Api from 'src/api/index.ts';
import UIkit from 'uikit';
import { IconNoSSR } from 'src/components/utils/Icon';
import SearchBar from 'src/components/filters/SearchBar';
import CandidateOffersTab from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab';
import OpportunitiesList from 'src/components/backoffice/opportunities/OpportunitiesList';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';


const candidateSearchFilters = OPPORTUNITY_FILTERS_DATA.filter((el) => {
  return el.key !== 'status';
});


const CandidateOpportunities = ({
  isPublic,
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidateId,
}) => {
  const { user } = useContext(UserContext);
  const opportunityListRef = useRef();
  const mutatedSchema = mutateFormSchema(formEditExternalOpportunity, [
    {
      fieldId: 'startEndContract',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
        {
          propName: 'disabled',
          value: true,
        },
      ],
    },
  ]);
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [offset, setOffset] = useState(0)


  const textVariables = {
    title: {
      [USER_ROLES.CANDIDAT]: {
        all: 'Consulter toutes les offres',
        mine: 'Consulter mes offres',
      },
      [USER_ROLES.COACH]: {
        all: '',
        mine: '',
      },
    },
    description: {
      [USER_ROLES.CANDIDAT]: {
        all: (
          <>
            Retrouvez toutes les offres LinkedOut. <br /> Vous pouvez aussi
            ajouter des offres que vous avez trouvé par vous même pour assurer
            un suivi complet de vos candidatures !
          </>
        ),
        mine: (
          <>
            Retrouvez toutes vos offres sauvagedées et les offres recommandées.
            <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé par
            vous même pour assurer un suivi complet de vos candidatures !
          </>
        ),
      },
      [USER_ROLES.COACH]: {
        all: '',
        mine: '',
      },
    },
  };

  const [offers, setOffers] = useState(undefined);
  const [otherOffers, setOtherOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkedOffers, setBookmarkedOffers] = useState(undefined);

  const fetchData = useCandidateOpportunities(
    setOffers,
    // setOtherOffers,
    // setBookmarkedOffers,
    // setNumberOfResults,
    setLoading,
    setHasError,
    setOtherOffers
  );

  useEffect(() => {
    const type = isPublic ? 'public' : '';
    fetchData(candidateId, search, type, filters, offset);
  }, [candidateId, fetchData, filters, isPublic, search, offset]);

  return (
    <>
      <HeaderBackoffice
        title={textVariables.title[user.role][isPublic ? 'all' : 'mine']}
        description={
          textVariables.description[user.role][isPublic ? 'all' : 'mine']
        }
      >
        <Button
          style="primary"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalEdit
                title={"Ajouter une offre d'emploi externe à LinkedOut"}
                description="J'ai décroché un entretien à l'extérieur : j'informe Linkedout de mes avancées !"
                submitText="Envoyer"
                formSchema={mutatedSchema}
                defaultValues={{
                  candidateId: getCandidateIdFromCoachOrCandidate(user),
                }}
                onSubmit={async (fields, closeModal) => {
                  const { businessLines, ...restFields } = fields;
                  try {
                    await Api.postExternalOpportunity({
                      ...restFields,
                      status: parseInt(fields.status, 10),
                      startOfContract: restFields.startOfContract || null,
                      endOfContract: restFields.endOfContract || null,
                      candidateId: getCandidateIdFromCoachOrCandidate(user),
                      date: moment().toISOString(),
                    });
                    closeModal();
                    opportunityListRef.current.fetchData();
                    UIkit.notification(
                      "L'offre externe a bien été ajouté à votre liste d'offres",
                      'success'
                    );
                  } catch (err) {
                    console.error(err);
                    UIkit.notification(`Une erreur est survenue.`, 'danger');
                  }
                }}
              />
            );
          }}
        >
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Ajouter une offre
        </Button>
      </HeaderBackoffice>
      {isPublic ? (
        <>
          <SearchBar
            filtersConstants={candidateSearchFilters}
            filters={filters}
            numberOfResults={numberOfResults}
            resetFilters={resetFilters}
            search={search}
            setSearch={setSearch}
            setFilters={setFilters}
            placeholder="Rechercher..."
          />
        </>
      ) : (
        <CandidateOffersTab />
      )}
      <OpportunitiesList offers={offers} />
    </>
  );
};

export default CandidateOpportunities;
