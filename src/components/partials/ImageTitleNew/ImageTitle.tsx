import React from 'react';
import {
  StyledImageTitle,
  StyledImageTitleCTAsContainer,
} from 'src/components/partials/ImageTitleNew/ImageTitle.styles';
import { Container, Button, BackgroundImage } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { useIsDesktop } from 'src/hooks/utils';

interface CTAProps {
  onClick: () => void;
  label: string;
  href?: string;
  className: UIKIT_BUTTON_STYLES_SPEC;
  isExternal?: boolean;
  newTab?: boolean;
  dataTest: string;
}

interface ImageTitleProps {
  title: string;
  description: string;
  img: string;
  imgMobile?: string;
  alt?: string;
  cta?: CTAProps | CTAProps[];
}
export const ImageTitle = ({
  title,
  description,
  img,
  imgMobile,
  alt,
  cta,
}: ImageTitleProps) => {
  const isDesktop = useIsDesktop();

  return (
    <BackgroundImage
      img={img}
      imgMobile={imgMobile}
      alt={alt}
      isHero
      hasCta={!!cta}
    >
      <Container>
        <StyledImageTitle className={`${isDesktop ? 'desktop' : ''}`}>
          <H1
            title={title}
            color="white"
            effect="cls: uk-animation-slide-left uk-animation-fade; delay: 200;"
          />
          <p data-uk-scrollspy="cls: uk-animation-slide-left uk-animation-fade; delay: 200;">
            {description}
          </p>
          {cta && !Array.isArray(cta) && (
            <Button
              style={cta.className}
              onClick={cta.onClick}
              dataTestId={cta.dataTest}
            >
              {cta.label}
            </Button>
          )}
          {cta && Array.isArray(cta) && cta.length > 0 && (
            <StyledImageTitleCTAsContainer>
              {cta.map(({ label, className, dataTest, onClick }, index) => {
                return (
                  <Button
                    key={index.toString()}
                    style={className}
                    onClick={onClick}
                    dataTestId={dataTest}
                  >
                    {label}
                  </Button>
                );
              })}
            </StyledImageTitleCTAsContainer>
          )}
        </StyledImageTitle>
      </Container>
    </BackgroundImage>
  );
};

ImageTitle.defaultProps = {
  alt: '',
  cta: null,
  imgMobile: undefined,
};
