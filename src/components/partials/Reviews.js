import React from 'react';
import { Img, Section, Grid } from 'src/components/utils';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-augustin-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review: (
      <>
        Par son expérience,{' '}
        <span className="uk-text-primary">
          il apporte quelque chose de radicalement différent.
        </span>{' '}
        Si je pouvais embaucher 2 Kenny, je le ferais&nbsp;!
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-francois-miah.jpg',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    companyInfo: '31 salariés',
    review: (
      <>
        Avec Miah c’est une réussite. Là où notre compétence s’arrête, on est
        rassurés par le fait que{' '}
        <span className="uk-text-primary">
          LinkedOut est là pour nous accompagner .
        </span>
        Si on peut s’inscrire dans des actions comme celles-ci tout en gardant
        notre efficacité, en y ajoutant le sourire de quelqu’un qui a envie, on
        le fait&nbsp;!
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-advens.jpg',
    author: 'Sylvie Lepoutre',
    authorStatus: 'Raison d’être & Projet d’entreprise',
    company: 'Advens',
    industry: 'partenaire LinkedOut',
    review: (
      <>
        Nous étions à mille lieux des problématiques des personnes en précarité.{' '}
        <span className="uk-text-primary">
          Maintenant, chez Advens, on entend des mots comme “résilience”,
          “deuxième chance”, “rebond”, “inclusion”.
        </span>{' '}
        Les collaborateurs sont très fiers !
      </>
    ),
  },
  {
    image: '/static/img/temoignage-candidat-amelie.jpg',
    author: 'Amélie',
    authorStatus: 'Ancienne candidate LinkedOut',
    review: (
      <>
        C&apos;est vraiment un bon dispositif. Avec mon coach, on ne parle pas
        simplement du travail, il me donne des conseils. Ce sont des choses dont
        j&apos;avais besoin, surtout que je n&apos;ai pas de famille ici.{' '}
        <span className="uk-text-primary">
          J&apos;ai parcouru beaucoup d&apos;autres dispositifs et là c&apos;est
          différent, LinkedOut est très présent
        </span>
        .
      </>
    ),
  },
];

const Reviews = () => {
  return (
    <Section id="reviews" style="default" container="small">
      <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Ce que LinkedOut <span className="uk-text-primary">leur a apporté</span>
      </h2>
      <div
        className="uk-flex uk-flex-center"
        uk-height-match=".ent-review-card"
      >
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
                    200 + index * 200
                  };`}
                  className="ent-review-card uk-flex uk-flex-row uk-card uk-card-medium uk-card-default uk-card-body uk-box-shadow-medium uk-border-rounded"
                >
                  <div className="uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-margin-small-bottom">
                      <div
                        className="uk-cover-container uk-margin-small-right uk-border-rounded"
                        style={{ width: 75, height: 75 }}
                      >
                        <Img src={image} alt={author} cover />
                      </div>
                      <div className="uk-flex-1 uk-margin-small-left uk-text-small">
                        <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                          {author}
                        </p>
                        {authorStatus && (
                          <p className="uk-margin-remove uk-text-italic">
                            {authorStatus}
                          </p>
                        )}
                        <p className="uk-text-meta uk-margin-remove uk-text-italic">
                          <span className="uk-text-bold">{company}</span>
                          {industry && <span>,&nbsp;{industry}</span>}
                          {companyInfo && (
                            <>
                              <br />
                              <span className="uk-text-lighter">
                                {companyInfo}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="uk-flex uk-flex-column uk-flex-center uk-margin-small-top">
                      <p className="uk-margin-remove uk-text-bold">
                        &laquo;&nbsp;{review}&nbsp;&raquo;
                      </p>
                    </div>
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
