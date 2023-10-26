import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { adminOffersTags } from 'src/constants';
import { StyledAdminTabsUl } from './AdminOffersTab.styles';
import {
  adminTabs,
  // adminTabsLabels, TabsLabelsType, adminTabsStatus
} from './AdminOffersTab.utils';

const uuidValue = uuid();

interface AdminOffersTabProps {
  activeStatus: {
    value: adminOffersTags;
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
  return (
    <div>
      <StyledAdminTabsUl className={!isMobile ? '' : 'ul-mobile'}>
        {adminTabs.map(({ value, label }, k) => {
          const queryString = `?tag=${value}`;

          const isActive = activeStatus?.value === value;

          return (
            <li className={isActive ? 'active' : ''} key={`${k}-${uuidValue}`}>
              <Link href={`${basePath}${queryString}`}>
                {!isMobile ? (
                  <div>
                    {/* <span>{tabCount}</span> */}
                    <p>{label}</p>
                  </div>
                ) : (
                  // `${/*tabCount*/} ${label}`
                  ''
                )}
              </Link>
            </li>
          );
        })}
      </StyledAdminTabsUl>
    </div>
  );
};
