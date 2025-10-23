import React from 'react';
import { Text } from 'src/components/utils';
import {
  StyledMobileCollaboratorItem,
  StyledMobileCollaboratorItemField,
  StyledMobileCollaboratorsContainer,
} from './CompanyCollaboratorsTable.styles';
import { CompanyCollaboratorsTableProps } from './CompanyCollaboratorsTable.types';

export const CompanyCollaboratorsTableMobile = ({
  items,
}: CompanyCollaboratorsTableProps) => {
  return (
    <StyledMobileCollaboratorsContainer>
      {items.map((item) => (
        <StyledMobileCollaboratorItem key={item.id}>
          {/* Display name if not '-' */}
          {item.name === '-' ? null : (
            <StyledMobileCollaboratorItemField>
              <Text size="large" color="mediumGray">
                Nom
              </Text>
              <Text size="large" weight="bold">
                {item.name}
              </Text>
            </StyledMobileCollaboratorItemField>
          )}

          <StyledMobileCollaboratorItemField>
            <Text size="large" color="mediumGray">
              Mail
            </Text>
            <Text size="large" underline>
              {item.email}
            </Text>
          </StyledMobileCollaboratorItemField>

          {/* Display connectionCounter if not '-' */}
          {item.connectionCounter === '-' ? null : (
            <StyledMobileCollaboratorItemField>
              <Text size="large" color="mediumGray">
                Candidat(s) contacté(s)
              </Text>
              <Text size="large" weight="bold">
                {item.connectionCounter}
              </Text>
            </StyledMobileCollaboratorItemField>
          )}

          {/* Display account creation date if not '-' */}
          {item.accountCreated === '-' ? null : (
            <StyledMobileCollaboratorItemField>
              <Text size="large" color="mediumGray">
                Date de création du compte
              </Text>
              <Text size="large">{item.accountCreated}</Text>
            </StyledMobileCollaboratorItemField>
          )}

          {/* Display invited date if not '-' */}
          {item.invitedAt === '-' ? null : (
            <StyledMobileCollaboratorItemField>
              <Text size="large" color="mediumGray">
                Invitation envoyée
              </Text>
              <Text size="large">
                {item.invitedAt}
                {item.accountCreated === '-' && '- En attente de création'}
              </Text>
            </StyledMobileCollaboratorItemField>
          )}
        </StyledMobileCollaboratorItem>
      ))}
    </StyledMobileCollaboratorsContainer>
  );
};
