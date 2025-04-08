import React from 'react';
import { CV } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { PostPrivateOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal/PostPrivateOpportunityModal';
import { Button } from 'src/components/utils';
import { H3, H5 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

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
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={2}>
          <H5 title="Vous recrutez&nbsp;?" center color="darkGray" />
          <p>
            Si vous avez une offre qui correspond au profil de{' '}
            {cv?.user?.candidat?.firstName}, envoyez-lui.
          </p>
          <Button
            variant="secondary"
            rounded
            disabled={actionDisabled}
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_CV_PROPOSER_OFFRE_CLIC);
              fbEvent(FB_TAGS.COMPANY_CV_OFFER_OPEN);
              openModal(
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                <PostPrivateOpportunityModal
                  candidateId={cv.UserId}
                  candidateFirstName={cv.user.candidat.firstName}
                  candidateLastName={cv.user.candidat.lastName}
                />
              );
            }}
          >
            Proposer une offre
          </Button>
        </StyledCVCTACard>
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
