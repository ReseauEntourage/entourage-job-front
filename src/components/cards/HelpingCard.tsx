import React from 'react';
import { Img } from 'src/components/utils';

interface HelpingCardProps {
  titleHead: string;
  titleMiddle: string;
  titleTail: string;
  description: string;
  img: string;
  alt?: string;
}

export const HelpingCard = ({
  titleHead,
  titleMiddle,
  titleTail,
  description,
  img,
  alt,
}: HelpingCardProps) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-height-small uk-text-center">
        <Img alt={alt} src={img} className="uk-height-1-1" />
      </div>
      <div>
        <h3 className="uk-text-bold">
          {titleHead}
          <span className="uk-text-primary">{titleMiddle}</span>
          {titleTail}
        </h3>
      </div>
      <p>{description}</p>
    </div>
  );
};

HelpingCard.defaultProps = {
  alt: undefined,
};
