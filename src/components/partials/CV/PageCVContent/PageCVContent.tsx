import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ProfileCareerPathSentence } from '@/src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { CVExperienceOrFormation } from '@/src/components/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import {
  StyledCVSkillTagContainer,
  StyledSkillTag,
} from '@/src/components/profile/CVExperienceOrFormation/CVExperienceOrFormation.styles';
import { CarouselSwiper } from '@/src/components/utils/CarouselSwiper';
import QuoteLeftIcon from 'assets/icons/quote-left.svg';
import QuoteRightIcon from 'assets/icons/quote-right.svg';
import { CVCallToActions } from '../CVCallToActions';
import { CVShareButtons } from '../CVCallToActions/CVShareButtons';
import { Api } from 'src/api';
import { PublicUser } from 'src/api/types';
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
  StyledHeaderDetails,
  StyledLeftColumn,
  StyledLeftQuoteContainer,
  StyledRightColumn,
  StyledRightQuoteContainer,
  StyledShareContainer,
  StyledTitleAccordion,
} from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { Button, Text } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { H1, H2, H3, H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CONTRACTS } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';
import { findConstantFromValue } from 'src/utils';

interface openedPanelType {
  informations: boolean;
  experiences: boolean;
  formations: boolean;
  passions: boolean;
}

interface PageCVContentProps {
  publicUser: PublicUser;
  actionDisabled?: boolean;
  isPreview?: boolean;
}

