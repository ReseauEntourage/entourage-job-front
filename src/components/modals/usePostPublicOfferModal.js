import schema from 'src/components/forms/schema/formEditOpportunity';
import { mutateFormSchema } from 'src/utils';
import { usePostOpportunity } from 'src/hooks';

function usePostPublicOfferModal() {
  const mutatedSchema = mutateFormSchema(
    schema,
    [
      {
        fieldId: 'candidatesIds',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'isPublic',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'message',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
    ],
    'post-job-ad'
  );

  const { PostOpportunityModal } = usePostOpportunity({
    defaultValues: {
      isPublic: true,
    },
    modalTitle: 'Proposer une opportunité',
    modalDesc:
      'Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats.',
    schema: mutatedSchema,
  });

  return PostOpportunityModal;
}

export default usePostPublicOfferModal;
