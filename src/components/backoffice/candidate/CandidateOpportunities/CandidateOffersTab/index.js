import React from 'react';
import Link from 'next/link';
import { StyledTabsUl } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/styles';
import { uuid } from 'uuid/v4';

const CandidateOffersTab = ({ activeTab }) => {
  const basePath = '/backoffice/candidat/offres/private';
  const tabs = [
    {
      status: [-1],
      text: 'offres à traiter',
    },
    {
      status: [0],
      text: 'offres contactées',
    },
    {
      status: [1],
      text: "offres en phase d'entretien",
    },
    {
      status: [3, 4],
      text: 'offres abandonnées',
    },
    {
      status: [2],
      text: 'offres acceptées',
    },
  ];
  console.log(activeTab);
  return (
    <StyledTabsUl>
      {tabs.map(({ status, text }, k) => {
        let queryString = '?';
        for (let i = 0; i < status.length; i += 1) {
          queryString += `status=${status[i]}`;
          if (i < status.length - 1) queryString += '&';
        }
        console.log(queryString);
        return (
          <li
            className={
              JSON.stringify(
                activeTab.map((t) => {
                  return t.value;
                })
              ) === JSON.stringify(status)
                ? 'active'
                : ''
            }
            key={`${k}-${uuid}`}
          >
            <Link href={`${basePath}${queryString}`}>{text}</Link>
          </li>
        );
      })}
    </StyledTabsUl>
  );
};

export default CandidateOffersTab;
