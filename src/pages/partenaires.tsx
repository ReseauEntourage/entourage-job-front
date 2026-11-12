import PropTypes from 'prop-types';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { LegacyImg, Section, Grid } from '@/src/components/ui';
import { StyledDividerSmall } from '@/src/components/ui/DividerSmall.styles';
import { PARTNERS } from '@/src/constants/partners';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import {
  StyledBold,
  StyledPrimary,
} from '@/src/features/partials/common/PageText/PageText.styles';
import {
  StyledPartnerItemAnswer,
  StyledPartnerItemAnswerRow,
  StyledPartnerItemAnswerText,
  StyledPartnerItemAuthor,
  StyledPartnerItemClosingQuote,
  StyledPartnerItemContent,
  StyledPartnerItemDescription,
  StyledPartnerItemDescriptionText,
  StyledPartnerItemLink,
  StyledPartnerItemLogoCell,
  StyledPartnerItemLogos,
  StyledPartnerItemOpeningQuote,
  StyledPartnerItemQuestion,
  StyledPartnerItemTestimonial,
  StyledPartnerItemTextCell,
  StyledPartnerItemTitle,
  StyledPartnersBanner,
  StyledPartnersBannerContent,
  StyledPartnersBannerOverlay,
  StyledPartnersBannerPicture,
  StyledPartnersBannerTitle,
  StyledPartnersCarouselTitle,
  StyledPartnersLogos,
  StyledPartnersLogosColumn,
} from '@/src/features/partials/pages/Partenaires/Partenaires.styles';
import { SimpleSection } from '@/src/features/partials/pages/Partenaires/SimpleSection';
import { LogoList } from '@/src/features/partials/utils/LogoList';
import { gaEvent } from '@/src/lib/gtag';
import { addPrefix, formatParagraph } from '@/src/utils';

const viewportHeightWithoutHeader = 'calc(100vh - 80px)';
const viewportHeightWithoutHeaderAndPadding = 'calc(100vh - 220px)';

const CarouselSection = ({ children, partners, img }) => {
  return (
    <StyledPartnersBanner style={{ minHeight: viewportHeightWithoutHeader }}>
      <StyledPartnersBannerPicture
        style={{
          backgroundImage: `url(${addPrefix(img)})`,
        }}
      />
      <StyledPartnersBannerOverlay $variant="dark" />
      <StyledPartnersBannerContent>
        <div>
          <StyledPartnersCarouselTitle>
            <mark>{children}</mark>
          </StyledPartnersCarouselTitle>
          {partners.length <= 5 ? (
            <>
              {partners.length < 5 ? (
                <LogoList logos={partners} padding background />
              ) : (
                <StyledPartnersLogosColumn>
                  <StyledPartnersLogos>
                    <LogoList logos={partners} carousel padding background />
                  </StyledPartnersLogos>
                </StyledPartnersLogosColumn>
              )}
            </>
          ) : (
            <LogoList logos={partners} carousel padding background />
          )}
        </div>
      </StyledPartnersBannerContent>
    </StyledPartnersBanner>
  );
};

CarouselSection.propTypes = {
  children: PropTypes.element.isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  img: PropTypes.string.isRequired,
};

interface TitleProps {
  children: React.ReactNode;
  img: string;
}

const Title = ({ children, img }: TitleProps) => {
  return (
    <StyledPartnersBanner style={{ minHeight: viewportHeightWithoutHeader }}>
      <StyledPartnersBannerPicture
        style={{
          backgroundImage: `url("${addPrefix(img)}")`,
        }}
      />
      <StyledPartnersBannerOverlay $variant="primary" />
      <StyledPartnersBannerContent>
        <div>
          <StyledPartnersBannerTitle>
            <mark>{children}</mark>
          </StyledPartnersBannerTitle>
        </div>
      </StyledPartnersBannerContent>
    </StyledPartnersBanner>
  );
};

