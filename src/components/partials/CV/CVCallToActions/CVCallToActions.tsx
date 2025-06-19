import React from 'react';
import { PublicUser } from 'src/api/types';
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
  publicUser: PublicUser;
  actionDisabled?: boolean;
}

export const CVCallToActions = ({
  publicUser,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();

  return (
    <StyledCVCTA>
      <H3
        title={`Donnez un coup de pouce à ${publicUser.firstName} !`}
        center
        color={COLORS.black}
      />
      <StyledCVCTAContainer>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={3}>
          <H5 title="Partagez son CV sur vos réseaux" center color="darkGray" />
          <p>Et offrez lui une visibilité qui peut tout changer.</p>
          <CVShareButtons
            publicProfile={publicUser}
            actionDisabled={actionDisabled}
          />
        </StyledCVCTACard>
        <CVSendMessage
          publicUser={publicUser}
          actionDisabled={actionDisabled}
        />
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
