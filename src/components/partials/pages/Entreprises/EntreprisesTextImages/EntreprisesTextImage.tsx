import React from 'react';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { content } from './EntreprisesTextImage.utils';

interface TextImageProps {
  element: 'quoi' | 'qui' | 'pourquoi';
}

export const EntreprisesTextImage = ({ element }: TextImageProps) => {
  return (
    <SimpleImageText
      img={content[element].img}
      reverse={content[element].reverse}
      title={content[element].title}
    >
      {content[element].content}
    </SimpleImageText>
  );
};
