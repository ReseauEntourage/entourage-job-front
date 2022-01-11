import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';
import { useCopyToClipboard } from 'src/hooks';
import { IconNoSSR } from 'src/components/utils/Icon';

function translateCategory(isPublic, isRecommended) {
  if (!isPublic) return 'Offre privée';
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
  contract,
  startOfContract,
  endOfContract,
  numberOfPositions,
  isPartTime,
  date,
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
      <div className="uk-flex uk-flex-middle">
        {translateCategory(isPublic, isRecommended)}
      </div>
      <ContractLabel
        contract={contract}
        endOfContract={endOfContract}
        startOfContract={startOfContract}
      />
      <div className="uk-text-small">
        {numberOfPositions} poste
        {numberOfPositions > 1 ? 's' : ''} -{' '}
        {isPartTime ? 'Temps partiel' : 'Temps plein'}
      </div>
      <div className="uk-text-italic uk-text-small">
        offre soumise le {moment(date).format('DD/MM/YYYY')}
      </div>
    </div>
  );
};

ModalOfferInfo.propTypes = {
  offerId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  isRecommended: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  isPartTime: PropTypes.bool.isRequired,
  numberOfPositions: PropTypes.number.isRequired,
};

ModalOfferInfo.defaultProps = {
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
};

export default ModalOfferInfo;
