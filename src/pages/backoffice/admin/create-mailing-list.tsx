import React from 'react';
import { Api } from '@/src/api';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section, Alert, Text } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { StyledHeaderContainer } from '@/src/features/backoffice/alertCandidates/AlertCandidates.styles';
import { FormWithValidation } from '@/src/features/forms/FormWithValidation';
import { formAdminCreateMailingList } from '@/src/features/forms/schemas/fromAdminCreateMailingList';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';

const CreateMailingListPage = () => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  const onSubmit = (data: any) => {
    setLoading(true);
    const createMailingListDto = {
      recipientEmails: data.recipientEmails
        .split(/[\n,]+/)
        .map((email: string) => email.trim()),
      content: data.content,
    };
    Api.postMailingList(createMailingListDto)
      .then(() => {
        setSucceeded(true);
        setErrorMessage(null);
      })
      .catch((error) => {
        setSucceeded(false);
        setErrorMessage(
          error.response?.data?.message ||
            'Une erreur inattendue est survenue lors de la création de la mailing list.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section className="custom-page">
        <StyledHeaderContainer>
          <HeaderBackoffice
            title={`Créer une mailing list`}
            description="Ce formulaire vous permet de créer une mailing list pour envoyer des messages au travers de la messagerie à un groupe d'utilisateurs."
            noSeparator
          />
        </StyledHeaderContainer>
      </Section>
      <Section className="custom-page">
        {errorMessage && (
          <Alert variant={AlertVariant.Error}>{errorMessage}</Alert>
        )}
        {succeeded && (
          <Alert variant={AlertVariant.Success}>
            La mailing list a été créée avec succès. Vérifiez les envois dans le
            BullBoard au besoin. : {`${process.env.NEXT_PUBLIC_API_URL}/queues`}
          </Alert>
        )}
        {!succeeded && (
          <FormWithValidation
            formSchema={formAdminCreateMailingList}
            onSubmit={onSubmit}
            submitText="Envoyer la mailing list"
            disabled={loading}
          />
        )}
        {loading && <Text>Le formulaire est en cours de soumission...</Text>}
      </Section>
    </LayoutBackOffice>
  );
};

export default CreateMailingListPage;
