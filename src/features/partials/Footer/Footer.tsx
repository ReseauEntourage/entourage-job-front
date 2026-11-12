import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Grid, Section } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { EXTERNAL_LINKS } from '@/src/constants';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { AppVersion } from '@/src/features/partials/AppVersion';
import { PageType } from '@/src/features/partials/Footer/Footer.type';
import { gaEvent } from '@/src/lib/gtag';
import { AssociationEntourage } from './AssociationEntourage';
import {
  StyledFooterLegalLink,
  StyledFooterLoginButton,
  StyledSiteMapBoldLink,
  StyledSiteMapColumn,
  StyledSiteMapColumnContent,
  StyledSiteMapGrid,
  StyledSiteMapLink,
  StyledSiteMapSubLink,
  StyledSiteMapTitle,
  StyledSiteMaps,
} from './Footer.styles';

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
        path: '/entreprises/recruter-inclusif',
        props: {
          onClick: () => {
            gaEvent(GA_TAGS.FOOTER_ENTREPRISES_CLIC);
          },
        },
        children: [
          {
            title: 'Engager mon entreprise',
            path: '/entreprises/s-engager',
            props: {
              onClick: () => {
                gaEvent(GA_TAGS.FOOTER_ENTREPRISES_ENGAGER_CLIC);
              },
            },
          },
          {
            title: 'Recruter inclusif',
            path: '/entreprises/recruter-inclusif',
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
        path: '/candidat',
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
        path: process.env.NEXT_PUBLIC_DONATION_LINK,
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
          <StyledFooterLoginButton href="/login" variant="primary">
            Espace coach & candidat
            <LucidIcon name="ChevronRight" />
          </StyledFooterLoginButton>
        ),
      },
    ],
  },
];

const SiteMap = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <StyledSiteMapGrid
      row
      center
      gap="large"
      childWidths={['1-3@m']}
      $mobileOnly={isMobile}
    >
      {pages.map(({ title, children }) => {
        return (
          <StyledSiteMapColumn key={uuid()}>
            <StyledSiteMapColumnContent $centered={isMobile}>
              {title && (
                <StyledSiteMapTitle className="ent-site-map">
                  {title}
                </StyledSiteMapTitle>
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
                    if (!childrenPath) {
                      return null;
                    }
                    return (
                      <React.Fragment key={uuid()}>
                        {title ? (
                          <StyledSiteMapLink
                            href={childrenPath}
                            {...childrenType}
                          >
                            {childrenTitle}
                          </StyledSiteMapLink>
                        ) : (
                          <StyledSiteMapBoldLink
                            href={childrenPath}
                            className="ent-site-map"
                            {...childrenType}
                          >
                            {childrenTitle}
                          </StyledSiteMapBoldLink>
                        )}
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
                              if (!childrenChildrenPath) {
                                return null;
                              }
                              return (
                                <StyledSiteMapSubLink
                                  key={
                                    childrenChildrenPath + childrenChildrenIndex
                                  }
                                  href={childrenChildrenPath}
                                  $indent={!isMobile}
                                  {...childrenChildrenProps}
                                >
                                  {childrenChildrenTitle}
                                </StyledSiteMapSubLink>
                              );
                            }
                          )}
                      </React.Fragment>
                    );
                  }
                )}
            </StyledSiteMapColumnContent>
          </StyledSiteMapColumn>
        );
      })}
    </StyledSiteMapGrid>
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
          {/* One cell for both site maps: only one is displayed, so the cell is never empty. */}
          <StyledSiteMaps>
            <div>
              <SiteMap isMobile />
            </div>
            <div>
              <SiteMap isMobile={false} />
            </div>
          </StyledSiteMaps>
          <Grid row center middle gap="medium">
            <StyledFooterLegalLink href="/legal-notice">
              Mentions légales
            </StyledFooterLegalLink>

            <StyledFooterLegalLink href="/cgu">
              Conditions Générales d&apos;Utilisation
            </StyledFooterLegalLink>

            <StyledFooterLegalLink href="/data-privacy">
              Politique de confidentialité
            </StyledFooterLegalLink>

            <StyledFooterLegalLink href="/cookies">
              Politique de cookies
            </StyledFooterLegalLink>
            <StyledFooterLegalLink href="#cookies">
              Gestion des cookies
            </StyledFooterLegalLink>
          </Grid>
          <AppVersion />
        </Grid>
      </Section>
    </footer>
  );
};
