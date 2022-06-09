import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'src/components/utils/Grid';
import SimpleLink from 'src/components/utils/SimpleLink';
import { gaEvent } from 'src/lib/gtag';
import { GA_TAGS } from 'src/constants/tags';
import { addPrefix } from 'src/utils';
import Carousel from 'src/components/utils/Carousel';

const Logo = ({ logoKey, link, bis }) => {
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
      <div
        className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
        style={{
          maxHeight: 100,
          backgroundImage: `url(${addPrefix(
            `/static/img/partners/${logoKey}/logo.png)`
          )}`,
        }}
      />
      {bis && (
        <div
          className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
          style={{
            maxHeight: 100,
            backgroundImage: `url(${addPrefix(
              `/static/img/partners/${logoKey}/logo_bis.png)`
            )}`,
          }}
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

const LogoList = ({ logos, carousel }) => {
  if (carousel) {
    return (
      <Carousel containerClasses="uk-child-width-auto" pagination={false}>
        {logos.map(({ key, link, bis }) => {
          return (
            <div
              key={key}
              className="uk-margin-medium-left uk-margin-medium-right"
            >
              <Logo logoKey={key} link={link} bis={bis} />
            </div>
          );
        })}
      </Carousel>
    );
  }
  return (
    <Grid
      childWidths={[`1-${Math.floor(logos.length / 3 + 1)}@m`, 'auto']}
      match
      middle
      center
      gap="small"
      items={logos.map(({ key, link, bis }) => {
        return <Logo key={key} logoKey={key} link={link} bis={bis} />;
      })}
    />
  );
};

LogoList.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      bis: PropTypes.bool,
    })
  ).isRequired,
  carousel: PropTypes.bool,
};

LogoList.defaultProps = {
  carousel: false,
};

export default LogoList;
