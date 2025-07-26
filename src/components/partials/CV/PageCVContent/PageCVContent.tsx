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
import { PublicUser } from 'src/api/types';

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
  publicUser: PublicUser;
  actionDisabled?: boolean;
  isPreview?: boolean;
}

export const PageCVContent = ({
  publicUser,
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
                role={publicUser.role}
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
                      {publicUser.userProfile.contracts.map(({ name }) => {
                        return (
                          <Text color="darkGray" key={name}>
                            {findConstantFromValue(name, CONTRACTS).label}
                          </Text>
                        );
                      })}
                    </div>
                  </li>
                )}
              {publicUser.userProfile.userProfileLanguages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Globe" /> <span>Langues</span>
                    </p>
                    {publicUser.userProfile.userProfileLanguages.map(
                      ({ language }) => {
                        return (
                          <Text color="darkGray" key={language?.id}>
                            {language?.name}
                          </Text>
                        );
                      }
                    )}
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
                  return <p key={name}>{name}</p>;
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
                  return <p key={name}>{name}</p>;
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
