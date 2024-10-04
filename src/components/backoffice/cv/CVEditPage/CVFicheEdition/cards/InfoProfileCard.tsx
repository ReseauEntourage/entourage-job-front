import React from 'react';
import { CV } from 'src/api/types';
import { formEditUsefulInformation } from 'src/components/forms/schemas/formEditUsefulInformation';

import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, Card } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Contract, CONTRACTS } from 'src/constants';
import {
  AdminZone,
  Department,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface InfoProfileCardProps {
  contracts: {
    name: Contract;
  }[];
  locations: {
    name: Department;
    order: number;
  }[];
  availability: string;
  languages: {
    name: string;
  }[];
  transport: string;
  email: string;
  phone?: string;
  address: string;
  onChange: (
    updatedCV: Partial<CV>,
    updatedInfo: {
      email: string;
      phone: string;
      address: string;
    }
  ) => void;
  userZone: AdminZone;
}
export const InfoProfileCard = ({
  contracts,
  locations,
  availability,
  languages,
  transport,
  email,
  phone,
  address,
  onChange,
  userZone,
}: InfoProfileCardProps) => {
  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : [];

  return (
    <Card
      title="Infos pratiques"
      editCallback={() => {
        openModal(
          <ModalEdit
            title="Édition - Informations utiles"
            formSchema={formEditUsefulInformation}
            defaultValues={{
              userZone,
              availability,
              transport,
              email,
              phone,
              address,
              contracts: contracts.map(({ name }) => {
                return findConstantFromValue(name, CONTRACTS);
              }),
              languages: languages.map(({ name }) => {
                return { label: name, value: name };
              }),
              locations: sortByOrder(locations).map(({ name }) => {
                return findConstantFromValue(name, DEPARTMENTS_FILTERS);
              }),
            }}
            onSubmit={async ({ userZone: zone, ...fields }, closeModal) => {
              closeModal();
              const {
                email: updatedEmail,
                phone: updatedPhone,
                address: updatedAddress,
                ...updatedCV
              } = fields;

              onChange(
                {
                  ...updatedCV,
                  contracts: updatedCV.contracts.map(({ value }) => {
                    return {
                      name: value,
                    };
                  }),
                  languages: updatedCV.languages.map(({ value }) => {
                    return {
                      name: value,
                    };
                  }),
                  locations: updatedCV.locations.map(({ value }, index) => {
                    return {
                      name: value,
                      order: index,
                    };
                  }),
                },
                {
                  email: updatedEmail,
                  phone: updatedPhone,
                  address: updatedAddress,
                }
              );
            }}
          />
        );
      }}
    >
      <Grid column gap="small">
        <Grid row gap="small" middle>
          <LucidIcon
            name="MessageCircle"
            size={20}
            color={COLORS.primaryBlue}
          />
          {email || 'Adresse mail non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="Phone" size={20} color={COLORS.primaryBlue} />
          {phone || 'Numéro de téléphone non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="House" size={20} color={COLORS.primaryBlue} />
          {address || 'Adresse postale non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="FileText" size={20} color={COLORS.primaryBlue} />
          {contracts && contracts.length > 0
            ? contracts
                .map(({ name }) => {
                  return findConstantFromValue(name, CONTRACTS).label;
                })
                .join(' / ')
            : 'Type de contrat recherché non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="MapPin" size={20} color={COLORS.primaryBlue} />
          {sortedLocations && sortedLocations.length > 0
            ? sortedLocations
                .map(({ name }) => {
                  return findConstantFromValue(name, DEPARTMENTS_FILTERS).label;
                })
                .join(' / ')
            : 'Localisations non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="Calendar" size={20} color={COLORS.primaryBlue} />
          {availability && availability !== ''
            ? availability
            : 'Disponibilités non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="Globe" size={20} color={COLORS.primaryBlue} />
          {languages && languages.length > 0
            ? languages
                .map(({ name }) => {
                  return name;
                })
                .join(' / ')
            : 'Langues apprises non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <LucidIcon name="CarFront" size={20} color={COLORS.primaryBlue} />
          {transport && transport !== ''
            ? transport
            : 'Moyen de transport non renseigné'}
        </Grid>
      </Grid>
    </Card>
  );
};
