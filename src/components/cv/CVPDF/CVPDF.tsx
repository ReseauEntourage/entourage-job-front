import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { CVDate } from '../CVDate';
import { CV } from 'src/api/types';
import { CVCareerPathSentenceNew } from 'src/components/cv/CVCareerPathSentence';
import {
  StyledLeftColumn,
  StyledRightColumn,
} from 'src/components/partials/CV/PageCvContent/PageCVContent.styles';
import { Icon } from 'src/components/utils';
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

  const [isExperiencesOnPageTwo, setIsExperiencesOnPageTwo] =
    useState<boolean>(false);
  const [isFormationOnPageOne, setIsFormationOnPageOne] =
    useState<boolean>(false);

  useEffect(() => {
    if (cv.experiences?.length + cv.formations?.length <= 4) {
      setIsFormationOnPageOne(true);
    }
    if (cv.experiences?.length > 4) {
      setIsExperiencesOnPageTwo(true);
    }
  }, [cv]);

  const pages = [
    // First Page
    <StyledCVPDFPage className="uk-background-muted uk-flex uk-flex-column">
      <StyledCVPDFContentHeader>
        <div id="header-picture-share">
          <StyledCVPDFProfilePicture
            imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
          >
            <div className="picture" />
            <div className="pseudo" />
          </StyledCVPDFProfilePicture>
          {cv.catchphrase && (
            <StyledCVPDFQuote>
              <Icon name="quote-right" />
              <span>{cv.catchphrase}</span>
              <Icon name="quote-right" />
            </StyledCVPDFQuote>
          )}
        </div>
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
            <div className="skill-tags">
              {cv.skills.length > 0 &&
                cv.skills.map(({ name, id }) => {
                  return (
                    <StyledCVPFSkillTag key={id}>{name}</StyledCVPFSkillTag>
                  );
                })}
            </div>
          </div>
        </div>
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
                      <Icon name="phone" /> <span>Numéro de téléphone</span>
                    </p>
                    <p className="content">{cv.user.candidat.phone}</p>
                  </div>
                </li>
              )}
              {cv.user.candidat.email && (
                <li>
                  <div>
                    <p className="subtitle">
                      <Icon name="mail" /> <span>Email</span>
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
                        <Icon name="home" /> <span>Adresse</span>
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
                      <Icon name="location" /> <span>Localisation</span>
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
                      <Icon name="file-text" /> <span>Type de contrat</span>
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
                      <Icon name="calendar" /> <span>Disponibilité</span>
                    </p>
                    <p className="content">{cv.availability}</p>
                  </div>
                </li>
              )}
              {cv.languages?.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <Icon name="commenting" /> <span>Langues</span>
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
                      <Icon name="car" /> <span>Mobilité</span>
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
          {cv.experiences?.length > 0 && (
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Expérience professionnelle</StyledCVPDFTitle>
              <ul>
                {cv.experiences?.slice(0, 3).map((experience) => {
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
                        <div>
                          {experience.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </div>
                      </StyledCVPDFExperienceDescription>
                    </StyledCVPDFExperienceLi>
                  );
                })}
              </ul>
            </StyledCVPDFContentExperience>
          )}
          {cv.formations?.length > 0 && isFormationOnPageOne && (
            // using same style for Formations and Experiences, but change in fields
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Formation</StyledCVPDFTitle>
              <ul>
                {cv.formations.map((formation) => {
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
                        <div>
                          {formation.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </div>
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
                      <Icon name="phone" /> <span>Numéro de téléphone</span>
                    </p>
                    <p className="content">{cv.user.candidat.phone}</p>
                  </div>
                </li>
              )}
              {cv.user.candidat.email && (
                <li>
                  <div>
                    <p className="subtitle">
                      <Icon name="mail" /> <span>Email</span>
                    </p>
                    <p className="content">{cv.user.candidat.email}</p>
                  </div>
                </li>
              )}
              {locations && locations.length > 0 && (
                <li>
                  <div>
                    <p className="subtitle">
                      <Icon name="location" /> <span>Localisation</span>
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
          {cv.experiences?.length > 0 && isExperiencesOnPageTwo && (
            <StyledCVPDFContentExperience>
              <ul>
                {cv.experiences?.map((experience, i) => {
                  if (i < 3) return null;
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
                        <div>
                          {experience.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </div>
                      </StyledCVPDFExperienceDescription>
                    </StyledCVPDFExperienceLi>
                  );
                })}
              </ul>
            </StyledCVPDFContentExperience>
          )}
          {cv.formations?.length > 0 && !isFormationOnPageOne && (
            // using same style for Formations and Experiences, but change in fields
            <StyledCVPDFContentExperience>
              <StyledCVPDFTitle>Formation</StyledCVPDFTitle>
              <ul>
                {cv.formations.map((formation) => {
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
                        <div>
                          {formation.skills.map(({ name, id }) => {
                            return (
                              <StyledCVPFSkillTag key={id}>
                                {name}
                              </StyledCVPFSkillTag>
                            );
                          })}
                        </div>
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
  ];

  return (
    <div className="uk-flex uk-flex-middle uk-flex-column">
      {page && page >= 0 && page < 2
        ? pages[Math.floor(page)]
        : pages.map((p) => {
            return p;
          })}
    </div>
  );
};
