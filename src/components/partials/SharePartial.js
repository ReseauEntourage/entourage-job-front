import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, Grid } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { IconNoSSR } from 'src/components/utils/Icon';

const SharePartial = ({ showTitle, padding }) => {
  const router = useRouter();

  const isCVPage = router.asPath.includes('/cv');

  return (
    <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      {showTitle && <p className="uk-text-center">Suivez-nous sur :</p>}
      <Grid center>
        {[
          {
            name: 'facebook',
            title: 'Facebook',
            href: 'https://www.facebook.com/linkedout.byentouragee',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            name: 'twitter',
            title: 'Twitter',
            href: 'https://twitter.com/LinkedOut',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_TWITTER_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_TWITTER_CLIC,
          },
          {
            name: 'linkedin',
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/company/linkedout-byentourage',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
          {
            name: 'instagram',
            title: 'Instagram',
            href: 'https://www.instagram.com/linkedout_byentourage',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_INSTAGRAM_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC,
          },
          {
            name: 'youtube',
            title: 'Youtube',
            href: 'https://www.youtube.com/channel/UCrr8eUOmw6bAr8ycC3Zua7g',
            tag: isCVPage
              ? GA_TAGS.PAGE_CV_SUIVRE_SUR_YOUTUBE_CLIC
              : GA_TAGS.HOME_SUIVRE_SUR_YOUTUBE_CLIC,
          },
        ].map(({ name, title, href, tag }, key) => {
          return (
            <Button
              href={href}
              style="primary"
              isExternal
              newTab
              onClick={() => {
                gaEvent(tag);
              }}
              key={key}
            >
              {title}&nbsp;
              <IconNoSSR name={name} />
            </Button>
          );
        })}
      </Grid>
    </div>
  );
};

SharePartial.propTypes = {
  padding: PropTypes.bool,
  showTitle: PropTypes.bool,
};

SharePartial.defaultProps = {
  padding: false,
  showTitle: true,
};

export default SharePartial;