export const PageCVContent = ({
  publicUser,
  actionDisabled = false,
  isPreview = false,
}: PageCVContentProps) => {
  const dispatch = useDispatch();

  const isDesktop = useIsDesktop();

  const [isStoryHidden, setIsStoryHidden] = useState<boolean>(true);

  const [openedPanel, setOpenedPanel] = useState<openedPanelType>({
    informations: false,
    experiences: true,
    formations: false,
    passions: false,
  });

  const imgSrc = publicUser?.userProfile?.hasPicture
    ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${publicUser.id}.profile.jpg`
    : '/static/img/arthur.jpg';

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
            imgSrc={imgSrc}
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
              <CVShareButtons
                publicProfile={publicUser}
                actionDisabled={actionDisabled}
              />
            </>
          )}
        </StyledCVProfilePictureContainer>
        <StyledHeaderDetails className={!isDesktop ? 'mobile' : ''}>
          <div>
            <H1
              title={`${publicUser.firstName} ${publicUser.lastName}`}
              color={COLORS.black}
            />
            {publicUser.userProfile.sectorOccupations && (
              <ProfileCareerPathSentence
                sectorOccupations={publicUser.userProfile.sectorOccupations}
              />
            )}

            {publicUser.userProfile.introduction && (
              <StyledCVPageContentStory
                className={!isDesktop && isStoryHidden ? 'mobile-hidden' : ''}
              >
                <p className="">{publicUser.userProfile.introduction}</p>
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
              {publicUser.userProfile.skills &&
                publicUser.userProfile.skills.map(({ name, id }, key) => {
                  return (
                    <StyledSkillTag key={`${key}-${id}`}>{name}</StyledSkillTag>
                  );
                })}
            </StyledCVSkillTagContainer>
          </div>
          <StyledCVMessageContainer className={!isDesktop ? 'mobile' : ''}>
            <H5
              title={`Donnez un coup de pouce à ${publicUser.firstName} !`}
              color={COLORS.black}
            />
            <p>
              Apporter des conseils, informations sur le secteur
              d&lsquo;activité, retour d&lsquo;expérience, mise en contact, une
              opportunité ...
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
                    title={`Envoyer un message à ${publicUser.firstName}`}
                    description={`Vous pouvez envoyer un message à ${publicUser.firstName} pour l'aider et le/la conseiller dans sa recherche d'emploi`}
                    submitText="Envoyer"
                    formSchema={formSendExternalMessage}
                    onSubmit={async (fields, closeModal) => {
                      gaEvent(GA_TAGS.PAGE_CV_ENVOYER_CONTACTEZ_MOI_CLIC);
                      fbEvent(FB_TAGS.MESSAGE_SEND);
                      try {
                        await Api.postExternalMessage({
                          UserId: publicUser.id,
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
              <CVShareButtons
                publicProfile={publicUser}
                actionDisabled={actionDisabled}
              />
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
              <H5 title="Informations" color={COLORS.black} />
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
              {publicUser.userProfile.contracts &&
                publicUser.userProfile.contracts.length > 0 && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <LucidIcon name="FileText" />{' '}
                        <span>Type de contrat</span>
                      </p>
                      <p className="content">
                        {publicUser.userProfile.contracts.map(({ name }) => {
                          return (
                            <Text color="darkGray" key={name}>
                              {findConstantFromValue(name, CONTRACTS).label}
                            </Text>
                          );
                        })}
                      </p>
                    </div>
                  </li>
                )}
              {publicUser.userProfile.userProfileLanguages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Globe" /> <span>Langues</span>
                    </p>
                    <p className="content">
                      {publicUser.userProfile.userProfileLanguages.map(
                        ({ language }) => {
                          return (
                            <Text color="darkGray" key={language?.id}>
                              {language?.name}
                            </Text>
                          );
                        }
                      )}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </StyledCVPageContentInformations>
          {publicUser.userProfile.interests?.length > 0 && isDesktop && (
            <StyledCVPageContentPassions>
              <H5 title="Mes centres d'intérêts" color={COLORS.black} />
              <ul>
                {publicUser.userProfile.interests.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledLeftColumn>
        <StyledRightColumn>
          {publicUser.userProfile.experiences?.length > 0 && (
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
                {publicUser.userProfile.experiences.map((experience) => {
                  return (
                    <CVExperienceOrFormation
                      key={experience.id}
                      title={experience.title}
                      description={experience.description}
                      startDate={experience.startDate}
                      endDate={experience.endDate}
                      location={experience.location}
                      structure={experience.company}
                      skills={experience.skills}
                    />
                  );
                })}
              </ul>
            </StyledCVPageContentExperience>
          )}
          {publicUser.userProfile.formations?.length > 0 && (
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
                {publicUser.userProfile.formations.map((formation) => {
                  return (
                    <CVExperienceOrFormation
                      key={formation.id}
                      title={formation.title}
                      description={formation.description}
                      startDate={formation.startDate}
                      endDate={formation.endDate}
                      location={formation.location}
                      structure={formation.institution}
                      skills={formation.skills}
                    />
                  );
                })}
              </ul>
            </StyledCVPageContentExperience>
          )}
          {publicUser.userProfile.interests?.length > 0 && !isDesktop && (
            <StyledCVPageContentPassions
              className={`${openedPanel.passions ? '' : 'close'} ${
                !isDesktop ? 'mobile' : ''
              }`}
            >
              {isDesktop ? (
                <H5 title="Mes centres d'intérêts" />
              ) : (
                <StyledTitleAccordion
                  onClick={() => {
                    setOpenedPanel({
                      ...openedPanel,
                      passions: !openedPanel.passions,
                    });
                  }}
                >
                  <H2 title="Mes centres d'intérêts" />
                  <LucidIcon
                    name="ChevronDown"
                    color={COLORS.primaryBlue}
                    size={25}
                  />
                </StyledTitleAccordion>
              )}
              <ul>
                {publicUser.userProfile.interests?.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledRightColumn>
      </StyledCVPageContentDetailsContainer>
      {publicUser.userProfile.reviews?.length > 0 && (
        <StyledCVPageContentCarousel>
          <H3 title="Ils me recommandent" color={COLORS.black} center />
          <CarouselSwiper
            slides={[
              ...publicUser.userProfile.reviews.map(
                ({ content, id, authorLabel, authorName }) => {
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
                }
              ),
            ]}
          />
        </StyledCVPageContentCarousel>
      )}
      <CVCallToActions
        actionDisabled={actionDisabled}
        publicUser={publicUser}
      />
    </StyledCVPageContent>
  );
};
