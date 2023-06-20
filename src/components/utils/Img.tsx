/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import React from 'react';
import { addPrefix } from 'src/utils';

interface ImgProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  cover?: boolean;
}

export const Img = ({
  src,
  alt,
  width,
  height,
  className,
  cover,
}: ImgProps) => {
  if (cover) {
    return (
      <img
        alt={alt}
        data-src={addPrefix(src)}
        width={width}
        height={height}
        data-uk-img=""
        className={className}
        data-uk-cover=""
      />
    );
  }
  return (
    <img
      alt={alt}
      data-src={addPrefix(src)}
      width={width}
      height={height}
      data-uk-img=""
      className={className}
    />
  );
};

Img.defaultProps = {
  width: undefined,
  height: undefined,
  className: undefined,
  cover: false,
};

export const ImgNoSSR = dynamic(
  () => {
    return import('src/components/utils/Img').then((mod) => mod.Img);
  },
  { ssr: false }
);