Title.propTypes = {
  children: PropTypes.element.isRequired,
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
      <StyledPartnerItemContent
        style={{ minHeight: viewportHeightWithoutHeaderAndPadding }}
      >
        <StyledPartnerItemLink
          className="animate"
          isExternal
          target="_blank"
          href={link}
        >
          <StyledPartnerItemTitle>{title}</StyledPartnerItemTitle>
          <Grid
            eachWidths={['1-3@m', '2-3@m']}
            match
            middle
            center
            gap="large"
            reverse={reverse}
          >
            <StyledPartnerItemLogoCell>
              <StyledPartnerItemLogos>
                <LegacyImg
                  src={`/static/img/partners/${key}/logo.png`}
                  alt="key"
                  width={300}
                  height={300}
                />
                {bis && (
                  <LegacyImg
                    src={`/static/img/partners/${key}/logo_bis.png`}
                    alt="key"
                    width={300}
                    height={300}
                  />
                )}
              </StyledPartnerItemLogos>
            </StyledPartnerItemLogoCell>
            <StyledPartnerItemTextCell>
              <StyledPartnerItemDescription className="animate">
                <StyledPartnerItemDescriptionText
                  $side={secondDirection}
                  $hasAnswer={!!answer}
                >
                  {formatParagraph(desc)}
                </StyledPartnerItemDescriptionText>
              </StyledPartnerItemDescription>
              {answer && <StyledDividerSmall />}
              {answer && (
                <StyledPartnerItemTestimonial
                  className="animate"
                  $side={secondDirection}
                >
                  {question && (
                    <StyledPartnerItemQuestion $side={secondDirection}>
                      {question}
                    </StyledPartnerItemQuestion>
                  )}
                  <StyledPartnerItemAnswerRow>
                    <StyledPartnerItemOpeningQuote>
                      <LegacyImg
                        alt=""
                        width={27}
                        height={21}
                        src="/static/img/guillemets-bleu.png"
                      />
                    </StyledPartnerItemOpeningQuote>
                    <StyledPartnerItemAnswer>
                      <StyledPartnerItemAnswerText $side={firstDirection}>
                        {answer}
                      </StyledPartnerItemAnswerText>
                      {author && (
                        <StyledPartnerItemAuthor $side={firstDirection}>
                          <StyledBold>{author.name}</StyledBold>, &nbsp;
                          {author.status}
                        </StyledPartnerItemAuthor>
                      )}
                    </StyledPartnerItemAnswer>
                    <StyledPartnerItemClosingQuote>
                      <LegacyImg
                        alt=""
                        width={15}
                        height={12}
                        src="/static/img/guillemets-gris.png"
                      />
                    </StyledPartnerItemClosingQuote>
                  </StyledPartnerItemAnswerRow>
                </StyledPartnerItemTestimonial>
              )}
            </StyledPartnerItemTextCell>
          </Grid>
        </StyledPartnerItemLink>
      </StyledPartnerItemContent>
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
    <Layout title="Les partenaires - Entourage Pro" hasHero>
      <Title img="/static/img/construct.jpg">
        <>
          Ils construisent le projet{' '}
          <StyledPrimary>avec&nbsp;nous</StyledPrimary>
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
          <StyledPrimary>Entourage Pro Jeunes</StyledPrimary>
        </>
      </CarouselSection>
      <CarouselSection
        img="/static/img/business.jpg"
        partners={PARTNERS.ALL_FINANCE}
      >
        <>
          Nos partenaires <StyledPrimary>financiers</StyledPrimary>
        </>
      </CarouselSection>
      <CarouselSection img="/static/img/sports.jpg" partners={PARTNERS.SPORTS}>
        <>
          Nos partenaires <StyledPrimary>sportifs et visibilité</StyledPrimary>
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
          Nos partenaires <StyledPrimary>opérationnels</StyledPrimary>
        </>
      </CarouselSection>
      <SimpleSection
        title={
          <>
            Rejoignez <StyledPrimary>Entourage Pro&nbsp;!</StyledPrimary>
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
