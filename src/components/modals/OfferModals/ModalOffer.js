import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import UIkit from 'uikit';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';

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

  const updateOpportunityUser = useCallback(
    async (opportunityUser) => {
      const { data } = await Api.put(`/opportunity/join`, opportunityUser);
      setOffer((prevOffer) => {
        return {
          ...prevOffer,
          userOpportunity: data,
        };
      });
      await onOfferUpdated();
    },
    [onOfferUpdated, setOffer]
  );

  useEffect(() => {
    setNoteBuffer(note);
  }, [offer, note]);

  useEffect(() => {
    const archiveOffer = async () => {
      const { userOpportunity } = offer;

      await updateOpportunityUser({
        ...userOpportunity,
        archived: true,
        status: OFFER_STATUS[4].value,
      });
      UIkit.notification("L'offre a été archivée", 'success');
    };

    const updateStatusOffer = async (newStatus) => {
      const { userOpportunity } = offer;
      await updateOpportunityUser({
        ...userOpportunity,
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

  const shouldShowCTAs = !offer.isExternal && !offer.userOpportunity.archived;

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
                            const { userOpportunity } = offer;
                            await updateOpportunityUser({
                              ...userOpportunity,
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
                                      vous soyez intéressé⸱e ou non&nbsp;!
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
                    Je ne suis pas intéressé⸱e par l&apos;offre
                  </Button>
                  <Button
                    className="uk-margin-small-left uk-margin-small-top uk-margin-small-bottom"
                    style="primary"
                    onClick={() => {
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
                            if (status < OFFER_STATUS[1].value) {
                              const { userOpportunity } = offer;
                              await updateOpportunityUser({
                                ...userOpportunity,
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
                      options={mutatedOfferStatus}
                      value={status}
                      onChange={async (event) => {
                        setLoadingStatus(true);
                        const { userOpportunity } = offer;
                        await updateOpportunityUser({
                          ...userOpportunity,
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
                      target="_blank"
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
