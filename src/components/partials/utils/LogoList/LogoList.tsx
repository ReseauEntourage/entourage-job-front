import React from 'react';
import { Logo } from 'src/components/utils';
import { CarouselSwiper } from 'src/components/utils/CarouselSwiper';
import {
  LogoListFlexContainer,
  LogoListFlexItem,
  StyledCarouselItem,
} from './LogoList.styles';

interface LogoListProps {
  logos: {
    key: string;
    link: string;
    bis?: boolean;
  }[];
  carousel?: boolean;
  padding?: boolean;
  background?: boolean;
}

export const LogoList = ({
  logos,
  carousel,
  padding,
  background,
}: LogoListProps) => {
  const logosPerLine = logos.length > 12 ? 5 : Math.floor(logos.length / 3 + 1);
  if (carousel) {
    return (
      <CarouselSwiper
        slidesPerView={logosPerLine}
        slides={logos.map(({ key, link, bis }) => {
          return (
            <StyledCarouselItem key={key}>
              <Logo logoKey={key} link={link} bis={bis} />
            </StyledCarouselItem>
          );
        })}
      />
    );
  }
  return (
    <LogoListFlexContainer
      className={`${background ? 'background' : 'border-rounded'} ${
        padding ? 'padding' : ''
      }`}
    >
      {logos.map(({ key, link, bis }) => {
        return (
          <LogoListFlexItem
            key={key}
            width={`calc(100% * 1 / ${logosPerLine <= 3 ? 3 : logosPerLine})`}
          >
            <Logo logoKey={key} link={link} bis={bis} />
          </LogoListFlexItem>
        );
      })}
    </LogoListFlexContainer>
  );
};
