import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingEthicsCharter: FormSchema<{
  hasAcceptEthicsCharter: boolean;
}> = {
  id: 'form-onboarding-ethics-charter',
  fields: [
    {
      id: 'hasAcceptEthicsCharter',
      name: 'hasAcceptEthicsCharter',
      component: 'checkbox-alert',
      title: "J'accepte la charte éthique d'Entourage Pro",
      showLabel: true,
      isRequired: true,
    },
  ],
};
