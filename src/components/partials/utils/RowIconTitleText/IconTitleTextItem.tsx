import React from 'react';
import { Img } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledIconTitleTextItem } from './RowIconTitleText.styles';

interface IconTitleTextItemProps {
  title: string;
  paragraph: string;
  src: string;
}

export const IconTitleTextItem = ({
  title,
  paragraph,
  src,
}: IconTitleTextItemProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledIconTitleTextItem className={isDesktop ? '' : 'mobile'}>
      <div className="image-container">
        <Img src={src} alt={title} cover />
      </div>
      <div className="text-container">
        <H6 title={title} color="black" center />
      </div>
      <p>{paragraph}</p>
    </StyledIconTitleTextItem>
  );
};
