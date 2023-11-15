import React from 'react';
import {
  StyledImageTitle,
  StyledImageTitleCTAsContainer,
} from 'src/components/partials/ImageTitle/ImageTitle.styles';
import { Button, BackgroundImage } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { useIsDesktop } from 'src/hooks/utils';

interface CTAProps {
  onClick: () => void;
  label: string;
  href?: string;
  style: UIKIT_BUTTON_STYLES_SPEC;
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
            style={cta.style}
            onClick={cta.onClick}
            dataTestId={cta.dataTest}
          >
            {cta.label}
          </Button>
        )}
        {cta && Array.isArray(cta) && cta.length > 0 && (
          <StyledImageTitleCTAsContainer>
            {cta.map(({ label, style, dataTest, onClick }, index) => {
              return (
                <Button
                  key={index.toString()}
                  style={style}
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
    </BackgroundImage>
  );
};
