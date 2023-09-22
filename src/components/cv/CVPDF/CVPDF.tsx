import React, { useEffect, useState } from 'react';

import CalendarIcon from 'assets/custom/icons/calendar.svg';
import CarIcon from 'assets/custom/icons/car.svg';
import DocumentIcon from 'assets/custom/icons/document.svg';
import EmailIcon from 'assets/custom/icons/email.svg';
import HomeIcon from 'assets/custom/icons/home.svg';
import LanguageIcon from 'assets/custom/icons/language.svg';
import LocationIcon from 'assets/custom/icons/location.svg';
import PhoneIcon from 'assets/custom/icons/phone.svg';
import QuoteLeftIcon from 'assets/custom/icons/quote-left.svg';
import QuoteRightIcon from 'assets/custom/icons/quote-right.svg';
import { CVDate } from '../CVDate';
import { CV, CVExperience, CVFormation } from 'src/api/types';
import { CVCareerPathSentenceNew } from 'src/components/cv/CVCareerPathSentence';
import {
  StyledCVSkillTagContainer,
  StyledLeftColumn,
  StyledRightColumn,
} from 'src/components/partials/CV/PageCvContent/PageCVContent.styles';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { addPrefix, findConstantFromValue, sortByOrder } from 'src/utils';

import {
  StyledCVPDFCareerPath,
  StyledCVPDFContentDetailsContainer,
  StyledCVPDFContentExperience,
  StyledCVPDFContentHeader,
  StyledCVPDFContentInformations,
  StyledCVPDFContentPassions,
  StyledCVPDFExperienceDate,
  StyledCVPDFExperienceDescription,
  StyledCVPDFExperienceLi,
  StyledCVPDFH1,
  StyledCVPDFPage,
  StyledCVPDFProfilePicture,
  StyledCVPDFProfilePictureContainer,
  StyledCVPDFQuote,
  StyledCVPDFStory,
  StyledCVPDFTitle,
  StyledCVPFSkillTag,
} from './CVPDF.styles';
import 'moment/locale/fr';

interface CVPDFProps {
  cv: CV;
  page: number;
}

