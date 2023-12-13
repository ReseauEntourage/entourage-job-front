import React, { useEffect, useState } from 'react';

import CalendarIcon from 'assets/icons/calendar.svg';
import CarIcon from 'assets/icons/car.svg';
import DocumentIcon from 'assets/icons/document.svg';
import LanguageIcon from 'assets/icons/language.svg';
import QuoteLeftIcon from 'assets/icons/quote-left.svg';
import QuoteRightIcon from 'assets/icons/quote-right.svg';
import { CV, CVExperience, CVFormation } from 'src/api/types';
import { CVCareerPathSentenceNew } from 'src/components/cv/CVCareerPathSentence';
import {
  StyledCVSkillTagContainer,
  StyledLeftColumn,
  StyledRightColumn,
} from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
import { CVContactInformationPDF } from './CVContactInformationPDF';
import { CVExperienceOrFormationPDF } from './CVExperienceOrFormationPDF';
import {
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
  StyledCVPDFQuote,
  StyledCVPDFStory,
  StyledCVPDFTitle,
  StyledCVPFSkillTag,
} from './CVPDF.styles';
import { CVProfilePicturePDF } from './CVProfilePicturePDF';
import 'moment/locale/fr';

interface CVPDFProps {
  cv: CV;
  page: number;
}

export const CVPDF = ({ cv, page }: CVPDFProps) => {
  const showCareerPathSentence =
    (cv.ambitions && cv.ambitions.length > 0) ||
    (cv.businessLines && cv.businessLines.length > 0);

  const [items, setItems] = useState<{
    firstPageExperiences: CVExperience[];
    secondPageExperiences: CVExperience[];
    firstPageFormations: CVFormation[];
    secondPageFormations: CVFormation[];
  }>({
    firstPageExperiences: [],
    secondPageExperiences: [],
    firstPageFormations: [],
    secondPageFormations: [],
  });

  useEffect(() => {
    if (
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      cv.experiences?.length >= 4
    ) {
      setItems({
        firstPageExperiences:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.experiences.slice(0, 4),
        secondPageExperiences:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.experiences.slice(4),
        firstPageFormations: [],

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        secondPageFormations: cv.formations,
      });
    }
    if (cv.experiences?.length === 3) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(0, 1),
        secondPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(1),
      });
    }
    if (cv.experiences?.length === 2) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(0, 2),
        secondPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(2),
      });
    }
    if (cv.experiences?.length === 1) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(0, 3),
        secondPageFormations:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          cv.formations.slice(3),
      });
    }
  }, [cv]);

  const pages = [
    // First Page
    <StyledCVPDFPage>
      <StyledCVPDFContentHeader>
        <StyledLeftColumn>
          <StyledCVPDFContentInformations>
            <StyledCVPDFProfilePictureContainer>
              <CVProfilePicturePDF urlImg={cv.urlImg} />
              {cv.catchphrase && (
                <StyledCVPDFQuote>
                  <QuoteLeftIcon />
                  <span>{cv.catchphrase}</span>
                  <QuoteRightIcon />
                </StyledCVPDFQuote>
              )}
            </StyledCVPDFProfilePictureContainer>
          </StyledCVPDFContentInformations>
        </StyledLeftColumn>
        <StyledRightColumn>
          <div id="header-details">
            <div>
              <StyledCVPDFH1>
                {cv.user.candidat.firstName} {cv.user.candidat.lastName}
              </StyledCVPDFH1>
              {showCareerPathSentence && (
                <StyledCVPDFCareerPath>
                  <CVCareerPathSentenceNew
                    ambitions={cv.ambitions}
                    businessLines={cv.businessLines}
                  />
                </StyledCVPDFCareerPath>
              )}
              {cv.story && (
                <StyledCVPDFStory>
                  <p>{cv.story}</p>
                </StyledCVPDFStory>
              )}
              <StyledCVSkillTagContainer>
                {cv.skills.length > 0 &&
                  cv.skills.map(({ name, id }) => {
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
            locations={cv.locations}
            address={cv.user.candidat.address}
            email={cv.user.candidat.email}
            phone={cv.user.candidat.phone}
          />
          <StyledCVPDFContentInformations>
            <StyledCVPDFTitle>Informations</StyledCVPDFTitle>
            <ul>
              {cv.contracts && cv.contracts.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <DocumentIcon /> <span>Type de contrat</span>
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
              {cv.availability?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <CalendarIcon /> <span>Disponibilité</span>
                    </p>
                    <p className="content">{cv.availability}</p>
                  </div>
                </li>
              )}
              {cv.languages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LanguageIcon /> <span>Langues</span>
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
                      <CarIcon /> <span>Mobilité</span>
                    </p>
                    <p className="content">{cv.transport}</p>
                  </div>
                </li>
              )}
            </ul>
          </StyledCVPDFContentInformations>
          {cv.passions?.length > 0 && (
            <StyledCVPDFContentPassions>
              <StyledCVPDFTitle>Mes passions</StyledCVPDFTitle>
              <ul>
                {cv?.passions?.map(({ name, id }) => {
                  return <p key={id}>{name}</p>;
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
          {items.firstPageFormations.length > 0 && (
            // using same style for Formations and Experiences, but change in fields
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Formation</StyledCVPDFTitle>
              <ul>
                {items.firstPageFormations.map((formation) => {
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
    </StyledCVPDFPage>,

    // Second Page
    items.secondPageExperiences.length > 0 ||
    items.secondPageFormations.length > 0 ? (
      <StyledCVPDFPage>
        <StyledCVPDFContentDetailsContainer>
          <StyledLeftColumn>
            {/* use Information Container to display profile picture */}
            <StyledCVPDFContentInformations>
              <StyledCVPDFProfilePictureContainer>
                <CVProfilePicturePDF urlImg={cv.urlImg} verticalMargin />
              </StyledCVPDFProfilePictureContainer>
            </StyledCVPDFContentInformations>
            {/* use Information Container to display contact information */}
            <CVContactInformationPDF
              locations={cv.locations}
              address={cv.user.candidat.address}
              email={cv.user.candidat.email}
              phone={cv.user.candidat.phone}
            />
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
    ) : null,
  ];

  return (
    <StyledCVPDFPageContainer>
      {page && page >= 0 && page < 2 ? pages[Math.floor(page)] : pages}
    </StyledCVPDFPageContainer>
  );
};
