import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import FacebookIcon from 'assets/icons/facebook.svg';
import LinkedInIcon from 'assets/icons/linked-in.svg';
import TwitterIcon from 'assets/icons/twitter.svg';
import WhatsappIcon from 'assets/icons/whatsapp.svg';
import { PublicUser } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { ModalShareCV } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalShareCV';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCVShareBUtton,
  StyledCVShareButtonsContainer,
} from './CVShareButtons.styles';

interface CVShareButtonsProps {
  publicProfile: PublicUser;
  actionDisabled?: boolean;
}

export const CVShareButtons = ({
  publicProfile,
  actionDisabled = false,
}: CVShareButtonsProps) => {
  const openNewsletterModal = useCallback(() => {
    openModal(<ModalShareCV firstName={publicProfile.firstName} />);
  }, [publicProfile.firstName]);

  const { asPath } = useRouter();
  const hostname = process.env.NEXT_PUBLIC_SERVER_URL;
  const path = asPath.includes('?')
    ? asPath.slice(0, asPath.indexOf('?'))
    : asPath;
  const link = `${hostname}${path}`;
  const hashtags = ['EntouragePro'];
  const candidateExists = !!publicProfile;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec Entourage Pro, aidons ${publicProfile.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `Entourage Pro\xa0: Aidez ${publicProfile.firstName} à retrouver un emploi`
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
          // await updateSharesCount(publicProfile.id, 'linkedin');
          openNewsletterModal();
        }}
        url={link}
        title={title}
        summary={sharedDescription}
      >
        <StyledCVShareBUtton>
          <LinkedInIcon />
        </StyledCVShareBUtton>
      </LinkedinShareButton>
      <FacebookShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          // await updateSharesCount(publicProfile.id, 'facebook');
          openNewsletterModal();
        }}
        url={link}
        quote={sharedDescription}
        hashtags={hashtags}
      >
        <StyledCVShareBUtton>
          <FacebookIcon />
        </StyledCVShareBUtton>
      </FacebookShareButton>
      <TwitterShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          // await updateSharesCount(publicProfile.id, 'twitter');
          openNewsletterModal();
        }}
        url={link}
        title={sharedDescription}
        hashtags={hashtags}
        via="R_Entourage"
      >
        <StyledCVShareBUtton>
          <TwitterIcon />
        </StyledCVShareBUtton>
      </TwitterShareButton>
      <WhatsappShareButton
        disabled={actionDisabled}
        onClick={() => {
          fbEvent(FB_TAGS.SHARE_CV_OPEN);
        }}
        onShareWindowClose={async () => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC);
          fbEvent(FB_TAGS.SHARE_CV_SEND);
          // await updateSharesCount(publicProfile.id, 'whatsapp');
          openNewsletterModal();
        }}
        url={link}
        title={sharedDescription}
      >
        <StyledCVShareBUtton>
          <WhatsappIcon />
        </StyledCVShareBUtton>
      </WhatsappShareButton>
    </StyledCVShareButtonsContainer>
  );
};
