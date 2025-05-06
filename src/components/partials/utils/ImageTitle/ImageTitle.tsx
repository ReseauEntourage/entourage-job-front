import React from 'react';
import { Button, BackgroundImage, Text } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
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
  variant?: 'default' | 'primary' | 'secondary';
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
            variant={cta.variant}
            onClick={cta.onClick}
            dataTestId={cta.dataTest}
            href={cta.href}
            isExternal={cta.isExternal}
            newTab={cta.newTab}
          >
            {cta.label}
          </Button>
        )}
        {cta && Array.isArray(cta) && cta.length > 0 && (
          <StyledImageTitleCTAsContainer marginTop={!description}>
            {cta.map(
              (
                { label, variant, dataTest, onClick, href, isExternal, newTab },
                index
              ) => {
                return (
                  <Button
                    key={index.toString()}
                    variant={variant}
                    onClick={onClick}
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
