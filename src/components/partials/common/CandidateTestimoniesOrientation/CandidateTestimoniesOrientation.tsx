import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { CarouselItem } from 'src/components/partials/utils/CarouselItem';
import { Img, Section, Carousel } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';

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
                Les candidats{' '}
                <span className="uk-text-primary">témoignent</span>
              </>
            )
          }
          center
        />
      )}
      <div className="uk-flex uk-flex-center uk-margin-large-top">
        <Carousel
          style="default"
          containerClasses="uk-container-small uk-child-width-1-1"
        >
          {testimonies.map(({ author, image, quote }, index) => {
            return (
              <CarouselItem
                key={index}
                index={index}
                img={image}
                description={
                  <div>
                    <Img
                      alt="guillemets"
                      width={27}
                      height={21}
                      src="/static/img/guillemets-bleu.png"
                    />
                    <p className="uk-text-small uk-margin-small uk-text-italic">
                      {quote}
                    </p>
                    <div
                      className="uk-text-bottom"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Img
                        alt="guillemets-petits"
                        width={15}
                        height={12}
                        src="/static/img/guillemets-gris.png"
                      />
                    </div>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {author}
                    </p>
                  </div>
                }
              />
            );
          })}
        </Carousel>
      </div>
      {!noVideo && (
        <div className="uk-margin-medium-top">
          <LiteYouTubeEmbed
            id="ztZB4BIBi44"
            title="Témoignages Entourage Pro"
            aspectWidth={1280}
            aspectHeight={720}
            params="rel=0&showinfo=0&iv_load_policy=3"
          />
        </div>
      )}
    </Section>
  );
};

CandidateTestimoniesOrientation.defaultProps = {
  noTitle: false,
  noVideo: false,
};
