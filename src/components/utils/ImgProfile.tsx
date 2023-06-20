import React from 'react';
import { Img } from 'src/components/utils/Img';

interface ImgProfileProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  border?: 'circle' | 'pill' | 'rounded';
}

export const ImgProfile = ({
  src,
  alt,
  width,
  height,
  border,
}: ImgProfileProps) => {
  return (
    <div
      className={`uk-cover-container uk-border-${border}`}
      style={{ width, height }}
    >
      <Img cover src={src} alt={alt} />
    </div>
  );
};
ImgProfile.defaultProps = {
  src: '/static/img/arthur.jpg',
  alt: '',
  width: '80px',
  height: '80px',
  border: 'circle',
};
