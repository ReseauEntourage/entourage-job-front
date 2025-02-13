import React from 'react';
import { Button, BackgroundImage, Text } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledImageTitle,
  StyledImageTitleCTAsContainer,
} from './ImageTitle.styles';

interface CTAProps {
  onClick?: () => void;
  label: string;
  href?: string;
  style?: UIKIT_BUTTON_STYLES_SPEC;
  isExternal?: boolean;
  newTab?: boolean;
  dataTest?: string;
  color?: string;
}

interface ImageTitleProps {
  img: string;
  imgMobile?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  alt?: string;
  textColor?: keyof typeof COLORS;
  cta?: CTAProps | CTAProps[];
}

export const ImageTitle = ({
  title,
  description,
  img,
  imgMobile,
  alt,
  cta,
  textColor,
}: ImageTitleProps) => {
  const isDesktop = useIsDesktop();

  return (
    <BackgroundImage
      img={img}
      imgMobile={imgMobile || img}
      alt={alt || ''}
      isHero
      hasCta={!!cta}
    >
      <StyledImageTitle textColor={textColor || 'white'}>
        <H2 title={title} color={textColor || 'white'} />
        {description && (
          <Text
            size={isDesktop ? 'xlarge' : 'normal'}
            color={textColor || 'white'}
          >
            {description}
          </Text>
        )}
        {cta && !Array.isArray(cta) && (
          <Button
            style={cta.style}
            onClick={cta.onClick}
            dataTestId={cta.dataTest}
            href={cta.href}
            isExternal={cta.isExternal}
            newTab={cta.newTab}
            color={cta.color}
          >
            {cta.label}
          </Button>
        )}
        {cta && Array.isArray(cta) && cta.length > 0 && (
          <StyledImageTitleCTAsContainer marginTop={!description}>
            {cta.map(
              (
                {
                  label,
                  style,
                  dataTest,
                  onClick,
                  color,
                  href,
                  isExternal,
                  newTab,
                },
                index
              ) => {
                return (
                  <Button
                    key={index.toString()}
                    style={style}
                    onClick={onClick}
                    color={color}
                    href={href}
                    isExternal={isExternal}
                    dataTestId={dataTest}
                    newTab={newTab}
                  >
                    {label}
                  </Button>
                );
              }
            )}
          </StyledImageTitleCTAsContainer>
        )}
      </StyledImageTitle>
    </BackgroundImage>
  );
};
