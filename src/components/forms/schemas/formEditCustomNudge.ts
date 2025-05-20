import { FormComponents, FormSchema } from '../FormSchema';

export const formEditCustomNudge: FormSchema<{
  content: string;
}> = {
  id: 'form-skills',
  fields: [
    {
      id: 'content',
      name: 'content',
      component: FormComponents.TEXTAREA,
      placeholder:
        'Ecrivez le détail de votre demande pour aider les coachs à mieux comprendre votre besoin.\nEx : J’aimerai que vous donniez des conseils sur mon CV pour un poste de Vendeur.',
    },
  ],
};
