import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { LegacyImg, Section, Carousel } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { StyledPrimary } from '@/src/features/partials/common/PageText/PageText.styles';
import { CarouselItem } from '@/src/features/partials/utils/CarouselItem';
import {
  StyledTestimoniesCarousel,
  StyledTestimoniesVideo,
  StyledTestimonyAuthor,
  StyledTestimonyClosingQuote,
  StyledTestimonyQuote,
} from './CandidateTestimoniesOrientation.styles';

const testimonies = [
  {
    image: '/static/img/temoignage-candidat-jordan.jpg',
    author: 'Jordan, candidat',
    quote:
      "C'est une équipe joyeuse, qui donne de la joie, l'envie de se battre jusqu'au bout. Les personnes que j'ai rencontré ne m'ont pas fait ressentir qu’on était différent.",
  },
  {
    image: '/static/img/temoignage-candidat-danny.jpg',
    author: 'Danny, candidat',
    quote:
      'J’ai découvert que j’ignorais des choses sur mon CV, on m’a appris à me découvrir. Entourage Pro, c’est un GPS pour être humain ! Vous nous aidez à trouver notre chemin et à le construire sans pour autant le faire pour nous.',
  },
  {
    image: '/static/img/temoignage-candidat-amelie.jpg',
    author: 'Amélie, candidate',
    quote:
      "C'est vraiment un bon dispositif. Avec mon coach, on ne parle pas simplement du travail, il me donne des conseils. Ce sont des choses dont j'avais besoin, surtout que je n'ai pas de famille ici. J'ai parcouru beaucoup d'autres dispositifs et là c'est différent, Entourage Pro est très présent.",
  },
  {
    image: '/static/img/temoignage-candidat-lamin.jpg',
    author: 'Lamin, candidat',
    quote:
      'C’est très organisé, je suis très satisfait. La vie est compliquée mais on peut avancer grâce à Entourage Pro.',
  },
];

interface CandidateTestimoniesOrientationProps {
  style: 'muted' | 'default';
  noTitle?: boolean;
  noVideo?: boolean;
  title?: React.ReactNode;
}

export const CandidateTestimoniesOrientation = ({
  style,
  noVideo,
  noTitle,
  title,
}: CandidateTestimoniesOrientationProps) => {
  return (
    <Section style={style} container="small">
      {!noTitle && (
        <H2
          title={
            title || (
              <>
                Les candidats <StyledPrimary>témoignent</StyledPrimary>
              </>
            )
          }
          center
        />
      )}
      <StyledTestimoniesCarousel>
        <Carousel style="default">
          {testimonies.map(({ author, image, quote }, index) => {
            return (
              <CarouselItem
                key={index}
                index={index}
                img={image}
                description={
                  <div>
                    <LegacyImg
                      alt="guillemets"
                      width={27}
                      height={21}
                      src="/static/img/guillemets-bleu.png"
                    />
                    <StyledTestimonyQuote>{quote}</StyledTestimonyQuote>
                    <StyledTestimonyClosingQuote>
                      <LegacyImg
                        alt="guillemets-petits"
                        width={15}
                        height={12}
                        src="/static/img/guillemets-gris.png"
                      />
                    </StyledTestimonyClosingQuote>
                    <StyledTestimonyAuthor>{author}</StyledTestimonyAuthor>
                  </div>
                }
              />
            );
          })}
        </Carousel>
      </StyledTestimoniesCarousel>
      {!noVideo && (
        <StyledTestimoniesVideo>
          <LiteYouTubeEmbed
            id="ztZB4BIBi44"
            poster="maxresdefault"
            title="Témoignages Entourage Pro"
            aspectWidth={1280}
            aspectHeight={720}
            params="rel=0&showinfo=0&iv_load_policy=3"
          />
        </StyledTestimoniesVideo>
      )}
    </Section>
  );
};

CandidateTestimoniesOrientation.defaultProps = {
  noTitle: false,
  noVideo: false,
};
