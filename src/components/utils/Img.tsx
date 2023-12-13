import Image from 'next/image';
import React from 'react';
import { addPrefix } from 'src/utils';

interface ImgProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  cover?: boolean;
}

export const Img = ({ src, alt, width, height, cover = false }: ImgProps) => {
  if (cover) {
    return (
      <Image
        alt={alt}
        src={addPrefix(src)}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    );
  }
  if (width || height) {
    return (
      <Image
        alt={alt}
        src={addPrefix(src)}
        width={width}
        height={height}
        objectFit="contain"
      />
    );
  }
  return (
    <Image alt={alt} src={addPrefix(src)} layout="fill" objectFit="contain" />
  );
};
