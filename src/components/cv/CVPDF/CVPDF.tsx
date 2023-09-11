import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CV_COLORS,
  StyledCVExperienceDate,
  StyledCVExperienceDateMobile,
  StyledCVExperienceDescription,
  StyledCVExperienceLi,
  StyledCVPageContentDetailsContainer,
  StyledCVPageContentExperience,
  StyledCVPageContentHeader,
  StyledCVPageContentInformations,
  StyledCVPageContentPassions,
  StyledCVPageContentStory,
  StyledCVProfilePicture,
  StyledLeftColumn,
  StyledRightColumn,
  StyledSkillTag,
} from '../../partials/CV/PageCvContent/PageCVContent.styles';
import { H2, H4, H5 } from '../../utils/Headings';
import { CVShape } from '../CV.shape';
import {
  CVCareerPathSentenceNew,
} from 'src/components/cv/CVCareerPathSentence';
import { Grid, SimpleLink, Icon } from 'src/components/utils';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  addPrefix,
  formatParagraph,
  sortByOrder,
  sortByName,
  findConstantFromValue,
} from 'src/utils';
import {
  StyledCVPDFPage,
  StyledCVPDFH1,
  StyledCVPDFQuote,
  StyledCVPDFCareerPath,
  StyledCVPDFTitle,
} from './CVPDF.styles';
import 'moment/locale/fr';

export const CVPDF = ({ cv, page }) => {

  const locations = cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

  const showCareerPathSentence =
    (cv.ambitions && cv.ambitions.length > 0) ||
    (cv.businessLines && cv.businessLines.length > 0);

 
  console.log(cv)

  const pages = [
    // First Page
    <StyledCVPDFPage
      className="uk-background-muted uk-flex uk-flex-column"
    >
          <StyledCVPageContentHeader>
            <div id="header-picture-share">
              <StyledCVProfilePicture
                imgSrc="https://entourage-job-preprod.s3.amazonaws.com/images/c67bcb92-fbd6-471a-8c96-0ecdbf37006d.Progress.jpg?1693841396903"
                // imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
                className="pdfVersion"
              >
                <div className="picture" />
                <div className="pseudo" />
              </StyledCVProfilePicture>
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
                {showCareerPathSentence && <StyledCVPDFCareerPath>
                  <CVCareerPathSentenceNew
                    ambitions={cv.ambitions}
                    businessLines={cv.businessLines}
                  />
                </StyledCVPDFCareerPath>}
                {cv.story && (
                  <StyledCVPageContentStory className="pdfVersion">
                    <p>{cv.story}</p>
                  </StyledCVPageContentStory>
                )}
                <div className="skill-tags">
                  {cv.skills.length > 0 &&
                    cv.skills.map(({ name, id }, key) => {
                      return (
                        <StyledSkillTag
                          className="pdfVersion"
                          key={`${key}-${id}`}
                        >
                          {name}
                        </StyledSkillTag>
                      );
                    })}
                </div>
              </div>
            </div>
          </StyledCVPageContentHeader>
          <StyledCVPageContentDetailsContainer>
            <StyledLeftColumn>
              {/* use Information Container to display contat informations */}
              <StyledCVPageContentInformations className="pdfVersion">
                <StyledCVPDFTitle>
                  Contact
                </StyledCVPDFTitle>
                <ul>
                  {cv.user.candidat.phone &&
                    <li>
                      <div>
                        <p className="subtitle">
                          <Icon name="phone" /> <span>Numéro de téléphone</span>
                        </p>
                        <p className="content">
                          {cv.user.candidat.phone}
                        </p>
                      </div>
                    </li>
                  }
                  {cv.user.candidat.email &&
                    <li>
                      <div>
                        <p className="subtitle">
                          <Icon name="mail" /> <span>Email</span>
                        </p>
                        <p className="content">
                          {cv.user.candidat.email}
                        </p>
                      </div>
                    </li>
                  }
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
              </StyledCVPageContentInformations >
              <StyledCVPageContentInformations className="pdfVersion">
                <StyledCVPDFTitle>
                  Informations
                </StyledCVPDFTitle>
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
                              return findConstantFromValue(name, CONTRACTS)
                                .label;
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
              </StyledCVPageContentInformations >
              {cv.passions?.length > 0 && (
                <StyledCVPageContentPassions className="pdfVersion">
                  <StyledCVPDFTitle>
                    Mes Passions
                  </StyledCVPDFTitle>
                  <ul>
                    {cv?.passions?.map(({ name }) => {
                      return <p>{name}</p>;
                    })}
                  </ul>
                </StyledCVPageContentPassions>
              )}
            </StyledLeftColumn>
            <StyledRightColumn>
              {cv.experiences?.length > 0 && (
                <StyledCVPageContentExperience className="pdfVersion">
                  <StyledCVPDFTitle>
                    Expérience professionnelle
                  </StyledCVPDFTitle>
                  <ul>
                    {cv.experiences?.map((experience) => {
                      return (
                        <StyledCVExperienceLi className="pdfVersion">
                          <StyledCVExperienceDate className="pdfVersion">
                            {experience.dateStart && (
                              <>
                                {experience.dateEnd
                                  ? moment(experience.dateEnd).format(
                                      'MMMM YYYY'
                                    )
                                  : "Aujourd'hui"}
                                <br />
                                {moment(experience.dateStart).format(
                                  'MMMM YYYY'
                                )}
                              </>
                            )}
                          </StyledCVExperienceDate>
                          <StyledCVExperienceDescription className="pdfVersion">
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
                            <div>
                              {experience.skills.map(({ name, id }) => {
                                return (
                                  <StyledSkillTag key={id} className="pdfVersion">
                                    {name}
                                  </StyledSkillTag>
                                );
                              })}
                            </div>
                          </StyledCVExperienceDescription>
                        </StyledCVExperienceLi>
                      );
                    })}
                  </ul>
                </StyledCVPageContentExperience>
              )}
              {cv.formations?.length > 0 && (
                // using same style for Formations and Experiences, but change in fields
                <StyledCVPageContentExperience className="pdfVersion">
                  <StyledCVPDFTitle>
                    Formation
                  </StyledCVPDFTitle>
                  <ul>
                    {cv.formations.map((formation) => {
                      return (
                        <StyledCVExperienceLi className="pdfVersion">
                          <StyledCVExperienceDate className="pdfVersion">
                            {formation.dateStart && (
                              <>
                                {formation.dateEnd
                                  ? moment(formation.dateEnd).format(
                                      'MMMM YYYY'
                                    )
                                  : "Aujourd'hui"}
                                <br />
                                {moment(formation.dateStart).format(
                                  'MMMM YYYY'
                                )}
                              </>
                            )}
                          </StyledCVExperienceDate>
                          <StyledCVExperienceDescription className="pdfVersion">
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
                            <div>
                              {formation.skills.map(({ name, id }) => {
                                return (
                                  <StyledSkillTag key={id} className="pdfVersion">
                                    {name}
                                  </StyledSkillTag>
                                );
                              })}
                            </div>
                          </StyledCVExperienceDescription>
                        </StyledCVExperienceLi>
                      );
                    })}
                  </ul>
                </StyledCVPageContentExperience>
              )}
            </StyledRightColumn>
          </StyledCVPageContentDetailsContainer>
    </StyledCVPDFPage>,

    // Second Page
    <StyledCVPDFPage>
      
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
