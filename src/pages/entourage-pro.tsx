import PropTypes from 'prop-types';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { Chapter } from 'src/components/partials/common/Chapter';
import { Grid, Section } from 'src/components/utils';

const Card = ({ text, number }) => {
  return (
    <div
      key={number}
      data-uk-scrollspy={`cls:uk-animation-slide-bottom-small; delay: ${
        100 * number
      };`}
      className="uk-flex uk-card uk-card-small uk-card-primary uk-card-body uk-box-shadow-medium"
    >
      <div
        className="uk-text-bold uk-text-primary uk-text-large uk-margin-small-right"
        style={{ fontSize: 46, lineHeight: 1 }}
      >
        {number}
      </div>
      <div className="uk-text-primary uk-margin-small-left">{text}</div>
    </div>
  );
};

Card.propTypes = {
  text: PropTypes.element.isRequired,
  number: PropTypes.number.isRequired,
};

const innovations = [
  {
    text: (
      <div>
        Croire en la force du réseau&nbsp;: c&apos;est en mobilisant toute une
        communauté de citoyens engagés que nous pouvons booster l’accès à
        l’emploi des plus exclus.
      </div>
    ),
  },
  {
    text: (
      <div>
        Une approche fondée sur l’humain&nbsp;: assumer des parcours de vie
        compliqués et valoriser des qualités et compétences plutôt que de
        camoufler des “trous” dans des CV.
      </div>
    ),
  },
  {
    text: (
      <div>
        Proposer des formats adaptés aux différents besoins qui donnent aux
        coachs comme aux candidats un choix entre un engagement régulier ou plus
        ponctuel.
      </div>
    ),
  },
  {
    text: (
      <div>
        Développer la fibre solidaire des entreprises en leur permettant de
        sensibiliser leurs collaborateurs et d’oeuvrer pour le recrutement
        inclusif.
      </div>
    ),
  },
  {
    text: (
      <div>
        Une méthode de mobilisation inédite des citoyens et des recruteurs, via
        la communication grand public et la viralisation des CV.
      </div>
    ),
  },
];

const EntouragePro = () => {
  const tempInnovations = [...innovations];

  return (
    <Layout title="Pourquoi Entourage Pro ? - Entourage Pro">
      <Chapter
        style="default"
        title={<>Le réseau pro de celles et ceux qui n’en ont pas.</>}
        content={
          <>
            Alors que certains bénéficient déjà d&apos;un réseau professionnel
            et savent comment l&apos;utiliser pour trouver un emploi,
            d&apos;autres se retrouvent isolés. Sans réseau et en situation de
            précarité ou d’exclusion, les chances de trouver sa place dans le
            monde du travail sont quasi nulles.
            <br />
            <br />
            C’est la raison d’être d’Entourage Pro : le premier vrai réseau
            professionnel solidaire. Plus qu’une simple plateforme, c’est un
            véritable réseau professionnel solidaire et inclusif sur lequel les
            coachs et les candidats peuvent se créer un profil, profiter
            d’outils de mise en relation, de boîtes à outils dédiées ainsi que
            des conseils de notre staff. Notre ambition ? Mobiliser toute une
            communauté de citoyens engagés pour booster l’accès à l’emploi des
            plus exclus.
          </>
        }
        imgSrc="/static/img/why_1.jpg"
        animate
        direction="column"
      />
      <Chapter
        style="muted"
        title={<>1 réseau, 2 formats d’engagement</>}
        content={
          <>
            Entourage Pro, c’est 2 formats d’engagement, donc 2 façons
            d’accompagner et d’être accompagné qui donnent aux coachs comme aux
            candidats un choix entre un engagement régulier sur 6 mois et un
            engagement ponctuel pour une durée variable.
            <br />
            <br />
            Le Format 360 propose aux candidates et candidats:
            <ul>
              <li>
                un accompagnement personnalisé avec un ou une coach dédié(e), de
                la définition de son projet à l’aide dans ses recherches
              </li>
              <li>
                des temps en présentiel pour créer une vraie relation et
                favoriser les échanges (2h par semaine pendant 6 mois)
              </li>
            </ul>
            <br />
            Le Format Coup de pouce permet aux candidates et candidats de
            bénéficier du ou des soutiens de leur choix :
            <ul>
              <li>
                recevoir une aide ponctuelle de la part de différents coachs
              </li>
              <li>être accompagné(e) dans la création de son CV</li>
              <li>bénéficier de conseils pour préparer ses entretiens</li>
              <li>
                échanger avec des coachs sur leur expérience et leur réseau
              </li>
            </ul>
            <br />
            <br />
            Quelles que soient vos disponibilités et vos impératifs, nous avons
            le format qu’il vous faut&apos;!
          </>
        }
        imgSrc="/static/img/why_2.jpg"
        animate={false}
        direction="column"
      />
      <Chapter
        style="default"
        title={<>Entourage Pro, pour qui&nbsp;?</>}
        content={
          <>
            Entourage Pro est à destination des personnes en recherche d’emploi
            qui manquent de réseau et en situation de précarité et d’exclusion.
            <br />
            <br />
            Pour intégrer l’un de nos programmes, il faut :
            <ul>
              <li>être âgé de plus de 18 ans*</li>
              <li>
                être à la recherche d’un contrat de longue durée (CDI, CDD de
                plus de 6 mois et alternance)
              </li>
              <li>disposer du droit de travailler en France</li>
              <li>être domicilié dans le 35, 56, 59, 69, 75, 92, 93</li>
            </ul>
            <br />
            *Le format 360 s’adresse uniquement aux personnes âgées de 18 à 30
            ans.
          </>
        }
        imgSrc="/static/img/why_3.jpg"
        animate={false}
        direction="left"
      />
      <Chapter
        style="muted"
        title={
          <>
            Entourage Pro, une{' '}
            <span className="uk-text-primary">brique supplémentaire</span> dans
            l’écosystème de l’inclusion et l’emploi
          </>
        }
        content={
          <>
            Entourage Pro vise à agir en collaboration avec les acteurs du
            retour vers l’emploi en proposant une brique complémentaire à
            l’existant (acteurs sociaux publics et associatifs, structures
            d’insertion, structures d’hébergement, job-boards solidaires),
            fondée sur une approche réseau.
            <br />
            <br />
            Pour les personnes sortant de parcours d’insertion, il s’inscrit
            dans la continuité de l’accompagnement socio-professionnel réalisé
            en amont par les travailleurs sociaux et/ou les associations,
            essentiel à la réussite du projet.
          </>
        }
        imgSrc="/static/img/why_4.jpg"
        animate
        direction="right"
      />
      <Section container="small" style="default">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            Quelle est{' '}
            <span className="uk-text-primary">l&apos;innovation</span> de
            Entourage Pro&nbsp;?
          </h2>
          <Grid masonry top gap="medium" eachWidths={['1-3@m', '2-3@m']}>
            <Card
              key={0}
              text={tempInnovations.splice(0, 1)[0].text}
              number={1}
            />
            <Grid masonry top gap="medium" childWidths={['1-2@m']}>
              {tempInnovations.map(({ text }, index) => {
                return <Card key={index} text={text} number={index + 2} />;
              })}
            </Grid>
          </Grid>
        </div>
      </Section>
    </Layout>
  );
};

export default EntouragePro;
