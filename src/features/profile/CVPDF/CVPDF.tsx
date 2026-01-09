import React, { useEffect, useState } from 'react';

import { Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  StyledLeftColumn,
  StyledRightColumn,
} from '@/src/features/partials/CV/PageCVContent/PageCVContent.styles';
import { ProfileCareerPathSentence } from '../../backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { StyledCVSkillTagContainer } from '../CVExperienceOrFormation/CVExperienceOrFormation.styles';
import { Experience, Formation, User } from 'src/api/types';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
import { CVContactInformationPDF } from './CVContactInformationPDF';
import { CVExperienceOrFormationPDF } from './CVExperienceOrFormationPDF';
import {
  StyledBreakPage,
  StyledCVPDFCareerPath,
  StyledCVPDFContentDetailsContainer,
  StyledCVPDFContentExperience,
  StyledCVPDFContentHeader,
  StyledCVPDFContentInformations,
  StyledCVPDFContentPassions,
  StyledCVPDFH1,
  StyledCVPDFPage,
  StyledCVPDFPageContainer,
  StyledCVPDFProfilePictureContainer,
  StyledCVPDFStory,
  StyledCVPDFTitle,
  StyledCVPFSkillTag,
} from './CVPDF.styles';
import { CVProfilePicturePDF } from './CVProfilePicturePDF';
import 'moment/locale/fr';

const BASE_NB_ITEM_PER_PAGE = 5;
const MAX_LINES_BY_ITEM = 9;
const MAX_CHAR_BY_LINE = 105;

interface CVPDFProps {
  user: User;
  page: number;
}

