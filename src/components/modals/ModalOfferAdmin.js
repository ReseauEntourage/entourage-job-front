import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from 'src/Axios';
import schema, {
  adminMutation,
} from 'src/components/forms/schema/formEditOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import { List, OfferInfoContainer } from 'src/components/modals/ModalOffer';

import {
  findOfferStatus,
  formatParagraph,
  getUserOpportunityFromOffer,
  mutateFormSchema,
} from 'src/utils';
import { OFFER_STATUS } from 'src/constants';
import ModalOfferInfo from 'src/components/modals/ModalOfferInfo';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import { useModalContext } from './Modal';

const ModalOfferAdmin = ({
  currentOffer,
  onOfferUpdated,
  duplicateOffer,
  navigateBackToList,
  selectedCandidateId,
}) => {
  const { onClose } = useModalContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [offer, setOffer] = useState(currentOffer);

  // desactivation du champ de disclaimer
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'disclaimer',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    {
      fieldId: 'openNewForm',
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
    adminMutation,
  ]);

  const updateOpportunity = async (opportunity) => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await Api.put(`/opportunity/`, opportunity);
      await setOffer(data);
      await onOfferUpdated();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityUser = async (opportunityUser) => {
    await Api.put(
      `/opportunity/join`,
      opportunityUser
    );
    await onOfferUpdated();
  };

  useEffect(() => {
    setError(false);
    setIsEditing(false);
  }, [offer]);

  if (!offer) {
    return null;
  }

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
            formSchema={mutatedSchema}
            defaultValues={{
              ...offer,
              candidatesId:
                !offer.isPublic &&
                offer.userOpportunity &&
                offer.userOpportunity.length > 0
                  ? offer.userOpportunity.map((userOpp) => {
                      return {
                        value: userOpp.User.id,
                        label: `${userOpp.User.firstName} ${userOpp.User.lastName}`,
                      };
                    })
                  : undefined,
            }}
            onCancel={() => {
              return setIsEditing(false);
            }}
            onSubmit={(fields) => {
              const tmpOpportunity = {
                ...offer,
                ...fields,
                message: fields.isPublic ? null : fields.message,
                startOfContract: fields.startOfContract || null,
                endOfContract: fields.endOfContract || null,
                candidatesId:
                  !fields.isPublic && fields.candidatesId
                    ? fields.candidatesId.map((candidateId) => {
                        return typeof candidateId === 'object'
                          ? candidateId.value
                          : candidateId;
                      })
                    : null,
              };
              updateOpportunity(tmpOpportunity);
              setIsEditing(false);
            }}
            submitText="Mettre à jour"
          />
        </div>
      );
    }

    const getUsersToShow = () => {
      if (Array.isArray(offer.userOpportunity)) {
        if (selectedCandidateId) {
          return [getUserOpportunityFromOffer(offer, selectedCandidateId)];
        }
        if (offer.isPublic) {
          return offer.userOpportunity.filter((userOpp) => {
            return userOpp.status !== OFFER_STATUS[0].value;
          });
        }
        return offer.userOpportunity;
      }
      return [offer.userOpportunity];
    };

    const mutatedOfferStatus = [
      {
        ...OFFER_STATUS[0],
        label: offer.isPublic ? OFFER_STATUS[0].alt : OFFER_STATUS[0].label,
      },
      ...OFFER_STATUS.slice(1),
    ];

    // view
    return (
      <div>
        <Grid gap="small" between middle eachWidths={['expand', 'auto']}>
          <ModalOfferInfo
            startOfContract={offer.startOfContract}
            isPublic={offer.isPublic}
            numberOfPositions={offer.numberOfPositions}
            contract={offer.contract}
            date={offer.date}
            title={offer.title}
            isPartTime={offer.isPartTime}
            endOfContract={offer.endOfContract}
            offerId={offer.id}
          />
          <div>
            <div className="uk-margin-small-top uk-margin-small-bottom">
              {(() => {
                let className = ' uk-label-warning';
                let content = 'À valider';
                if (offer.isValidated) {
                  content = 'Publiée';
                  className = ' uk-label-success';
                }
                if (offer.isArchived) {
                  content = 'Archivée';
                  className = ' uk-label-danger';
                }
                return <div className={`uk-label${className}`}>{content}</div>;
              })()}
            </div>
            <List className="uk-iconnav uk-flex-right">
              <ButtonIcon
                name="pencil"
                tooltip="Modifier l'offre"
                onClick={() => {
                  setIsEditing(true);
                }}
              />
              <ButtonIcon
                name="copy"
                tooltip="Dupliquer l'offre"
                onClick={() => {
                  duplicateOffer(onClose);
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
        <Grid className="uk-margin-bottom" eachWidths={['1-3@s', '2-3@s']}>
          <Grid column gap="medium">
            <OfferInfoContainer icon="home" title="Entreprise">
              {offer.company}
            </OfferInfoContainer>
            <OfferInfoContainer icon="user" title="Recruteur">
              <span>
                {offer.recruiterFirstName} {offer.recruiterName}
              </span>
              <span className="uk-text-muted">{offer.recruiterPosition}</span>
              <SimpleLink
                href={`mailto:${offer.recruiterMail}`}
                className="uk-link-muted"
                isExternal
                newTab
              >
                <span>
                  {offer.recruiterMail}
                  &nbsp;
                </span>
                <IconNoSSR name="mail" ratio={0.8} />
              </SimpleLink>
              <SimpleLink
                href={`tel:${offer.recruiterPhone}`}
                className="uk-link-muted"
                isExternal
                newTab
              >
                <span>
                  {offer.recruiterPhone}
                  &nbsp;
                </span>
                <IconNoSSR name="phone" ratio={0.8} />
              </SimpleLink>
              {offer.beContacted && <span>Souhaite être recontacté</span>}
            </OfferInfoContainer>
            <OfferInfoContainer icon="location" title={offer.department} />
            {offer.userOpportunity && (
              <OfferInfoContainer
                icon="users"
                title={`${
                  offer.isPublic ? 'Statut pour' : 'Candidat(s) lié(s)'
                }`}
              >
                <div className="uk-height-max-medium uk-overflow-auto">
                  {getUsersToShow().map((userOpp) => {
                    if (userOpp.User) {
                      const offerStatus = findOfferStatus(userOpp.status);

                      return (
                        <div
                          key={userOpp.OpportunityId + userOpp.User.id}
                          className="uk-flex uk-flex-column"
                          style={{ marginTop: 5 }}
                        >
                          <SimpleLink
                            as={`/backoffice/admin/membres/${userOpp.User.id}`}
                            href="/backoffice/admin/membres/[id]"
                            className="uk-link-muted"
                            target="_blank"
                          >
                            <span>
                              {`${userOpp.User.firstName} ${userOpp.User.lastName}`}
                              &nbsp;
                            </span>
                            <IconNoSSR name="link" ratio={0.8} />
                          </SimpleLink>
                          <div uk-form-custom="target: true">
                            <select
                              className="uk-select"
                              onChange={(event) => {
                                setLoading(true);
                                const userOpportunity = userOpp;
                                userOpportunity.status = Number(
                                  event.target.value
                                );
                                updateOpportunityUser(userOpportunity);
                                setLoading(false);
                              }}
                              value={userOpp.status}
                              style={{
                                height: 'auto',
                              }}
                            >
                              {mutatedOfferStatus.map((item, i) => {
                                return (
                                  <option value={item.value} key={i}>
                                    {item.label}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="uk-flex uk-flex-middle">
                              <span
                                className={`uk-text-meta uk-text-${offerStatus.color}`}
                              >
                                {offer.isPublic && offerStatus.alt
                                  ? offerStatus.alt
                                  : offerStatus.label}
                              </span>
                              <IconNoSSR
                                ratio={0.8}
                                className="uk-margin-small-left uk-text-muted"
                                name="triangle-down"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return undefined;
                  })}
                </div>
              </OfferInfoContainer>
            )}
          </Grid>
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
            <OfferInfoContainer icon="check" title="Compétences importantes">
              <div>{formatParagraph(offer.skills)}</div>
            </OfferInfoContainer>
            {offer.prerequisites && (
              <OfferInfoContainer icon="check" title="Pré-requis">
                <div>{formatParagraph(offer.prerequisites)}</div>
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
          </Grid>
        </Grid>
        <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom">
          {!offer.isArchived ? (
            <Button
              style="default"
              onClick={() => {
                return updateOpportunity({
                  ...offer,
                  isValidated: false,
                  isArchived: true,
                });
              }}
            >
              Refuser l&apos;offre
            </Button>
          ) : (
            <Button
              style="default"
              onClick={() => {
                return updateOpportunity({
                  ...offer,
                  isValidated: false,
                  isArchived: false,
                });
              }}
            >
              Retirer l&apos;offre des archives
            </Button>
          )}
          {!offer.isValidated && (
            <Button
              style="primary"
              onClick={() => {
                return updateOpportunity({
                  ...offer,
                  isValidated: true,
                  isArchived: false,
                });
              }}
            >
              Valider l&apos;offre
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Modal
  return (
    <ModalGeneric
      className={offer.isArchived ? 'uk-light uk-background-secondary' : ''}
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
ModalOfferAdmin.propTypes = {
  currentOffer: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    description: PropTypes.string,
    prerequisites: PropTypes.string,
    recruiterName: PropTypes.string,
    isPublic: PropTypes.bool,
    isArchived: PropTypes.bool,
    isValidated: PropTypes.bool,
    recruiterMail: PropTypes.string,
    recruiterPhone: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    location: PropTypes.string,
    department: PropTypes.string,
    userOpportunity: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        note: PropTypes.string,
        archived: PropTypes.bool,
        User: PropTypes.shape(),
      })
    ),
    companyDescription: PropTypes.string,
    skills: PropTypes.string,
    contract: PropTypes.string,
    endOfContract: PropTypes.string,
    startOfContract: PropTypes.string,
    isPartTime: PropTypes.bool,
    recruiterFirstName: PropTypes.string,
    recruiterPosition: PropTypes.string,
    numberOfPositions: PropTypes.number,
    beContacted: PropTypes.bool,
  }),
  onOfferUpdated: PropTypes.func.isRequired,
  duplicateOffer: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
  selectedCandidateId: PropTypes.string,
};
ModalOfferAdmin.defaultProps = {
  selectedCandidateId: undefined,
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
