import React, { useMemo } from 'react';
import { EntreprisesFAQ } from '@/src/components/partials/pages/Entreprises/EntreprisesFAQ/EntreprisesFAQ';
import { EntreprisesTuto } from '@/src/components/partials/pages/Entreprises/EntreprisesTuto/EntreprisesTuto';
import { EntreprisesVideo } from '@/src/components/partials/pages/Entreprises/EntreprisesVideo/EntreprisesVideo';
import { SimpleImageText } from '@/src/components/partials/utils/SimpleImageText';
import { RegistrationFlow } from '@/src/components/registration/flows/flows.types';
import { CheckListElement, List } from '@/src/components/utils/Lists';
import { CompanyGoal } from '@/src/constants/company';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { TaxModal } from 'src/components/modals/PopupModal/TaxModal';
import { Impact } from 'src/components/partials/common/Impact';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { EntreprisesEnSavoirPlus } from 'src/components/partials/pages/Entreprises/EntreprisesEnSavoirPlus';
import { CTAProps, ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { Button, Text } from 'src/components/utils';
import { STORAGE_KEYS } from 'src/constants';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { useMount } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-augustin-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review: (
      <>
        &ldquo;Par son expérience, il apporte quelque chose de radicalement
        différent. Si je pouvais embaucher 2 Kenny, je le ferais&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-francois-miah.jpg',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    companyInfo: '31 salariés',
    review: (
      <>
        &ldquo;Avec Miah c’est une réussite. Là où notre compétence s’arrête, on
        est rassurés par le fait que Entourage est là pour nous accompagner. Si
        on peut s’inscrire dans des actions comme celles-ci tout en gardant
        notre efficacité, en y ajoutant le sourire de quelqu’un qui a envie, on
        le fait&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-advens.jpg',
    author: 'Sylvie Lepoutre',
    authorStatus: 'Raison d’être & Projet d’entreprise',
    company: 'Advens',
    industry: '',
    review: (
      <>
        &ldquo;Nous étions à mille lieux des problématiques des personnes en
        précarité. Maintenant, chez Advens, on entend des mots comme
        “résilience”, “deuxième chance”, “rebond”, “inclusion”. Les
        collaborateurs sont très fiers !&ldquo;
      </>
    ),
  },
];

const RecruterInclusif = () => {
  useUtm();
  useMount(() => {
    const taxModalClosed = localStorage.getItem(STORAGE_KEYS.TAX_MODAL_CLOSED);
    if (process.env.NEXT_PUBLIC_SHOW_POPUP === 'true' && !taxModalClosed) {
      setTimeout(() => {
        openModal(<TaxModal />);
      }, 1500);
    }
  });

  const ctaRegister = useMemo(() => {
    return {
      dataTest: 'button-register-company-header',
      onClick: () => {
        gaEvent(GA_TAGS.PAGE_ENTREPRISES_REGISTER);
        fbEvent(FB_TAGS.COMPANY_REGISTRATION_OPEN);
      },
      href: `/inscription?flow=${RegistrationFlow.COMPANY}`,
      variant: 'primary',
      label: 'Créer mon espace entreprise',
    } as CTAProps;
  }, []);

  return (
    <Layout title="S'engager - Entourage Pro">
      <ImageTitle
        img="/static/img/entreprises-engager-banner-desktop.jpg"
        imgMobile="/static/img/entreprises-engager-banner-mobile.jpg"
        title="Sensibiliser et engager mes collaborateurs"
        description={
          <>
            Depuis plus de 10 ans, Entourage se mobilise pour que chacun puisse
            s’engager auprès des plus précaires. Rejoignez l&apos;aventure de
            l&apos;inclusion !
          </>
        }
        cta={ctaRegister}
      />

      <SimpleImageText
        img="/static/img/company-why-sensibilize.jpg"
        title="Pourquoi engager mes collaborateurs ? "
      >
        <Text>
          Aujourd’hui. les entreprises ont un réel rôle à jouer dans la lutte
          contre l’exclusion. Mais encore faut-il savoir comment mobiliser ses
          propres équipes !
        </Text>
        <br />
        <Text>
          En rejoignant Entourage Pro, vous engagez votre entreprise dans une
          démarche d’inclusion, en changeant le regard de vos collaborateurs sur
          la précarité et l’isolement.
        </Text>
        <br />
        <Text>
          Vous renforcez la cohésion entre collègues ainsi que votre marque
          employeur et fidélisez vos talents.
        </Text>
        <br />
        <Text>
          Vous vous positionnez sur la question du lien social, l’un des grands
          sujets de société et défis contemporains.
        </Text>
      </SimpleImageText>

      <EntreprisesVideo />

      <SimpleImageText
        img="/static/img/why-become-coach.jpg"
        title="Engagez vos collaborateurs à devenir coachs bénévoles"
      >
        <Text>
          Devenir coach, c’est donner des coups de pouce à des candidat(e)s afin
          qu’ils aient toutes les cartes en main pour appréhender le monde
          professionnel et y trouver leur place.
        </Text>
        <List>
          <CheckListElement>
            <Text>
              Une mission de bénévolat concrète et valorisante pour vos
              salariés.
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              Un format d’engagement souple, qui s’adapte à leurs disponibilités
              et leur permet de s’engager à leur rythme.
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              <b>Un suivi d’impact chiffré</b> avec le nombre de collaborateurs
              engagés, le nombre de candidats accompagnés, etc.
            </Text>
          </CheckListElement>
        </List>
        <Button
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
            fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
            linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
          }}
          href={ctaRegister.href}
          dataTestId="button-company-first-section"
          variant="secondary"
          rounded
        >
          {ctaRegister.label}
        </Button>
      </SimpleImageText>

      <EntreprisesTuto context={CompanyGoal.SENSIBILIZE} />

      <SimpleImageText
        img="/static/img/team-building.jpg"
        title="Proposez un Team Building solidaire à vos équipes"
        reverse
      >
        <List>
          <CheckListElement>
            <Text>
              Un engagement authentique de vos collaborateurs dans des actions
              de RSE concrètes.
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              Des ateliers variés et ludiques comme l’atelier job dating où vos
              collaborateurs rencontrent et conseillent des candidats de tous
              horizons.
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              Une augmentation de la satisfaction et de la cohésion interne et
              des actions de bénévolat valorisantes pour vos équipes.
            </Text>
          </CheckListElement>
        </List>
        <Button
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_TBS_FORMATS_CLIC);
          }}
          href=""
          dataTestId="button-company-first-section"
          variant="secondary"
          rounded
        >
          Découvrir les formats
        </Button>
      </SimpleImageText>

      <Impact
        as="Company"
        gaEventTag={GA_TAGS.PAGE_ENTREPRISES_MESURE_D_IMPACT_CLICK}
        inviteToShowMore
      />

      <Reviews reviews={reviews} title="Témoignages" />

      <EntreprisesFAQ context={CompanyGoal.SENSIBILIZE} />

      <EntreprisesEnSavoirPlus />

      <PartnersWorkingWithUs tag={GA_TAGS.PAGE_ENTREPRISES_PARTNERS_CLICK} />

      <NewsletterPartial
        style="default"
        tag={GA_TAGS.PAGE_ENTREPRISES_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default RecruterInclusif;
