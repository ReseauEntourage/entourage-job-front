import React from 'react';
import { Text } from '@/src/components/ui';
import { H6 } from '@/src/components/ui/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledIconTitleTextItem } from './RowIconTitleText.styles';

interface IconTitleTextItemProps {
  title?: React.ReactNode;
  illu: React.ReactNode;
  paragraph: React.ReactNode;
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
        {title && <H6 title={title} color="black" center />}
      </div>
      <Text center>{paragraph}</Text>
    </StyledIconTitleTextItem>
  );
};
