import { useMemo } from 'react';
import { Text, LucidIcon, Button } from '@/src/components/ui';
import { H4, H5 } from '@/src/components/ui/Headings';
import { ListGroupTimeLineVertical } from '@/src/components/ui/ListGroup/ListGroupTimeLineVertical';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

export const StepsSummary = () => {
  const user = useAuthenticatedUser();

  const steps = useMemo(
    () => [
      {
        title: 'S’inscrire au Webinaire de bienvenue',
        description:
          "Découvrez le programme, rencontrez l'équipe, posez vos questions en direct",
        duration: '~1 heure',
      },
      {
        title: `Comprendre le rôle et les missions du ${user.role} Entourage Pro`,
        description: 'Des modules vidéos avec des cas concrets pour être prêt',
        duration: '~20 minutes',
      },
      {
        title: 'Choisir le type d’engagement',
        description: 'Ajustez votre accompagnement selon vos besoins.',
        duration: '~1 minute',
      },
      ...(user.role === 'Candidat'
        ? [
            {
              title: 'Indiquer la situation sociale et économique',
              description: 'Pour nous permettre de mieux vous connaître',
              duration: '~1-2 minutes',
            },
          ]
        : []),
      {
        title: 'Compléter le profil',
        description:
          'Obtenir des conseils pratiques pour organiser et animer efficacement votre première session.',
        duration: '~4-5 minutes',
      },
    ],
    [user.role]
  );

  const totalDuration = useMemo(() => {
    return steps.reduce((total, step) => {
      const durationMatch = step.duration.match(/~(\d+)(-(\d+))? minute/);
      if (durationMatch) {
        const min = parseInt(durationMatch[1], 10);
        const max = durationMatch[3] ? parseInt(durationMatch[3], 10) : min;
        return total + (min + max) / 2;
      }
      return total;
    }, 0);
  }, [steps]);

  return (
    <>
      <H4 title="Votre parcours d'intégration : 5 étapes essentielles" />
      <Text>
        Un parcours structuré pour vous donner toutes les clés de réussite avant
        votre première session.
      </Text>
      <br />
      <Text>
        <LucidIcon name="Clock" size={16} /> Durée totale : ~{totalDuration}{' '}
        minutes + 1 heure de webinaire
      </Text>
      <br />
      <ListGroupTimeLineVertical.Container>
        {steps.map((step, index) => (
          <ListGroupTimeLineVertical.Item
            key={index}
            number={index + 1}
            isLast={index === steps.length - 1}
          >
            <H5 title={step.title} noMarginBottom />
            <Text>{step.description}</Text>
            <Text>
              <LucidIcon name="Clock" size={16} /> Durée estimée :{' '}
              {step.duration}
            </Text>
          </ListGroupTimeLineVertical.Item>
        ))}
      </ListGroupTimeLineVertical.Container>
      <Button>Commencer le parcours</Button>
    </>
  );
};
