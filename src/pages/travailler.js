import React, { useState } from 'react';
import { CONTACT_INFO, antenneInfo } from 'src/constants';
import { Section, SimpleLink, Button } from 'src/components/utils';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import HowToJoin from 'src/components/partials/HowToJoin';
import StepsToJoin from 'src/components/partials/StepsToJoin';
import Highlights from 'src/components/partials/Highlights';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import { fbEvent } from 'src/lib/fb';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { openModal } from 'src/components/modals/Modal';
import formCandidateInscription from 'src/components/forms/schema/formCandidateInscription';
import api from 'src/api/index.ts';
import ModalGeneric from 'src/components/modals/Modal/ModalGeneric/';
import UIkit from 'uikit';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { useMount } from 'src/hooks/utils/useMount';
import moment from 'moment';
import 'moment/locale/fr';

const Travailler = () => {
  const [campaigns, setCampaigns] = useState([]);

  useMount(() => {
    api
      .getCampaigns()
      .then((res) => {
        setCampaigns(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function openModalInscription() {
    openModal(
      <ModalEdit
        title="Rejoindre LinkedOut"
        description="LinkedOut accompagne des personnes en situation de précarité et sans réseau à trouver des opportunités d’emploi. Merci de répondre à quelques questions. Cela prend moins de 5 minutes"
        formSchema={formCandidateInscription}
        submitText="Valider"
        id="candidate-inscription-form"
        onSubmit={async (fields, closeModal) => {
          gaEvent(GA_TAGS.PAGE_TRAVAILLER_VALIDER_CANDIDATURE_CLIC);
          fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_SEND);
          await api
            .postInscriptionCandidate(fields)
            .then(() => {
              closeModal();
              const antenne = antenneInfo.find((info) => {
                return info.dpt === fields.location;
              });
              const infoCoAddress = antenne?.address;
              const email = antenne?.mailCoordo;
              const infoCoDate = `${moment(
                campaigns.find((campaign) => {
                  return campaign.id === fields.infoCo;
                })?.time
              ).format('dddd D MMMM [à] HH[h]mm')}`;
              openModal(
                <ModalGeneric
                  title="Merci pour votre inscription !"
                  onClose={closeModal()}
                  withCloseButton
                >
                  <StyledModalContent>
                    <p>Votre inscription a bien été prise en compte </p>
                    {fields.infoCo ? (
                      <>
                        <p>
                          Nous sommes impatient de vous retrouver pour la
                          réunion d’information collective, qui aura lieu dans
                          nos locaux le
                        </p>
                        <p>
                          <strong>{infoCoDate}</strong>
                        </p>
                        <p>
                          <strong>{infoCoAddress}</strong>
                        </p>
                        <p>
                          N’oubliez pas de noter la date dans votre agenda,
                          cette réunion est indispensable pour commencer le
                          programme LinkedOut
                        </p>
                        <p>
                          Si vous avez un empêchement, n’oubliez pas de nous
                          prévenir par mail : {email}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Nous allons vous contacter rapidement pour vous
                          proposer un rendez-vous
                        </p>
                        <p>
                          si vous avez des questions, n’hésitez pas à nous
                          contacter par mail : {email}
                        </p>
                      </>
                    )}
                  </StyledModalContent>
                </ModalGeneric>
              );
            })
            .catch((err) => {
              console.log(err);
              UIkit.notification('Un problème est survenu', 'danger');
            });
        }}
      />
    );
  }

  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_work.jpg"
        id="work-title"
        title={
          <mark>
            LinkedOut, un tremplin vers{' '}
            <span className="uk-text-primary">l’emploi</span>
          </mark>
        }
        text={
          <>
            Vous êtes dans une situation de précarité ou d’exclusion ? Vous avez
            un projet professionnel mais vous n’avez pas de réseau ?
          </>
        }
        cta={{
          onClick: () => {
            openModalInscription();
            gaEvent(GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC);
            fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_OPEN);
          },
          // href: process.env.AIRTABLE_LINK_JOIN_LINKEDOUT,
          label: 'Rejoindre LinkedOut',
          isExternal: true,
          newTab: true,
          dataTestId: 'cta-inscription',
        }}
      />
      <Section id="introWork" container="small" style="muted">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h4
            className="uk-align-center uk-text-center"
            data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > span; delay: 200;"
          >
            <span>
              LinkedOut vous propose{' '}
              <span className="uk-text-bold uk-text-primary">
                un parcours sur 6 mois
              </span>{' '}
              pour vous aider à trouver un emploi.
            </span>
            <br />
            <br />
            <span>
              Candidatez au programme à Paris, dans le 92 et 93, à Lille, Lyon
              et Lorient.
            </span>
          </h4>
          <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
            <Button
              style="secondary"
              className="uk-margin-small-top"
              isExternal
              newTab
              dataTestId="cta-inscription"
              onClick={() => {
                openModalInscription();
                gaEvent(GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC);
                fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_OPEN);
              }}
              // href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
            >
              Je m&apos;inscris <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Highlights />
      <HowToJoin />
      <StepsToJoin />
      <CandidateTestimoniesOrientation style="muted" />
      <Section className="uk-padding-remove-top" style="muted">
        <h4 className="uk-text-center">
          Si vous avez des questions, écrivez-nous à <br />
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>{' '}
          ou appelez nous au{' '}
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            rel="noopener"
            href={`tel:${CONTACT_INFO.MOBILE_PHONE_NUMBER}`}
          >
            {CONTACT_INFO.MOBILE_PHONE_NUMBER}
          </SimpleLink>
        </h4>
      </Section>
    </Layout>
  );
};

export default Travailler;
