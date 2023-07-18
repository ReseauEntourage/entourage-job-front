import React from 'react';
import { Grid, Carousel, Logo } from 'src/components/utils';

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
  const logosPerLine = Math.floor(logos.length / 3 + 1);

  if (carousel) {
    return (
      <Carousel
        containerClasses="uk-child-width-auto"
        pagination={false}
        padding={padding}
      >
        {logos.map(({ key, link, bis }) => {
          return (
            <div
              key={key}
              className="uk-margin-medium-left uk-margin-medium-right"
            >
              <Logo logoKey={key} link={link} bis={bis} />
            </div>
          );
        })}
      </Carousel>
    );
  }
  return (
    <div
      className={`${
        background ? 'uk-background-default' : ''
      } uk-border-rounded ${padding ? 'uk-padding-small' : ''}`}
    >
      <Grid
        childWidths={[`1-${logosPerLine <= 3 ? 3 : logosPerLine}@m`, 'auto']}
        match
        middle
        center
        gap="small"
        items={logos.map(({ key, link, bis }) => {
          return <Logo key={key} logoKey={key} link={link} bis={bis} />;
        })}
      />
    </div>
  );
};

LogoList.defaultProps = {
  carousel: false,
  padding: false,
  background: false,
};
