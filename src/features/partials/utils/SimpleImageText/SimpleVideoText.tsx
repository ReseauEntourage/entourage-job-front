import React, { Ref } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Section } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledSimpleImageTextBackground,
  StyledSimpleImageTextBackgroundProps,
  StyledSimpleImageTextContainer,
  StyledSimpleVideoTextTextContainer,
  StyledSimpleVideoTextVideoContainer,
} from './SimpleImageText.styles';

interface SimpleVideoTextProps {
  backgroundColor?: StyledSimpleImageTextBackgroundProps['backgroundColor'];
  innerRef?: Ref<HTMLDivElement>;
  title: React.ReactNode;
  videoId: string;
  videoTitle: string;
  children: React.ReactNode;
  reverse?: boolean;
}

export const SimpleVideoText = ({
  backgroundColor,
  innerRef,
  title,
  videoId,
  videoTitle,
  children,
  reverse = false,
}: SimpleVideoTextProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledSimpleImageTextBackground backgroundColor={backgroundColor}>
      <Section>
        {!isDesktop && <H3 title={title} color="primaryBlue" />}
        <StyledSimpleImageTextContainer
          className={isDesktop ? '' : 'mobile'}
          reverse={reverse}
        >
          <StyledSimpleVideoTextVideoContainer
            className={isDesktop ? '' : 'mobile'}
            ref={innerRef}
          >
            <LiteYouTubeEmbed
              id={videoId}
              poster="maxresdefault"
              title={videoTitle}
              aspectWidth={662}
              aspectHeight={370}
              wrapperClass="yt-lite videoCustom"
              playerClass="lty-playbtn playBtnCustom"
              params="rel=0&showinfo=0&iv_load_policy=3"
            />
          </StyledSimpleVideoTextVideoContainer>
          <StyledSimpleVideoTextTextContainer
            className={isDesktop ? '' : 'mobile'}
          >
            {isDesktop && <H3 title={title} color="primaryBlue" />}
            {children}
          </StyledSimpleVideoTextTextContainer>
        </StyledSimpleImageTextContainer>
      </Section>
    </StyledSimpleImageTextBackground>
  );
};
