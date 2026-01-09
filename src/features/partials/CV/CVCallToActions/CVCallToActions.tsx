import React from 'react';
import { H3, H5 } from '@/src/components/ui/Headings';
import { PublicCV } from 'src/api/types';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';

import {
  StyledCVCTA,
  StyledCVCTAContainer,
  StyledCVCTACard,
} from './CVCallToActions.styles';
import { CVShareButtons } from './CVShareButtons';

interface CVCallToActionsProps {
  publicCv: PublicCV;
  actionDisabled?: boolean;
}

export const CVCallToActions = ({
  publicCv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();

  return (
    <StyledCVCTA>
      <H3
        title={`Donnez un coup de pouce à ${publicCv.firstName} !`}
        center
        color={COLORS.black}
      />
      <StyledCVCTAContainer>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={3}>
          <H5 title="Partagez son CV sur vos réseaux" center color="darkGray" />
          <p>Et offrez lui une visibilité qui peut tout changer.</p>
          <CVShareButtons publicCV={publicCv} actionDisabled={actionDisabled} />
        </StyledCVCTACard>
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
