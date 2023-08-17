import Link from 'next/link';
import React, { useState } from 'react';
import UIkit from 'uikit';
import { CVCallToActions } from '../CVCallToActions';
import { CVShareButtons } from '../CVCallToActions/CVShareButtons';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { CVCareerPathSentenceNew as CVCareerPathSentence } from 'src/components/cv';
import { formSendExternalMessage } from 'src/components/forms/schema/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import {
  StyledCVPageContent,
  CV_COLORS,
  StyledCVPageContentFooter,
  StyledCVPageContentStory,
  StyledCVExperienceLi,
  StyledCVPageContentSlide,
  StyledShareContainer,
  StyledSkillTag,
  StyledCVPageContentHeader,
  StyledCVProfilePicture,
  StyledCVPageContentDetailsContainer,
  StyledCVPageContentInformations,
  StyledCVPageContentExperience,
  StyledCVPageContentPassions,
  StyledCVPageContentCarousel,
  StyledChevronIcon,
  StyledCVMessageContainer,
  StyledBackLink,
  StyledLeftColumn,
  StyledRightColumn,
} from 'src/components/partials/CV/PageCvContent/PageCVContent.styles';
import { Button, Icon } from 'src/components/utils';
import { CarouselSwiper } from 'src/components/utils/CarouselSwiper';
import { H1, H2, H3, H4, H5 } from 'src/components/utils/Headings';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { addPrefix, findConstantFromValue, sortByOrder } from 'src/utils';

interface openedPanelType {
  informations: boolean;
  experiences: boolean;
  formations: boolean;
  passions: boolean;
}

interface PageCVContentProps {
  cv: CV;
  actionDisabled?: boolean;
}

