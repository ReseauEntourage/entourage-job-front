import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { SvgIcon } from '@/assets/icons/icons';
import { openModal } from '@/src/features/modals/Modal';
import { ModalShareCV } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalShareCV';
import { PublicCV } from 'src/api/types';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCVShareButton,
  StyledCVShareButtonsContainer,
} from './CVShareButtons.styles';

interface CVShareButtonsProps {
  publicCV: PublicCV;
  actionDisabled?: boolean;
}

export const CVShareButtons = ({
  publicCV,
  actionDisabled = false,
}: CVShareButtonsProps) => {
  const openNewsletterModal = useCallback(() => {
    openModal(<ModalShareCV firstName={publicCV.firstName} />);
  }, [publicCV.firstName]);

  const { asPath } = useRouter();
  const hostname = process.env.NEXT_PUBLIC_SERVER_URL;
  const path = asPath.includes('?')
    ? asPath.slice(0, asPath.indexOf('?'))
    : asPath;
  const link = `${hostname}${path}`;
  const hashtags = ['EntouragePro'];
  const candidateExists = !!publicCV;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec Entourage Pro, aidons ${publicCV.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `Entourage Pro\xa0: Aidez ${publicCV.firstName} à retrouver un emploi`
    : '';

  return (
    <StyledCVShareButtonsContainer>
      <LinkedinShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_LINKEDIN_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          openNewsletterModal();
        }}
        url={link}
        title={title}
        summary={sharedDescription}
      >
        <StyledCVShareButton>
          <SvgIcon name="LinkedIn" />
        </StyledCVShareButton>
      </LinkedinShareButton>
      <FacebookShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          openNewsletterModal();
        }}
        url={link}
        quote={sharedDescription}
        hashtags={hashtags}
      >
        <StyledCVShareButton>
          <SvgIcon name="Facebook" />
        </StyledCVShareButton>
      </FacebookShareButton>
      <TwitterShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          openNewsletterModal();
        }}
        url={link}
        title={sharedDescription}
        hashtags={hashtags}
        via="R_Entourage"
      >
        <StyledCVShareButton>
          <SvgIcon name="Twitter" />
        </StyledCVShareButton>
      </TwitterShareButton>
      <WhatsappShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          openNewsletterModal();
        }}
        url={link}
        title={sharedDescription}
      >
        <StyledCVShareButton>
          <SvgIcon name="Whatsapp" />
        </StyledCVShareButton>
      </WhatsappShareButton>
    </StyledCVShareButtonsContainer>
  );
};
