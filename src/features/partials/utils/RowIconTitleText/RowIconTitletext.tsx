import React from 'react';
import { Section } from '@/src/components/ui';
import { H4, H5 } from '@/src/components/ui/Headings';
import { Color } from 'src/constants/styles';
import { IconTitleTextItem } from './IconTitleTextItem';
import {
  StyledSectionContent,
  StyledRowIconTitleTextBackground,
  StyledRowIconTitleTextContainer,
} from './RowIconTitleText.styles';

interface RowIconTitleTextProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  backgroundColor?: Color;
  sectionBgColor?: Color;
  content: {
    title: string;
    paragraph: string;
    illu: React.ReactNode;
  }[];
}

export const RowIconTitleText = ({
  title,
  subtitle,
  content,
  backgroundColor,
  sectionBgColor,
}: RowIconTitleTextProps) => {
  return (
    <StyledRowIconTitleTextBackground backgroundColor={backgroundColor}>
      <Section>
        <StyledSectionContent bgColor={sectionBgColor}>
          {title && <H4 title={title} color="black" center />}
          {subtitle && (
            <H5 title={subtitle} color="black" weight="normal" center />
          )}
          <StyledRowIconTitleTextContainer>
            {content.map(({ title: itemTitle, paragraph, illu }, index) => {
              return (
                <IconTitleTextItem
                  title={itemTitle}
                  paragraph={paragraph}
                  illu={illu}
                  key={index}
                />
              );
            })}
          </StyledRowIconTitleTextContainer>
        </StyledSectionContent>
      </Section>
    </StyledRowIconTitleTextBackground>
  );
};
