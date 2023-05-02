import Image from 'next/image';
import React from 'react';
import ImgSrc from 'public/static/img/travailler-participer.jpg';
import { Button, Section } from 'src/components/utils';
import { H2, H6 } from 'src/components/utils/Headings';
import { CheckListElement as CheckList } from 'src/components/utils/Lists';
import { useIsDesktop } from 'src/hooks/utils/usePlatforms';
import { StyledParticiper } from './Participer.styles';

export const Participer = ({ cta }: { cta: (label: string) => void }) => {
  const isDesktop = useIsDesktop();

  return (
    <Section className="custom-primary">
      <StyledParticiper>
        {isDesktop && (
          <div className="image-container">
            <Image
              src={ImgSrc}
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              alt="Binôme coach et candidat LinkedOut"
            />
          </div>
        )}
        <div className="text-container">
          <H2 title="LinkedOut vous donne accès à un nouveau réseau professionnel !" />
          <p>
            Ce programme gratuit vous accompagne à chaque étape de votre
            recherche d’emploi
          </p>
          {!isDesktop && (
            <div className="image-container-mobile">
              <Image
                src={ImgSrc}
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                alt="Binôme coach et candidat LinkedOut"
              />
            </div>
          )}
          <ul>
            <CheckList>
              <H6
                title="Un coach LinkedOut qui vous accompagne pendant 6 mois"
                data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                Le coach vous soutient à chaque étape de votre recherche
                d’emploi et pendant votre intégration en entreprise (1 rencontre
                / semaine).
              </p>
            </CheckList>
            <CheckList>
              <H6
                title="De nouvelles opportunités professionnelles"
                data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                Une large proposition d’offres d’emploi, de contacts et de
                conseils grâce à notre communauté d’entreprises et de citoyens
                engagés.
              </p>
            </CheckList>
            <CheckList>
              <H6
                title="Un CV qui vous ressemble et une nouvelle visibilité "
                data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                Le CV LinkedOut valorise votre parcours quel qu’il soit et vos
                qualités et vous rend visible auprès des entreprises grâce aux
                partages sur les réseaux sociaux professionnels.
              </p>
            </CheckList>
            <CheckList>
              <H6
                title="Des ateliers selon vos besoins"
                data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                Se préparer aux échanges professionnels, apprendre à activer son
                réseau, prendre confiance en soi, adopter la bonne posture en
                entretien etc.
              </p>
            </CheckList>
          </ul>
          <Button
            style="custom-secondary-inverted"
            onClick={() => cta('P1_Acces_Reseau')}
          >
            Participer au programme
          </Button>
        </div>
      </StyledParticiper>
    </Section>
  );
};
