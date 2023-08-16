import React, { useMemo } from 'react';
import { formAddOpportunity } from 'src/components/forms/schemas/formAddOpportunity';
import { CV_COLORS } from '../PageCvContent/PageCVContent.styles';
import { CV } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { PostOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { Button } from 'src/components/utils';
import { H3, H5 } from 'src/components/utils/Headings';
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

  const opportunityModalProps = useMemo(() => {
    return {
      modalTitle: 'Proposer une opportunité à un candidat',
      modalDesc: (
        <div className="uk-text-normal">
          Contactez ici le candidat et son coach LinkedOut afin de solliciter un
          échange.
          <br />
          <br />
          Si vous souhaitez échanger avec le coach bénévole qui accompagne le
          candidat dans sa recherche d&apos;emploi, précisez-le dans votre
          message.
          <br />
          <br />
          <span className="uk-text-meta uk-text-italic">
            LinkedOut est susceptible de transmettre cette opportunité à
            d&apos;autres candidats dont le profil correspond à votre besoin.
          </span>
        </div>
      ),
      defaultValues: {
        candidatesIds: [
          {
            label: `${cv.user.candidat.firstName} ${cv.user.candidat.lastName}`,
            value: cv.UserId,
          },
        ],
        isPublic: false,
      },
      formSchema: formAddOpportunity,
    };
  }, [cv]);

  return (
    <StyledCVCTA>
      <H3
        title={`Donnez un coup de pouce à ${
          cv?.user?.candidat?.firstName
        }${' '}!`}
        center
        color={CV_COLORS.titleGray}
      />
      <StyledCVCTAContainer>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={3}>
          <H5
            title="Partagez son CV sur vos réseaux :"
            center
            color="darkGrayFont"
          />
          <p>Et offrez lui une visibilité qui peut tout changer.</p>
          <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
        </StyledCVCTACard>
        <CVSendMessage cv={cv} actionDisabled={actionDisabled} />
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={2}>
          <H5 title="Vous recrutez&nbsp;?" center color="darkGrayFont" />
          <p>
            Si vous avez une offre qui correspond au profil de{' '}
            {cv?.user?.candidat?.firstName}, envoyez-lui.
          </p>
          <Button
            style="custom-secondary"
            disabled={actionDisabled}
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_CV_PROPOSER_OFFRE_CLIC);
              fbEvent(FB_TAGS.COMPANY_CV_OFFER_OPEN);
              openModal(<PostOpportunityModal {...opportunityModalProps} />);
            }}
          >
            Proposer une offre
          </Button>
        </StyledCVCTACard>
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
