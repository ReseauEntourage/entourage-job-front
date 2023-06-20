import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';

import UIkit from 'uikit';
import MainImg from 'public/static/img/travailler-banner.jpg';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import formCandidateInscription from 'src/components/forms/schema/formCandidateInscription';
import { openModal } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import {
  NewsletterPartial,
  SharePartial,
  CandidateTestimoniesOrientation,
} from 'src/components/partials';
import { ImageTitle } from 'src/components/partials/ImageTitleNew';
import { Partners } from 'src/components/partials/PartnersNew';
import { Participer } from 'src/components/partials/Travailler/Participer';
import { Rejoindre } from 'src/components/partials/Travailler/Rejoindre';
import { Steps } from 'src/components/partials/Travailler/Steps';
import { Section } from 'src/components/utils';
import { ANTENNE_INFO } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useMount } from 'src/hooks/utils/useMount';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

const Travailler = () => {
  const [campaigns, setCampaigns] = useState([]);

  useMount(() => {
    Api.getCampaigns()
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const openModalInscription = (gTagLabel: string) => {
    gaEvent({
      ...GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC,
      label: gTagLabel,
    });
    fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_OPEN);
    openModal(
      <ModalEdit
        title="Rejoindre LinkedOut"
        description="Pour mieux vous connaitre, nous avons besoins de quelques informations ! Merci de répondre à ces quelques questions, cela prend moins de 5 min !"
        formSchema={formCandidateInscription}
        submitText="Valider"
        formId="candidate-inscription-form"
        onSubmit={async (fields, closeModal) => {
          gaEvent({
            ...GA_TAGS.PAGE_TRAVAILLER_ENVOYER_DEPOSER_CANDIDATURE_CLIC,
            label: gTagLabel,
          });
          fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_SEND);
          await Api.postInscriptionCandidate(fields)
            .then(() => {
              closeModal();
              const selectedCampaign = campaigns.find((campaign) => {
                return campaign.id === fields.infoCo;
              });

              const antenne = ANTENNE_INFO.find((info) => {
                return info.dpt === fields.location;
              });

              const infoCoAddress = selectedCampaign?.address
                ? _.upperFirst(selectedCampaign?.address)
                : _.upperFirst(antenne?.address);

              const email = antenne?.mailCoordo;

              const infoCoDate = _.upperFirst(
                `${moment(
                  campaigns.find((campaign) => {
                    return campaign.id === fields.infoCo;
                  })?.time
                ).format('dddd D MMMM [à] HH[h]mm')}`
              );

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
                          réunion d&apos;information collective, qui aura lieu
                          dans nos locaux le&nbsp;:
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
                          programme LinkedOut.
                        </p>
                        <p>
                          Si vous avez un empêchement, n’oubliez pas de nous
                          prévenir par mail&nbsp;: {email}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Nous allons vous contacter rapidement pour vous
                          proposer un rendez-vous.
                        </p>
                        <p>
                          Si vous avez des questions, n’hésitez pas à nous
                          contacter par mail&nbsp;: {email}
                        </p>
                      </>
                    )}
                  </StyledModalContent>
                </ModalGeneric>
              );
            })
            .catch((err) => {
              console.error(err);
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
        description={`Vous êtes dans une situation de précarité ou d’exclusion\xa0? Vous avez un projet professionnel mais vous n’avez pas de réseau\xa0?`}
        img={MainImg}
        imgMobile={MainImg}
        alt="Candidats LinkedOut en recherche d’emploi"
        cta={{
          label: 'Rejoindre LinkedOut',
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
