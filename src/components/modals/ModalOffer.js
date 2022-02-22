import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import Textarea from 'src/components/forms/fields/Textarea';
import Select from 'src/components/forms/fields/Select';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import Api from 'src/Axios';
import { formatParagraph, mutateDefaultOfferStatus } from 'src/utils';
import ModalOfferInfo from 'src/components/modals/ModalOfferInfo';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { UserContext } from 'src/components/store/UserProvider';
import { EXTERNAL_OFFERS_ORIGINS, USER_ROLES } from 'src/constants';

export const List = ({ className, children }) => {
  return (
    <ul className={`uk-nav ${className}`}>
      {Array.isArray(children)
        ? children.map((item, i) => {
            return <li key={i}>{item}</li>;
          })
        : children}
    </ul>
  );
};

List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

List.defaultProps = {
  className: undefined,
};

export const OfferInfoContainer = ({ icon, title, children }) => {
  if (!children) {
    children = [];
  } else if (!children.map) {
    children = [children];
  }

  return (
    <Grid gap="small" eachWidths={['auto', 'expand']}>
      {icon ? <IconNoSSR name={icon} /> : <div className="uk-margin-left" />}
      <div>
        {title ? <span className="uk-text-bold">{title}</span> : undefined}
        <Grid gap="collapse" childWidths={['1-1']}>
          {children}
        </Grid>
      </div>
    </Grid>
  );
};

OfferInfoContainer.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    ),
  ]),
};

OfferInfoContainer.defaultProps = {
  title: undefined,
  icon: undefined,
  children: [],
};

const ModalOffer = ({ currentOffer, onOfferUpdated, navigateBackToList }) => {
  const { user } = useContext(UserContext);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [offer, setOffer] = useState(currentOffer);
  const { status, bookmarked, note, archived } = offer?.userOpportunity || {};
  const [noteBuffer, setNoteBuffer] = useState(note);

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

  const resetNoteBuffer = () => {
    return setNoteBuffer(note);
  };

  useEffect(resetNoteBuffer, [offer, note]);

  if (!offer) {
    return null;
  }

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

  const contentBuilder = () => {
    // error
    if (error) {
      return <div>Une erreur c&lsquo;est produite</div>;
    }

    // loading
    if (loading) {
      return (
        <div className="uk-height-medium uk-flex uk-flex-middle uk-flex-center">
          <div data-uk-spinner="" />
        </div>
      );
    }

    // edit
    if (isEditing) {
      return (
        <div>
          <h3>Modification de l&apos;offre d&apos;emploi</h3>
          <FormWithValidation
            formSchema={formEditExternalOpportunity}
            defaultValues={{
              ...offer,
              candidateId:
                user.role === USER_ROLES.COACH ? user.candidat.id : user.id,
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
              };
              await updateOpportunity(tmpOpportunity);
              setIsEditing(false);
            }}
            submitText="Mettre à jour"
          />
        </div>
      );
    }
    return (
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
              <>
                {loadingStatus && <div data-uk-spinner="" />}
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
              </>
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
              {offer.recruiterFirstName && offer.recruiterName && (
                <OfferInfoContainer icon="user" title="Personne à contacter">
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
            <Grid gap="medium" childWidths={['1-1']}>
              {offer.companyDescription && (
                <OfferInfoContainer
                  icon="comment"
                  title="Description de l'entreprise"
                >
                  <div>{formatParagraph(offer.companyDescription)}</div>
                </OfferInfoContainer>
              )}
              <OfferInfoContainer icon="comment" title="Description de l'offre">
                <div>{formatParagraph(offer.description)}</div>
              </OfferInfoContainer>
              {offer.skills && (
                <OfferInfoContainer
                  icon="check"
                  title="Compétences importantes"
                >
                  <div>{formatParagraph(offer.skills)}</div>
                </OfferInfoContainer>
              )}
              {offer.prerequisites && (
                <OfferInfoContainer icon="check" title="Pré-requis">
                  <div>{formatParagraph(offer.prerequisites)}</div>
                </OfferInfoContainer>
              )}
              {offer.link && (
                <OfferInfoContainer icon="link" title="Lien">
                  <div>{offer.link.trim()}</div>
                </OfferInfoContainer>
              )}
              {offer.businessLines && (
                <Grid gap="small">
                  {offer.businessLines.map((businessLine, index) => {
                    return (
                      <Button key={index} disabled>
                        <span style={{ color: '#666' }}>{businessLine}</span>
                      </Button>
                    );
                  })}
                </Grid>
              )}
            </Grid>,
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
                console.log('update offer note', noteBuffer);
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
    );
  };
  let className = '';
  if (archived) {
    className = 'uk-light uk-background-secondary';
  } else if (offer.isExternal) {
    className = 'uk-background-muted';
  }
  // Modal
  return (
    <ModalGeneric
      className={className}
      onClose={(closeModal) => {
        if (isEditing) {
          setIsEditing(false);
        } else {
          closeModal();
          navigateBackToList();
        }
      }}
    >
      {contentBuilder()}
    </ModalGeneric>
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