export const CVPDF = ({ cv, page }: CVPDFProps) => {
  const locations =
    cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

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
    if (cv.experiences?.length >= 4) {
      setItems({
        firstPageExperiences: cv.experiences.slice(0, 4),
        secondPageExperiences: cv.experiences.slice(4),
        firstPageFormations: [],
        secondPageFormations: cv.formations,
      });
    }
    if (cv.experiences?.length === 3) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations: cv.formations.slice(0, 1),
        secondPageFormations: cv.formations.slice(1),
      });
    }
    if (cv.experiences?.length === 2) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations: cv.formations.slice(0, 2),
        secondPageFormations: cv.formations.slice(2),
      });
    }
    if (cv.experiences?.length === 1) {
      setItems({
        firstPageExperiences: cv.experiences,
        secondPageExperiences: [],
        firstPageFormations: cv.formations.slice(0, 3),
        secondPageFormations: cv.formations.slice(3),
      });
    }
  }, [cv]);

  const pages = [
    // First Page
    <StyledCVPDFPage className="uk-background-muted uk-flex uk-flex-column">
      <StyledCVPDFContentHeader>
        <StyledLeftColumn>
          <StyledCVPDFProfilePictureContainer>
            <div id="header-picture-share">
              <StyledCVPDFProfilePicture
                imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
              >
                <div className="picture" />
                <div className="pseudo" />
              </StyledCVPDFProfilePicture>
              {cv.catchphrase && (
                <StyledCVPDFQuote>
                  <QuoteLeftIcon viewBox="0 0 10 8" />
                  <span>{cv.catchphrase}</span>
                  <QuoteRightIcon viewBox="0 0 10 8" />
                </StyledCVPDFQuote>
              )}
            </div>
          </StyledCVPDFProfilePictureContainer>
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
          <StyledCVPDFContentInformations>
            <StyledCVPDFTitle>Contact</StyledCVPDFTitle>
            <ul>
              {cv.user.candidat.phone && (
                <li>
                  <div>
                    <p className="subtitle">
                      <PhoneIcon viewBox="0 0 6 6" />{' '}
                      <span>Numéro de téléphone</span>
                    </p>
                    <p className="content">{cv.user.candidat.phone}</p>
                  </div>
                </li>
              )}
              {cv.user.candidat.email && (
                <li>
                  <div>
                    <p className="subtitle">
                      <EmailIcon viewBox="0 0 6 6" /> <span>Email</span>
                    </p>
                    <p className="content">{cv.user.candidat.email}</p>
                  </div>
                </li>
              )}
              <ul>
                {cv.user.candidat.address && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <HomeIcon viewBox="0 0 576 512" /> <span>Adresse</span>
                      </p>
                      <p className="content">{cv.user.candidat.address}</p>
                    </div>
                  </li>
                )}
              </ul>
              {locations && locations.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LocationIcon viewBox="0 0 6 6" />{' '}
                      <span>Localisation</span>
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
            </ul>
          </StyledCVPDFContentInformations>
          <StyledCVPDFContentInformations>
            <StyledCVPDFTitle>Informations</StyledCVPDFTitle>
            <ul>
              {cv.contracts && cv.contracts.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <DocumentIcon viewBox="0 0 6 8" />{' '}
                      <span>Type de contrat</span>
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
                      <CalendarIcon viewBox="0 0 6 6" />{' '}
                      <span>Disponibilité</span>
                    </p>
                    <p className="content">{cv.availability}</p>
                  </div>
                </li>
              )}
              {cv.languages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <LanguageIcon viewBox="0 0 6 6" /> <span>Langues</span>
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
                      <CarIcon viewBox="0 0 6 6" /> <span>Mobilité</span>
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
                    <StyledCVPDFExperienceLi key={experience.id}>
                      <StyledCVPDFExperienceDate>
                        {experience.dateStart && (
                          <CVDate experience={experience} />
                        )}
                      </StyledCVPDFExperienceDate>
                      <StyledCVPDFExperienceDescription>
                        {experience.title && (
                          <StyledCVPDFTitle>
                            {experience.title}
                          </StyledCVPDFTitle>
                        )}
                        {(experience.company || experience.location) && (
                          <div className="name-gray">
                            {experience.company}
                            {experience.company && experience.location && ' - '}
                            {experience.location}
                          </div>
                        )}
                        {experience.description && (
                          <div>{experience.description}</div>
                        )}
                        <StyledCVSkillTagContainer>
                          {experience.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </StyledCVSkillTagContainer>
                      </StyledCVPDFExperienceDescription>
                    </StyledCVPDFExperienceLi>
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
                    <StyledCVPDFExperienceLi key={formation.id}>
                      <StyledCVPDFExperienceDate>
                        {formation.dateStart && (
                          <CVDate experience={formation} />
                        )}
                      </StyledCVPDFExperienceDate>
                      <StyledCVPDFExperienceDescription>
                        {formation.title && (
                          <StyledCVPDFTitle>{formation.title}</StyledCVPDFTitle>
                        )}
                        {(formation.institution || formation.location) && (
                          <div className="name-gray">
                            {formation.institution}
                            {formation.institution &&
                              formation.location &&
                              ' - '}
                            {formation.location}
                          </div>
                        )}
                        {formation.description && (
                          <div>{formation.description}</div>
                        )}
                        <StyledCVSkillTagContainer>
                          {formation.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </StyledCVSkillTagContainer>
                      </StyledCVPDFExperienceDescription>
                    </StyledCVPDFExperienceLi>
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
              <StyledCVPDFProfilePicture
                imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
              >
                <div className="picture" />
                <div className="pseudo" />
              </StyledCVPDFProfilePicture>
            </StyledCVPDFContentInformations>
            {/* use Information Container to display contat informations */}
            <StyledCVPDFContentInformations>
              <StyledCVPDFTitle>Contact</StyledCVPDFTitle>
              <ul>
                {cv.user.candidat.phone && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <PhoneIcon viewBox="0 0 6 6" />{' '}
                        <span>Numéro de téléphone</span>
                      </p>
                      <p className="content">{cv.user.candidat.phone}</p>
                    </div>
                  </li>
                )}
                {cv.user.candidat.email && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <EmailIcon viewBox="0 0 6 6" /> <span>Email</span>
                      </p>
                      <p className="content">{cv.user.candidat.email}</p>
                    </div>
                  </li>
                )}
                {cv.user.candidat.address && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <HomeIcon viewBox="0 0 24 24" /> <span>Adresse</span>
                      </p>
                      <p className="content">{cv.user.candidat.address}</p>
                    </div>
                  </li>
                )}
                {locations && locations.length > 0 && (
                  <li>
                    <div>
                      <p className="subtitle">
                        <LocationIcon viewBox="0 0 6 6" />{' '}
                        <span>Localisation</span>
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
              </ul>
            </StyledCVPDFContentInformations>
          </StyledLeftColumn>
          <StyledRightColumn>
            {items.secondPageExperiences.length > 0 && (
              <StyledCVPDFContentExperience>
                <ul>
                  {items.secondPageExperiences?.map((experience) => {
                    return (
                      <StyledCVPDFExperienceLi key={experience.id}>
                        <StyledCVPDFExperienceDate>
                          {experience.dateStart && (
                            <CVDate experience={experience} />
                          )}
                        </StyledCVPDFExperienceDate>
                        <StyledCVPDFExperienceDescription>
                          {experience.title && (
                            <StyledCVPDFTitle>
                              {experience.title}
                            </StyledCVPDFTitle>
                          )}
                          {(experience.company || experience.location) && (
                            <div className="name-gray">
                              {experience.company}
                              {experience.company &&
                                experience.location &&
                                ' - '}
                              {experience.location}
                            </div>
                          )}
                          {experience.description && (
                            <div>{experience.description}</div>
                          )}
                          <StyledCVSkillTagContainer>
                            {experience.skills.map(({ name, id }) => {
                              return (
                                <StyledCVPFSkillTag key={id}>
                                  {name}
                                </StyledCVPFSkillTag>
                              );
                            })}
                          </StyledCVSkillTagContainer>
                        </StyledCVPDFExperienceDescription>
                      </StyledCVPDFExperienceLi>
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
                      <StyledCVPDFExperienceLi key={formation.id}>
                        <StyledCVPDFExperienceDate>
                          {formation.dateStart && (
                            <CVDate experience={formation} />
                          )}
                        </StyledCVPDFExperienceDate>
                        <StyledCVPDFExperienceDescription>
                          {formation.title && (
                            <StyledCVPDFTitle>
                              {formation.title}
                            </StyledCVPDFTitle>
                          )}
                          {(formation.institution || formation.location) && (
                            <div className="name-gray">
                              {formation.institution}
                              {formation.institution &&
                                formation.location &&
                                ' - '}
                              {formation.location}
                            </div>
                          )}
                          {formation.description && (
                            <div>{formation.description}</div>
                          )}
                          <StyledCVSkillTagContainer>
                            {formation.skills.map(({ name, id }) => {
                              return (
                                <StyledCVPFSkillTag key={id}>
                                  {name}
                                </StyledCVPFSkillTag>
                              );
                            })}
                          </StyledCVSkillTagContainer>
                        </StyledCVPDFExperienceDescription>
                      </StyledCVPDFExperienceLi>
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
    <div className="uk-flex uk-flex-middle uk-flex-column">
      {page && page >= 0 && page < 2 ? pages[Math.floor(page)] : pages}
    </div>
  );
};
