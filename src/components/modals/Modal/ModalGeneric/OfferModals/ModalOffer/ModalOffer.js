import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import Select from 'src/components/forms/fields/Select';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import Api from 'src/Axios';
import {
  findConstantFromValue,
  formatParagraph,
  getCandidateIdFromCoachOrCandidate,
  mutateDefaultOfferStatus,
  mutateFormSchema,
} from 'src/utils';
import ModalOfferInfo from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/ModalOfferInfo';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { UserContext } from 'src/components/store/UserProvider';
import { EXTERNAL_OFFERS_ORIGINS, OFFER_STATUS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { OfferInfoContainer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/OfferInfoContainer';
import { List } from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/NavList';
import ModalOfferBase from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOfferBase';
import useModalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/useModalOffer';
import OfferContent from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/OfferContent';
import UIkit from 'uikit';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { GA_TAGS } from 'src/constants/tags';
import formEditExternalOpportunitySchema from 'src/components/forms/schema/formEditExternalOpportunity';

const AfterContactItem = ({ isPublic }) => {
  return (
    <li>
      Une fois le mail envoyé, cliquez sur{' '}
      <span className="uk-text-italic">
        {isPublic ? "J'ai contacté le recruteur" : "J'ai répondu au recruteur"}
      </span>
      . Vous informez ainsi LikedOut, merci&nbsp;!
    </li>
  );
};

AfterContactItem.propTypes = {
  isPublic: PropTypes.bool.isRequired,
};

const ContactStepsInterested = ({ mail, isPublic }) => {
  return (
    <div>
      <ol className="uk-list uk-list-decimal">
        <li>
          <span className="uk-text-bold uk-flex uk-flex-wrap">
            Écrivez au recruteur à&nbsp;
            <SimpleLink
              href={`mailto:${mail}`}
              isExternal
              target="_blank"
              className="uk-flex uk-flex-middle"
            >
              {mail}
              &nbsp;
            </SimpleLink>
            pour lui proposer un temps d&apos;échange.{' '}
          </span>
          Relisez votre mail avec votre coach.
        </li>
        <AfterContactItem isPublic={isPublic} />
      </ol>
    </div>
  );
};

ContactStepsInterested.propTypes = {
  mail: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
};

const PrivateOfferSentence = ({ firstName, lastName }) => {
  return (
    <>
      <span className="uk-text-bold">
        {firstName} {lastName}
      </span>{' '}
      a pris le temps de vous adresser cette offre personnellement.
    </>
  );
};

PrivateOfferSentence.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const ModalOffer = ({ currentOffer, onOfferUpdated, navigateBackToList }) => {
  const {
    replace,
    pathname,
    query: { updateStatus, ...restQuery },
  } = useRouter();
  const prevUpdateStatus = usePrevious(updateStatus);

  const { user } = useContext(UserContext);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const { loading, setLoading, isEditing, setIsEditing, offer, setOffer } =
    useModalOffer(currentOffer);

  const { status, bookmarked, note, archived } = offer?.opportunityUsers || {};

  const isInternalContact = offer?.recruiterMail?.includes('entourage.social');

  const updateOpportunityUser = useCallback(
    async (opportunityUser) => {
      const { data } = await Api.put(`/opportunity/join`, opportunityUser);
      setOffer((prevOffer) => {
        return {
          ...prevOffer,
          opportunityUsers: data,
        };
      });
      await onOfferUpdated();
    },
    [onOfferUpdated, setOffer]
  );

  useEffect(() => {
    const archiveOffer = async () => {
      const { opportunityUsers } = offer;

      await updateOpportunityUser({
        ...opportunityUsers,
        archived: true,
        status: OFFER_STATUS[4].value,
      });
      UIkit.notification("L'offre a été archivée", 'success');
    };

    const updateStatusOffer = async (newStatus) => {
      const { opportunityUsers } = offer;
      await updateOpportunityUser({
        ...opportunityUsers,
        archived: false,
        status: newStatus,
      });
      UIkit.notification("Le statut de l'offre a été mis à jour", 'success');
    };

    if (updateStatus && prevUpdateStatus !== updateStatus) {
      const statusAsNumber = parseInt(updateStatus, 10);
      if (statusAsNumber === OFFER_STATUS[4].value) {
        archiveOffer();
      } else {
        updateStatusOffer(statusAsNumber);
      }
      replace({
        pathname,
        query: restQuery,
      });
    }
  }, [
    pathname,
    offer,
    prevUpdateStatus,
    replace,
    restQuery,
    updateOpportunityUser,
    updateStatus,
  ]);

  const mutatedOfferStatus = mutateDefaultOfferStatus(
    offer,
    offer.opportunityUsers
  );

  const mutatedExternalOfferSchema = mutateFormSchema(
    formEditExternalOpportunitySchema,
    [
      {
        fieldId: 'candidateStatus',
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
    ]
  );

  const updateOpportunity = async (opportunity) => {
    setLoading(true);
    try {
      const { data } = await Api.put(`/opportunity/external`, opportunity);
      setOffer(data);
      await onOfferUpdated();
      setIsEditing(false);
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const shouldShowCTAs = !offer.isExternal && !offer.opportunityUsers.archived;

  // Modal
  return (
    <ModalOfferBase
      isExternal={offer.isExternal}
      isArchived={archived}
      navigateBackToList={navigateBackToList}
      loading={loading}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      editingForm={
        <div>
          <h3>Modification de l&apos;offre d&apos;emploi</h3>
          <FormWithValidation
            formSchema={mutatedExternalOfferSchema}
            defaultValues={{
              ...offer,
              candidateId: getCandidateIdFromCoachOrCandidate(user),
              department: findConstantFromValue(
                offer.department,
                DEPARTMENTS_FILTERS
              ),
            }}
            onCancel={() => {
              setIsEditing(false);
            }}
            onSubmit={async (fields) => {
              const tmpOpportunity = {
                ...fields,
                startOfContract: fields.startOfContract || null,
                endOfContract: fields.endOfContract || null,
                candidateId: getCandidateIdFromCoachOrCandidate(user),
                id: offer.id,
                businessLines: undefined,
              };
              await updateOpportunity(tmpOpportunity);
            }}
            submitText="Mettre à jour"
          />
        </div>
      }
    >
      <div>
        <Grid gap="small" between middle eachWidths={['expand@m', 'auto@m']}>
          <ModalOfferInfo
            startOfContract={offer.startOfContract}
            isPublic={offer.isPublic}
            isRecommended={offer.opportunityUsers.recommended}
            isExternal={offer.isExternal}
            salary={offer.salary}
            driversLicense={offer.driversLicense}
            workingHours={offer.workingHours}
            contract={offer.contract}
            date={offer.date}
            title={offer.title}
            isPartTime={offer.isPartTime}
            endOfContract={offer.endOfContract}
            offerId={offer.id}
          />
          <div className="uk-flex uk-flex-column uk-flex-bottom">
            <Grid
              className="uk-flex-right uk-flex-row"
              eachWidths={['auto', 'auto']}
              row
              bottom
            >
              {shouldShowCTAs && status < OFFER_STATUS[1].value ? (
                <div className="uk-flex uk-flex-middle uk-flex-right uk-flex-wrap-reverse">
                  <Button
                    style="default"
                    className="uk-margin-small-top uk-margin-small-bottom"
                    onClick={() => {
                      openModal(
                        <ModalConfirm
                          text={
                            !offer.isPublic ? (
                              <PrivateOfferSentence
                                lastName={offer.recruiterName}
                                firstName={offer.recruiterFirstName}
                              />
                            ) : (
                              ''
                            )
                          }
                          onConfirm={async () => {
                            const { opportunityUsers } = offer;
                            await updateOpportunityUser({
                              ...opportunityUsers,
                              archived: true,
                              status: OFFER_STATUS[4].value,
                            });
                            UIkit.notification(
                              "L'offre a été archivée",
                              'success'
                            );
                          }}
                          title="L'offre ne vous intéresse pas"
                          buttonText={
                            offer.isPublic
                              ? "J'archive l'offre"
                              : "J'ai contacté le recruteur"
                          }
                        >
                          {offer.isPublic ? (
                            <>
                              Cette offre étant adressée à tous, vous
                              n&apos;avez pas besoin de répondre au recruteur.
                              <br />
                              <br />
                              Vous pourrez retrouver cette offre à tout moment
                              dans l&apos;onglet{' '}
                              <span className="uk-text-bold">
                                Offres archivées
                              </span>
                              .
                            </>
                          ) : (
                            <div className="uk-margin-medium-top">
                              <ol className="uk-list uk-list-decimal">
                                <li>
                                  <div className="uk-flex uk-flex-wrap">
                                    <span className="uk-text-bold uk-flex uk-flex-wrap">
                                      Écrivez au recruteur à
                                    </span>
                                    &nbsp;
                                    <SimpleLink
                                      href={`mailto:${offer.recruiterMail}`}
                                      isExternal
                                      target="_blank"
                                      className="uk-flex uk-flex-middle uk-text-bold"
                                    >
                                      {offer.recruiterMail}
                                    </SimpleLink>
                                    .&nbsp;
                                    <span>
                                      Il est indispensable de lui répondre, que
                                      vous soyez intéressé(e) ou non&nbsp;!
                                      Relisez votre mail avec votre coach.
                                    </span>
                                  </div>
                                </li>
                                <AfterContactItem isPublic={offer.isPublic} />
                              </ol>
                            </div>
                          )}
                        </ModalConfirm>
                      );
                    }}
                  >
                    Je ne suis pas intéressé(e) par l&apos;offre
                  </Button>
                  <Button
                    className="uk-margin-small-left uk-margin-small-top uk-margin-small-bottom"
                    style="primary"
                    onClick={() => {
                      gaEvent(
                        GA_TAGS.BACKOFFICE_CANDIDAT_CONTACTER_RECRUTEUR_CLIC
                      );
                      openModal(
                        <ModalConfirm
                          title={"L'offre vous intéresse"}
                          text={
                            !offer.isPublic ? (
                              <PrivateOfferSentence
                                lastName={offer.recruiterName}
                                firstName={offer.recruiterFirstName}
                              />
                            ) : (
                              ''
                            )
                          }
                          buttonText={
                            offer.isPublic
                              ? "J'ai contacté le recruteur"
                              : "J'ai répondu au recruteur"
                          }
                          onConfirm={async () => {
                            gaEvent(
                              GA_TAGS.BACKOFFICE_CANDIDAT_VALIDER_CONTACTER_RECRUTEUR_CLIC
                            );
                            if (status < OFFER_STATUS[1].value) {
                              const { opportunityUsers } = offer;
                              await updateOpportunityUser({
                                ...opportunityUsers,
                                status: OFFER_STATUS[1].value,
                              });
                            }
                          }}
                        >
                          <div className="uk-margin-medium-top">
                            <ContactStepsInterested
                              mail={offer.recruiterMail}
                              isPublic={offer.isPublic}
                            />
                          </div>
                        </ModalConfirm>
                      );
                    }}
                  >
                    Contacter le recruteur
                  </Button>
                </div>
              ) : (
                <div className="uk-flex uk-flex-middle uk-flex-right uk-flex-wrap-reverse">
                  {!offer.isExternal && status === OFFER_STATUS[1].value && (
                    <Button
                      style="default"
                      onClick={async () => {
                        gaEvent(
                          GA_TAGS.BACKOFFICE_CANDIDAT_PAS_CONTACTER_RECRUTEUR_CLIC
                        );
                        const { opportunityUsers } = offer;
                        await updateOpportunityUser({
                          ...opportunityUsers,
                          status: OFFER_STATUS[0].value,
                        });
                      }}
                    >
                      Je n&apos;ai pas encore contacté le recruteur
                    </Button>
                  )}
                  <div className="uk-flex uk-flex-middle uk-margin-small-left">
                    {loadingStatus && (
                      <div
                        className="uk-margin-small-right"
                        data-uk-spinner=""
                      />
                    )}
                    <Select
                      id="modal-offer-status"
                      title="Statut"
                      name="status"
                      placeholder="statut"
                      options={
                        offer.isExternal
                          ? mutatedOfferStatus.slice(1)
                          : mutatedOfferStatus
                      }
                      value={status}
                      onChange={async (event) => {
                        gaEvent(
                          GA_TAGS.BACKOFFICE_CANDIDAT_STATUT_SELECTEUR_CLIC
                        );
                        setLoadingStatus(true);
                        const { opportunityUsers } = offer;
                        await updateOpportunityUser({
                          ...opportunityUsers,
                          status: parseInt(event.target.value, 10),
                        });
                        setLoadingStatus(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </Grid>
            <List className="uk-iconnav uk-flex uk-flex-right uk-flex-middle">
              {loadingIcon && (
                <div className="uk-flex uk-flex-center uk-flex-middle">
                  <div data-uk-spinner="" />
                </div>
              )}
              {offer.isExternal && (
                <ButtonIcon
                  name="pencil"
                  tooltip="Modifier l'offre"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                />
              )}
              <ButtonIcon
                name="star"
                className={bookmarked ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { opportunityUsers } = offer;
                  await updateOpportunityUser({
                    ...opportunityUsers,
                    bookmarked: !bookmarked,
                  });
                  setLoadingIcon(false);
                }}
              />
              <ButtonIcon
                name="archive"
                className={archived ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { opportunityUsers } = offer;
                  await updateOpportunityUser({
                    ...opportunityUsers,
                    archived: !archived,
                  });
                  setLoadingIcon(false);
                }}
              />
            </List>
          </div>
        </Grid>
        <hr />
        {offer.message && (
          <>
            <Grid>
              <OfferInfoContainer icon="commenting">
                <div>{formatParagraph(offer.message)}</div>
              </OfferInfoContainer>
            </Grid>
            <hr />
          </>
        )}
        <Grid
          className="uk-margin-bottom"
          eachWidths={['1-3@s', '2-3@s']}
          items={[
            <Grid column gap="medium">
              <OfferInfoContainer icon="home" title="Entreprise">
                {offer.company}
              </OfferInfoContainer>
              {!offer.isExternal && status > OFFER_STATUS[0].value && (
                <OfferInfoContainer
                  icon="user"
                  title={
                    isInternalContact ? 'Personne à contacter' : 'Recruteur'
                  }
                >
                  {(offer.recruiterFirstName || offer.recruiterName) && (
                    <span>
                      {offer.recruiterFirstName
                        ? `${offer.recruiterFirstName} `
                        : ''}
                      {offer.recruiterName ? offer.recruiterName : ''}
                    </span>
                  )}
                  {offer.recruiterPosition && (
                    <span className="uk-text-meta">
                      {offer.recruiterPosition}
                    </span>
                  )}
                  {offer.recruiterMail && (
                    <SimpleLink
                      href={`mailto:${offer.recruiterMail}`}
                      className="uk-text-meta uk-text-muted uk-flex uk-flex-middle"
                      isExternal
                      target="_blank"
                    >
                      <span>
                        {offer.recruiterMail}
                        &nbsp;
                      </span>
                      <IconNoSSR name="mail" ratio={0.8} />
                    </SimpleLink>
                  )}
                </OfferInfoContainer>
              )}
              <OfferInfoContainer icon="location" title={offer.department}>
                {offer.address && <span>{offer.address}</span>}
              </OfferInfoContainer>
              {offer.externalOrigin && (
                <OfferInfoContainer icon="search" title="Origine de l'offre">
                  <div>
                    {
                      EXTERNAL_OFFERS_ORIGINS.find((origin) => {
                        return offer.externalOrigin === origin.value;
                      })?.label
                    }
                  </div>
                </OfferInfoContainer>
              )}
            </Grid>,
            <OfferContent offer={offer} />,
          ]}
        />
        {note && (
          <div>
            <div className="uk-text-muted uk-text-bold">
              Anciens commentaires à propos de l&apos;offre
            </div>
            <div className="uk-text-muted">{formatParagraph(note)}</div>
          </div>
        )}
      </div>
    </ModalOfferBase>
  );
};

ModalOffer.propTypes = {
  currentOffer: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    description: PropTypes.string,
    companyDescription: PropTypes.string,
    numberOfPositions: PropTypes.number,
    prerequisites: PropTypes.string,
    otherInfo: PropTypes.string,
    skills: PropTypes.string,
    contract: PropTypes.string,
    endOfContract: PropTypes.string,
    startOfContract: PropTypes.string,
    isPartTime: PropTypes.bool,
    recruiterName: PropTypes.string,
    recruiterFirstName: PropTypes.string,
    recruiterPosition: PropTypes.string,
    isPublic: PropTypes.bool,
    recruiterMail: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    location: PropTypes.string,
    department: PropTypes.string,
    opportunityUsers: PropTypes.shape({
      status: PropTypes.number,
      bookmarked: PropTypes.bool,
      recommended: PropTypes.bool,
      note: PropTypes.string,
      archived: PropTypes.bool,
    }),
    link: PropTypes.string,
    externalOrigin: PropTypes.string,
    isExternal: PropTypes.bool,
    salary: PropTypes.string,
    driversLicense: PropTypes.string,
    workingHours: PropTypes.string,
  }),
  onOfferUpdated: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
};

ModalOffer.defaultProps = {
  currentOffer: { opportunityUsers: {}, businessLines: [] },
};

export default ModalOffer;
