import React, { useMemo } from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Button, Text } from '@/src/components/ui';
import { CheckListElement, List } from '@/src/components/ui/Lists';
import { CompanyGoal } from '@/src/constants/company';
import { Impact } from '@/src/features/partials/common/Impact';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { PartnersWorkingWithUs } from '@/src/features/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { EntreprisesCVList } from '@/src/features/partials/pages/Entreprises/EntreprisesCVList';
import { EntreprisesEnSavoirPlus } from '@/src/features/partials/pages/Entreprises/EntreprisesEnSavoirPlus';
import { EntreprisesFAQ } from '@/src/features/partials/pages/Entreprises/EntreprisesFAQ/EntreprisesFAQ';
import { EntreprisesTuto } from '@/src/features/partials/pages/Entreprises/EntreprisesTuto/EntreprisesTuto';
import { EntreprisesVideo } from '@/src/features/partials/pages/Entreprises/EntreprisesVideo/EntreprisesVideo';
import { RecruitmentMetrics } from '@/src/features/partials/pages/Entreprises/RecruitmentMetrics/RecruitmentMetrics';
import { CTAProps, ImageTitle } from '@/src/features/partials/utils/ImageTitle';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
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
    <Layout title="Recruter inclusif - Entourage Pro">
      <ImageTitle
        img="/static/img/recruter-inclusif-banner-desktop.jpg"
        imgMobile="/static/img/recruter-inclusif-banner-mobile.jpg"
        title="Pour gagner en performance et en impact, recrutez inclusif"
        description={
          <>
            Accédez à un vivier de talents diversifiés et motivés
            <br />
            Engagez vos équipes dans une démarche RSE concrète
          </>
        }
        cta={ctaRegister}
      />

      <SimpleImageText
        img="/static/img/company-what-s-inclusive-recruitment.jpg"
        title="Le recrutement inclusif, c'est quoi ?"
        contentPaddingY={40}
      >
        <Text>
          Recruter inclusif, c’est donner la chance à une personne en dehors des
          canaux traditionnels d’intégrer votre entreprise et créer les
          conditions pour l’intégrer durablement.
        </Text>

        <Text>
          Concrètement, vous adaptez votre processus de recrutement et
          l’intégration de la personne. Avec Entourage Pro, vous êtes guidé et
          accompagné pour faire de ce recrutement un succès.
        </Text>
      </SimpleImageText>

      <RecruitmentMetrics />

      <SimpleImageText
        img="/static/img/ordinateur-EP.png"
        title="Pourquoi rejoindre Entourage Pro ?"
        reverse
      >
        <List>
          <CheckListElement>
            <Text>
              Accédez à des talents qualifiés souvent non visibles dans les
              canaux de recrutement traditionnels
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              Créez des alertes mail personnalisées pour être informé
              automatiquement dès qu’un candidat correspond à vos critères
            </Text>
          </CheckListElement>
          <CheckListElement>
            <Text>
              Bénéficiez de l’ensemble des outils et formations de la plateforme
              Entourage Pro
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

      <EntreprisesVideo context={CompanyGoal.RECRUIT} />

      <EntreprisesTuto context={CompanyGoal.RECRUIT} />

      <EntreprisesCVList />

      <Impact
        as="Company"
        gaEventTag={GA_TAGS.PAGE_ENTREPRISES_MESURE_D_IMPACT_CLICK}
        inviteToShowMore
        invertBgColor
      />

      <Reviews reviews={reviews} title="Témoignages" />

      <EntreprisesFAQ context={CompanyGoal.RECRUIT} />

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
