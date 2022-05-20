import React from 'react';
import { Img, Section, Grid } from 'src/components/utils';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-augustin-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review:
      'Par son expérience, il apporte quelque chose de radicalement différent. Si je pouvais embaucher 2 Kenny, je le ferais !',
  },
  {
    image: '/static/img/temoignage-entreprise-francois-miah.jpg',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    companyInfo: '31 salariés',
    review:
      'Avec Miah c’est une réussite. Là où notre compétence s’arrête, on est rassurés par le fait que LinkedOut est là pour nous accompagner. Si on peut s’inscrire dans des actions comme celles-ci tout en gardant notre efficacité, en y ajoutant le sourire de quelqu’un qui a envie, on le fait !',
  },
  {
    image: '/static/img/temoignage-entreprise-advens.jpg',
    author: 'Sylvie Lepoutre',
    authorStatus: 'Raison d’être & Projet d’entreprise',
    company: 'Advens',
    companyInfo: 'partenaire LinkedOut',
    review:
      'Nous étions à mille lieux des problématiques des personnes en précarité. Maintenant, chez Advens, on entend des mots comme “résilience”, “deuxième chance”, “rebond”, “inclusion”. Les collaborateurs sont très fiers !',
  },
  {
    image: '/static/img/temoignage-candidat-amelie.jpg',
    author: 'Amélie',
    authorStatus: 'Ancienne candidate LinkedOut',
    review:
      "C'est vraiment un bon dispositif. Avec mon coach, on ne parle pas simplement du travail, il me donne des conseils. Ce sont des choses dont j'avais besoin, surtout que je n'ai pas de famille ici. J'ai parcouru beaucoup d'autres dispositifs et là c'est différent, LinkedOut est très présent.",
  },
];

const Reviews = () => {
  return (
    <Section id="reviews" style="default">
      <h3 className="uk-text-bold uk-text-left uk-margin-medium-bottom uk-margin-remove-top">
        Ce que LinkedOut <span className="uk-text-primary">leur a apporté</span>
      </h3>
      <div className="uk-flex uk-flex-center" uk-height-match=".review-card">
        <Grid center middle match gap="medium" childWidths={['1-2@m']}>
          {reviews.map(
            (
              {
                author,
                authorStatus,
                company,
                industry,
                companyInfo,
                review,
                image,
              },
              index
            ) => {
              return (
                <div
                  key={index}
                  uk-scrollspy={`cls:uk-animation-slide-bottom-small; delay: ${
                    100 * index
                  };`}
                  className="review-card uk-flex uk-flex-column uk-card uk-card-large uk-card-default uk-card-body uk-box-shadow-medium uk-background-muted"
                >
                  <Img src={image} alt={author} />
                  <div className="uk-margin-medium-top">
                    <Img
                      alt="guillemets"
                      width="27"
                      height="21"
                      src="/static/img/guillemets.png"
                    />
                    <p className="uk-text-small uk-margin-small uk-text-italic">
                      {review}
                    </p>
                    <div
                      className="uk-text-bottom"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Img
                        alt="guillemets-petits"
                        width="15"
                        height="12"
                        src="/static/img/guillemetsPetits.png"
                      />
                    </div>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {author}
                    </p>
                    {authorStatus && (
                      <p className="uk-margin-remove">{authorStatus}</p>
                    )}
                    <p className="uk-text-meta uk-margin-remove">
                      <span className="uk-text-bold">{company}</span>
                      {industry && <span>,&nbsp;{industry}</span>}
                      {companyInfo && <span>,&nbsp;{companyInfo}</span>}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </Grid>
      </div>
    </Section>
  );
};

export default Reviews;
