import { Alert, Card } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { StyledCardList } from './Content.styles';
import {
  personnalSocialSituationFormFields,
  professionnalSocialSituationFormFields,
  socialSituationFormSchema,
} from './SocialSituationFormSchema';
import { SocialSituationSchemaField } from './SocialSituationSchemaField';

export const Content = () => {
  return (
    <StyledCardList>
      <Alert variant={AlertVariant.Info}>
        Ces informations ne sont pas obligatoires, et ne seront pas
        communiquées.
      </Alert>

      <Card title="Informations personnelles">
        {personnalSocialSituationFormFields.map((field) => (
          <SocialSituationSchemaField
            key={String(field.name)}
            formSchema={socialSituationFormSchema}
            field={field}
          />
        ))}
      </Card>

      <Card title="Informations professionnelles">
        {professionnalSocialSituationFormFields.map((field) => (
          <SocialSituationSchemaField
            key={String(field.name)}
            formSchema={socialSituationFormSchema}
            field={field}
          />
        ))}
      </Card>
    </StyledCardList>
  );
};
