import React, { useState } from 'react';

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
import { PublicCV } from 'src/api/types';

import {
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
import { Text } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { H1, H2, H3, H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CONTRACTS } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import { findConstantFromValue } from 'src/utils';

interface openedPanelType {
  informations: boolean;
  experiences: boolean;
  formations: boolean;
  passions: boolean;
}

interface PageCVContentProps {
  publicCV: PublicCV;
  actionDisabled?: boolean;
  isPreview?: boolean;
}

export const PageCVContent = ({
  publicCV,
  actionDisabled = false,
  isPreview = false,
}: PageCVContentProps) => {
  const isDesktop = useIsDesktop();

  const [isStoryHidden, setIsStoryHidden] = useState<boolean>(true);

  const [openedPanel, setOpenedPanel] = useState<openedPanelType>({
    informations: false,
    experiences: true,
    formations: false,
    passions: false,
  });

  const imgSrc = publicCV?.userProfile?.hasPicture
    ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${publicCV.id}.profile.jpg`
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
                publicCV={publicCV}
                actionDisabled={actionDisabled}
              />
            </>
          )}
        </StyledCVProfilePictureContainer>
        <StyledHeaderDetails className={!isDesktop ? 'mobile' : ''}>
          <div>
            <H1
              title={`${publicCV.firstName} ${publicCV.lastName}`}
              color={COLORS.black}
            />
            {publicCV.userProfile.sectorOccupations && (
              <ProfileCareerPathSentence
                role={publicCV.role}
                sectorOccupations={publicCV.userProfile.sectorOccupations}
              />
            )}

            {publicCV.userProfile.introduction && (
              <StyledCVPageContentStory
                className={!isDesktop && isStoryHidden ? 'mobile-hidden' : ''}
              >
                <p className="">{publicCV.userProfile.introduction}</p>
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
              {publicCV.userProfile.skills &&
                publicCV.userProfile.skills.map(({ name, id }, key) => {
                  return (
                    <StyledSkillTag key={`${key}-${id}`}>{name}</StyledSkillTag>
                  );
                })}
            </StyledCVSkillTagContainer>
          </div>
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
                publicCV={publicCV}
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
              {publicCV.userProfile.contracts &&
                publicCV.userProfile.contracts.length > 0 && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <LucidIcon name="FileText" />{' '}
                        <span>Type de contrat</span>
                      </p>
                      <p className="content">
                        {publicCV.userProfile.contracts.map(({ name }) => {
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
              {publicCV.userProfile.userProfileLanguages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Globe" /> <span>Langues</span>
                    </p>
                    <p className="content">
                      {publicCV.userProfile.userProfileLanguages.map(
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
          {publicCV.userProfile.interests?.length > 0 && isDesktop && (
            <StyledCVPageContentPassions>
              <H5 title="Mes centres d'intérêts" color={COLORS.black} />
              <ul>
                {publicCV.userProfile.interests.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledLeftColumn>
        <StyledRightColumn>
          {publicCV.userProfile.experiences?.length > 0 && (
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
                {publicCV.userProfile.experiences.map((experience) => {
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
          {publicCV.userProfile.formations?.length > 0 && (
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
                {publicCV.userProfile.formations.map((formation) => {
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
          {publicCV.userProfile.interests?.length > 0 && !isDesktop && (
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
                {publicCV.userProfile.interests?.map(({ name }) => {
                  return <p>{name}</p>;
                })}
              </ul>
            </StyledCVPageContentPassions>
          )}
        </StyledRightColumn>
      </StyledCVPageContentDetailsContainer>
      {publicCV.userProfile.reviews?.length > 0 && (
        <StyledCVPageContentCarousel>
          <H3 title="Ils me recommandent" color={COLORS.black} center />
          <CarouselSwiper
            slides={[
              ...publicCV.userProfile.reviews.map(
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
      <CVCallToActions actionDisabled={actionDisabled} publicCv={publicCV} />
    </StyledCVPageContent>
  );
};
