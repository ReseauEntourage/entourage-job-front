import React from 'react';
import { Button, Img, Grid } from 'src/components/utils';

interface MultipleCTAProps {
  showNumbers?: boolean;
  showHorizontalDividers?: boolean;
  showVerticalDividers?: boolean;
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
      size?: 'small' | 'large';
      variant?: 'default' | 'primary' | 'secondary';
      dataTestId?: string;
    };
  }[];
  animate?: boolean;
}

export const MultipleCTA = ({
  showNumbers,
  showHorizontalDividers,
  showVerticalDividers,
  data,
  spacing,
  className,
  animate,
}: MultipleCTAProps) => {
  return (
    <div data-uk-height-match="target : h4, .text" className={className}>
      <Grid
        childWidths={[`1-${data.length}@m`]}
        match
        gap={spacing}
        divider={showVerticalDividers}
        items={data.map((item, index) => {
          return (
            <div
              data-uk-scrollspy={
                animate
                  ? `cls: uk-animation-slide-${
                      index % 2 === 0 ? 'bottom' : 'top'
                    }-small; delay: ${100 * (index + 1)};`
                  : ''
              }
              key={index.toString()}
              className="uk-flex uk-flex-column uk-flex-middle"
            >
              {item.img && (
                <div className="uk-flex uk-flex-bottom uk-flex-center uk-margin-small-bottom">
                  <Img src={item.img} alt="" height={100} width={100} />
                </div>
              )}
              <div className="uk-flex uk-flex-1">
                {showNumbers && (
                  <div
                    className="uk-text-bold uk-text-primary uk-text-large uk-margin-medium-right uk-margin-small-top"
                    style={{ fontSize: 46, lineHeight: 1 }}
                  >
                    {index + 1}
                  </div>
                )}
                <div className="uk-flex uk-flex-column uk-flex-1">
                  {item.title && (
                    <h4
                      className={`${
                        showHorizontalDividers
                          ? 'uk-text-left uk-flex-left'
                          : 'uk-text-center uk-flex-center'
                      } ${
                        item.img ? 'uk-flex-middle' : 'uk-flex-top'
                      } uk-flex-1 uk-text-bold uk-flex`}
                    >
                      {item.title}
                    </h4>
                  )}
                  {showHorizontalDividers && (
                    <hr className="uk-divider-small uk-margin-remove-vertical" />
                  )}
                  {item.text && (
                    <div
                      className={`text ${
                        item.button ? '' : 'uk-margin-remove-bottom'
                      } ${
                        showHorizontalDividers ? 'uk-margin-medium-top' : ''
                      } ${
                        !showHorizontalDividers && item.title
                          ? 'uk-text-center'
                          : ''
                      } uk-flex-1 uk-margin-small-bottom`}
                    >
                      {item.text}
                    </div>
                  )}
                  {item.button && (
                    <div
                      className={`${
                        showHorizontalDividers
                          ? 'uk-flex-start'
                          : 'uk-flex-center'
                      } uk-flex uk-flex-middle uk-margin-small-top`}
                    >
                      <Button
                        href={item.button.href}
                        variant={item.button.variant || 'secondary'}
                        isExternal={item.button.external}
                        newTab={item.button.external}
                        toggle={item.button.modal}
                        onClick={item.button.onClick}
                        size={item.button.size}
                        dataTestId={item.button.dataTestId}
                      >
                        {item.button.label}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      />
    </div>
  );
};

MultipleCTA.defaultProps = {
  showNumbers: false,
  showHorizontalDividers: false,
  showVerticalDividers: false,
  spacing: 'large',
  className: '',
  animate: false,
};
