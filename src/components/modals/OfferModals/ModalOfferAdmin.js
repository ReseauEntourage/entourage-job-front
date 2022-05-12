import React from 'react';
import PropTypes from 'prop-types';
import Api from 'src/Axios';
import schema, {
  adminMutations,
} from 'src/components/forms/schema/formEditOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import {
  findConstantFromValue,
  findOfferStatus,
  formatParagraph,
  mutateDefaultOfferStatus,
  mutateFormSchema,
  sortByOrder,
} from 'src/utils';
import {
  BUSINESS_LINES,
  EXTERNAL_OFFERS_ORIGINS,
  OFFER_STATUS,
} from 'src/constants';
import ModalOfferInfo from 'src/components/modals/OfferModals/ModalOfferInfo';
import { useModalContext } from 'src/components/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import formEditExternalOpportunitySchema from 'src/components/forms/schema/formEditExternalOpportunity';
import { List } from 'src/components/modals/OfferModals/NavList';
import { OfferInfoContainer } from 'src/components/modals/OfferModals/OfferInfoContainer';
import ModalOfferBase from 'src/components/modals/OfferModals/ModalOfferBase';
import useModalOffer from 'src/components/modals/OfferModals/useModalOffer';
import OfferContent from 'src/components/modals/OfferModals/OfferContent';

const getCandidatesToShowInInput = (offer) => {
  if (offer.userOpportunity && offer.userOpportunity.length > 0) {
    if (offer.isPublic) {
      return offer.userOpportunity
        .filter((userOpp) => {
          return userOpp.recommended;
        })
        .map((userOpp) => {
          return {
            value: userOpp.User.id,
            label: `${userOpp.User.firstName} ${userOpp.User.lastName}`,
          };
        });
    }
    return offer.userOpportunity.map((userOpp) => {
      return {
        value: userOpp.User.id,
        label: `${userOpp.User.firstName} ${userOpp.User.lastName}`,
      };
    });
  }
  return undefined;
};

