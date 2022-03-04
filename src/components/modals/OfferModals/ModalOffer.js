import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import Textarea from 'src/components/forms/fields/Textarea';
import Select from 'src/components/forms/fields/Select';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import Api from 'src/Axios';
import {
  findConstantFromValue,
  formatParagraph,
  mutateDefaultOfferStatus,
} from 'src/utils';
import ModalOfferInfo from 'src/components/modals/OfferModals/ModalOfferInfo';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { UserContext } from 'src/components/store/UserProvider';
import {
  EXTERNAL_OFFERS_ORIGINS,
  OFFER_STATUS,
  USER_ROLES,
} from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import { OfferInfoContainer } from 'src/components/modals/OfferModals/OfferInfoContainer';
import { List } from 'src/components/modals/OfferModals/NavList';
import ModalOfferBase from 'src/components/modals/OfferModals/ModalOfferBase';
import useModalOffer from 'src/components/modals/OfferModals/useModalOffer';
import OfferContent from 'src/components/modals/OfferModals/OfferContent';

const ModalOffer = ({ currentOffer, onOfferUpdated, navigateBackToList }) => {
  const { user } = useContext(UserContext);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const {
    loading,
    error,
    setLoading,
    setError,
    isEditing,
    setIsEditing,
    offer,
    setOffer,
  } = useModalOffer(currentOffer);

  const { status, bookmarked, note, archived } = offer?.userOpportunity || {};
  const [noteBuffer, setNoteBuffer] = useState(note);

  const isInternalContact = offer?.recruiterMail?.includes('entourage.social');

  const updateOpportunityUser = async (opportunityUser) => {
    const { data } = await Api.put(`/opportunity/join`, opportunityUser);
    setOffer((prevOffer) => {
      return {
        ...prevOffer,
        userOpportunity: data,
      };
    });
    await onOfferUpdated();
  };

  useEffect(() => {
    setNoteBuffer(note);
  }, [offer, note]);

  const mutatedOfferStatus = mutateDefaultOfferStatus(
    offer,
    offer.userOpportunity
  );

  const updateOpportunity = async (opportunity) => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await Api.put(`/opportunity/external`, opportunity);
      setOffer(data);
      await onOfferUpdated();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Modal
  return (
    <ModalOfferBase
      isExternal={offer.isExternal}
      isArchived={archived}
      navigateBackToList={navigateBackToList}
      loading={loading}
      error={error}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      editingForm={
        <div>
          <h3>Modification de l&apos;offre d&apos;emploi</h3>
          <FormWithValidation
            formSchema={formEditExternalOpportunity}
            defaultValues={{
              ...offer,
              candidateId:
                user.role === USER_ROLES.COACH ? user.candidat.id : user.id,
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
                candidateId:
                  user.role === USER_ROLES.COACH ? user.candidat.id : user.id,
                id: offer.id,
                businessLines: undefined,
              };
              await updateOpportunity(tmpOpportunity);
              setIsEditing(false);
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
            isRecommended={offer.userOpportunity.recommended}
            isExternal={offer.isExternal}
            numberOfPositions={offer.numberOfPositions}
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
              middle
            >
              <div className="uk-flex uk-flex-middle">
                {loadingStatus && (
                  <div className="uk-margin-small-right" data-uk-spinner="" />
                )}
                <Select
                  id="modal-offer-status"
                  title="Statut"
                  name="status"
                  placeholder="statut"
                  options={mutatedOfferStatus}
                  value={status}
                  onChange={async (event) => {
                    setLoadingStatus(true);
                    const { userOpportunity } = offer;
                    await updateOpportunityUser({
                      ...userOpportunity,
                      status: Number(event.target.value),
                    });
                    setLoadingStatus(false);
                  }}
                />
              </div>
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
                name="archive"
                className={archived ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { userOpportunity } = offer;
                  await updateOpportunityUser({
                    ...userOpportunity,
                    archived: !archived,
                  });
                  setLoadingIcon(false);
                }}
              />
              <ButtonIcon
                name="star"
                className={bookmarked ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { userOpportunity } = offer;
                  await updateOpportunityUser({
                    ...userOpportunity,
                    bookmarked: !bookmarked,
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
              {offer.recruiterFirstName &&
                offer.recruiterName &&
                status > OFFER_STATUS[0].value && (
                  <OfferInfoContainer
                    icon="user"
                    title={
                      isInternalContact ? 'Personne à contacter' : 'Recruteur'
                    }
                  >
                    <span>
                      {offer.recruiterFirstName} {offer.recruiterName}
                    </span>
                    <span className="uk-text-meta">
                      {offer.recruiterPosition}
                    </span>
                    <SimpleLink
                      href={`mailto:${offer.recruiterMail}`}
                      className="uk-text-meta uk-text-muted uk-flex uk-flex-middle"
                      isExternal
                      newTab
                    >
                      <span>{offer.recruiterMail}&nbsp;</span>
                      <IconNoSSR name="mail" ratio={0.8} />
                    </SimpleLink>
                  </OfferInfoContainer>
                )}
              <OfferInfoContainer icon="location" title={offer.department} />
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
        <div>
          <Textarea
            id="modal-offer-comment"
            name="modal-offer-comment"
            title="Ecrivez vos commentaires à propos de cette offre. Ceux-ci ne sont pas envoyés au recruteur."
            type="text"
            value={noteBuffer}
            onChange={(e) => {
              return setNoteBuffer(e.target.value);
            }}
          />
          {noteBuffer === note || (note === null && noteBuffer === '') ? (
            <Button style="default" disabled>
              Enregistré
            </Button>
          ) : (
            <Button
              style="default"
              onClick={async () => {
                setLoading(true);
                const { userOpportunity } = offer;
                await updateOpportunityUser({
                  ...userOpportunity,
                  note: noteBuffer,
                });
                setLoading(false);
              }}
            >
              Enregistrer
              {loading ? (
                <div
                  data-uk-spinner="ratio: 0.5"
                  className="uk-margin-small-left"
                />
              ) : null}
            </Button>
          )}
        </div>
        {!offer.isExternal &&
          !offer.userOpportunity.archived &&
          status <= OFFER_STATUS[1].value && (
            <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
              <>
                {status < OFFER_STATUS[1].value && (
                  <Button
                    style="default"
                    onClick={() => {
                      openModal(
                        <ModalConfirm
                          onConfirm={async () => {
                            const { userOpportunity } = offer;
                            await updateOpportunityUser({
                              ...userOpportunity,
                              archived: true,
                              status: OFFER_STATUS[4].value,
                            });
                          }}
                          text={
                            'L\'offre va être archivée et son statut sera déclaré comme "Refusé avant entretien". Vous pourrez toujours la retrouver dans vos offres archivées et la restaurer !'
                          }
                          buttonText="Confirmer"
                        />
                      );
                    }}
                  >
                    Je ne suis pas intéressé par l&apos;offre
                  </Button>
                )}
                {status === OFFER_STATUS[1].value && (
                  <Button
                    style="default"
                    onClick={async () => {
                      const { userOpportunity } = offer;
                      await updateOpportunityUser({
                        ...userOpportunity,
                        status: OFFER_STATUS[0].value,
                      });
                    }}
                  >
                    Je n&apos;ai pas encore contacté le recruteur
                  </Button>
                )}
                {status < OFFER_STATUS[1].value && (
                  <Button
                    style="primary"
                    onClick={() => {
                      openModal(
                        <ModalConfirm
                          title={
                            isInternalContact
                              ? 'Personne à contacter'
                              : 'Coordonnées du recruteur'
                          }
                          text=""
                          buttonText="J'ai contacté le recruteur"
                          onConfirm={async () => {
                            if (status < OFFER_STATUS[1].value) {
                              const { userOpportunity } = offer;
                              await updateOpportunityUser({
                                ...userOpportunity,
                                status: OFFER_STATUS[1].value,
                              });
                            }
                          }}
                        >
                          <Grid gap="small" column>
                            <div className="uk-flex uk-flex-middle">
                              <IconNoSSR
                                style={{ width: 20 }}
                                name="user"
                                ratio={1}
                                className="uk-margin-small-right"
                              />
                              <div className="uk-flex uk-flex-column">
                                <h4 className="uk-text-bold uk-flex-middle uk-flex uk-margin-remove">
                                  {offer.recruiterFirstName}{' '}
                                  {offer.recruiterName}
                                </h4>
                                <span className="uk-text-meta">
                                  {offer.recruiterPosition}
                                </span>
                              </div>
                            </div>
                            <div className="uk-flex uk-flex-middle">
                              <IconNoSSR
                                name="home"
                                ratio={0.8}
                                style={{ width: 20 }}
                                className="uk-margin-small-right"
                              />
                              <span>{offer.company}</span>
                            </div>
                            <SimpleLink
                              href={`mailto:${offer.recruiterMail}`}
                              isExternal
                              newTab
                              className="uk-flex uk-flex-middle"
                            >
                              <IconNoSSR
                                name="mail"
                                ratio={0.8}
                                style={{ width: 20 }}
                                className="uk-margin-small-right"
                              />
                              {offer.recruiterMail}
                            </SimpleLink>
                          </Grid>
                        </ModalConfirm>
                      );
                    }}
                  >
                    Contacter le recruteur
                  </Button>
                )}
              </>
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
    userOpportunity: PropTypes.shape({
      status: PropTypes.number,
      bookmarked: PropTypes.bool,
      recommended: PropTypes.bool,
      note: PropTypes.string,
      archived: PropTypes.bool,
    }),
    link: PropTypes.string,
    externalOrigin: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onOfferUpdated: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
};

ModalOffer.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOffer;
