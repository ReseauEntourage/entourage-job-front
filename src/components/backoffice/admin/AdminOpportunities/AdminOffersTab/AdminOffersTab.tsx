import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { AdminOffersTags, ADMIN_OFFERS_TAGS } from 'src/constants';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { StyledAdminTabsUl } from './AdminOffersTab.styles';

const uuidValue = uuid();

interface AdminOffersTabProps {
  activeStatus: AdminOffersTags;
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
        {ADMIN_OFFERS_TAGS.map(({ value, label }, k) => {
          const isActive = activeStatus === value;

          return (
            <li
              data-testid={`admin-offer-tab-${value}`}
              className={isActive ? 'active' : ''}
              key={`${k}-${uuidValue}`}
            >
              <Link
                href={{
                  pathname: basePath,
                  query: {
                    ...queryParamsOpportunities,
                    tag: value,
                  },
                }}
                scroll={false}
                shallow
                passHref
                legacyBehavior
              >
                {!isMobile ? (
                  <div>
                    <p>{label}</p>
                  </div>
                ) : (
                  label
                )}
              </Link>
            </li>
          );
        })}
      </StyledAdminTabsUl>
    </div>
  );
};
