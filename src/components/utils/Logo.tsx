import Image from 'next/image';
import React from 'react';
import { SimpleLink } from 'src/components/utils/SimpleLink';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { addPrefix } from 'src/utils';

interface LogoProps {
  logoKey: string;
  link: string;
  bis?: boolean;
}

export const Logo = ({ logoKey, link, bis }: LogoProps) => {
  return (
    <SimpleLink
      className="uk-flex uk-flex-center"
      isExternal
      target="_blank"
      onClick={() => {
        gaEvent(GA_TAGS.FOOTER_PARTENAIRE_CLIC);
      }}
      key={logoKey}
      href={link}
    >
      <Image
        src={addPrefix(`/static/img/partners/${logoKey}/logo.png`)}
        objectFit="contain"
        objectPosition="center"
        width={150}
        height={100}
        alt={logoKey}
      />
      {bis && (
        <Image
          src={addPrefix(`/static/img/partners/${logoKey}/logo_bis.png`)}
          objectFit="contain"
          objectPosition="center"
          width={150}
          height={100}
          alt={logoKey}
        />
      )}
    </SimpleLink>
  );
};

Logo.defaultProps = {
  bis: undefined,
};
