import React from 'react';
import { Section, Img, SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';

export const AnnouncementPartial = () => {
  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <SimpleLink href={EXTERNAL_LINKS.ARTICLE_RDR} isExternal target="_blank">
        <Img
          width={1440}
          height={420}
          src="/static/img/home_announcement_banner.jpg"
          alt="Victoire Transat Jacques Vabre"
        />
      </SimpleLink>
    </Section>
  );
};
