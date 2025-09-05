import React from 'react';
import { BusinessSector, User } from '@/src/api/types';
import { CompanyCard } from '@/src/components/utils/Cards/EntityCards/CompanyCard/CompanyCard';
import { CardListItem } from 'src/components/utils/CardList';

interface DirectoryCompanyItemProps {
  id: string;
  name: string;
  businessSectors: BusinessSector[];
  users: User[];
  logoUrl?: string;
}

export function DirectoryCompanyItem({
  id,
  name,
  businessSectors,
  users,
  logoUrl,
}: DirectoryCompanyItemProps) {
  return (
    <CardListItem dataTestId={id}>
      <CompanyCard
        id={id}
        name={name}
        businessSectors={businessSectors}
        users={users}
        logoUrl={logoUrl}
      />
    </CardListItem>
  );
}
