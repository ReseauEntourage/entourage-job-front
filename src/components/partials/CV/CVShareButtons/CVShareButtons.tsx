import React, { useCallback } from 'react';
import {
  StyledCVShareBUtton,
  StyledCVShareButtonsContainer,
} from './CVShareButtons.styles';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import FacebookIcon from 'public/static/img/icons/facebook.svg';
import LinkedInIcon from 'public/static/img/icons/linked-in.svg';
import TwitterIcon from 'public/static/img/icons/twitter.svg';
import WhatsappIcon from 'public/static/img/icons/whatsapp.svg';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { AnyToFix } from 'src/utils/Types';
import { ModalShareCV } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalShareCV';
import { openModal } from 'src/components/modals/Modal';
import { useRouter } from 'next/router';
import { useUpdateSharesCount } from 'src/hooks';

interface CVCallToActionsProps {
  cv: AnyToFix; // finish typing
  actionDisabled?: boolean;
}

export const CVShareButtons = ({
  cv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const updateSharesCount = useUpdateSharesCount();

  const openNewsletterModal = useCallback(() => {
    openModal(<ModalShareCV firstName={cv.user.candidat.firstName} />);
  }, [cv.user.candidat.firstName]);

  const { asPath } = useRouter();
  const hostname = process.env.SERVER_URL;
  const path = asPath.includes('?')
    ? asPath.slice(0, asPath.indexOf('?'))
    : asPath;
  const link = `${hostname}${path}`;
  const hashtags = ['LinkedOut'];
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  return (
    <StyledCVShareButtonsContainer>
      <LinkedinShareButton
        disabled={actionDisabled}
        onShareWindowClose={() => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_LINKEDIN_CLIC);
          fbEvent(FB_TAGS.SHARE_CV);
          updateSharesCount(cv.UserId, 'linkedin');
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
        onShareWindowClose={() => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC);
          fbEvent(FB_TAGS.SHARE_CV);
          updateSharesCount(cv.UserId, 'facebook');
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
        onShareWindowClose={() => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC);
          fbEvent(FB_TAGS.SHARE_CV);
          updateSharesCount(cv.UserId, 'twitter');
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
        onShareWindowClose={() => {
          gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC);
          fbEvent(FB_TAGS.SHARE_CV);
          updateSharesCount(cv.UserId, 'whatsapp');
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