const ModalOfferAdmin = ({
  currentOffer,
  onOfferUpdated,
  duplicateOffer,
  navigateBackToList,
}) => {
  const { onClose } = useModalContext();
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

  // desactivation du champ de disclaimer
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'shouldSendNotifications',
      props: [
        {
          propName: 'hidden',
          value: !offer.isValidated,
        },
        {
          propName: 'disabled',
          value: !offer.isValidated,
        },
      ],
    },
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
    {
      fieldId: 'locations',
      props: [
        {
          propName: 'component',
          value: 'fieldgroup',
        },
      ],
    },
    {
      fieldId: 'startEndContract',
      props: [
        {
          propName: 'hidden',
          value: false,
        },
        {
          propName: 'disabled',
          value: false,
        },
      ],
    },
    ...adminMutations,
  ]);

  const mutatedExternalOfferSchema = mutateFormSchema(
    formEditExternalOpportunitySchema,
    [
      {
        fieldId: 'businessLines',
        props: [
          {
            propName: 'hidden',
            value: false,
          },
          {
            propName: 'disabled',
            value: false,
          },
        ],
      },
    ]
  );

  const sortedBusinessLines =
    offer.businessLines && offer.businessLines.length > 0
      ? sortByOrder(offer.businessLines)
      : null;

  const defaultBusinessLines =
    sortedBusinessLines?.map((businessLineObject) => {
      return findConstantFromValue(businessLineObject.name, BUSINESS_LINES);
    }) || undefined;

  const updateOpportunity = async (opportunity, isExternal) => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await Api.put(
        `/opportunity/${isExternal ? 'external' : ''}`,
        opportunity
      );
      setOffer({
        ...data,
        userOpportunity: isExternal
          ? [data.userOpportunity]
          : data.userOpportunity,
      });
      await onOfferUpdated();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityUser = async (opportunityUser) => {
    setError(false);
    try {
      const { data } = await Api.put(`/opportunity/join`, opportunityUser);
      setOffer((prevOffer) => {
        return {
          ...prevOffer,
          userOpportunity: Array.isArray(offer.userOpportunity)
            ? [
                ...offer.userOpportunity.filter((userOpp) => {
                  return userOpp.UserId !== data.UserId;
                }),
                {
                  ...offer.userOpportunity.find((userOpp) => {
                    return userOpp.UserId === data.UserId;
                  }),
                  ...data,
                },
              ]
            : data,
        };
      });
      await onOfferUpdated();
    } catch (err) {
      setError(true);
    }
  };

  const getUsersToShow = () => {
    if (Array.isArray(offer.userOpportunity)) {
      if (offer.isPublic) {
        return offer.userOpportunity.filter((userOpp) => {
          return (
            userOpp.status !== OFFER_STATUS[0].value || userOpp.recommended
          );
        });
      }
      return offer.userOpportunity;
    }
    return [offer.userOpportunity];
  };

  // Modal
  return (
    <ModalOfferBase
      isExternal={offer.isExternal}
      isArchived={offer.isArchived}
      navigateBackToList={navigateBackToList}
      loading={loading}
      error={error}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      editingForm={
        <div>
          <h3>Modification de l&apos;offre d&apos;emploi</h3>
          {offer.isExternal ? (
            <FormWithValidation
              formSchema={mutatedExternalOfferSchema}
              defaultValues={{
                ...offer,
                candidateId: offer.userOpportunity[0]?.UserId,
                businessLines: defaultBusinessLines,
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
                  recruiterPhone: fields.recruiterPhone || null,
                  candidateId: offer.userOpportunity[0]?.UserId,
                  id: offer.id,
                  businessLines: fields.businessLines
                    ? fields.businessLines.map((businessLine, index) => {
                        return {
                          name: businessLine,
                          order: index,
                        };
                      })
                    : [],
                };
                await updateOpportunity(tmpOpportunity, true);
                setIsEditing(false);
              }}
              submitText="Mettre à jour"
            />
          ) : (
            <FormWithValidation
              formSchema={mutatedSchema}
              defaultValues={{
                ...offer,
                candidatesId: getCandidatesToShowInInput(offer),
                businessLines: defaultBusinessLines,
                department: findConstantFromValue(
                  offer.department,
                  DEPARTMENTS_FILTERS
                ),
                shouldSendNotifications: true,
              }}
              onCancel={() => {
                setIsEditing(false);
              }}
              onSubmit={async (fields) => {
                const tmpOpportunity = {
                  ...offer,
                  ...fields,
                  message: fields.isPublic ? null : fields.message,
                  startOfContract: fields.startOfContract || null,
                  endOfContract: fields.endOfContract || null,
                  recruiterPhone: fields.recruiterPhone || null,
                  candidatesId:
                    fields.candidatesId?.map((candidateId) => {
                      return typeof candidateId === 'object'
                        ? candidateId.value
                        : candidateId;
                    }) || [],
                  businessLines: fields.businessLines
                    ? fields.businessLines.map((businessLine, index) => {
                        return {
                          name: businessLine,
                          order: index,
                        };
                      })
                    : [],
                };
                await updateOpportunity(tmpOpportunity);
                setIsEditing(false);
              }}
              submitText="Mettre à jour"
            />
          )}
        </div>
      }
    >
      <div>
        <Grid gap="small" between middle eachWidths={['expand@m', 'auto@m']}>
          <ModalOfferInfo
            startOfContract={offer.startOfContract}
            isPublic={offer.isPublic}
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
            <div className="uk-margin-small-top uk-margin-small-bottom">
              {(() => {
                let className = ' uk-label-warning';
                let content = 'À valider';
                if (offer.isValidated) {
                  content = 'Publiée';
                  className = ' uk-label-success';
                }
                return <div className={`uk-label${className}`}>{content}</div>;
              })()}
            </div>
            <List className="uk-iconnav uk-flex-right">
              <ButtonIcon
                name="archive"
                className={offer.isArchived ? 'ent-color-amber' : undefined}
                tooltip="Archiver l'offre"
                onClick={async () => {
                  await updateOpportunity({
                    ...offer,
                    isArchived: !offer.isArchived,
                  });
                }}
              />
              <ButtonIcon
                name="pencil"
                tooltip="Modifier l'offre"
                onClick={() => {
                  setIsEditing(true);
                }}
              />
              {!offer.isExternal && (
                <ButtonIcon
                  name="copy"
                  tooltip="Dupliquer l'offre"
                  onClick={() => {
                    duplicateOffer(onClose);
                  }}
                />
              )}
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
            {offer.recruiterFirstName && offer.recruiterName && (
              <>
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
                    target="_blank"
                  >
                    <span>
                      {offer.recruiterMail}
                      &nbsp;
                    </span>
                    <IconNoSSR name="mail" ratio={0.8} />
                  </SimpleLink>
                  {offer.recruiterPhone && (
                    <SimpleLink
                      href={`tel:${offer.recruiterPhone}`}
                      className="uk-text-meta uk-text-muted uk-flex uk-flex-middle"
                      isExternal
                      newTab
                    >
                      <span>
                        {offer.recruiterPhone}
                        &nbsp;
                      </span>
                      <IconNoSSR name="phone" ratio={0.8} />
                    </SimpleLink>
                  )}
                </OfferInfoContainer>
                {offer.contactMail && (
                  <OfferInfoContainer icon="mail" title="Mail de contact">
                    <SimpleLink
                      href={`mailto:${offer.contactMail}`}
                      className="uk-text-muted uk-flex uk-flex-middle"
                      isExternal
                      target="_blank"
                    >
                      <span>{offer.contactMail}</span>
                    </SimpleLink>
                  </OfferInfoContainer>
                )}
              </>
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
            {offer.userOpportunity && (
              <OfferInfoContainer
                icon="users"
                title={offer.isPublic ? 'Statut pour' : 'Candidat(s) lié(s)'}
              >
                <div className="uk-height-max-medium uk-overflow-auto">
                  {getUsersToShow()
                    .sort((a, b) => {
                      return a.User.firstName.localeCompare(b.User.firstName);
                    })
                    .map((userOpp) => {
                      if (userOpp.User) {
                        const offerStatus = findOfferStatus(
                          userOpp.status,
                          offer.isPublic,
                          userOpp.recommended
                        );

                        return (
                          <div
                            key={userOpp.OpportunityId + userOpp.User.id}
                            className="uk-flex uk-flex-column"
                            style={{ marginTop: 5 }}
                          >
                            <SimpleLink
                              href={`/backoffice/admin/membres/${userOpp.User.id}`}
                              className="uk-link-muted uk-flex uk-flex-middle"
                              target="_blank"
                            >
                              <span className="uk-flex-1">
                                {`${userOpp.User.firstName} ${userOpp.User.lastName}`}
                                &nbsp;
                              </span>
                              <div className="uk-flex-right">
                                {userOpp.bookmarked && (
                                  <IconNoSSR
                                    name="star"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                                {userOpp.archived && (
                                  <IconNoSSR
                                    name="archive"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                                {offer.isPublic && userOpp.recommended && (
                                  <IconNoSSR
                                    name="bolt"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                              </div>
                            </SimpleLink>
                            <div uk-form-custom="target: true">
                              <select
                                className="uk-select"
                                onChange={async (event) => {
                                  await updateOpportunityUser({
                                    ...userOpp,
                                    status: parseInt(event.target.value, 10),
                                  });
                                }}
                                value={userOpp.status}
                                style={{
                                  height: 'auto',
                                }}
                              >
                                {mutateDefaultOfferStatus(offer, userOpp).map(
                                  (item, i) => {
                                    return (
                                      <option value={item.value} key={i}>
                                        {item.label}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                              <div className="uk-flex uk-flex-middle">
                                <span
                                  className={`uk-text-meta uk-text-${offerStatus.color}`}
                                >
                                  {offerStatus.label}
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
          <OfferContent offer={offer} />
        </Grid>
        <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom">
          {!offer.isExternal && (
            <>
              {offer.isValidated ? (
                <Button
                  style="default"
                  onClick={async () => {
                    await updateOpportunity({
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
                  style="primary"
                  onClick={async () => {
                    await updateOpportunity({
                      ...offer,
                      isValidated: true,
                      shouldSendNotifications: true,
                    });
                  }}
                >
                  Valider l&apos;offre
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </ModalOfferBase>
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
    otherInfo: PropTypes.string,
    recruiterName: PropTypes.string,
    isPublic: PropTypes.bool,
    isArchived: PropTypes.bool,
    isValidated: PropTypes.bool,
    recruiterMail: PropTypes.string,
    contactMail: PropTypes.string,
    recruiterPhone: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    location: PropTypes.string,
    department: PropTypes.string,
    userOpportunity: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        recommended: PropTypes.bool,
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
    link: PropTypes.string,
    externalOrigin: PropTypes.string,
    isExternal: PropTypes.bool,
    salary: PropTypes.string,
    driversLicense: PropTypes.string,
    workingHours: PropTypes.string,
  }),
  onOfferUpdated: PropTypes.func.isRequired,
  duplicateOffer: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
};

ModalOfferAdmin.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
