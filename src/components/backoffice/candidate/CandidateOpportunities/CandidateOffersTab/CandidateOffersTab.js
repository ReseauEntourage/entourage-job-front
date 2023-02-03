import React from 'react';
import Link from 'next/link';
import { StyledTabsUl } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.styles';
import { uuid } from 'uuid/v4';
import {
  formatPlural,
  tabs,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import PropTypes from 'prop-types';
import { isSSR } from 'src/utils/isSSR';
import { BREAKPOINTS } from 'src/constants/styles';
import _ from 'lodash';

const CandidateOffersTab = ({ activeStatus, tabCounts }) => {
  const basePath = '/backoffice/candidat/offres/private';

  let isDesktop = true;
  if (!isSSR) {
    isDesktop = window.innerWidth >= BREAKPOINTS.desktop;
  }

  return (
    <div>
      <StyledTabsUl className={isDesktop ? '' : 'ul-mobile'}>
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
          let active;
          for (let i = 0; i < activeStatus.length; i += 1) {
            if (status.includes(activeStatus[i].value)) {
              active = true;
              break;
            }
          }
          return (
            <li className={active ? 'active' : ''} key={`${k}-${uuid}`}>
              {isDesktop ? (
                <Link href={`${basePath}${queryString}`}>
                  <div>
                    <span>{tabCount}</span>
                    <p>{text}</p>
                  </div>
                </Link>
              ) : (
                <Link href={`${basePath}${queryString}`}>
                  {`${tabCount} ${text}`}
                </Link>
              )}
            </li>
          );
        })}
      </StyledTabsUl>
    </div>
  );
};

CandidateOffersTab.propTypes = {
  activeStatus: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  tabCounts: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CandidateOffersTab;
