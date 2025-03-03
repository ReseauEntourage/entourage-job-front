import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingEthicsCharter: FormSchema<{
  hasAcceptedEthicsCharter: boolean;
}> = {
  id: 'form-onboarding-ethics-charter',
  fields: [
    {
      id: 'hasAcceptedEthicsCharter',
      name: 'hasAcceptedEthicsCharter',
      component: 'checkbox-alert',
      title: "J'accepte la charte éthique d'Entourage Pro",
      showLabel: true,
      isRequired: true,
    },
  ],
};
