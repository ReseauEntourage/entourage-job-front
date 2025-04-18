import PropTypes from 'prop-types';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { SimpleSection } from 'src/components/partials/pages/Partenaires/SimpleSection';
import { LogoList } from 'src/components/partials/utils/LogoList';
import { Img, Section, SimpleLink, Grid } from 'src/components/utils';
import { PARTNERS } from 'src/constants/partners';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { addPrefix, formatParagraph } from 'src/utils';

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
      />
      <div
        className="uk-overlay-primary uk-position-cover"
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <div className="uk-overlay uk-position-center">
        <div>
          <h2 className="uk-text-bold uk-align-center uk-text-center">
            <mark>{children}</mark>
          </h2>
          {partners.length <= 5 ? (
            <>
              {partners.length < 5 ? (
                <LogoList logos={partners} padding background />
              ) : (
                <div className="uk-flex uk-flex-column uk-flex-middle">
                  <div className="uk-width-large@m">
                    <LogoList logos={partners} carousel padding background />
                  </div>
                </div>
              )}
            </>
          ) : (
            <LogoList logos={partners} carousel padding background />
          )}
        </div>
      </div>
    </div>
  );
};

CarouselSection.propTypes = {
  children: PropTypes.element.isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  img: PropTypes.string.isRequired,
};

interface TitleProps {
  children: React.ReactNode;
  overlay: string | null;
  img: string;
}

const Title = ({ children, overlay = null, img }: TitleProps) => {
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
      />
      <div className={`uk-overlay-${overlay} uk-position-cover`} />
      <div className="uk-overlay uk-position-center">
        <div>
          <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-remove">
            <mark>{children}</mark>
          </h1>
        </div>
      </div>
    </div>
  );
};

Title.propTypes = {
  children: PropTypes.element.isRequired,
  overlay: PropTypes.string.isRequired,
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
                  alt="key"
                  width={300}
                  height={300}
                />
                {bis && (
                  <Img
                    src={`/static/img/partners/${key}/logo_bis.png`}
                    alt="key"
                    width={300}
                    height={300}
                  />
                )}
              </div>
            </div>
            <div className="uk-flex uk-flex-column uk-flex-middle">
              <div className="animate uk-flex uk-flex-column">
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
                >
                  {question && (
                    <p
                      className={`uk-flex-1 uk-text-${secondDirection} uk-text-bold`}
                    >
                      {question}
                    </p>
                  )}
                  <div className="uk-flex">
                    <div className="uk-flex uk-flex-top uk-margin-small-right">
                      <Img
                        alt=""
                        width={27}
                        height={21}
                        src="/static/img/guillemets-bleu.png"
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
                    <div className="uk-flex uk-flex-bottom uk-margin-small-left">
                      <Img
                        alt=""
                        width={15}
                        height={12}
                        src="/static/img/guillemets-gris.png"
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
  bis: PropTypes.bool,
  question: PropTypes.string.isRequired,
  author: PropTypes.string,
  answer: PropTypes.string.isRequired,
  logoKey: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

PartnerItem.defaultProps = {
  bis: undefined,
  author: undefined,
};

const Partenaires = () => {
  return (
    <Layout title="Les partenaires - Entourage Pro">
      <Title overlay="primary" img="/static/img/construct.jpg">
        <>
          Ils construisent le projet{' '}
          <span className="uk-text-primary">avec&nbsp;nous</span>
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
        img="/static/img/meeting.jpg"
        partners={PARTNERS.YOUNG_FINANCE}
      >
        <>
          Nos partenaires sur le projet{' '}
          <span className="uk-text-primary">Entourage Pro Jeunes</span>
        </>
      </CarouselSection>
      <CarouselSection
        img="/static/img/business.jpg"
        partners={PARTNERS.ALL_FINANCE}
      >
        <>
          Nos partenaires <span className="uk-text-primary">financiers</span>
        </>
      </CarouselSection>
      <CarouselSection img="/static/img/sports.jpg" partners={PARTNERS.SPORTS}>
        <>
          Nos partenaires{' '}
          <span className="uk-text-primary">sportifs et visibilité</span>
        </>
      </CarouselSection>
      {/*
        TODO to put back when we have the right texts
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
      */}
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
            Rejoignez{' '}
            <span className="uk-text-primary">Entourage Pro&nbsp;!</span>
          </>
        }
        text="Vous êtes intéressé(e) par l’approche de Entourage Pro et souhaitez coopérer avec nous ? Contactez-nous pour devenir partenaire !"
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
