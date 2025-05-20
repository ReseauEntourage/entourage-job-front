import React from 'react';
import { StyledCVPDFProfilePicture } from './CVPDF.styles';

export function CVProfilePicturePDF({
  urlImg,
  verticalMargin = false,
}: {
  urlImg: string;
  verticalMargin?: boolean;
}) {
  return (
    <StyledCVPDFProfilePicture
      imgSrc={`${process.env.NEXT_PUBLIC_AWSS3_CDN_URL}/${urlImg}`}
      verticalMargin={verticalMargin}
    >
      <div className="picture" />
      <div className="pseudo" />
    </StyledCVPDFProfilePicture>
  );
}
