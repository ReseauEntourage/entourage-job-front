import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CompanyIcon } from '@/assets/icons/icons';
import { ReduxRequestEvents } from '@/src/constants';
import { COLORS } from '@/src/constants/styles';
import { updateCompanyLogoSelectors } from '@/src/use-cases/company';
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
  const [hash, setHash] = useState<number>(Date.now());

  const updateCompanyLogoStatus = useSelector(
    updateCompanyLogoSelectors.selectUpdateCompanyLogoStatus
  );

  useEffect(() => {
    if (updateCompanyLogoStatus === ReduxRequestEvents.SUCCEEDED) {
      setHash(Date.now());
    }
  }, [updateCompanyLogoStatus]);

  if (!company.logoUrl) {
    return <CompanyIcon width={size} height={size} />;
  }

  return (
    <ImgProfile
      pictureUrl={company.logoUrl ? `${company.logoUrl}?${hash}` : null}
      placeholder={company.name}
      size={size}
      highlight={highlight}
      alt={`Logo de ${company.name}`}
      cover={false}
      bgColor={COLORS.white}
    />
  );
};
