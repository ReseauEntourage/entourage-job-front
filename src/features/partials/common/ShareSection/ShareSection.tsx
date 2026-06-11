import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Grid, Section } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledShareButton } from './ShareSection.styles';

const uuidValue = uuid();

export const ShareSection = () => {
  const { asPath } = useRouter();

  const isCVPage = asPath.includes('/cv');

  const iconProps = {
    width: 28,
    height: 28,
    color: COLORS.white,
  };

  return (
    <Section style="muted" size="small">
      <Grid center>
        {[
          {
            picto: <SvgIcon name="Instagram" {...iconProps} />,
            href: 'https://www.instagram.com/entourage_asso/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_INSTAGRAM_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC,
          },
          {
            picto: <SvgIcon name="Facebook" {...iconProps} />,
            href: 'https://www.facebook.com/entouragereseaupro/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            picto: <SvgIcon name="Youtube" {...iconProps} />,
            href: 'https://www.youtube.com/channel/UCrr8eUOmw6bAr8ycC3Zua7g',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_YOUTUBE_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_YOUTUBE_CLIC,
          },
          {
            picto: <SvgIcon name="LinkedIn" {...iconProps} />,
            href: 'https://www.linkedin.com/company/entouragepro/',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
        ].map((share, key) => {
          return (
            <a
              key={`${key}-${uuidValue}`}
              href={share.href}
              target="_blank"
              rel="noopener noreferrer"
            >
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
    </Section>
  );
};
