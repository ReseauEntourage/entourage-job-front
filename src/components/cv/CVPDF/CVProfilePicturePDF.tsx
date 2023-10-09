import React from 'react';
import { addPrefix } from 'src/utils';
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
      imgSrc={process.env.AWSS3_CDN_URL + addPrefix(urlImg)}
      verticalMargin={verticalMargin}
    >
      <div className="picture" />
      <div className="pseudo" />
    </StyledCVPDFProfilePicture>
  );
}
