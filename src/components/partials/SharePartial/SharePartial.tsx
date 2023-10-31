import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import FacebookIcon from 'assets/icons/facebook.svg';
import InstaIcon from 'assets/icons/instagram.svg';
import LinkedInIcon from 'assets/icons/linked-in.svg';
import TwitterIcon from 'assets/icons/twitter.svg';
import YoutubeIcon from 'assets/icons/youtube.svg';
import { StyledShareButton } from 'src/components/partials/SharePartial/SharePartial.styles';
import { Grid } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

const uuidValue = uuid();

export const SharePartial = ({ padding }: { padding?: boolean }) => {
  const { asPath } = useRouter();

  const isCVPage = asPath.includes('/cv');

  return (
    <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      <Grid center>
        {[
          {
            picto: FacebookIcon,
            href: 'https://www.facebook.com/linkedout.byentouragee',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            picto: TwitterIcon,
            href: 'https://twitter.com/LinkedOut',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_TWITTER_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_TWITTER_CLIC,
          },
          {
            picto: LinkedInIcon,
            href: 'https://www.linkedin.com/company/linkedout-byentourage',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
          {
            picto: InstaIcon,
            href: 'https://www.instagram.com/linkedout_byentourage',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_INSTAGRAM_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC,
          },
          {
            picto: YoutubeIcon,
            href: 'https://www.youtube.com/channel/UCrr8eUOmw6bAr8ycC3Zua7g',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_YOUTUBE_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_YOUTUBE_CLIC,
          },
        ].map((share, key) => {
          return (
            <a key={`${key}-${uuidValue}`} href={share.href} target="_blanck">
              <StyledShareButton
                onClick={() => {
                  gaEvent(share.tag);
                }}
              >
                <share.picto />
              </StyledShareButton>
            </a>
          );
        })}
      </Grid>
    </div>
  );
};

SharePartial.defaultProps = {
  padding: false,
};
