import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { SvgIcon } from '@/assets/icons/icons';
import { Grid } from '@/src/components/ui';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledShareButton } from './SharePartial.styles';

const uuidValue = uuid();

export const SharePartial = ({ padding }: { padding?: boolean }) => {
  const { asPath } = useRouter();

  const isCVPage = asPath.includes('/cv');

  return (
    <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      <Grid center>
        {[
          {
            picto: <SvgIcon name="Facebook" />,
            href: 'https://www.facebook.com/entouragereseaupro/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            picto: <SvgIcon name="Twitter" />,
            href: 'https://x.com/Entourage__Pro',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_TWITTER_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_TWITTER_CLIC,
          },
          {
            picto: <SvgIcon name="LinkedIn" />,
            href: 'https://www.linkedin.com/company/entouragepro/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
          {
            picto: <SvgIcon name="Instagram" />,
            href: 'https://www.instagram.com/entourage_pro/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_INSTAGRAM_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC,
          },
          {
            picto: <SvgIcon name="Youtube" />,
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
                {share.picto}
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
