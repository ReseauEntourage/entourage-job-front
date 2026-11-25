import React from 'react';
import { Button, Card, LucidIcon, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from '@/src/lib/gtag';
import {
  useDismissDonationBlockMutation,
  useGetDonationBlockQuery,
} from '@/src/use-cases/donation-block';
import { DONATION_URL } from './DashboardDonationBlock.constants';
import {
  StyledDonationBlockAction,
  StyledDonationBlockClose,
  StyledDonationBlockContainer,
  StyledDonationBlockIcon,
  StyledDonationBlockLayout,
  StyledDonationBlockText,
} from './DashboardDonationBlock.styles';

/**
 * Invitation to support Entourage with a donation, shown on the dashboard
 * until the user closes it for good (visibility is decided by the API).
 */
export const DashboardDonationBlock = () => {
  const { role } = useAuthenticatedUser();
  const { data } = useGetDonationBlockQuery();
  const [dismissDonationBlock] = useDismissDonationBlockMutation();

  if (!data?.visible) {
    return null;
  }

  // The role is the only dimension of the measure: no user identifier is sent
  const handleDonate = () => {
    gaEvent({
      action: GA_TAGS.BACKOFFICE_DASHBOARD_DONATION_BLOCK_CLIC.action,
      label: role,
    });
  };

  const handleDismiss = () => {
    gaEvent({
      action: GA_TAGS.BACKOFFICE_DASHBOARD_DONATION_BLOCK_FERMER.action,
      label: role,
    });
    void dismissDonationBlock();
  };

  return (
    <Card dataTestId="dashboard-donation-block">
      <StyledDonationBlockContainer>
        <StyledDonationBlockClose
          variant="text"
          size="small"
          color={COLORS.darkGray}
          ariaLabel="Ne plus afficher ce message"
          icon={<LucidIcon name="X" />}
          onClick={handleDismiss}
        />
        <StyledDonationBlockLayout>
          <StyledDonationBlockIcon aria-hidden="true">
            <LucidIcon name="Heart" size={24} color={COLORS.orangeSocial} />
          </StyledDonationBlockIcon>
          <StyledDonationBlockText>
            <Text size="large" weight="semibold">
              Entourage vit grâce à vous
            </Text>
            <Text color="darkGray">
              Entourage est une association financée par la générosité du
              public. Vous pouvez nous soutenir en faisant un don.
            </Text>
          </StyledDonationBlockText>
          <StyledDonationBlockAction>
            <Button
              variant="secondary"
              rounded
              href={DONATION_URL}
              isExternal
              newTab
              onClick={handleDonate}
            >
              Faire un don
            </Button>
          </StyledDonationBlockAction>
        </StyledDonationBlockLayout>
      </StyledDonationBlockContainer>
    </Card>
  );
};
