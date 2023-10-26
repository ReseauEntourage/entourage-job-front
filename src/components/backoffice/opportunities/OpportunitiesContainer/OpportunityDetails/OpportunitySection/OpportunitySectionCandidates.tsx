import React from 'react';
import { ActionLabel } from '../../ActionLabel/ActionLabel';
import {
  AdminOpportunityWithOpportunityUsers,
  //   OpportunityUser,
  UserCandidateWithUsers,
} from 'src/api/types';
import { Icon } from 'src/components/utils';
// import { Select } from 'src/components/utils/Inputs';
// import { OFFER_STATUS } from 'src/constants';
// import { mutateDefaultOfferStatus } from 'src/utils';
import { StyledOpportunitySectionList } from './OpportunitySection.styles';

interface OpportunitySectionCandidatesProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
}

const statusToTitle = (status) => {
  const titles = {
    '-1': 'A traiter',
    '0': 'Contactée',
    '1': "En phase d'entretien",
    '2': 'Abandonnée',
    '3': 'Acceptée',
  };
  return titles[status.toString()];
};

export const OpportunitySectionCandidates = ({
  opportunity,
}: OpportunitySectionCandidatesProps) => {
  const { opportunityUsers } = opportunity;
  return (
    <StyledOpportunitySectionList>
      {opportunityUsers.map((opportunityuser) => {
        const {
          recommended,
          user,
          status,
          // id,
        } = opportunityuser;
        const userInfo = user as UserCandidateWithUsers;
        // const options = OFFER_STATUS.slice(opportunity.isExternal ? 1 : 0).map(
        //   (status) => {
        //     return { label: status.label, value: status.value };
        //   }
        // );

        return (
          <li>
            <span>
              {userInfo?.firstName} {userInfo?.lastName}
            </span>
            <span>
              {statusToTitle(status)}
              {/* <Select 
                                id={`oppotunity-user-${id}-select`}
                                name=""
                                title=""
                                options={options}
                                onChange={async (event) => {
                                    // await updateOpportunityUser({
                                    //   ...opportunityuser,
                                    //   status: parseInt(event.target.value, 10),
                                    // });
                                  }}
                                value={options.find(option => option.value === status)[0]?.value}
                            /> */}
            </span>
            <span>
              {recommended && (
                <ActionLabel
                  disabled
                  fill
                  color="primaryOrange"
                  label="Recommandé"
                  icon={<Icon name="entourage" ratio={0.8} />}
                />
              )}
            </span>
          </li>
        );
      })}
    </StyledOpportunitySectionList>
  );
};
