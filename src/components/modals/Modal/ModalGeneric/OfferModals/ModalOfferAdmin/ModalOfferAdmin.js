import React from 'react';
import PropTypes from 'prop-types';
import Api from 'src/api/index.ts';
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
import ModalOfferInfo from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/ModalOfferInfo';
import { useModalContext } from 'src/components/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements.ts';
import formEditExternalOpportunitySchema from 'src/components/forms/schema/formEditExternalOpportunity';
import { List } from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/NavList';
import { OfferInfoContainer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/OfferInfoContainer';
import ModalOfferBase from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOfferBase';
import useModalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/useModalOffer';
import OfferContent from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/OfferContent';
import UIkit from 'uikit';

const getCandidatesToShowInInput = (offer) => {
  if (offer.opportunityUsers && offer.opportunityUsers.length > 0) {
    if (offer.isPublic) {
      return offer.opportunityUsers
        .filter((oppUser) => {
          return oppUser.recommended;
        })
        .map((oppUser) => {
          return {
            value: oppUser.user?.id,
            label: `${oppUser.user?.firstName} ${oppUser.user?.lastName}`,
          };
        });
    }
    return offer.opportunityUsers.map((oppUser) => {
      return {
        value: oppUser.user?.id,
        label: `${oppUser.user?.firstName} ${oppUser.user?.lastName}`,
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
  const { loading, setLoading, isEditing, setIsEditing, offer, setOffer } =
    useModalOffer(currentOffer);

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

  const sortedBusinessLines =
    offer.businessLines && offer.businessLines.length > 0
      ? sortByOrder(offer.businessLines)
      : null;

  const defaultBusinessLines =
    sortedBusinessLines?.map((businessLineObject) => {
      return findConstantFromValue(businessLineObject.name, BUSINESS_LINES);
    }) || undefined;

  const updateOpportunity = async (opportunity, isExternal) => {
    setLoading(true);
    const {
      createdAt,
      updatedAt,
      createdBy,
      opportunityUsers,
      id,
      candidateId,
      ...restOpportunity
    } = opportunity;
    try {
      const { data } = isExternal
        ? await Api.putExternalOpportunity(id, candidateId, restOpportunity)
        : await Api.putOpportunity(id, restOpportunity);
      setOffer({
        ...data,
        opportunityUsers: isExternal
          ? [data.opportunityUsers]
          : data.opportunityUsers,
      });
      await onOfferUpdated();
      setIsEditing(false);
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityUser = async (opportunityUser) => {
    try {
      const { data } = await Api.putJoinOpportunity(opportunityUser);
      setOffer((prevOffer) => {
        return {
          ...prevOffer,
          opportunityUsers: Array.isArray(offer.opportunityUsers)
            ? [
                ...offer.opportunityUsers.filter((oppUser) => {
                  return oppUser.UserId !== data.UserId;
                }),
                {
                  ...offer.opportunityUsers.find((oppUser) => {
                    return oppUser.UserId === data.UserId;
                  }),
                  ...data,
                },
              ]
            : data,
        };
      });
      await onOfferUpdated();
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };

  const getUsersToShow = () => {
    if (Array.isArray(offer.opportunityUsers)) {
      if (offer.isPublic) {
        return offer.opportunityUsers.filter((oppUser) => {
          return (
            oppUser.status !== OFFER_STATUS[0].value || oppUser.recommended
          );
        });
      }
      return offer.opportunityUsers;
    }
    return [offer.opportunityUsers];
  };

  const isInternalContact = offer?.recruiterMail?.includes('entourage.social');

  // Modal
  return (
    <ModalOfferBase
      isExternal={offer.isExternal}
      isArchived={offer.isArchived}
      navigateBackToList={navigateBackToList}
      loading={loading}
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
                candidateId: offer.opportunityUsers[0]?.UserId,
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
                  candidateId: offer.opportunityUsers[0]?.UserId,
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
              }}
              submitText="Mettre à jour"
            />
          ) : (
            <FormWithValidation
              formSchema={mutatedSchema}
              defaultValues={{
                ...offer,
                candidatesIds: getCandidatesToShowInInput(offer),
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
                  candidatesIds:
                    fields.candidatesIds?.map((candidateId) => {
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
            <List className="uk-iconnav uk-flex-right uk-flex uk-flex-middle">
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
              {(offer.isValidated || offer.isArchived || !offer.isExternal) && (
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
            {!offer.isExternal && (
              <OfferInfoContainer
                icon="user"
                title={isInternalContact ? 'Personne à contacter' : 'Recruteur'}
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
            )}
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
            {offer.opportunityUsers && (
              <OfferInfoContainer
                icon="users"
                title={offer.isPublic ? 'Statut pour' : 'Candidat(s) lié(s)'}
              >
                <div className="uk-height-max-medium uk-overflow-auto">
                  {getUsersToShow()
                    .sort((a, b) => {
                      return a.user.firstName.localeCompare(b.user.firstName);
                    })
                    .map((oppUser) => {
                      if (oppUser.user) {
                        const offerStatus = findOfferStatus(
                          oppUser.status,
                          offer.isPublic,
                          oppUser.recommended
                        );

                        return (
                          <div
                            key={oppUser.OpportunityId + oppUser.user.id}
                            className="uk-flex uk-flex-column"
                            style={{ marginTop: 5 }}
                          >
                            <SimpleLink
                              href={`/backoffice/admin/membres/${oppUser.user.id}`}
                              className="uk-link-muted uk-flex uk-flex-middle"
                              target="_blank"
                            >
                              <span className="uk-flex-1">
                                {`${oppUser.user.firstName} ${oppUser.user.lastName}`}
                                &nbsp;
                              </span>
                              <div className="uk-flex-right">
                                {oppUser.bookmarked && (
                                  <IconNoSSR
                                    name="star"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                                {oppUser.archived && (
                                  <IconNoSSR
                                    name="archive"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                                {offer.isPublic && oppUser.recommended && (
                                  <IconNoSSR
                                    name="bolt"
                                    ratio={0.8}
                                    className="ent-color-amber"
                                  />
                                )}
                              </div>
                            </SimpleLink>
                            <div data-uk-form-custom="target: true">
                              <select
                                className="uk-select"
                                onChange={async (event) => {
                                  await updateOpportunityUser({
                                    ...oppUser,
                                    status: parseInt(event.target.value, 10),
                                  });
                                }}
                                value={oppUser.status}
                                style={{
                                  height: 'auto',
                                }}
                              >
                                {mutateDefaultOfferStatus(offer, oppUser)
                                  .slice(offer.isExternal ? 1 : 0)
                                  .map((item, i) => {
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
        {!offer.isExternal && (
          <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom">
            {(!offer.isArchived || offer.isValidated) && (
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
            )}
            {!offer.isValidated && (
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
          </div>
        )}
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
    opportunityUsers: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        recommended: PropTypes.bool,
        note: PropTypes.string,
        archived: PropTypes.bool,
        User: PropTypes.shape({}),
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
  currentOffer: { opportunityUsers: {}, businessLines: [] },
};

export default ModalOfferAdmin;
