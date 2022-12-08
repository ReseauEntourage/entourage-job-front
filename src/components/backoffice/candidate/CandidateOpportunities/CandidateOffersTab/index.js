import React from 'react';
import Link from 'next/link';
import { StyledTabsUl } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/styles';

const CandidateOffersTab = () => {
  const basePath = '/backoffice/candidat/offres/private';
  return (
    <StyledTabsUl>
      <li>
        <Link href={`${basePath}?status=-1&bookmarked=true`}>
          offres à traiter
        </Link>
      </li>
      <li>
        <Link href={`${basePath}?status=0`}>offres contactées</Link>
      </li>
      <li>
        <Link href={`${basePath}?status=1`}>offres en phase d'entretien</Link>
      </li>
      <li>
        <Link href={`${basePath}?status=3&status=4`}>offres abandonnées</Link>
      </li>
      <li>
        <Link href={`${basePath}?status=2`}>offres acceptées</Link>
      </li>
    </StyledTabsUl>
  );
};

export default CandidateOffersTab;
