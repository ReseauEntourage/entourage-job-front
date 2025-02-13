import React from 'react';
import { Text } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledIconTitleTextItem } from './RowIconTitleText.styles';

interface IconTitleTextItemProps {
  title: string;
  illu: React.ReactNode;
  paragraph: string;
}

export const IconTitleTextItem = ({
  title,
  paragraph,
  illu,
}: IconTitleTextItemProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledIconTitleTextItem className={isDesktop ? '' : 'mobile'}>
      <div className="image-container">{illu}</div>
      <div className="text-container">
        <H6 title={title} color="black" center />
      </div>
      <Text center>{paragraph}</Text>
    </StyledIconTitleTextItem>
  );
};
