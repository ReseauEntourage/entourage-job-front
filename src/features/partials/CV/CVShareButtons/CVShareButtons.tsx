import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  XShareButton,
} from 'react-share';
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
          <svg
            width={40}
            height={40}
            viewBox="0 0 448 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
              fill="#0A66C2"
            />
          </svg>
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
        hashtag="#EntouragePro"
      >
        <StyledCVShareButton>
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
              fill="#1877F2"
            />
          </svg>
        </StyledCVShareButton>
      </FacebookShareButton>
      <XShareButton
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
      >
        <StyledCVShareButton>
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="#000000"
            />
          </svg>
        </StyledCVShareButton>
      </XShareButton>
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
          <svg
            width={40}
            height={40}
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"
              fill="#25D366"
            />
          </svg>
        </StyledCVShareButton>
      </WhatsappShareButton>
    </StyledCVShareButtonsContainer>
  );
};