export const PageCVContent = ({
  cv,
  actionDisabled = false,
}: PageCVContentProps) => {
  const locations =
    cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

  const isDesktop = useIsDesktop();

  const [isStoryHidden, setIsStoryHidden] = useState<boolean>(true);

  const [openedPanel, setOpenedPanel] = useState<openedPanelType>({
    informations: true,
    experiences: false,
    formations: false,
    passions: false,
  });

  return (
    <StyledCVPageContent>
      <Link href="/candidats?employed=false" scroll={false} shallow passHref>
        <StyledBackLink>
          <Icon name="chevron-left" />
          &nbsp;Retour à la page candidats
        </StyledBackLink>
      </Link>
      <StyledCVPageContentHeader className={!isDesktop ? 'mobile' : ''}>
        <div id="header-picture-share">
          <StyledCVProfilePicture
            className={!isDesktop ? 'mobile' : ''}
            imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}
          >
            <div className="picture" />
            <div className="pseudo" />
          </StyledCVProfilePicture>
          {isDesktop && (
            <>
              <StyledShareContainer>
                <H5
                  title="Partagez son CV sur vos réseaux"
                  color={CV_COLORS.titleGray}
                />
                <p>
                  En augmentant sa visibilité, vous pouvez générer des
                  rencontres qui peuvent tout changer&nbsp;!
                </p>
              </StyledShareContainer>
              <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
            </>
          )}
        </div>
        <div id="header-details">
          <div>
            <H1
              title={`${cv.user.candidat.firstName} ${cv.user.candidat.lastName}`}
              color={CV_COLORS.titleGray}
            />
            <CVCareerPathSentence
              ambitions={cv.ambitions}
              businessLines={cv.businessLines}
            />
            {cv.catchphrase && (
              <p id="quote">
                <Icon name="quote-right" />
                <span>{cv.catchphrase}</span>
                <Icon name="quote-right" />
              </p>
            )}
            {cv.story && (
              <StyledCVPageContentStory
                className={!isDesktop && isStoryHidden ? 'mobile-hidden' : ''}
              >
                <p className="">{cv.story}</p>
                {!isDesktop && isStoryHidden && (
                  <div className="seeMore">
                    <div onClick={() => setIsStoryHidden(!isStoryHidden)}>
                      En lire plus
                    </div>
                  </div>
                )}
              </StyledCVPageContentStory>
            )}
            <div className="skill-tags">
              {cv.skills.length > 0 &&
                cv.skills.map(({ name, id }, key) => {
                  return (
                    <StyledSkillTag key={`${key}-${id}`}>{name}</StyledSkillTag>
                  );
                })}
            </div>
          </div>
          <StyledCVMessageContainer className={!isDesktop ? 'mobile' : ''}>
            <H5
              title={`Donnez un coup de pouce à ${cv.user.candidat.firstName} !`}
              color={CV_COLORS.titleGray}
            />
            <p>
              Apporter des conseils, informations sur le secteur
              d&#8217;activité, retour d&#8217;expérience, mise en contact, une
              opportunité&nbsp;...
            </p>
            <Button
              style="custom-secondary-inverted"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_CV_CONTACTEZ_MOI_CLIC);
                fbEvent(FB_TAGS.MESSAGE_OPEN);
                openModal(
                  <ModalEdit
                    title={`Envoyer un message à ${cv.user.candidat.firstName}`}
                    description={`Vous pouvez envoyer un message à ${
                      cv.user.candidat.firstName
                    } pour l'aider et ${
                      cv.user.candidat.gender === 0 ? 'le' : 'la'
                    } conseiller dans sa recherche d'emploi`}
                    submitText="Envoyer"
                    formSchema={formSendExternalMessage}
                    onSubmit={async (
                      { optInContact, ...fields },
                      closeModal
                    ) => {
                      gaEvent(GA_TAGS.PAGE_CV_ENVOYER_CONTACTEZ_MOI_CLIC);
                      fbEvent(FB_TAGS.MESSAGE_SEND);
                      try {
                        await Api.postExternalMessage({
                          UserId: cv.UserId,
                          ...fields,
                        });
                        UIkit.notification(
                          'Le message a bien été envoyé',
                          'success'
                        );

                        closeModal();
                      } catch (err) {
                        UIkit.notification(
                          "Une erreur s'est produite",
                          'danger'
                        );
                        console.error(err);
                      }
                    }}
                  />
                );
              }}
            >
              M&#8217;envoyer un message
            </Button>
          </StyledCVMessageContainer>
          {!isDesktop && (
            <>
              <StyledShareContainer>
                <H5
                  title="Partagez son CV sur vos réseaux"
                  color={CV_COLORS.titleGray}
                />
                <p>
                  En augmentant sa visibilité, vous pouvez générer des
                  rencontres qui peuvent tout changer&nbsp;!
                </p>
              </StyledShareContainer>
              <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
            </>
          )}
        </div>
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
            {!isDesktop && <StyledChevronIcon name="chevron-down" />}
            {isDesktop ? (
              <H4 title="Informations" color={CV_COLORS.titleGray} />
            ) : (
              <span
                onClick={() => {
                  setOpenedPanel({
                    ...openedPanel,
                    informations: !openedPanel.informations,
                  });
                }}
              >
                <H2 title="Informations" color={CV_COLORS.titleGray} />
              </span>
            )}
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
          </StyledCVPageContentInformations>
          {cv.passions?.length > 0 && isDesktop && (
            <StyledCVPageContentPassions>
              <H4 title="Mes Passions" color={CV_COLORS.titleGray} />
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
            <StyledCVPageContentExperience
              className={`${openedPanel.experiences ? '' : 'close'} ${
                !isDesktop ? 'mobile' : ''
              }`}
            >
              {!isDesktop && <StyledChevronIcon name="chevron-down" />}

              {/* {isDesktop ?<H2 title="Expériences" color={CV_COLORS.titleGray} />:  */}
              <span
                onClick={() => {
                  setOpenedPanel({
                    ...openedPanel,
                    experiences: !openedPanel.experiences,
                  });
                }}
              >
                <H2 title="Expériences" color={CV_COLORS.titleGray} />
              </span>
              {/* } */}
              <ul>
                {cv.experiences.map((experience) => {
                  return (
                    <StyledCVExperienceLi>
                      <div>{experience.description}</div>
                      <div>
                        {experience.skills.map(({ name, id }) => {
                          return (
                            <StyledSkillTag key={id}>{name}</StyledSkillTag>
                          );
                        })}
                      </div>
                    </StyledCVExperienceLi>
                  );
                })}
              </ul>
            </StyledCVPageContentExperience>
          )}
          {cv.passions?.length > 0 && !isDesktop && (
            <StyledCVPageContentPassions
              className={`${openedPanel.passions ? '' : 'close'} ${
                !isDesktop ? 'mobile' : ''
              }`}
            >
              {!isDesktop && <StyledChevronIcon name="chevron-down" />}
              {isDesktop ? (
                <H4 title="Mes Passions" color={CV_COLORS.titleGray} />
              ) : (
                <span
                  onClick={() => {
                    setOpenedPanel({
                      ...openedPanel,
                      passions: !openedPanel.passions,
                    });
                  }}
                >
                  <H2 title="Mes Passions" color={CV_COLORS.titleGray} />
                </span>
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
          <H3 title="Ils me recommandent" color={CV_COLORS.titleGray} center />
          <CarouselSwiper
            slides={[
              ...cv.reviews.map(({ text, id, name, status }) => {
                return (
                  <StyledCVPageContentSlide key={id}>
                    <Icon name="quote-right" />
                    <div>
                      <span>{text}</span>
                      <br />
                      <span className="name">
                        {name}, {status}
                      </span>
                    </div>
                    <Icon name="quote-right" />
                  </StyledCVPageContentSlide>
                );
              }),
            ]}
          />
        </StyledCVPageContentCarousel>
      )}
      <CVCallToActions actionDisabled={actionDisabled} cv={cv} />
      <StyledCVPageContentFooter>
        <p>
          Je suis accompagné{cv.user.candidat.gender === 1 && 'e'} dans ma
          recherche d&#8217;emploi et mon intégration en entreprise par le
          projet LinkedOut. Pour plus d&#8217;information, contactez :
        </p>
        <Link href="mailto:contact-linkedout@entourage.social">
          contact-linkedout@entourage.social
        </Link>
      </StyledCVPageContentFooter>
    </StyledCVPageContent>
  );
};
