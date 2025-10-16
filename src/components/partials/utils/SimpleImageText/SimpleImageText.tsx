import React, { Ref } from 'react';
import { LegacyImg, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledSimpleImageTextBackground,
  StyledSimpleImageTextBackgroundProps,
  StyledSimpleImageTextContainer,
  StyledSimpleImageTextImageContainer,
  StyledSimpleImageTextTextContainer,
} from './SimpleImageText.styles';

interface SimpleImageTextProps {
  backgroundColor?: StyledSimpleImageTextBackgroundProps['backgroundColor'];
  innerRef?: Ref<HTMLDivElement>;
  title: React.ReactNode;
  img: string;
  children: React.ReactNode;
  reverse?: boolean;
  contentPaddingY?: number;
}

export const SimpleImageText = ({
  backgroundColor,
  innerRef,
  title,
  img,
  contentPaddingY = 0,
  children,
  reverse = false,
}: SimpleImageTextProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledSimpleImageTextBackground backgroundColor={backgroundColor}>
      <Section>
        {!isDesktop && <H3 title={title} />}
        <br />
        <StyledSimpleImageTextContainer
          className={isDesktop ? '' : 'mobile'}
          reverse={reverse}
        >
          <StyledSimpleImageTextImageContainer
            className={isDesktop ? '' : 'mobile'}
            ref={innerRef}
          >
            <LegacyImg src={img} alt="" cover />
          </StyledSimpleImageTextImageContainer>
          <StyledSimpleImageTextTextContainer contentPaddingY={contentPaddingY}>
            {isDesktop && <H3 title={title} />}
            <div>{children}</div>
          </StyledSimpleImageTextTextContainer>
        </StyledSimpleImageTextContainer>
      </Section>
    </StyledSimpleImageTextBackground>
  );
};
