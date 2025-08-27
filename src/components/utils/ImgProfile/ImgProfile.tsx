import React from 'react';
import { Img } from 'src/components/utils/Img';
import { StyledImgProfileContainer } from './ImgProfile.style';

interface ImgProfileProps {
  pictureUrl: string | null;
  size?: number;
  highlight?: boolean;
  placeholder: string;
  alt?: string;
}

export const ImgProfile = ({
  pictureUrl,
  size = 40,
  alt = 'photo',
  highlight = false,
  placeholder,
}: ImgProfileProps) => {
  return (
    <StyledImgProfileContainer size={size} highlight={highlight}>
      {pictureUrl ? (
        <Img cover src={pictureUrl} alt={alt} />
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase"
          style={{ fontSize: size / 2, color: '#fff' }}
        >
          {placeholder.substring(0, 1)}
        </span>
      )}
    </StyledImgProfileContainer>
  );
};
