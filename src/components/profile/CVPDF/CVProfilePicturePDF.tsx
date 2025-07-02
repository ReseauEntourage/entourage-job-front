import React from 'react';
import { StyledCVPDFProfilePicture } from './CVPDF.styles';

export function CVProfilePicturePDF({
  imgSrc,
  verticalMargin = false,
}: {
  imgSrc: string;
  verticalMargin?: boolean;
}) {
  return (
    <StyledCVPDFProfilePicture imgSrc={imgSrc} verticalMargin={verticalMargin}>
      <div className="picture" />
      <div className="pseudo" />
    </StyledCVPDFProfilePicture>
  );
}
