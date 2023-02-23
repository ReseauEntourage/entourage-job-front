import React, { useEffect, useState } from 'react';
import { StyledDetailsProgressBar } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/DetailsProgressBar/DetailsProgressBar.styles';
import uuid from 'uuid/v4';
import { useIsDesktop } from 'src/hooks/utils/usePlatforms';
import PropTypes from 'prop-types';

const DetailsProgressBar = ({ tab, noProcess }) => {
  const isDesktop = useIsDesktop();
  const [steps, setSteps] = useState();
  const renderClassNames = (className, index, array) => {
    for (let i = 0; i <= index; i += 1) {
      array[i].className = className;
    }
    setSteps(array);
  };
  useEffect(() => {
    const basicSteps = [
      {
        text: 'A traiter',
        mobile: 'A traiter',
        className: '',
      },
      {
        text: 'Contactée',
        mobile: 'Contactée',
        className: '',
      },
      {
        text: "En phase d'entretien",
        mobile: 'Entretien',
        className: '',
      },
      {
        text: "Réponse de l'offre",
        mobile: 'Réponse',
        className: '',
      },
    ];
    if (noProcess) {
      renderClassNames('', -1, basicSteps);
    } else if (tab === 0) {
      renderClassNames('fullOrange', 0, basicSteps);
    } else if (tab === 1) {
      renderClassNames('fullOrange', 1, basicSteps);
    } else if (tab === 2) {
      renderClassNames('fullOrange', 2, basicSteps);
    } else if (tab === 3) {
      renderClassNames('fullRed', 3, basicSteps);
    } else if (tab === 4) {
      renderClassNames('fullGreen', 3, basicSteps);
    }
  }, [tab, noProcess]);
  return (
    <StyledDetailsProgressBar>
      {steps &&
        steps.map(({ text, className, mobile }) => {
          return (
            <div key={uuid()} className={className}>
              {isDesktop ? text : mobile}
            </div>
          );
        })}
    </StyledDetailsProgressBar>
  );
};

DetailsProgressBar.propTypes = {
  tab: PropTypes.number.isRequired,
  noProcess: PropTypes.bool.isRequired,
};

export default DetailsProgressBar;
