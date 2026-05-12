import React from 'react';
import { Section } from '@/src/components/ui';
import { H2, H5 } from '@/src/components/ui/Headings';
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
    title?: React.ReactNode;
    paragraph: React.ReactNode;
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
          {title && (
            <H2 title={title} color="primaryBlue" center weight="bold" />
          )}
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
