import React from 'react';
import { Button, LegacyImg, Grid, ButtonSize } from '@/src/components/ui';
import { useHeightMatch } from '@/src/hooks/useHeightMatch';
import {
  StyledMultipleCTAButtons,
  StyledMultipleCTABody,
  StyledMultipleCTAContent,
  StyledMultipleCTADivider,
  StyledMultipleCTAItem,
  StyledMultipleCTANumber,
  StyledMultipleCTAPicture,
  StyledMultipleCTAText,
  StyledMultipleCTATitle,
} from './MultipleCTA.styles';

interface MultipleCTAProps {
  showNumbers?: boolean;
  showHorizontalDividers?: boolean;
  spacing?: 'small' | 'medium' | 'large';
  className?: string;
  data: {
    title?: React.ReactNode;
    text?: React.ReactNode;
    img?: string;
    button?: {
      label: string;
      href?: string;
      external?: boolean;
      modal?: string;
      onClick?: () => void;
      size?: ButtonSize;
      variant?: 'default' | 'primary' | 'secondary';
      dataTestId?: string;
    };
  }[];
}

export const MultipleCTA = ({
  showNumbers,
  showHorizontalDividers,
  data,
  spacing,
  className,
}: MultipleCTAProps) => {
  const rootRef = useHeightMatch<HTMLDivElement>(['h4', '.text']);

  return (
    <div ref={rootRef} className={className}>
      <Grid
        childWidths={[`1-${data.length}@m`]}
        match
        gap={spacing}
        items={data.map((item, index) => {
          return (
            <StyledMultipleCTAItem key={index.toString()}>
              {item.img && (
                <StyledMultipleCTAPicture>
                  <LegacyImg src={item.img} alt="" height={100} width={100} />
                </StyledMultipleCTAPicture>
              )}
              <StyledMultipleCTABody>
                {showNumbers && (
                  <StyledMultipleCTANumber
                    style={{ fontSize: 46, lineHeight: 1 }}
                  >
                    {index + 1}
                  </StyledMultipleCTANumber>
                )}
                <StyledMultipleCTAContent>
                  {item.title && (
                    <StyledMultipleCTATitle
                      $left={!!showHorizontalDividers}
                      $hasPicture={!!item.img}
                    >
                      {item.title}
                    </StyledMultipleCTATitle>
                  )}
                  {showHorizontalDividers && <StyledMultipleCTADivider />}
                  {item.text && (
                    <StyledMultipleCTAText
                      className="text"
                      $hasButton={!!item.button}
                      $spaced={!!showHorizontalDividers}
                      $centered={!showHorizontalDividers && !!item.title}
                    >
                      {item.text}
                    </StyledMultipleCTAText>
                  )}
                  {item.button && (
                    <StyledMultipleCTAButtons $left={!!showHorizontalDividers}>
                      <Button
                        href={item.button.href}
                        variant={item.button.variant || 'secondary'}
                        isExternal={item.button.external}
                        newTab={item.button.external}
                        onClick={item.button.onClick}
                        size={item.button.size}
                        dataTestId={item.button.dataTestId}
                      >
                        {item.button.label}
                      </Button>
                    </StyledMultipleCTAButtons>
                  )}
                </StyledMultipleCTAContent>
              </StyledMultipleCTABody>
            </StyledMultipleCTAItem>
          );
        })}
      />
    </div>
  );
};

MultipleCTA.defaultProps = {
  showNumbers: false,
  showHorizontalDividers: false,
  spacing: 'large',
  className: '',
};
