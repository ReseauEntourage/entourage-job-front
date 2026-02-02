import {
  FileTypes,
  FormComponents,
  FormSchema,
} from '@/src/features/forms/FormSchema';

export const formOnboardingCandidateJob: FormSchema<{
  linkedinUrl: string;
  externalCv: File;
}> = {
  id: 'form-onboarding-candidate-job',
  fields: [
    {
      id: 'externalCv',
      name: 'externalCv',
      title: 'Ajoutez votre CV pour mettre en avant vos compétences',
      component: FormComponents.FILE,
      fileType: FileTypes.CV,
      showLabel: true,
      accept: '.pdf',
    },
    {
      id: 'infoExternalCv',
      name: 'infoExternalCv',
      component: FormComponents.TEXT,
      title: 'Seul un CV au format PDF est accepté',
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title:
        'Ajoutez votre profil LinkedIn pour que les membres le découvrent et vous y soutiennent aussi',
      placeholder: 'Ajouter le lien LinkedIn',
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              (!!fieldValue && fieldValue.includes('linkedin.com'))
            );
          },
          message: 'Doit être un lien Linkedin valide',
        },
      ],
    },
  ],
};
