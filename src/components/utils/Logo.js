import React from 'react';
import SimpleLink from 'src/components/utils/SimpleLink';
import { gaEvent } from 'src/lib/gtag.ts';
import { GA_TAGS } from 'src/constants/tags';
import Image from 'next/image';
import { addPrefix } from 'src/utils';
import PropTypes from 'prop-types';

export const Logo = ({ logoKey, link, bis }) => {
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
          alt={bis}
        />
      )}
    </SimpleLink>
  );
};

Logo.propTypes = {
  logoKey: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  bis: PropTypes.bool,
};

Logo.defaultProps = {
  bis: undefined,
};
