import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Button, Section } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import moment from 'moment';
import { UserContext } from 'src/components/store/UserProvider';
import Api from 'src/api/index.ts';
import UIkit from 'uikit';
import { IconNoSSR } from 'src/components/utils/Icon';
import SearchBar from 'src/components/filters/SearchBar';
import CandidateOffersTab from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab';
import OpportunitiesList from 'src/components/backoffice/opportunities/OpportunitiesList';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';
import {
  textVariables,
  candidateSearchFilters,
  mutatedSchema,
} from 'src/components/backoffice/candidate/CandidateOpportunities/utils';

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

  const [numberOfResults, setNumberOfResults] = useState(0);
  const [offset, setOffset] = useState(0);

  const [offers, setOffers] = useState(undefined);
  const [otherOffers, setOtherOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCandidateOpportunities(
    setOffers,
    setOtherOffers,
    setNumberOfResults,
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
      <Section className="custom-header">
        <HeaderBackoffice
          title={textVariables.title[user.role][isPublic ? 'all' : 'mine']}
          description={
            textVariables.description[user.role][isPublic ? 'all' : 'mine']
          }
          noSeparator
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
      </Section>
      {isPublic ? (
        <Section className="custom-mobile-darkBG custom-mobile-fixed">
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
        </Section>
      ) : (
        <Section className="custom-primary">
          <CandidateOffersTab activeTab={filters.status} />
        </Section>
      )}
      <Section className="custom-primary">
        <OpportunitiesList
          loading={loading}
          offers={offers}
          otherOffers={otherOffers}
          hasError={hasError}
        />
      </Section>
    </>
  );
};

CandidateOpportunities.propTypes = {
  isPublic: PropTypes.bool,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  candidateId: PropTypes.string.isRequired,
};

CandidateOpportunities.defaultProps = {
  isPublic: true,
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default CandidateOpportunities;
