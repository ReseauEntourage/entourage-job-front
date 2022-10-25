import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Grid } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import FacebookIcon from 'public/static/img/icons/facebook.svg';
import YoutubeIcon from 'public/static/img/icons/youtube.svg';
import InstaIcon from 'public/static/img/icons/instagram.svg';
import TwitterIcon from 'public/static/img/icons/twitter.svg';
import LinkedInIcon from 'public/static/img/icons/linked-in.svg';
import { uuid } from 'uuid/v4';
import { StyledShareButton } from 'src/components/partials/SharePartial/styles';

const SharePartial = ({ padding }) => {
  const router = useRouter();

  const isCVPage = router.asPath.includes('/cv');

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
            <a key={key + uuid} href={share.href} target="_blanck">
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

SharePartial.propTypes = {
  padding: PropTypes.bool,
};

SharePartial.defaultProps = {
  padding: false,
};

export default SharePartial;
