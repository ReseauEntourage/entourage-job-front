import React from 'react';
import { ImgProfile } from '../ImgProfile';

interface ImgCompanyProfileProps {
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  size?: number;
  highlight?: boolean;
}

export const ImgCompanyProfile = ({
  company,
  size = 40,
  highlight = false,
}: ImgCompanyProfileProps) => {
  return (
    <ImgProfile
      pictureUrl={company.logoUrl || null}
      placeholder={company.name}
      size={size}
      highlight={highlight}
      alt={`Logo de ${company.name}`}
    />
  );
};
