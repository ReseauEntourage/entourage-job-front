import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { CompanyWithUsers } from '@/src/api/types';
import { CompanyCollaboratorsList } from '@/src/components/backoffice/companies/CompanyCollaboratorsTable/CompanyCollaboratorsTable';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { notificationsActions } from '@/src/use-cases/notifications';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const CompanyCollaboratorsPage = () => {
  const dispatch = useDispatch();
  const { selectedCompany } = useSelectedCompany();

  const [companyWithCollaborators, setCompanyWithCollaborators] =
    React.useState<CompanyWithUsers | null>(null);
  const [fetchCollaboratorsLoading, setFetchCollaboratorsLoading] =
    React.useState(true);

  /**
   * Fetches the collaborators of the selected company.
   * This effect runs when the selected company changes.
   * It retrieves the company data along with its users and pending invitations.
   * If the company is not selected, it does not fetch any data.
   * If an error occurs during the fetch, it dispatches a notification.
   */
  useEffect(() => {
    if (selectedCompany && selectedCompany.id) {
      setFetchCollaboratorsLoading(true);
      Api.getCompanyByIdWithUsersAndPendingInvitations(selectedCompany.id)
        .then((response) => {
          setCompanyWithCollaborators(response.data);
          setFetchCollaboratorsLoading(false);
        })
        .catch((error) => {
          setFetchCollaboratorsLoading(false);
          console.error('Error fetching company collaborators:', error);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise",
            })
          );
        });
    }
  }, [dispatch, selectedCompany]);

  return (
    <LayoutBackOffice title="Gestion de vos collaborateurs">
      {companyWithCollaborators && !fetchCollaboratorsLoading ? (
        <CompanyCollaboratorsList
          companyWithCollaborators={companyWithCollaborators}
        />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default CompanyCollaboratorsPage;
