import {
  socialSituationFormFields,
  socialSituationFormSchema,
} from './SocialSituationFormSchema';
import { SocialSituationSchemaField } from './SocialSituationSchemaField';

export const Content = () => {
  return (
    <>
      {socialSituationFormFields.map((field) => (
        <SocialSituationSchemaField
          key={String(field.name)}
          formSchema={socialSituationFormSchema}
          field={field}
        />
      ))}
    </>
  );
};
