import React, { Ref } from 'react'
import { Img, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledSimpleImageTextBackground, StyledSimpleImageTextBackgroundProps, StyledSimpleImageTextContainer, StyledSimpleImageTextImageContainer, StyledSimpleImageTextTextContainer } from './SimpleImageText.styles';

interface SimpleImageTextProps {
    backgroundColor?: StyledSimpleImageTextBackgroundProps["backgroundColor"];
    innerRef?: Ref<HTMLDivElement>;
    title: string;
    img: string;
    children: React.ReactNode;

}

export const SimpleImageText = ({
    backgroundColor, 
    innerRef,
    title,
    img,
    children
}: SimpleImageTextProps) => {
   const isDesktop =  useIsDesktop();
  return (
    <StyledSimpleImageTextBackground
        backgroundColor={backgroundColor}
    >
<Section>
        {!isDesktop && (
          <H3
            title={title}
            color="primaryBlue"
          />
        )}
        <StyledSimpleImageTextContainer className={isDesktop ? '' : 'mobile'}>
            <StyledSimpleImageTextImageContainer className={isDesktop ? "" : "mobile"} ref={innerRef}>
                <Img src={img} alt="" cover />
            </StyledSimpleImageTextImageContainer>
            <StyledSimpleImageTextTextContainer className={isDesktop ? "" : "mobile"}>
                {isDesktop && (
                    <H3
                        title={title}
                        color="primaryBlue"
                    />
                )}
                {children}
            </StyledSimpleImageTextTextContainer>
        </StyledSimpleImageTextContainer>
      </Section>
    </StyledSimpleImageTextBackground>
  )
}
