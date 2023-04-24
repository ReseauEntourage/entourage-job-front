import moment from 'moment';
import React, { useState } from 'react';

import UIkit from 'uikit';
import MainImg from 'public/static/img/travailler-banner.png';
import api from 'src/api/index';
import Layout from 'src/components/Layout';
import formCandidateInscription from 'src/components/forms/schema/formCandidateInscription';
import { openModal } from 'src/components/modals/Modal';
import ModalGeneric from 'src/components/modals/Modal/ModalGeneric/';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { NewsletterPartial, SharePartial } from 'src/components/partials';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';
import { ImageTitle } from 'src/components/partials/ImageTitleNew';
import { Partners } from 'src/components/partials/PartnersNew';
import { Participer } from 'src/components/partials/Travailler/Participer';
import { Rejoindre } from 'src/components/partials/Travailler/Rejoindre';
import { Steps } from 'src/components/partials/Travailler/Steps';
import { Section } from 'src/components/utils';
import { antenneInfo } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useMount } from 'src/hooks/utils/useMount';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

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

  const openModalInscription = (gTagLabel: string) => {
    openModal(
      <ModalEdit
        title="Rejoindre LinkedOut"
        description="Pour mieux vous connaitre, nous avons besoins de quelques informations ! Merci de répondre à ces quelques questions, cela prend moins de 5 min !"
        formSchema={formCandidateInscription}
        submitText="Valider"
        formId="candidate-inscription-form"
        onSubmit={async (fields, closeModal) => {
          gaEvent({
            ...GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC,
            label: gTagLabel,
          });
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
  };

  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        title="LinkedOut, un tremplin vers l’emploi"
        description="Vous êtes dans une situation de précarité ou d’exclusion ? Vous avez un projet professionnel mais vous n’avez pas de réseau ?"
        img={MainImg}
        imgMobile={MainImg}
        alt="Candidats LinkedOut en recherche d’emploi"
        cta={{
          label: 'Rejoindre Linkedout',
          href: '',
          onClick: () => {
            openModalInscription('Header');
          },
          className: 'custom-secondary-inverted',
          isExternal: false,
          newTab: false,
          dataTest: 'banner-cta',
        }}
      />
      <Participer cta={openModalInscription} />
      <Rejoindre cta={openModalInscription} />
      <Steps cta={openModalInscription} />
      <CandidateTestimoniesOrientation noTitle noVideo style="muted" />
      <Partners />
      <Section style="custom-primary">
        <NewsletterPartial
          padding={false}
          tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC}
        />
      </Section>
      <Section style="custom-primary">
        <SharePartial />
      </Section>
    </Layout>
  );
};

export default Travailler;
