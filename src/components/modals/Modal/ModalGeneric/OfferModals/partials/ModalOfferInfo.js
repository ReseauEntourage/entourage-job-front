import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel/ContractLabel';
import { useCopyToClipboard } from 'src/hooks';
import { IconNoSSR } from 'src/components/utils/Icon';

function translateCategory(isPublic, isRecommended, isExternal) {
  if (!isPublic) {
    if (isExternal) {
      return 'Offre externe';
    }
    return 'Offre privée';
  }
  if (isPublic) {
    return (
      <>
        Offre générale
        {isRecommended ? (
          <>
            {' '}
            recommandée&nbsp;
            <IconNoSSR name="bolt" ratio={0.8} className="ent-color-amber" />
          </>
        ) : (
          ''
        )}
      </>
    );
  }
  return 'Offre inconnue';
}

const ModalOfferInfo = ({
  offerId,
  title,
  isPublic,
  isRecommended,
  isExternal,
  contract,
  startOfContract,
  endOfContract,
  isPartTime,
  date,
  salary,
  driversLicense,
  workingHours,
}) => {
  const { copyToClipboard, hasBeenCopied, setHasBeenCopied, fade } =
    useCopyToClipboard();

  return (
    <div className="uk-flex uk-flex-column">
      <div className="uk-flex uk-flex-middle">
        <h3 className="uk-text-bold uk-margin-remove-bottom">{title}</h3>
        <ButtonIcon
          style={{ width: 30 }}
          ratio={0.8}
          className="uk-margin-small-left"
          tooltip="Copier le lien"
          name="link"
          onMouseLeave={() => {
            return setHasBeenCopied(false);
          }}
          onClick={() => {
            copyToClipboard(
              `${process.env.SERVER_URL}/backoffice/candidat/offres/${offerId}`
            );
          }}
        />
        {hasBeenCopied && (
          <span
            className={`uk-text-meta uk-text-italic uk-margin-small-left ${
              fade ? 'uk-animation-fade uk-animation-reverse' : ''
            }`}
          >
            Lien copié&nbsp;!
          </span>
        )}
      </div>
      <div className="uk-flex uk-flex-wrap uk-flex-middle uk-margin-small-top">
        <div className="uk-flex uk-flex-column uk-flex-center">
          <div className="uk-flex uk-flex-middle">
            {translateCategory(isPublic, isRecommended, isExternal)}
          </div>
          <ContractLabel
            contract={contract}
            endOfContract={endOfContract}
            startOfContract={startOfContract}
          />
          <div className="uk-text-small">
            {isPartTime ? 'Temps partiel' : 'Temps plein'}
          </div>
          {workingHours && <div className="uk-text-small">{workingHours}</div>}
        </div>
        {(salary || driversLicense) && (
          <div className="uk-flex">
            <hr className="uk-divider-vertical uk-visible@s uk-margin-small-right uk-margin-small-left uk-margin-remove-bottom" />
            <div className="uk-flex uk-flex-column uk-flex-center">
              {salary && (
                <div className="uk-flex uk-flex-middle">
                  <IconNoSSR
                    name="credit-card"
                    className="uk-margin-small-right"
                  />
                  {salary}
                </div>
              )}

              {driversLicense && (
                <div className="uk-flex uk-flex-middle">
                  <IconNoSSR
                    style={{ width: 20 }}
                    name="car"
                    className="uk-margin-small-right"
                  />
                  Permis requis
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="uk-text-italic uk-text-small uk-margin-small-top">
        offre soumise le {moment(date).format('DD/MM/YYYY')}
      </div>
    </div>
  );
};

ModalOfferInfo.propTypes = {
  offerId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  isRecommended: PropTypes.bool,
  isExternal: PropTypes.bool,
  date: PropTypes.string.isRequired,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  isPartTime: PropTypes.bool.isRequired,
  salary: PropTypes.string,
  driversLicense: PropTypes.string,
  workingHours: PropTypes.string,
};

ModalOfferInfo.defaultProps = {
  contract: undefined,
  isRecommended: false,
  isExternal: false,
  endOfContract: undefined,
  startOfContract: undefined,
  salary: undefined,
  driversLicense: undefined,
  workingHours: undefined,
};

export default ModalOfferInfo;
