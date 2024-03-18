import React from 'react';
import { Section } from 'src/components/utils';
import { H2, H5 } from 'src/components/utils/Headings';
import { IconTitleTextItem } from './IconTitleTextItem';
import {
  StyledRowIconTitleTextBackground,
  StyledRowIconTitleTextContainer,
} from './RowIconTitleText.styles';

interface RowIconTitleTextProps {
  title?: React.ReactNode;
  backgroundColor?: 'blue';
  content: {
    title: string;
    paragraph: string;
    src: string;
  }[];
}

export const RowIconTitleText = ({
  title,
  content,
  backgroundColor,
}: RowIconTitleTextProps) => {
  return (
    <StyledRowIconTitleTextBackground backgroundColor={backgroundColor}>
      <Section>
        {title && <H2 title={title} color="black" center />}
        <H5 title="Des réseaux activés = plus d'opportunités" center />
        <StyledRowIconTitleTextContainer data-uk-scrollspy="cls:uk-animation-slide-bottom; target: h6, p; delay: 200;">
          {content.map(({ title: itemTitle, paragraph, src }, index) => {
            return (
              <IconTitleTextItem
                title={itemTitle}
                paragraph={paragraph}
                src={src}
                key={index}
              />
            );
          })}
        </StyledRowIconTitleTextContainer>
      </Section>
    </StyledRowIconTitleTextBackground>
  );
};
