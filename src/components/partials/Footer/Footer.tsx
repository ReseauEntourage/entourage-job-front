import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { PageType } from 'src/components/partials/Footer/Footer.type';
import { Grid, Section, SimpleLink, Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { EXTERNAL_LINKS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { AssociationEntourage } from './AssociationEntourage';

const pages: PageType = [
  {
    title: 'Notre mission',
    children: [
      {
        title: 'Pourquoi Entourage Pro ?',
        path: '/entourage-pro',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_POURQUOI_LINKEDOUT_CLIC);
          },
        },
      },
      {
        title: 'Nos partenaires',
        path: 'https://www.entourage.social/qui-sommes-nous/partenaires',
        props: {
          isExternal: true,
          newTab: true,
          target: '_blank',
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_VOIR_PARTENAIRES_CLIC);
          },
        },
      },
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
            path: '/candidats?employed=false',
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
        title: 'Associations',
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
            variant="primary"
            className="uk-margin-medium-top"
          >
            Espace coach & candidat
            <LucidIcon name="ChevronRight" />
          </Button>
        ),
      },
    ],
  },
];

const SiteMap = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <Grid
      row
      center
      gap="large"
      childWidths={['1-3@m']}
      className={isMobile ? 'uk-hidden@m' : 'uk-visible@m'}
    >
      {pages.map(({ title, children }) => {
        return (
          <div
            key={uuid()}
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
                  ({
                    component: childrenComponent,
                    title: childrenTitle,
                    path: childrenPath,
                    children: childrenChildren,
                    props: childrenType = {},
                  }) => {
                    if (childrenComponent) {
                      return (
                        <div key={uuid()} className="ent-site-map">
                          {childrenComponent}
                        </div>
                      );
                    }
                    if (!childrenPath) return null;
                    return (
                      <React.Fragment key={uuid()}>
                        <SimpleLink
                          href={childrenPath}
                          className={
                            title
                              ? 'uk-text-muted uk-margin-small-top'
                              : 'uk-text-bold ent-site-map'
                          }
                          {...childrenType}
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
                              childrenChildrenIndex: number
                            ) => {
                              if (childrenComponent) {
                                return (
                                  <div key={uuid()} className="ent-site-map">
                                    {childrenComponent}
                                  </div>
                                );
                              }
                              if (!childrenChildrenPath) return null;
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

export const Footer = () => {
  const { pathname } = useRouter();

  const showAssociationEntourage = !pathname.includes('/entreprises');

  return (
    <footer id="footer">
      {showAssociationEntourage && <AssociationEntourage />}
      <Section className="custom-secondary">
        <Grid middle center column childWidths={['1-1']} gap="medium">
          <div />
          <SiteMap isMobile />
          <SiteMap isMobile={false} />
          <Grid row center middle gap="medium">
            <SimpleLink
              className="uk-text-small uk-text-muted"
              href="/legal-notice"
            >
              Mentions légales
            </SimpleLink>

            <SimpleLink className="uk-text-small uk-text-muted" href="/cgu">
              Conditions Générales d&apos;Utilisation
            </SimpleLink>

            <SimpleLink
              className="uk-text-small uk-text-muted"
              href="/data-privacy"
            >
              Politique de confidentialité
            </SimpleLink>

            <SimpleLink className="uk-text-small uk-text-muted" href="/cookies">
              Politique de cookies
            </SimpleLink>
            <SimpleLink className="uk-text-small uk-text-muted" href="#cookies">
              Gestion des cookies
            </SimpleLink>
          </Grid>
        </Grid>
      </Section>
    </footer>
  );
};
