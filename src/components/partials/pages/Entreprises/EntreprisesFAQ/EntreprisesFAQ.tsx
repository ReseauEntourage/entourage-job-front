import React from 'react';
import { IlluBulleQuestionCheck } from '@/assets/icons/icons';
import { Text, Section } from '@/src/components/utils';
import { H3 } from '@/src/components/utils/Headings';
import { Accordion } from '../../../utils/Accordion/Accordion';
import { AccordionGroup } from '../../../utils/Accordion/AccordionGroup';
import {
  StyledEntrepriseFAQContainer,
  StyledFAQContainer,
  StyledFirstColumn,
  StyledTitleContainer,
} from './EntreprisesFAQ.styles';

export const EntreprisesFAQ = () => {
  return (
    <Section>
      <StyledEntrepriseFAQContainer>
        <StyledFirstColumn>
          <StyledTitleContainer>
            <IlluBulleQuestionCheck width={80} height={80} />
            <H3 title="On répond à vos questions" />
          </StyledTitleContainer>
        </StyledFirstColumn>
        <StyledFAQContainer>
          <AccordionGroup>
            <Accordion
              title="Qu’est-ce que la plateforme Entourage Pro ?"
              defaultOpen
            >
              <Text>
                Entourage Pro est un{' '}
                <b>réseau professionnel solidaire en ligne</b>. Il permet à des
                personnes éloignées de l’emploi de développer leur réseau et
                d’accéder à des opportunités professionnelles grâce aux
                entreprises, coachs bénévoles et associations partenaires.
              </Text>
            </Accordion>
            <Accordion title="Comment mon entreprise utilise la plateforme ?">
              <Text>
                En créant un <b>compte entreprise</b>, vous pouvez :
                <ul>
                  <li>
                    consulter des profils de candidats en situation de précarité
                    et d’exclusion,
                  </li>
                  <li>
                    créer des alertes recrutement pour recevoir des profils de
                    candidats,
                  </li>
                  <li>
                    mobiliser vos collaborateurs via du mentorat ou des
                    ateliers,
                  </li>
                  <li>suivre vos engagements et vos impacts.</li>
                </ul>
              </Text>
            </Accordion>
            <Accordion title="Qui sont les candidats présents sur la plateforme ?">
              <Text>
                Ce sont des personnes en situation de précarité ou d’exclusion
                professionnelle (chômage longue durée, parcours de rue, exil,
                etc.). Chaque candidat est{' '}
                <b>accompagné par un coach bénévole</b> qui l’aide à clarifier
                son projet professionnel et à préparer son intégration.
              </Text>
            </Accordion>

            <Accordion title="Comment se fait la mise en relation avec un candidat ?">
              <Text>
                <ul>
                  <li>
                    Via la <b>messagerie intégrée</b> sécurisée,
                  </li>
                  <li>Avec l’aide si besoin d’Entourage Pro,</li>
                  <li>
                    Grâce à des recommandations automatiques qui vous présentent
                    les profils les plus pertinents.
                  </li>
                </ul>
              </Text>
            </Accordion>

            <Accordion title="Quel est l’investissement en temps pour mon entreprise ?">
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
                    Recrutement inclusif : votre processus habituel, accompagné
                    par Entourage Pro.
                  </li>
                </ul>
              </Text>
            </Accordion>

            <Accordion
              title="Et si nous ne sommes pas prêts à recruter ?
"
            >
              <Text>
                Vous pouvez commencer par :
                <ul>
                  <li>
                    organiser un <b>atelier de sensibilisation</b> pour vos
                    équipes,
                  </li>
                  <li>
                    participer à des <b>ateliers collectifs</b> avec des
                    candidats,
                  </li>
                  <li>
                    proposer du <b>mentorat ponctuel</b> à vos collaborateurs.
                  </li>
                </ul>
              </Text>
            </Accordion>

            <Accordion
              title="Les candidats sont-ils préparés à intégrer une entreprise ?
"
            >
              <Text>
                Les candidats bénéficient de coups de pouce professionnels de la
                part des coachs bénévoles de la plateforme (CV, préparation aux
                entretiens, ateliers collectifs).
              </Text>
            </Accordion>

            <Accordion title="Quel bénéfice concret pour mon entreprise ?">
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
                    Performance : diversité et inclusion favorisent créativité
                    et efficacité.
                  </li>
                </ul>
              </Text>
            </Accordion>

            <Accordion title="Combien ça coûte ?">
              <Text>L’accès à la plateforme est gratuit.</Text>
            </Accordion>
          </AccordionGroup>
        </StyledFAQContainer>
      </StyledEntrepriseFAQContainer>
    </Section>
  );
};
