import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import AssociationEntourage from 'src/components/partials/AssociationEntourage';
import Partners from 'src/components/partials/Partners';
import Button from 'src/components/utils/Button';
import { EXTERNAL_LINKS } from 'src/constants';
import { gaEvent } from 'src/lib/gtag.ts';
import { GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import PropTypes from 'prop-types';
import ModalInterestLinkedOut from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { openModal } from 'src/components/modals/Modal';

const pages = [
  {
    title: 'Notre mission',
    children: [
      {
        title: 'Pourquoi LinkedOut ?',
        path: '/linkedout',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_POURQUOI_LINKEDOUT_CLIC);
          },
        },
      },
      {
        title: 'Nos partenaires',
        path: '/partenaires',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_VOIR_PARTENAIRES_CLIC);
          },
        },
      },
      /*
        {
          title: 'Notre histoire',
          path: '/histoire',
        },
      */
      {
        title: 'Devenir partenaire',
        props: {
          isExternal: true,
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_DEVENIR_PARTENAIRE_CLIC);
            openModal(<ModalInterestLinkedOut />);
          },
        },
      },
      /*
        {
          title: 'Nos résultats',
          path: '/resultats',
        },
      */
    ],
  },
  {
    title: "S'engager",
    children: [
      {
        title: 'Entreprises',
        path: '/entreprises',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_ENTREPRISES_CLIC);
          },
        },
        children: [
          {
            title: 'Engager mon entreprise',
            path: '/entreprises/sinformer',
            props: {
              onClick: () => {
                gaEvent(GA_TAGS.FOOTER_ENTREPRISES_ENGAGER_CLIC);
              },
            },
          },
          {
            title: 'Recruter',
            path: '/entreprises/cvs',
            props: {
              onClick: () => {
                gaEvent(GA_TAGS.FOOTER_ENTREPRISES_RECRUTER_CLIC);
              },
            },
          },
        ],
      },
      {
        title: 'Particuliers',
        path: '/aider',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_AIDER_CLIC);
          },
        },
      },

      {
        title: 'Travailleurs sociaux',
        path: '/orienter',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_ORIENTER_CLIC);
          },
        },
      },
      {
        title: 'Candidats',
        path: '/travailler',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_TRAVAILLER_CLIC);
          },
        },
      },
    ],
  },
  /* {
    title: 'Territoires',
    children: [
      {
        title: 'Paris',
        path: '/paris',
      },
      {
        title: 'Lyon',
        path: '/lyon',
      },
      {
        title: 'Lille',
        path: '/lille',
      },
    ],
  }, */
  {
    children: [
      {
        title: 'Contact',
        path: '/contact',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_CONTACT_CLIC);
          },
        },
      },
      {
        title: 'Nous soutenir',
        path: process.env.DONATION_LINK,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_DON_CLIC);
          },
          target: '_blank',
        },
      },
      /*   {
        title: 'Presse',
        path: '/presse',
      }, */
      {
        title: 'Recrutement',
        path: EXTERNAL_LINKS.RECRUITMENTS,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_RECRUITMENTS_CLIC);
          },
          target: '_blank',
        },
      },
      {
        title: 'Actualités',
        path: EXTERNAL_LINKS.LKO_BLOG,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_BLOG_LINKEDOUT_CLIC);
          },
          target: '_blank',
        },
      },
      {
        title: 'Association Entourage',
        path: EXTERNAL_LINKS.ENTOURAGE,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
          },
          target: '_blank',
        },
      },
      {
        component: (
          <Button
            href="/login"
            style="primary"
            className="uk-margin-medium-top"
          >
            Espace coach & candidat <IconNoSSR name="chevron-right" />
          </Button>
        ),
      },
    ],
  },
];

const SiteMap = ({ isMobile }) => {
  return (
    <Grid
      row
      center
      gap="large"
      childWidths={['1-3@m']}
      className={isMobile ? 'uk-hidden@m' : 'uk-visible@m'}
    >
      {pages.map(({ title, children }, index) => {
        return (
          <div
            key={title + index}
            className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom"
          >
            <div
              className={`uk-flex uk-flex-column ${
                isMobile ? 'uk-flex-middle' : ''
              }`}
            >
              {title && (
                <span className="uk-text-bold ent-site-map">{title}</span>
              )}
              {children &&
                children.map(
                  (
                    {
                      component: childrenComponent,
                      title: childrenTitle,
                      path: childrenPath,
                      children: childrenChildren,
                      props: childrenProps = {},
                    },
                    childrenIndex
                  ) => {
                    if (childrenComponent) {
                      return (
                        <div
                          key={`component${childrenIndex}`}
                          className="ent-site-map"
                        >
                          {childrenComponent}
                        </div>
                      );
                    }
                    return (
                      <React.Fragment key={childrenPath + index}>
                        <SimpleLink
                          href={childrenPath}
                          className={
                            title
                              ? 'uk-text-muted uk-margin-small-top'
                              : 'uk-text-bold ent-site-map'
                          }
                          {...childrenProps}
                        >
                          {childrenTitle}
                        </SimpleLink>
                        {childrenChildren &&
                          childrenChildren.map(
                            (
                              {
                                title: childrenChildrenTitle,
                                path: childrenChildrenPath,
                                props: childrenChildrenProps = {},
                              },
                              childrenChildrenIndex
                            ) => {
                              return (
                                <SimpleLink
                                  key={
                                    childrenChildrenPath + childrenChildrenIndex
                                  }
                                  href={childrenChildrenPath}
                                  className={`${
                                    isMobile ? '' : 'uk-margin-small-left'
                                  } uk-text-small uk-text-muted uk-margin-small-top`}
                                  {...childrenChildrenProps}
                                >
                                  {childrenChildrenTitle}
                                </SimpleLink>
                              );
                            }
                          )}
                      </React.Fragment>
                    );
                  }
                )}
            </div>
          </div>
        );
      })}
    </Grid>
  );
};

SiteMap.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

const Footer = () => {
  const { pathname } = useRouter();

  const showAssociationEntourage = !pathname.includes('/entreprises');

  return (
    <footer id="footer">
      {pathname === '/' && <Partners />}
      {showAssociationEntourage && <AssociationEntourage />}
      <Section style="secondary" size="small" container="large" preserveColor>
        <Grid middle center column childWidths={['1-1']} gap="medium">
          {pathname === '/' && (
            <div className="uk-text-center uk-light">
              <p>
                LinkedOut est un est un projet porté par l&apos;association
                Entourage, qui permet l’accompagnement des personnes les plus
                précaires ou en situation d’exclusion pour un retour à l’emploi.
                LinkedIn soutient la mission et les valeurs véhiculées par ce
                dispositif, et a contribué au lancement de ce projet en ayant
                accordé une utilisation limitée de sa marque LinkedOut par le
                biais d’une licence.
              </p>
            </div>
          )}
          <SiteMap isMobile />
          <SiteMap isMobile={false} />
          <Grid row center middle gap="medium">
            <SimpleLink
              isExternal
              target="_blank"
              className="uk-text-small uk-text-muted"
              href={EXTERNAL_LINKS.LEGAL_MENTIONS}
            >
              Mentions légales
            </SimpleLink>
            <SimpleLink
              isExternal
              className="uk-text-small uk-text-muted"
              href="#cookies"
            >
              Gestion des cookies
            </SimpleLink>
          </Grid>
        </Grid>
      </Section>
    </footer>
  );
};

export default Footer;
