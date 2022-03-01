import React from 'react';
import Layout from 'src/components/Layout';
import PARTNERS from 'src/constants/partners';
import Grid from 'src/components/utils/Grid';
import { Img, Section } from 'src/components/utils';
import { addPrefix, formatParagraph } from 'src/utils';
import Carousel from 'src/components/utils/Carousel';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import SimpleSection from 'src/components/partials/SimpleSection';
import SimpleLink from 'src/components/utils/SimpleLink';
import { gaEvent } from 'src/lib/gtag';
import { GA_TAGS } from 'src/constants/tags';
import { openModal } from 'src/components/modals/Modal';
import PropTypes from 'prop-types';

const viewportHeightWithoutHeader = 'calc(100vh - 80px)';
const viewportHeightWithoutHeaderAndPadding = 'calc(100vh - 220px)';

const CarouselSection = ({ children, partners, img }) => {
  return (
    <div
      className="uk-inline uk-cover-container uk-flex uk-flex-center uk-flex-middle"
      style={{ minHeight: viewportHeightWithoutHeader }}
    >
      <div
        className="uk-position-cover uk-background uk-background-cover uk-background-center-center"
        style={{
          backgroundImage: `url(${addPrefix(img)})`,
        }}
        uk-scrollspy="cls: uk-animation-kenburns uk-animation-reverse; delay: 200;"
      />
      <div
        className="uk-overlay-primary uk-position-cover"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      />
      <div className="uk-overlay uk-position-center">
        <Section
          size="large"
          style="muted"
          preserveColor
          className="uk-box-shadow-medium uk-padding-large uk-width-2xlarge@m"
        >
          <div uk-scrollspy="cls: uk-animation-fade; delay: 200;">
            <h2 className="uk-text-bold uk-align-center uk-text-center">
              {children}
            </h2>
            <div className="uk-width-expand">
              <div className="uk-container-small uk-flex uk-flex-center">
                <div className="uk-width-large">
                  <Carousel containerClasses="uk-child-width-1-1">
                    {partners.map(({ key, link }, index) => {
                      return (
                        <SimpleLink
                          isExternal
                          target="_blank"
                          href={link}
                          key={index}
                          className="uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-padding-large"
                        >
                          <div className="uk-width-medium uk-flex uk-flex-center uk-flex-middle">
                            <Img
                              src={`/static/img/partners/${key}/logo.png`}
                              width=""
                              height=""
                              alt=""
                              className="uk-height-max-small"
                            />
                          </div>
                        </SimpleLink>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

CarouselSection.propTypes = {
  children: PropTypes.element.isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  img: PropTypes.string.isRequired,
};

const Title = ({ children, overlay, inverse = false, img }) => {
  return (
    <div
      className="uk-inline uk-cover-container uk-flex uk-flex-center uk-flex-middle"
      style={{ minHeight: viewportHeightWithoutHeader }}
    >
      <div
        className="uk-position-cover uk-background uk-background-cover uk-background-center-center"
        style={{
          backgroundImage: `url("${addPrefix(img)}")`,
        }}
        uk-scrollspy="cls: uk-animation-kenburns uk-animation-reverse; delay: 200;"
      />
      <div className={`uk-overlay-${overlay} uk-position-cover`} />
      <div className="uk-overlay uk-position-center">
        <Section
          style={inverse ? 'secondary' : 'default'}
          preserveColor
          className="uk-box-shadow-medium"
        >
          <div uk-scrollspy="cls: uk-animation-fade; delay: 200;">
            <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-remove">
              {children}
            </h1>
          </div>
        </Section>
      </div>
    </div>
  );
};

Title.propTypes = {
  children: PropTypes.element.isRequired,
  overlay: PropTypes.string.isRequired,
  inverse: PropTypes.bool.isRequired,
  img: PropTypes.string.isRequired,
};

const PartnerItem = ({
  title,
  desc,
  question,
  answer,
  author,
  logoKey: key,
  bis,
  link,
  index,
}) => {
  const reverse = index % 2 !== 0;
  const firstDirection = reverse ? 'left' : 'right';
  const secondDirection = reverse ? 'right' : 'left';
  return (
    <Section style={index % 2 === 0 ? 'muted' : 'default'} key={index}>
      <div
        className="uk-flex uk-flex-center uk-flex-middle uk-overflow-hidden"
        uk-scrollspy="target: .animate; cls: uk-animation-fade; delay: 200;"
        style={{ minHeight: viewportHeightWithoutHeaderAndPadding }}
      >
        <SimpleLink
          className="animate uk-flex uk-flex-column uk-flex-center uk-flex-middle"
          isExternal
          target="_blank"
          href={link}
        >
          <h2 className="uk-text-primary uk-text-center uk-text-bold uk-margin-large-bottom">
            {title}
          </h2>
          <Grid
            eachWidths={['1-3@m', '2-3@m']}
            match
            middle
            center
            gap="large"
            reverse={reverse}
          >
            <div className="uk-flex uk-flex-middle uk-flex-center">
              <div className="uk-width-medium uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <Img
                  src={`/static/img/partners/${key}/logo.png`}
                  width=""
                  height=""
                  alt=""
                />
                {bis && (
                  <Img
                    src={`/static/img/partners/${key}/logo_bis.png`}
                    width=""
                    height=""
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="uk-flex uk-flex-column uk-flex-middle">
              <div
                className="animate uk-flex uk-flex-column"
                uk-scrollspy-class={`uk-animation-slide-${secondDirection}`}
              >
                <h4
                  className={`${
                    answer ? 'uk-margin-medium-bottom' : ''
                  } uk-text-${secondDirection}`}
                >
                  {formatParagraph(desc)}
                </h4>
              </div>
              {answer && <hr className="uk-divider-small" />}
              {answer && (
                <div
                  className={`uk-text-secondary animate uk-flex uk-flex-column uk-flex-stretch uk-margin-large-${secondDirection} uk-margin-medium-top`}
                  uk-scrollspy-class={`uk-animation-slide-${firstDirection}`}
                >
                  {question && (
                    <p
                      className={`uk-flex-1 uk-text-${secondDirection} uk-text-bold`}
                    >
                      {question}
                    </p>
                  )}
                  <div className="uk-flex">
                    <div className="uk-flex uk-flex-top">
                      <Img
                        alt=""
                        width="27"
                        height="21"
                        src="/static/img/guillemets.png"
                        className="uk-margin-small-right"
                      />
                    </div>
                    <div className="uk-flex-1">
                      <p
                        className={`uk-text-${firstDirection} uk-text-italic uk-margin-small-top uk-margin-small-bottom`}
                      >
                        {answer}
                      </p>
                      {author && (
                        <div
                          className={`uk-flex-1 uk-text-${firstDirection} uk-margin-small-top uk-text-secondary`}
                        >
                          <span className="uk-text-bold">{author.name}</span>,
                          &nbsp;{author.status}
                        </div>
                      )}
                    </div>
                    <div className="uk-flex uk-flex-bottom">
                      <Img
                        alt=""
                        width="15"
                        height="12"
                        src="/static/img/guillemetsPetits.png"
                        className="uk-margin-small-left"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </SimpleLink>
      </div>
    </Section>
  );
};

PartnerItem.propTypes = {
  desc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  bis: PropTypes.bool.isRequired,
  question: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  logoKey: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

const Partenaires = () => {
  return (
    <Layout title="Les partenaires - LinkedOut">
      <Title overlay="default" inverse img="/static/img/construct.jpg">
        <>
          <span className="uk-light">
            <span className="uk-text-primary">Ils construisent le projet</span>
          </span>{' '}
          <span className="uk-text-primary">avec nous</span>
        </>
      </Title>
      {PARTNERS.STRATEGY.map(
        ({ title, desc, question, answer, author, key, bis, link }, index) => {
          return (
            <PartnerItem
              title={title}
              desc={desc}
              question={question}
              answer={answer}
              key={key}
              logoKey={key}
              bis={bis}
              link={link}
              author={author}
              index={index}
            />
          );
        }
      )}
      <CarouselSection
        img="/static/img/partners.jpg"
        partners={PARTNERS.YOUNG_FINANCE}
      >
        <>
          Nos partenaires sur le projet{' '}
          <span className="uk-text-primary">LinkedOut Jeunes</span>
        </>
      </CarouselSection>
      <CarouselSection
        img="/static/img/partners.jpg"
        partners={PARTNERS.ALL_FINANCE}
      >
        <>
          Nos partenaires <span className="uk-text-primary">financiers</span>
        </>
      </CarouselSection>
      <Title overlay="primary" inverse={false} img="/static/img/sports.jpg">
        <>
          Nos partenaires{' '}
          <span className="uk-text-primary">sportifs et visibilité</span>
        </>
      </Title>
      {PARTNERS.SPORTS.map(
        ({ title, desc, question, answer, author, key, bis, link }, index) => {
          return (
            <PartnerItem
              key={key}
              title={title}
              desc={desc}
              question={question}
              answer={answer}
              logoKey={key}
              bis={bis}
              link={link}
              author={author}
              index={index}
            />
          );
        }
      )}
      <CarouselSection
        img="/static/img/partners.jpg"
        partners={PARTNERS.ORIENTATION}
      >
        <>
          Nos partenaires <span className="uk-text-primary">opérationnels</span>
        </>
      </CarouselSection>
      <SimpleSection
        title={
          <>
            Rejoignez <span className="uk-text-primary">LinkedOut&nbsp;!</span>
          </>
        }
        text="Vous êtes intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec nous ? Contactez-nous pour devenir partenaire !"
        id="give"
        style="muted"
        button={{
          label: 'Nous écrire',
          onClick: () => {
            openModal(<ModalInterestLinkedOut />);
            gaEvent(GA_TAGS.PAGE_PARTENAIRES_NOUS_ECRIRE_CLIC);
          },
        }}
      />
    </Layout>
  );
};

export default Partenaires;
