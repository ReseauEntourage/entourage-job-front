import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import QuoteLeftIcon from 'assets/icons/quote-left.svg';
import QuoteRightIcon from 'assets/icons/quote-right.svg';
import { CVCallToActions } from '../CVCallToActions';
import { CVShareButtons } from '../CVCallToActions/CVShareButtons';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { formSendExternalMessage } from 'src/components/forms/schemas/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

import {
  StyledCVMessageContainer,
  StyledCVPageContent,
  StyledCVPageContentCarousel,
  StyledCVPageContentDetailsContainer,
  StyledCVPageContentExperience,
  StyledCVPageContentHeader,
  StyledCVPageContentInformations,
  StyledCVPageContentPassions,
  StyledCVPageContentSlide,
  StyledCVPageContentStory,
  StyledCVProfilePicture,
  StyledCVProfilePictureContainer,
  StyledCVSkillTagContainer,
  StyledHeaderDetails,
  StyledLeftColumn,
  StyledLeftQuoteContainer,
  StyledRightColumn,
  StyledRightQuoteContainer,
  StyledShareContainer,
  StyledSkillTag,
  StyledTitleAccordion,
} from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { CVCareerPathSentence } from 'src/components/profile';
import { CVExperienceOrFormation } from 'src/components/profile/CVExperienceOrFormation';
import { Button } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { CarouselSwiper } from 'src/components/utils/CarouselSwiper';
import { H1, H2, H3, H4, H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface openedPanelType {
  informations: boolean;
  experiences: boolean;
  formations: boolean;
  passions: boolean;
}

interface PageCVContentProps {
  cv: CV;
  actionDisabled?: boolean;
  isPreview?: boolean;
}

export const PageCVContent = ({
  cv,
  actionDisabled = false,
  isPreview = false,
}: PageCVContentProps) => {
  const locations =
    cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

  const dispatch = useDispatch();

  const isDesktop = useIsDesktop();

  const [isStoryHidden, setIsStoryHidden] = useState<boolean>(true);

  const [openedPanel, setOpenedPanel] = useState<openedPanelType>({
    informations: false,
    experiences: true,
    formations: false,
    passions: false,
  });

  return (
    <StyledCVPageContent>
      {!isPreview && (
        <BackLink
          url="/candidats?employed=false"
          label="Retour à la page candidats"
        />
      )}
      <StyledCVPageContentHeader>
        <StyledCVProfilePictureContainer className={!isDesktop ? 'mobile' : ''}>
          <StyledCVProfilePicture
            className={!isDesktop ? 'mobile' : ''}
            imgSrc={`${process.env.NEXT_PUBLIC_AWSS3_CDN_URL}/${cv.urlImg}`}
          />
          {isDesktop && (
            <>
              <StyledShareContainer>
                <H5
                  title="Partagez son CV sur vos réseaux"
                  color={COLORS.black}
                />
                <p>
                  En augmentant sa visibilité, vous pouvez générer des
                  rencontres qui peuvent tout changer&nbsp;!
                </p>
              </StyledShareContainer>
              <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
            </>
          )}
        </StyledCVProfilePictureContainer>
        <StyledHeaderDetails className={!isDesktop ? 'mobile' : ''}>
          <div>
            <H1
              title={`${cv.user.candidat.firstName} ${cv.user.candidat.lastName}`}
              color={COLORS.black}
            />
            <CVCareerPathSentence
              occupations={cv.occupations}
              businessSectors={cv.businessSectors}
            />
            {cv.catchphrase && (
              <p id="quote">
                <QuoteLeftIcon />
                <span>{cv.catchphrase}</span>
                <QuoteRightIcon />
              </p>
            )}
            {cv.introduction && (
              <StyledCVPageContentStory
                className={!isDesktop && isStoryHidden ? 'mobile-hidden' : ''}
              >
                <p className="">{cv.introduction}</p>
                {!isDesktop && isStoryHidden && (
                  <div className="seeMore">
                    <div onClick={() => setIsStoryHidden(!isStoryHidden)}>
                      En lire plus
                    </div>
                  </div>
                )}
              </StyledCVPageContentStory>
            )}
            <StyledCVSkillTagContainer>
              {cv.skills.length > 0 &&
                cv.skills.map(({ name, id }, key) => {
                  return (
                    <StyledSkillTag key={`${key}-${id}`}>{name}</StyledSkillTag>
                  );
                })}
            </StyledCVSkillTagContainer>
          </div>
          <StyledCVMessageContainer className={!isDesktop ? 'mobile' : ''}>
            <H5
              title={`Donnez un coup de pouce à ${cv.user.candidat.firstName} !`}
              color={COLORS.black}
            />
            <p>
              Apporter des conseils, informations sur le secteur
              d&lsquo;activité, retour d&lsquo;expérience, mise en contact, une
              opportunité&nbsp;...
            </p>
            <Button
              variant="primary"
              rounded
              disabled={actionDisabled}
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_CV_CONTACTEZ_MOI_CLIC);
                fbEvent(FB_TAGS.MESSAGE_OPEN);
                openModal(
                  <ModalEdit
                    title={`Envoyer un message à ${cv.user.candidat.firstName}`}
                    description={`Vous pouvez envoyer un message à ${cv.user.candidat.firstName} pour l'aider et le/la conseiller dans sa recherche d'emploi`}
                    submitText="Envoyer"
                    formSchema={formSendExternalMessage}
                    onSubmit={async (fields, closeModal) => {
                      gaEvent(GA_TAGS.PAGE_CV_ENVOYER_CONTACTEZ_MOI_CLIC);
                      fbEvent(FB_TAGS.MESSAGE_SEND);
                      try {
                        await Api.postExternalMessage({
                          UserId: cv.UserId,
                          ...fields,
                        });
                        dispatch(
                          notificationsActions.addNotification({
                            type: 'success',
                            message: 'Le message a bien été envoyé',
                          })
                        );

                        closeModal();
                      } catch (err) {
                        dispatch(
                          notificationsActions.addNotification({
                            type: 'danger',
                            message: "Une erreur s'est produite",
                          })
                        );
                        console.error(err);
                      }
                    }}
                  />
                );
              }}
            >
              Envoyer un message
            </Button>
          </StyledCVMessageContainer>
          {!isDesktop && (
            <>
              <StyledShareContainer>
                <H5
                  title="Partagez son CV sur vos réseaux"
                  color={COLORS.black}
                />
                <p>
                  En augmentant sa visibilité, vous pouvez générer des
                  rencontres qui peuvent tout changer&nbsp;!
                </p>
              </StyledShareContainer>
              <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
            </>
          )}
        </StyledHeaderDetails>
      </StyledCVPageContentHeader>
      <StyledCVPageContentDetailsContainer
        className={!isDesktop ? 'mobile' : ''}
      >
        <StyledLeftColumn>
          <StyledCVPageContentInformations
            className={`${openedPanel.informations ? '' : 'close'} ${
              !isDesktop ? 'mobile' : ''
            }`}
          >
            {isDesktop ? (
              <H4 title="Informations" color={COLORS.black} />
            ) : (
              <StyledTitleAccordion
                onClick={() => {
                  setOpenedPanel({
                    ...openedPanel,
                    informations: !openedPanel.informations,
                  });
                }}
              >
                <H2 title="Informations" />
                <LucidIcon
                  name="ChevronDown"
                  color={COLORS.primaryBlue}
                  size={25}
                />
              </StyledTitleAccordion>
            )}
            <ul>
              {cv.contracts && cv.contracts.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="FileText" /> <span>Type de contrat</span>
                    </p>
                    <p className="content">
                      {cv.contracts
                        .map(({ name }) => {
                          return findConstantFromValue(name, CONTRACTS).label;
                        })
                        .join(' / ')}
                    </p>
                  </div>
                </li>
              )}
              {locations && locations.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="MapPin" /> <span>Localisation</span>
                    </p>
                    <p className="content">
                      {locations
                        .map(({ name }) => {
                          return findConstantFromValue(
                            name,
                            DEPARTMENTS_FILTERS
                          ).label;
                        })
                        .join(' / ')}
                    </p>
                  </div>
                </li>
              )}
              {cv.availability?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Calendar" /> <span>Disponibilité</span>
                    </p>
                    <p className="content">{cv.availability}</p>
                  </div>
                </li>
              )}
              {cv.languages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Globe" /> <span>Langues</span>
                    </p>
                    <p className="content">
                      {cv.languages
                        .map(({ name }) => {
                          return name;
                        })
                        .join(' / ')}
                    </p>
                  </div>
                </li>
              )}
              {cv.transport?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="CarFront" /> <span>Mobilité</span>
                    </p>
                    <p className="content">{cv.transport}</p>
                  </div>
                </li>
              )}
            </ul>
          </StyledCVPageContentInformations>
          {cv.passions?.length > 0 && isDesktop && (
            <StyledCVPageContentPassions>
              <H4 title="Mes passions" color={COLORS.black} />
              <ul>
                {cv?.passions?.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledLeftColumn>
        <StyledRightColumn>
          {
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            cv.experiences?.length > 0 && (
              <StyledCVPageContentExperience
                className={`${openedPanel.experiences ? '' : 'close'} ${
                  !isDesktop ? 'mobile' : ''
                }`}
              >
                <StyledTitleAccordion
                  onClick={() => {
                    setOpenedPanel({
                      ...openedPanel,
                      experiences: !openedPanel.experiences,
                    });
                  }}
                >
                  <H2 title="Expériences" />
                  {!isDesktop && (
                    <LucidIcon
                      name="ChevronDown"
                      color={COLORS.primaryBlue}
                      size={25}
                    />
                  )}
                </StyledTitleAccordion>
                <ul>
                  {
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    cv.experiences.map((experience) => {
                      return (
                        <CVExperienceOrFormation
                          key={experience.id}
                          title={experience.title}
                          description={experience.description}
                          dateStart={experience.dateStart}
                          dateEnd={experience.dateEnd}
                          location={experience.location}
                          structure={experience.company}
                          skills={experience.skills}
                        />
                      );
                    })
                  }
                </ul>
              </StyledCVPageContentExperience>
            )
          }
          {
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            cv.formations?.length > 0 && (
              // using same style for Formations and Experiences, but change in fields
              <StyledCVPageContentExperience
                className={`${openedPanel.formations ? '' : 'close'} ${
                  !isDesktop ? 'mobile' : ''
                }`}
              >
                <StyledTitleAccordion
                  onClick={() => {
                    setOpenedPanel({
                      ...openedPanel,
                      formations: !openedPanel.formations,
                    });
                  }}
                >
                  <H2 title="Formation" />
                  {!isDesktop && (
                    <LucidIcon
                      name="ChevronDown"
                      color={COLORS.primaryBlue}
                      size={25}
                    />
                  )}
                </StyledTitleAccordion>
                <ul>
                  {
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    cv.formations.map((formation) => {
                      return (
                        <CVExperienceOrFormation
                          key={formation.id}
                          title={formation.title}
                          description={formation.description}
                          dateStart={formation.dateStart}
                          dateEnd={formation.dateEnd}
                          location={formation.location}
                          structure={formation.institution}
                          skills={formation.skills}
                        />
                      );
                    })
                  }
                </ul>
              </StyledCVPageContentExperience>
            )
          }
          {cv.passions?.length > 0 && !isDesktop && (
            <StyledCVPageContentPassions
              className={`${openedPanel.passions ? '' : 'close'} ${
                !isDesktop ? 'mobile' : ''
              }`}
            >
              {isDesktop ? (
                <H4 title="Mes passions" />
              ) : (
                <StyledTitleAccordion
                  onClick={() => {
                    setOpenedPanel({
                      ...openedPanel,
                      passions: !openedPanel.passions,
                    });
                  }}
                >
                  <H2 title="Mes passions" />
                  <LucidIcon
                    name="ChevronDown"
                    color={COLORS.primaryBlue}
                    size={25}
                  />
                </StyledTitleAccordion>
              )}
              <ul>
                {cv?.passions?.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledRightColumn>
      </StyledCVPageContentDetailsContainer>
      {cv.reviews?.length > 0 && (
        <StyledCVPageContentCarousel>
          <H3 title="Ils me recommandent" color={COLORS.black} center />
          <CarouselSwiper
            slides={[
              ...cv.reviews.map(({ content, id, authorLabel, authorName }) => {
                return (
                  <StyledCVPageContentSlide key={id}>
                    <StyledLeftQuoteContainer>
                      <QuoteLeftIcon />
                    </StyledLeftQuoteContainer>
                    <div>
                      <span>{content}</span>
                      <br />
                      <span className="name">
                        {authorName}, {authorLabel}
                      </span>
                    </div>
                    <StyledRightQuoteContainer>
                      <QuoteRightIcon />
                    </StyledRightQuoteContainer>
                  </StyledCVPageContentSlide>
                );
              }),
            ]}
          />
        </StyledCVPageContentCarousel>
      )}
      <CVCallToActions actionDisabled={actionDisabled} cv={cv} />
    </StyledCVPageContent>
  );
};
