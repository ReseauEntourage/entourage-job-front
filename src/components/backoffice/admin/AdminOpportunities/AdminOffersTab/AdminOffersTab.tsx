import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { AdminOffersTags } from 'src/constants';
import { StyledAdminTabsUl } from './AdminOffersTab.styles';
import {
  adminTabs,
  //   adminTabsLabels, TabsLabelsType, adminTabsStatus
} from './AdminOffersTab.types';

const uuidValue = uuid();

interface AdminOffersTabProps {
  activeStatus: {
    value: AdminOffersTags;
    label: string;
  };
  // tabCounts?: {
  //     tag: string;
  //     count: number;
  // }[];
  isMobile: boolean;
}

export const AdminOffersTab = ({
  activeStatus,
  // tabCounts,
  isMobile = false,
}: AdminOffersTabProps) => {
  const basePath = `/backoffice/admin/offres`;
  const queryParamsOpportunities = useQueryParamsOpportunities();

  return (
    <div>
      <StyledAdminTabsUl className={!isMobile ? '' : 'ul-mobile'}>
        {adminTabs.map(({ value, label }, k) => {
          const isActive = activeStatus?.value === value;

          return (
            <li className={isActive ? 'active' : ''} key={`${k}-${uuidValue}`}>
              <Link
                href={{
                  pathname: basePath,
                  query: {
                    ...queryParamsOpportunities,
                    tag: value,
                  },
                }}
              >
                {!isMobile ? (
                  <div>
                    <p>{label}</p>
                  </div>
                ) : (
                  <>{label}</>
                )}
              </Link>
            </li>
          );
        })}
      </StyledAdminTabsUl>
    </div>
  );
};
