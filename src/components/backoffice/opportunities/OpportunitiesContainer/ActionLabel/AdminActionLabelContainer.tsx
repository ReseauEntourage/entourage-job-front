import React from 'react';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';

interface AdminActionLabelContainerProps {
  isPublic: boolean;
  isExternal: boolean;
}
export const AdminActionLabelContainer = ({
  isPublic,
  isExternal,
}: AdminActionLabelContainerProps) => {
  return (
    <>
      {!isPublic && !isExternal && (
        <ActionLabel disabled fill color="primaryOrange" label="Offre privée" />
      )}
      {isPublic && !isExternal && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Offre générale"
        />
      )}
      {isExternal && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Offre externe"
        />
      )}
    </>
  );
};
