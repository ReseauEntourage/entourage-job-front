import React from 'react';
import { gaEvent } from 'src/lib/gtag';
import { GA_TAGS } from 'src/constants/tags';
import { openModal } from 'src/components/modals/Modal';
import usePostPublicOfferModal from 'src/components/modals/usePostPublicOfferModal';

const GlobalOffer = () => {
  const PublicOfferModal = usePostPublicOfferModal();
  return (
    <h4 className="uk-text-bold uk-margin-large-top uk-text-center">
      Vous n&apos;avez pas trouvé de profils qui correspondent à vos besoins de
      recrutement ? Pas de problème&nbsp;! Dès la rentrée, plus de 160 candidats
      LKO s&apos;apprêtent à se lancer dans la recherche d&apos;une nouvelle
      expérience professionnelle&nbsp;!
      <br />
      <br />
      <a
        style={{ textDecoration: 'underline' }}
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
          openModal(<PublicOfferModal />);
        }}
      >
        Laissez-nous votre contact ou votre besoin et nous revenons vers vous.
      </a>
    </h4>
  );
};

export default GlobalOffer;
