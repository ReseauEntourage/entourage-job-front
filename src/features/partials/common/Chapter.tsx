import React from 'react';

import { Grid, Section, LegacyImg } from '@/src/components/ui';
import {
  StyledChapterContent,
  StyledChapterCta,
  StyledChapterPicture,
  StyledChapterSmallTitle,
  StyledChapterText,
  StyledChapterTitle,
} from './Chapter.styles';

interface ChapterProps {
  title: React.ReactNode;
  content: React.ReactNode;
  imgSrc?: string;
  style: 'muted' | 'default';
  direction: 'left' | 'right' | 'column';
  cta?: React.ReactNode;
  smallTitle?: boolean;
}

export const Chapter = ({
  title,
  content,
  imgSrc,
  style,
  direction,
  cta,
  smallTitle,
}: ChapterProps) => {
  return (
    <Section style={style}>
      <StyledChapterContent>
        {!smallTitle && <StyledChapterTitle>{title}</StyledChapterTitle>}
        <Grid
          childWidths={[`1-${direction !== 'column' ? '2' : '1'}@m`]}
          center
          middle
          gap="large"
          reverse={direction === 'left'}
          row={direction !== 'left'}
        >
          <div>
            {smallTitle && (
              <StyledChapterSmallTitle className="animate">
                {title}
              </StyledChapterSmallTitle>
            )}
            <StyledChapterText className="animate">{content}</StyledChapterText>
            {cta && <StyledChapterCta>{cta}</StyledChapterCta>}
          </div>
          {imgSrc && (
            <StyledChapterPicture>
              <LegacyImg src={imgSrc} cover alt="" />
            </StyledChapterPicture>
          )}
        </Grid>
      </StyledChapterContent>
    </Section>
  );
};

Chapter.defaultProps = {
  cta: undefined,
  imgSrc: undefined,
  smallTitle: false,
};
