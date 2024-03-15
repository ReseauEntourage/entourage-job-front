import React from 'react';
import { StyledRowIconTitleTextBackground } from './RowIconTitleText.styles';
import { Section } from 'src/components/utils';
import { H2, H5 } from 'src/components/utils/Headings';
import { IconTitleTextItem } from './IconTitleTextItem';
import { StyledRowIconTitleTextContainer } from './RowIconTitleText.styles';

interface RowIconTitleTextProps {
    title?: React.ReactNode;
    backgroundColor?: 'blue';
    content: {
        title: string;
        paragraph: string;
        src: string;
    }[];
}

export const RowIconTitleText = ({title, content, backgroundColor}: RowIconTitleTextProps) => {
  return (
    <StyledRowIconTitleTextBackground backgroundColor={backgroundColor}>
      <Section>
        {title && <H2
          title={title}
          color="black"
          center
        />}
        <H5 title="Des réseaux activés = plus d'opportunités" center />
        <StyledRowIconTitleTextContainer data-uk-scrollspy="cls:uk-animation-slide-bottom; target: h6, p; delay: 200;">
          {content.map(({ title, paragraph, src }, index) => {
            return (
              <IconTitleTextItem
                title={title}
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
