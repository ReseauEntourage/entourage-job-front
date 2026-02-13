import { FormComponents, FormSchema } from '../FormSchema';

export const formEditCustomNudgeCandidate: FormSchema<{
  content: string;
}> = {
  id: 'form-skills',
  fields: [
    {
      id: 'content',
      name: 'content',
      component: FormComponents.TEXTAREA,
      placeholder:
        'Détaillez votre demande pour aider les coachs à bien comprendre votre besoin.\nEx. : J’aimerais des conseils sur mon CV pour un poste de vendeur.',
    },
  ],
};

export const formEditCustomNudgeCoach: FormSchema<{
  content: string;
}> = {
  id: 'form-skills',
  fields: [
    {
      id: 'content',
      name: 'content',
      component: FormComponents.TEXTAREA,
      placeholder:
        'Détaillez les coups de pouce que vous pouvez apporter aux candidats.\nEx. : Je peux simuler un entretien pour un poste dans le secteur du bâtiment, que je connais très bien.',
    },
  ],
};
