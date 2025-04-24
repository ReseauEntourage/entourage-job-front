import React from 'react';
import { CV } from 'src/api/types';
import { H3, H5 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';

import {
  StyledCVCTA,
  StyledCVCTAContainer,
  StyledCVCTACard,
} from './CVCallToActions.styles';
import { CVSendMessage } from './CVSendMessage';
import { CVShareButtons } from './CVShareButtons';

interface CVCallToActionsProps {
  cv: CV;
  actionDisabled?: boolean;
}

export const CVCallToActions = ({
  cv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();

  return (
    <StyledCVCTA>
      <H3
        title={`Donnez un coup de pouce à ${cv?.user?.candidat?.firstName} !`}
        center
        color={COLORS.black}
      />
      <StyledCVCTAContainer>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={3}>
          <H5 title="Partagez son CV sur vos réseaux" center color="darkGray" />
          <p>Et offrez lui une visibilité qui peut tout changer.</p>
          <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
        </StyledCVCTACard>
        <CVSendMessage cv={cv} actionDisabled={actionDisabled} />
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
