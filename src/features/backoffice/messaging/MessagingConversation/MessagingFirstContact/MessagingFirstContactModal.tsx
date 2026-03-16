import React from 'react';
import { Text } from '@/src/components/ui';
import { Alert } from '@/src/components/ui/Alert/Alert';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { UserRoles } from '@/src/constants/users';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { StyledMessagingFirstContactModalContent } from './MessagingFirstContactModal.styles';

interface MessagingFirstContactModalProps {
  role: UserRoles;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Alert variant={AlertVariant.LightBlue} icon={null}>
    <Text weight="semibold" size="large">
      {title}
    </Text>
    <br />
    {children}
  </Alert>
);

const CoachContent = () => (
  <StyledMessagingFirstContactModalContent>
    <Text>Quelques repères pour un soutien efficace dès le début</Text>

    <Section title="1. Démarrer par la messagerie : clarifier rapidement">
      <Text>La messagerie permet :</Text>
      <Text>
        <ul>
          <li>de prendre contact facilement,</li>
          <li>de vérifier la disponibilité du candidat,</li>
          <li>de comprendre en quelques lignes son besoin principal.</li>
        </ul>
      </Text>
      <Text>
        L'objectif n'est pas d'accompagner en profondeur par message, mais de :
      </Text>
      <Text>
        <ul>
          <li>identifier le sujet prioritaire,</li>
          <li>proposer un format d'échange plus efficace,</li>
          <li>fixer un créneau.</li>
        </ul>
      </Text>
    </Section>

    <Section title="2. Proposer rapidement un appel ou une visio : gagner en efficacité">
      <Text>
        Les échanges écrits peuvent devenir longs et imprécis, surtout lorsqu'il
        s'agit de CV, de projet professionnel ou de difficultés personnelles.
      </Text>
      <br />
      <Text>Un appel ou une visio permet :</Text>
      <Text>
        <ul>
          <li>de poser les bonnes questions rapidement,</li>
          <li>d'éviter les malentendus,</li>
          <li>de mieux comprendre la situation globale,</li>
          <li>d'aller plus vite vers une action concrète.</li>
        </ul>
      </Text>
      <Text>
        Un échange de 30 à 45 minutes suffit généralement pour un premier point
        structuré.
      </Text>
    </Section>

    <Section title="3. Structurer le premier rendez-vous pour fluidifier la suite">
      <Text>
        Le premier rendez-vous doit surtout permettre d'organiser la relation.
      </Text>
      <br />
      <Text>Commencez par comprendre clairement la situation actuelle :</Text>
      <Text>
        <ul>
          <li>
            où en est le candidat, depuis combien de temps il cherche, quels
            sont ses freins principaux.
          </li>
        </ul>
      </Text>
      <Text>Enfin, définissez un cadre léger mais clair :</Text>
      <Text>
        <ul>
          <li>comment vous échangez (visio, téléphone, messages),</li>
          <li>à quel rythme,</li>
          <li>pour combien de temps environ.</li>
        </ul>
      </Text>
      <Text>
        Ce cadre évite les malentendus et rend les échanges plus fluides.
      </Text>
    </Section>

    <Section title="4. Toujours terminer par une action concrète">
      <Text>Un premier échange utile se conclut par une étape claire :</Text>
      <Text>
        <ul>
          <li>retravailler une partie du CV,</li>
          <li>identifier 5 entreprises à cibler,</li>
          <li>préparer des réponses à des questions d'entretien, etc.</li>
        </ul>
      </Text>
      <Text>Précisez qui fait quoi et à quel moment.</Text>
      <Text>
        Cela permet de garder une dynamique et d'éviter que la relation reste
        floue.
      </Text>
    </Section>
  </StyledMessagingFirstContactModalContent>
);

const CandidateContent = () => (
  <StyledMessagingFirstContactModalContent>
    <Text>Quelques repères pour un soutien efficace dès le début</Text>

    <Section title="1. Commencer par la messagerie">
      <Text>Il est normal de démarrer par message. Cela permet :</Text>
      <Text>
        <ul>
          <li>de vous présenter,</li>
          <li>d'expliquer brièvement votre situation,</li>
          <li>de préciser ce dont vous avez besoin.</li>
        </ul>
      </Text>
      <Text>
        Pour faciliter l'échange, essayez d'être clair dès le départ :
      </Text>
      <Text>
        <ul>
          <li>Depuis combien de temps cherchez-vous ?</li>
          <li>Dans quel domaine ?</li>
          <li>
            Quel type d'aide recherchez-vous (CV, entretien, réseau,
            motivation…) ?
          </li>
        </ul>
      </Text>
      <Text>
        Un message simple et sincère suffit. Pas besoin d'être parfait.
      </Text>
    </Section>

    <Section title="2. Proposer ou accepter un appel rapidement">
      <Text>
        Les échanges écrits ont leurs limites. Après quelques messages, il est
        souvent plus efficace de proposer un appel ou une visio.
      </Text>
      <Text>Pourquoi ?</Text>
      <Text>
        <ul>
          <li>C'est plus rapide.</li>
          <li>C'est plus clair.</li>
          <li>Cela permet d'expliquer votre situation plus facilement.</li>
        </ul>
      </Text>
      <Text>
        Un échange de 20 à 30 minutes peut déjà faire avancer les choses
        concrètement.
      </Text>
    </Section>

    <Section title="3. Préparer le premier rendez-vous">
      <Text>
        Lors du premier rendez-vous, l'objectif n'est pas de tout régler d'un
        coup.
      </Text>
      <Text>Essayez d'identifier une priorité :</Text>
      <Text>
        <ul>
          <li>retravailler votre CV,</li>
          <li>préparer un entretien,</li>
          <li>cibler des entreprises,</li>
          <li>développer votre réseau,</li>
          <li>reprendre confiance.</li>
        </ul>
      </Text>
      <Text>Avancer sur un sujet précis permet d'être plus efficace.</Text>
    </Section>

    <Section title="4. Définir la prochaine étape">
      <Text>À la fin du premier échange, assurez-vous de repartir avec :</Text>
      <Text>
        <ul>
          <li>une action concrète à réaliser,</li>
          <li>un délai,</li>
          <li>éventuellement une date pour un prochain échange.</li>
        </ul>
      </Text>
      <Text>Exemple :</Text>
      <Text>
        <ul>
          <li>Vous retravaillez votre CV.</li>
          <li>Le coach vous fait un retour d'ici quelques jours.</li>
          <li>Vous refaites un point la semaine suivante.</li>
        </ul>
      </Text>
      <Text>
        Cela permet de garder une dynamique et d'éviter que la conversation
        s'arrête.
      </Text>
    </Section>
  </StyledMessagingFirstContactModalContent>
);

export const MessagingFirstContactModal = ({
  role,
}: MessagingFirstContactModalProps) => {
  return (
    <ModalGeneric
      title="Comment structurer votre premier échange"
      withCloseButton
    >
      {role === UserRoles.CANDIDATE ? <CandidateContent /> : <CoachContent />}
    </ModalGeneric>
  );
};
