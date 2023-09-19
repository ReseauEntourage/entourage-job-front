import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  StyledLeftColumn,
  StyledRightColumn,
} from '../../partials/CV/PageCvContent/PageCVContent.styles';
import { CVShape } from '../CV.shape';
import { CVCareerPathSentenceNew } from 'src/components/cv/CVCareerPathSentence';
import { Icon } from 'src/components/utils';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { sortByOrder, findConstantFromValue } from 'src/utils';
import {
  StyledCVPDFPage,
  StyledCVPDFH1,
  StyledCVPDFQuote,
  StyledCVPDFCareerPath,
  StyledCVPDFTitle,
  StyledCVPDFProfilePicture,
  StyledCVPDFStory,
  StyledCVPDFExperienceLi,
  StyledCVPDFExperienceDescription,
  StyledCVPFSkillTag,
  StyledCVPDFExperienceDate,
  StyledCVPDFContentInformations,
  StyledCVPDFContentExperience,
  StyledCVPDFContentPassions,
  StyledCVPDFContentHeader,
  StyledCVPDFContentDetailsContainer,
} from './CVPDF.styles';
import 'moment/locale/fr';

export const CVPDF = ({ cv, page }) => {
  const locations =
    cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

  const showCareerPathSentence =
    (cv.ambitions && cv.ambitions.length > 0) ||
    (cv.businessLines && cv.businessLines.length > 0);
  console.log(cv);

  const [isExperiencesOnPageTwo, setisExperiencesOnPageTwo] =
    useState<boolean>(false);
  const [isFormationOnPageOne, setIsFormationOnPageOne] =
    useState<boolean>(false);

  useEffect(() => {
    if (cv.experiences?.length + cv.formations?.length <= 4) {
      setIsFormationOnPageOne(true);
    }
    if (cv.experiences?.length > 4) {
      setisExperiencesOnPageTwo(true);
    }
  }, [cv]);

  const pages = [
    // First Page
    <StyledCVPDFPage className="uk-background-muted uk-flex uk-flex-column">
      <StyledCVPDFContentHeader>
        <div id="header-picture-share">
          <StyledCVPDFProfilePicture imgSrc="https://entourage-job-preprod.s3.amazonaws.com/images/c67bcb92-fbd6-471a-8c96-0ecdbf37006d.Progress.jpg?1693841396903">
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
                cv.skills.map(({ name, id }, key) => {
                  return (
                    <StyledCVPFSkillTag key={`${key}-${id}`}>
                      {name}
                    </StyledCVPFSkillTag>
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
              <StyledCVPDFTitle>Mes Passions</StyledCVPDFTitle>
              <ul>
                {cv?.passions?.map(({ name }) => {
                  return <p>{name}</p>;
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
                {cv.experiences?.map((experience, i) => {
                  if (i > 3) return null;
                  return (
                    <StyledCVPDFExperienceLi>
                      <StyledCVPDFExperienceDate>
                        {experience.dateStart && (
                          <>
                            {experience.dateEnd
                              ? moment(experience.dateEnd).format('MMMM YYYY')
                              : "Aujourd'hui"}
                            <br />
                            {moment(experience.dateStart).format('MMMM YYYY')}
                          </>
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
                    <StyledCVPDFExperienceLi>
                      <StyledCVPDFExperienceDate>
                        {formation.dateStart && (
                          <>
                            {formation.dateEnd
                              ? moment(formation.dateEnd).format('MMMM YYYY')
                              : "Aujourd'hui"}
                            <br />
                            {moment(formation.dateStart).format('MMMM YYYY')}
                          </>
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
                              <StyledCVPFSkillTag>{name}</StyledCVPFSkillTag>
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
              imgSrc="https://entourage-job-preprod.s3.amazonaws.com/images/c67bcb92-fbd6-471a-8c96-0ecdbf37006d.Progress.jpg?1693841396903"
              // imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
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
                    <StyledCVPDFExperienceLi>
                      <StyledCVPDFExperienceDate>
                        {experience.dateStart && (
                          <>
                            {experience.dateEnd
                              ? moment(experience.dateEnd).format('MMMM YYYY')
                              : "Aujourd'hui"}
                            <br />
                            {moment(experience.dateStart).format('MMMM YYYY')}
                          </>
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
                    <StyledCVPDFExperienceLi>
                      <StyledCVPDFExperienceDate>
                        {formation.dateStart && (
                          <>
                            {formation.dateEnd
                              ? moment(formation.dateEnd).format('MMMM YYYY')
                              : "Aujourd'hui"}
                            <br />
                            {moment(formation.dateStart).format('MMMM YYYY')}
                          </>
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
                              <StyledCVPFSkillTag>{name}</StyledCVPFSkillTag>
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

CVPDF.propTypes = {
  cv: CVShape.isRequired,
  page: PropTypes.number,
};

CVPDF.defaultProps = {
  page: null,
};
