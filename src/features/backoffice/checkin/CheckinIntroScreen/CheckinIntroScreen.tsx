import React from 'react';
import { Button, Card, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import {
  StyledCheckinIntroActions,
  StyledCheckinIntroList,
  StyledCheckinIntroListItem,
  StyledCheckinIntroScreen,
} from './CheckinIntroScreen.styles';

interface CheckinIntroScreenProps {
  otherFirstName: string;
  onStart: () => void;
  onLater: () => void;
}

export const CheckinIntroScreen = ({
  otherFirstName,
  onStart,
  onLater,
}: CheckinIntroScreenProps) => {
  const staffContact = useCurrentUserStaffContact();
  const INTRO_POINTS = [
    'On vous proposera une suite concrète, choisie selon ce que vous nous dites',
    `Si ça n'a pas marché, ${staffContact ? staffContact.name + ',' : ''} votre référent peut vous appeler pour en parler`,
    `Si le courant est bien passé, vous pourrez le dire à ${otherFirstName} en un clic`,
  ];

  return (
    <StyledCheckinIntroScreen>
      <LucidIcon name="Footprints" color={COLORS.primaryBlue} size={72} />
      <Text size="xxlarge" weight="semibold" center>
        Un mois d’échanges avec {otherFirstName}, comment ça se passe ?
      </Text>
      <Text center>
        Trois minutes pour faire le point. On vous propose ensuite la suite la
        plus utile.
      </Text>
      <Card>
        <StyledCheckinIntroList>
          {INTRO_POINTS.map((point) => (
            <StyledCheckinIntroListItem key={point}>
              <LucidIcon name="Check" color={COLORS.primaryBlue} />
              <Text>{point}</Text>
            </StyledCheckinIntroListItem>
          ))}
        </StyledCheckinIntroList>
      </Card>
      <StyledCheckinIntroActions>
        <Button onClick={onStart} size="large">
          Faire le bilan
        </Button>
        <Button variant="text" onClick={onLater}>
          Plus tard
        </Button>
      </StyledCheckinIntroActions>
    </StyledCheckinIntroScreen>
  );
};
