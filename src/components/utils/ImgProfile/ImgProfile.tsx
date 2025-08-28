import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { Img } from 'src/components/utils/Img';
import { StyledImgProfileContainer } from './ImgProfile.style';

interface ImgProfileProps {
  pictureUrl: string | null;
  size?: number;
  highlight?: boolean;
  placeholder: string;
  alt?: string;
  cover?: boolean;
  bgColor?: string;
}

export const ImgProfile = ({
  pictureUrl,
  size = 40,
  alt = 'photo',
  highlight = false,
  placeholder,
  cover = true,
  bgColor = COLORS.primaryBlue,
}: ImgProfileProps) => {
  return (
    <StyledImgProfileContainer
      size={size}
      highlight={highlight}
      bgColor={bgColor}
    >
      {pictureUrl ? (
        <Img src={pictureUrl} alt={alt} cover={cover} />
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
