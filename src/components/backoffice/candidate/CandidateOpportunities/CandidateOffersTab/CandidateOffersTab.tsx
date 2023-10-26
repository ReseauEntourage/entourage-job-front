import _ from 'lodash';
import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { StyledTabsUl } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.styles';
import {
  formatPlural,
  tabs,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';

const uuidValue = uuid();

interface CandidateOffersTabProps {
  activeStatus: {
    value: number;
    label: string;
    color: string;
    public: string;
  }[];
  tabCounts: {
    status: number;
    count: number;
  }[];
  candidateId: string;
  isMobile: boolean;
}

export const CandidateOffersTab = ({
  activeStatus,
  tabCounts,
  candidateId,
  isMobile = false,
}: CandidateOffersTabProps) => {
  const basePath = `/backoffice/candidat/${candidateId}/offres/private`;

  return (
    <div>
      <StyledTabsUl className={!isMobile ? '' : 'ul-mobile'}>
        {tabs.map(({ status, text }, k) => {
          let queryString = '?';
          let tabCount = 0;
          for (let i = 0; i < status.length; i += 1) {
            if (_.isInteger(status[i])) {
              queryString += `status=${status[i]}`;
              if (i < status.length - 1 && _.isInteger(status[i + 1])) {
                queryString += '&';
              }
            }

            if (tabCounts) {
              for (let j = 0; j < tabCounts.length; j += 1) {
                if (status[i] === tabCounts[j].status) {
                  tabCount += tabCounts[j].count * 1;
                }
              }
            }
          }
          text = formatPlural(text, tabCount);

          const isActive = activeStatus.some((singleActiveStatus) => {
            return (
              singleActiveStatus && status.includes(singleActiveStatus.value)
            );
          });

          return (
            <li className={isActive ? 'active' : ''} key={`${k}-${uuidValue}`}>
              <Link href={`${basePath}${queryString}`}>
                {!isMobile ? (
                  <div>
                    <span>{tabCount}</span>
                    <p>{text}</p>
                  </div>
                ) : (
                  `${tabCount} ${text}`
                )}
              </Link>
            </li>
          );
        })}
      </StyledTabsUl>
    </div>
  );
};
