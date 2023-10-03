import React from 'react';
import { addPrefix } from 'src/utils';
import { StyledCVPDFProfilePicture } from './CVPDF.styles';

export function CVProfilePicturePDF({ urlImg }: { urlImg: string }) {
  return (
    <StyledCVPDFProfilePicture
      imgSrc={process.env.AWSS3_CDN_URL + addPrefix(urlImg)}
    >
      <div className="picture" />
      <div className="pseudo" />
    </StyledCVPDFProfilePicture>
  );
}