export const CVPDF = ({ user, page }: CVPDFProps) => {
  const imgSrc = user?.userProfile.hasPicture
    ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${user.id}.profile.jpg`
    : '/static/img/arthur.jpg';

  const showCareerPathSentence =
    user.userProfile?.sectorOccupations &&
    user.userProfile.sectorOccupations?.length > 0;

  const [items, setItems] = useState<{
    firstPageExperiences: Experience[];
    secondPageExperiences: Experience[];
    firstPageFormations: Formation[];
    secondPageFormations: Formation[];
  }>({
    firstPageExperiences: [],
    secondPageExperiences: [],
    firstPageFormations: [],
    secondPageFormations: [],
  });

  const countSmallDescriptionInCVItemList = (
    expFormaList: Experience[] | Formation[]
  ) => {
    let smallItemCounter = 0;

    expFormaList.forEach((experience) => {
      if (!experience.description) {
        // When no description, we consider it as a small item
        smallItemCounter += 1;
      } else {
        // When description lines are < MAX_LINES_BY_ITEM / 2, we consider it as a small item
        // We split the description in lines and count the number of lines
        const descriptionLines = experience.description
          .split('\n')
          .map((line) => {
            const lines: string[] = [];
            let currentLine = '';
            line.split(' ').forEach((word) => {
              if (currentLine.length + word.length > MAX_CHAR_BY_LINE) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine += ` ${word}`;
              }
            });
            lines.push(currentLine);
            return lines;
          })
          .flat();

        if (descriptionLines.length < MAX_LINES_BY_ITEM / 2) {
          smallItemCounter += 1;
        }
      }
    });
    return smallItemCounter;
  };

  useEffect(() => {
    // Compute the number of experiences and formations to display on the first page
    let nbItemsOnFirstPage = BASE_NB_ITEM_PER_PAGE;

    // Add 0.5 item on the first page for each formation or experience where the content is < MAX_LINES_BY_ITEM / 2
    if (!user.userProfile.experiences || !user.userProfile.formations) {
      return;
    }
    nbItemsOnFirstPage +=
      countSmallDescriptionInCVItemList(user.userProfile.experiences) / 2;

    nbItemsOnFirstPage +=
      countSmallDescriptionInCVItemList(user.userProfile.formations) / 2;

    const nbOfExperienceFirstPage = Math.min(
      user.userProfile.experiences.length,
      nbItemsOnFirstPage
    );
    const availableSpaceOnFirstPage = Math.max(
      nbItemsOnFirstPage - nbOfExperienceFirstPage,
      0
    );
    const nbOfFormationFirstPage = Math.min(
      user.userProfile.formations.length,
      availableSpaceOnFirstPage
    );
    setItems({
      firstPageExperiences: user.userProfile.experiences, // all the xp on first page
      firstPageFormations: user.userProfile.formations.slice(
        0,
        nbOfFormationFirstPage
      ),
      secondPageExperiences: [], // no xp on second page
      secondPageFormations: user.userProfile.formations.slice(
        nbOfFormationFirstPage
      ),
    });
  }, [user]);

  const pages = [
    // First Page
    <StyledCVPDFPage>
      <StyledCVPDFContentHeader>
        <StyledLeftColumn>
          <StyledCVPDFContentInformations>
            <StyledCVPDFProfilePictureContainer>
              <CVProfilePicturePDF imgSrc={imgSrc} />
            </StyledCVPDFProfilePictureContainer>
          </StyledCVPDFContentInformations>
        </StyledLeftColumn>
        <StyledRightColumn>
          <div id="header-details">
            <div>
              <StyledCVPDFH1>
                {user.firstName} {user.lastName}
              </StyledCVPDFH1>
              {showCareerPathSentence && (
                <StyledCVPDFCareerPath>
                  <ProfileCareerPathSentence
                    sectorOccupations={user.userProfile.sectorOccupations || []}
                    size="small"
                    weight="bold"
                    role={user.role}
                    asSimpleSentence
                  />
                </StyledCVPDFCareerPath>
              )}
              {user.userProfile.introduction && (
                <StyledCVPDFStory>
                  <p>{user.userProfile.introduction}</p>
                </StyledCVPDFStory>
              )}
              <StyledCVSkillTagContainer>
                {user.userProfile.skills &&
                  user.userProfile.skills.map(({ name, id }) => {
                    return (
                      <StyledCVPFSkillTag key={id}>{name}</StyledCVPFSkillTag>
                    );
                  })}
              </StyledCVSkillTagContainer>
            </div>
          </div>
        </StyledRightColumn>
      </StyledCVPDFContentHeader>
      <StyledCVPDFContentDetailsContainer>
        <StyledLeftColumn>
          {/* use Information Container to display contat informations */}
          <CVContactInformationPDF
            // departments={user.userProfile.departments}
            email={user.email}
            phone={user.phone}
          />
          <StyledCVPDFContentInformations>
            <StyledCVPDFTitle>Informations</StyledCVPDFTitle>
            <ul>
              {user.userProfile.contracts &&
                user.userProfile.contracts.length > 0 && (
                  <li>
                    <p className="subtitle">
                      <LucidIcon name="FileText" /> <span>Type de contrat</span>
                    </p>
                    {user.userProfile.contracts.map(({ name }) => {
                      return (
                        <p className="content" key={name}>
                          {findConstantFromValue(name, CONTRACTS).label}
                        </p>
                      );
                    })}
                  </li>
                )}
              {/* {user.userProfile.availability?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Calendar" />
                      <span>Disponibilité</span>
                    </p>
                    <p className="content">{cv.availability}</p>
                  </div>
                </li>
              )} */}
              {user.userProfile.userProfileLanguages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="Globe" /> <span>Langues</span>
                    </p>
                    {user.userProfile.userProfileLanguages.map(
                      ({ language }) => {
                        return (
                          <p className="content" key={language?.id}>
                            {language?.name}
                          </p>
                        );
                      }
                    )}
                  </div>
                </li>
              )}
              {/* {publiusercUser.userProfile.transport?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LucidIcon name="CarFront" /> <span>Mobilité</span>
                    </p>
                    <p className="content">{user.userProfile.transport}</p>
                  </div>
                </li>
              )} */}
            </ul>
          </StyledCVPDFContentInformations>
          {user.userProfile.interests?.length > 0 && (
            <StyledCVPDFContentPassions>
              <StyledCVPDFTitle>Mes centres d&apos;intérêts</StyledCVPDFTitle>
              <ul>
                {user.userProfile.interests.map(({ name, id }) => {
                  return (
                    <Text key={id} size="xsmall">
                      {name}
                    </Text>
                  );
                })}
              </ul>
            </StyledCVPDFContentPassions>
          )}
        </StyledLeftColumn>
        <StyledRightColumn>
          {items.firstPageExperiences.length > 0 && (
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Expérience professionnelle</StyledCVPDFTitle>
              <ul>
                {items.firstPageExperiences.map((experience) => {
                  return (
                    <CVExperienceOrFormationPDF
                      key={experience.id}
                      title={experience.title}
                      description={experience.description || ''}
                      startDate={experience.startDate || ''}
                      endDate={experience.endDate || ''}
                      location={experience.location || ''}
                      structure={experience.company || ''}
                      skills={experience.skills || []}
                    />
                  );
                })}
              </ul>
            </StyledCVPDFContentExperience>
          )}
          {items.firstPageFormations.length > 0 && (
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Formation</StyledCVPDFTitle>
              <ul>
                {items.firstPageFormations.map((formation) => {
                  return (
                    <CVExperienceOrFormationPDF
                      key={formation.id}
                      title={formation.title}
                      description={formation.description || ''}
                      startDate={formation.startDate || ''}
                      endDate={formation.endDate || ''}
                      location={formation.location || ''}
                      structure={formation.institution || ''}
                      skills={formation.skills || []}
                    />
                  );
                })}
              </ul>
            </StyledCVPDFContentExperience>
          )}
        </StyledRightColumn>
      </StyledCVPDFContentDetailsContainer>
    </StyledCVPDFPage>,

    // Second Page
    items.secondPageExperiences.length > 0 ||
    items.secondPageFormations.length > 0 ? (
      <>
        <StyledBreakPage />
        <StyledCVPDFPage>
          <StyledCVPDFContentDetailsContainer>
            <StyledLeftColumn>
              {/* use Information Container to display profile picture */}
              <StyledCVPDFContentInformations>
                <StyledCVPDFProfilePictureContainer>
                  <CVProfilePicturePDF imgSrc={imgSrc} verticalMargin />
                </StyledCVPDFProfilePictureContainer>
              </StyledCVPDFContentInformations>
              {/* use Information Container to display contact information */}
              {/* <CVContactInformationPDF
                locations={publicCV.userProfile.locations}
                address={publicCV.userProfile.address}
                email={publicCV.userProfile.email}
                phone={publicCV.userProfile.phone}
              /> */}
            </StyledLeftColumn>
            <StyledRightColumn>
              {items.secondPageExperiences.length > 0 && (
                <StyledCVPDFContentExperience>
                  <ul>
                    {items.secondPageExperiences?.map((experience) => {
                      return (
                        <CVExperienceOrFormationPDF
                          key={experience.id}
                          title={experience.title}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          description={experience.description}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          dateStart={experience.dateStart}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          dateEnd={experience.dateEnd}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          location={experience.location}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          structure={experience.company}
                          skills={experience.skills}
                        />
                      );
                    })}
                  </ul>
                </StyledCVPDFContentExperience>
              )}
              {items.secondPageFormations.length > 0 && (
                // using same style for Formations and Experiences, but change in fields
                <StyledCVPDFContentExperience>
                  {items.firstPageFormations.length === 0 && (
                    <StyledCVPDFTitle>Formation</StyledCVPDFTitle>
                  )}
                  <ul>
                    {items.secondPageFormations.map((formation) => {
                      return (
                        <CVExperienceOrFormationPDF
                          key={formation.id}
                          title={formation.title}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          description={formation.description}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          dateStart={formation.dateStart}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          dateEnd={formation.dateEnd}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          location={formation.location}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          structure={formation.institution}
                          skills={formation.skills}
                        />
                      );
                    })}
                  </ul>
                </StyledCVPDFContentExperience>
              )}
            </StyledRightColumn>
          </StyledCVPDFContentDetailsContainer>
        </StyledCVPDFPage>
      </>
    ) : null,
  ];

  return (
    <StyledCVPDFPageContainer>
      {page && page >= 0 && page < 2 ? pages[Math.floor(page)] : pages}
    </StyledCVPDFPageContainer>
  );
};
