import React from 'react';
import { Text } from '@/src/components/ui';
import {
  StyledMobileCollaboratorItem,
  StyledMobileCollaboratorItemField,
  StyledMobileCollaboratorsContainer,
} from '@/src/features/backoffice/companies/CompanyCollaboratorsList/CompanyCollaboratorsTable/CompanyCollaboratorsTable.styles';
import { RefererCandidatesTableProps } from './RefererCandidatesTable.types';

export const RefererCandidatesTableMobile = ({
  items,
}: RefererCandidatesTableProps) => {
  return (
    <StyledMobileCollaboratorsContainer>
      {items.map((item) => (
        <StyledMobileCollaboratorItem key={item.id}>
          <StyledMobileCollaboratorItemField>
            <Text size="large" color="mediumGray">
              Nom
            </Text>
            <Text size="large" weight="bold">
              {item.name}
            </Text>
          </StyledMobileCollaboratorItemField>

          <StyledMobileCollaboratorItemField>
            <Text size="large" color="mediumGray">
              Email
            </Text>
            <Text size="large" underline>
              {item.email}
            </Text>
          </StyledMobileCollaboratorItemField>

          <StyledMobileCollaboratorItemField>
            <Text size="large" color="mediumGray">
              Coachs contactés
            </Text>
            <Text size="large" weight="bold">
              {item.coachesContactedCount}
            </Text>
          </StyledMobileCollaboratorItemField>

          <StyledMobileCollaboratorItemField>
            <Text size="large" color="mediumGray">
              Invitation envoyée
            </Text>
            <Text size="large">
              {item.referredAt}
              {item.accountCreatedAt === '-' && " — En attente d'activation"}
            </Text>
          </StyledMobileCollaboratorItemField>

          {item.accountCreatedAt !== '-' && (
            <StyledMobileCollaboratorItemField>
              <Text size="large" color="mediumGray">
                Intégration finalisée le
              </Text>
              <Text size="large">{item.accountCreatedAt}</Text>
            </StyledMobileCollaboratorItemField>
          )}
        </StyledMobileCollaboratorItem>
      ))}
    </StyledMobileCollaboratorsContainer>
  );
};
