import React, { Ref } from 'react';
import { LegacyImg, Section } from '@/src/components/ui';
import { H2, H3, H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledSimpleImageTextBackground,
  StyledSimpleImageTextBackgroundProps,
  StyledSimpleImageTextContainer,
  StyledSimpleImageTextImageContainer,
  StyledSimpleImageTextTextContainer,
  StyledTitleContainer,
} from './SimpleImageText.styles';

interface SimpleImageTextProps {
  backgroundColor?: StyledSimpleImageTextBackgroundProps['backgroundColor'];
  innerRef?: Ref<HTMLDivElement>;
  title: string;
  subtitle?: string;
  img: string;
  children: React.ReactNode;
  reverse?: boolean;
  contentPaddingY?: number;
  imgCover?: boolean;
}

export const SimpleImageText = ({
  backgroundColor,
  innerRef,
  title,
  subtitle,
  img,
  contentPaddingY = 0,
  children,
  reverse = false,
  imgCover = true,
}: SimpleImageTextProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledSimpleImageTextBackground backgroundColor={backgroundColor}>
      <Section>
        {!isDesktop && (
          <H3
            title={title}
            weight="bold"
            noMarginBottom
            color={COLORS.primaryBlue}
          />
        )}
        {subtitle && !isDesktop && (
          <H4 title={subtitle} weight="normal" noMarginBottom />
        )}
        <br />
        <StyledSimpleImageTextContainer
          className={isDesktop ? '' : 'mobile'}
          reverse={reverse}
        >
          <StyledSimpleImageTextImageContainer
            className={isDesktop ? '' : 'mobile'}
            ref={innerRef}
          >
            <LegacyImg src={img} alt="" cover={imgCover} />
          </StyledSimpleImageTextImageContainer>
          <StyledSimpleImageTextTextContainer contentPaddingY={contentPaddingY}>
            <StyledTitleContainer>
              {isDesktop && (
                <H2
                  title={title}
                  weight="bold"
                  color={COLORS.primaryBlue}
                  noMarginBottom
                />
              )}
              {isDesktop && subtitle && (
                <H4 title={subtitle} weight="normal" noMarginBottom />
              )}
            </StyledTitleContainer>
            <div>{children}</div>
          </StyledSimpleImageTextTextContainer>
        </StyledSimpleImageTextContainer>
      </Section>
    </StyledSimpleImageTextBackground>
  );
};
