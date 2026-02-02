import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Text, Section } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AccordionGroup } from '@/src/components/ui/Accordion/AccordionGroup';
import { H3, H5 } from '@/src/components/ui/Headings';
import { CompanyGoal } from '@/src/constants/company';
import {
  StyledEntrepriseFAQContainer,
  StyledTitleContainer,
} from './EntreprisesFAQ.styles';

export type EntreprisesFAQProps = {
  context: CompanyGoal;
};

export type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

export const EntreprisesFAQ = ({ context }: EntreprisesFAQProps) => {
  const contentByContext: Record<string, FAQItem[]> = {
    recruit: [
      {
        question: 'Qu’est-ce que la plateforme Entourage Pro ?',
        answer: (
          <Text>
            Entourage Pro est un <b>réseau professionnel solidaire en ligne</b>.
            Il permet à des personnes éloignées de l’emploi de développer leur
            réseau et d’accéder à des opportunités professionnelles grâce aux
            entreprises, coachs bénévoles et associations partenaires.
          </Text>
        ),
      },
      {
        question: 'Comment mon entreprise utilise la plateforme ?',
        answer: (
          <Text>
            En créant un <b>compte entreprise</b>, vous pouvez :
            <ul>
              <li>
                consulter des profils de candidats en situation de précarité et
                d’exclusion,
              </li>
              <li>
                créer des alertes recrutement pour recevoir des profils de
                candidats,
              </li>
              <li>
                mobiliser vos collaborateurs via du mentorat ou des ateliers,
              </li>
              <li>suivre vos engagements et vos impacts.</li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Qui sont les candidats présents sur la plateforme ?',
        answer: (
          <Text>
            Ce sont des personnes en situation de précarité ou d’exclusion
            professionnelle (chômage longue durée, parcours de rue, exil, etc.).
            Chaque candidat est <b>accompagné par un coach bénévole</b> qui
            l’aide à clarifier son projet professionnel et à préparer son
            intégration.
          </Text>
        ),
      },
      {
        question: 'Comment se fait la mise en relation avec un candidat ?',
        answer: (
          <Text>
            <ul>
              <li>
                Via la <b>messagerie intégrée</b> sécurisée,
              </li>
              <li>Avec l’aide si besoin d’Entourage Pro,</li>
              <li>
                Grâce à des recommandations automatiques qui vous présentent les
                profils les plus pertinents.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Quel est l’investissement en temps pour mon entreprise ?',
        answer: (
          <Text>
            Cela dépend de votre niveau d’engagement :
            <ul>
              <li>
                Sensibilisation : <b>1h</b>
              </li>
              <li>
                Mentorat : <b>2h/mois</b> par collaborateur volontaire
              </li>
              <li>
                Recrutement inclusif : votre processus habituel, accompagné par
                Entourage Pro.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Et si nous ne sommes pas prêts à recruter ?',
        answer: (
          <Text>
            Vous pouvez commencer par :
            <ul>
              <li>
                organiser un <b>atelier de sensibilisation</b> pour vos équipes,
              </li>
              <li>
                participer à des <b>ateliers collectifs</b> avec des candidats,
              </li>
              <li>
                proposer du <b>mentorat ponctuel</b> à vos collaborateurs.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Les candidats sont-ils préparés à intégrer une entreprise ?',
        answer: (
          <Text>
            Les candidats bénéficient de coups de pouce professionnels de la
            part des coachs bénévoles de la plateforme (CV, préparation aux
            entretiens, ateliers collectifs).
          </Text>
        ),
      },
      {
        question: 'Quel bénéfice concret pour mon entreprise ?',
        answer: (
          <Text>
            <ul>
              <li>
                Image employeur renforcée : attractivité auprès des jeunes
                talents et collaborateurs sensibles aux valeurs sociétales.
              </li>

              <li>
                Cohésion interne : les équipes engagées se sentent fières et
                impliquées.
              </li>

              <li>
                Performance : diversité et inclusion favorisent créativité et
                efficacité.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Combien ça coûte ?',
        answer: <Text>L’accès à la plateforme est gratuit.</Text>,
      },
    ],
    sensibilize: [
      {
        question:
          'Quel est l’impact de l’engagement collaborateur sur les compétences de mes équipes ?',
        answer: (
          <Text>
            Les collaborateurs développent des <b>soft skills</b> clés : écoute
            active, leadership bienveillant, accompagnement et intelligence
            relationnelle. Autant de compétences utiles dans leur quotidien
            professionnel.
          </Text>
        ),
      },
      {
        question: 'En quoi cela motive et fidélise mes collaborateurs ?',
        answer: (
          <Text>
            Participer à Entourage Pro nourrit leur besoin de sens.
            <ul>
              <li>
                86 % des salariés estiment que leur entreprise doit agir contre
                les inégalités.
              </li>
              <li>
                41 % pourraient quitter une entreprise dont les valeurs ne sont
                pas alignées avec les leurs.
              </li>
              <li>
                S’engager via Entourage Pro renforce la fierté d’appartenance et
                la rétention.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Est-ce que cela renforce notre attractivité ?',
        answer: (
          <Text>
            Oui. 82 % des candidats à l’emploi regardent les engagements sociaux
            d’une entreprise avant de postuler. L’engagement collaborateur
            devient un argument fort pour attirer les talents sensibles aux
            valeurs sociétales.
          </Text>
        ),
      },
      {
        question: 'Quel effet sur la cohésion interne ?',
        answer: (
          <Text>
            Partager une expérience solidaire crée des liens entre
            collaborateurs de services et niveaux hiérarchiques différents. Cela
            favorise une meilleure ambiance de travail et une culture
            d’entreprise plus inclusive.
          </Text>
        ),
      },
      {
        question:
          'Qu’est-ce que cela veut dire, s’engager avec Entourage Pro ?',
        answer: (
          <Text>
            C’est participer à des actions solidaires qui favorisent l’inclusion
            professionnelle : accompagner un candidat en mentorat, participer à
            des ateliers collectifs ou suivre une sensibilisation au recrutement
            inclusif.
          </Text>
        ),
      },
      {
        question: 'Quels bénéfices pour les collaborateurs ?',
        answer: (
          <Text>
            <ul>
              <li>
                Développer des compétences transversales (écoute, communication,
                accompagnement).
              </li>

              <li>
                Découvrir d’autres réalités sociales et renforcer son empathie.
              </li>

              <li>
                Donner du sens à son travail et ressentir de la fierté d’agir
                pour un projet qui dépasse son quotidien.
              </li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Combien de temps prend le coaching d’un candidat ?',
        answer: (
          <Text>
            C’est flexible selon les disponibilités des collaborateurs mais
            consacrer 2h par mois permet déjà de contribuer grandement au
            soutien d’un candidat.
          </Text>
        ),
      },
      {
        question: 'Un collaborateur peut-il coacher sans être expert RH ?',
        answer: (
          <Text>
            Absolument. Le rôle de coach est de donner{' '}
            <b>un coup de pouce concret</b>
            (relire un CV, préparer un entretien, partager votre réseau).
            L’expérience professionnelle de chacun est précieuse, même sans
            avoir fait de mentorat auparavant.
          </Text>
        ),
      },
      {
        question: 'Quel impact cela a pour les candidats ?',
        answer: (
          <Text>
            Votre aide peut changer une trajectoire de vie :
            <ul>
              <li>un CV mieux présenté,</li>
              <li>un entretien réussi,</li>
              <li>une mise en relation dans un réseau pro,</li>
              <li>et surtout un soutien, une écoute</li>
            </ul>
          </Text>
        ),
      },
      {
        question: 'Quel soutien pour les coachs ?',
        answer: (
          <Text>
            <ul>
              <li>Une boite à outils (guides, fiches conseils),</li>
              <li>du soutien d’une communauté de coachs engagés,</li>
              <li>un contact référent Entourage Pro.</li>
            </ul>
          </Text>
        ),
      },
    ],
  };
  return (
    <Section container="small">
      <StyledEntrepriseFAQContainer>
        <StyledTitleContainer>
          <SvgIcon name="IlluBulleQuestionCheck" width={80} height={80} />
          <H3 title="On répond à vos questions" />
        </StyledTitleContainer>

        <AccordionGroup>
          {contentByContext[context].map((item, idx) => (
            <Accordion
              headerContent={<H5 title={item.question} />}
              key={item.question}
              defaultOpen={idx === 0}
              variant="simple"
            >
              {item.answer}
            </Accordion>
          ))}
        </AccordionGroup>
      </StyledEntrepriseFAQContainer>
    </Section>
  );
};
