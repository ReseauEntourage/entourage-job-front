import React from 'react';
import { formAddPrivateOpportunity } from 'src/components/forms/schemas/formAddPrivateOpportunity';
import { PostOpportunityModal } from './PostOpportunityModal';

export const PostPublicOfferModal = () => {
  const postPublicOfferModalProps = {
    defaultValues: {
      isPublic: true,
    },
    modalTitle: 'Proposer une opportunité',
    modalDesc:
      'Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats.',
    formSchema: formAddPrivateOpportunity,
  };

  return <PostOpportunityModal {...postPublicOfferModalProps} />;
};
