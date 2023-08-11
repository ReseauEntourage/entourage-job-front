import React from 'react';
import { formAddOpportunity } from 'src/components/forms/schemas/formAddOpportunity';
import { PostOpportunityModal } from './PostOpportunityModal';

export const PostPublicOfferModal = () => {
  const postPublicOfferModalProps = {
    defaultValues: {
      isPublic: true,
    },
    modalTitle: 'Proposer une opportunité',
    modalDesc:
      'Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats.',
    formSchema: formAddOpportunity,
  };

  return <PostOpportunityModal {...postPublicOfferModalProps} />;
};
