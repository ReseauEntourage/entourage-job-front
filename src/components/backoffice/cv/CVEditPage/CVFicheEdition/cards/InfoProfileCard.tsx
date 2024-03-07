import React from 'react';
import CalendarIcon from 'assets/icons/calendar.svg';
import CarIcon from 'assets/icons/car.svg';
import DocumentIcon from 'assets/icons/document.svg';
import EmailIcon from 'assets/icons/email.svg';
import HomeIcon from 'assets/icons/home.svg';
import LocationIcon from 'assets/icons/location.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { CV } from 'src/api/types';
import { formEditUsefulInformation } from 'src/components/forms/schemas/formEditUsefulInformation';

import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, Card } from 'src/components/utils';
import { Contract, CONTRACTS } from 'src/constants';
import {
  AdminZone,
  Department,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import { StyledBlueIconContainer } from '../CVEdit/CVEdit.styles';

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
    // <div className="uk-card uk-card-primary uk-card-body">
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
          <StyledBlueIconContainer>
            <EmailIcon width={20} />
          </StyledBlueIconContainer>
          {email || 'Adresse mail non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <PhoneIcon width={20} />
          </StyledBlueIconContainer>
          {phone || 'Numéro de téléphone non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <HomeIcon width={20} />
          </StyledBlueIconContainer>
          {address || 'Adresse postale non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <DocumentIcon width={20} />
          </StyledBlueIconContainer>
          {contracts && contracts.length > 0
            ? contracts
                .map(({ name }) => {
                  return findConstantFromValue(name, CONTRACTS).label;
                })
                .join(' / ')
            : 'Type de contrat recherché non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <LocationIcon width={20} />
          </StyledBlueIconContainer>
          {sortedLocations && sortedLocations.length > 0
            ? sortedLocations
                .map(({ name }) => {
                  return findConstantFromValue(name, DEPARTMENTS_FILTERS).label;
                })
                .join(' / ')
            : 'Localisations non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <CalendarIcon width={20} />
          </StyledBlueIconContainer>
          {availability && availability !== ''
            ? availability
            : 'Disponibilités non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <UserIcon width={20} />
          </StyledBlueIconContainer>
          {languages && languages.length > 0
            ? languages
                .map(({ name }) => {
                  return name;
                })
                .join(' / ')
            : 'Langues apprises non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <StyledBlueIconContainer>
            <CarIcon width={20} />
          </StyledBlueIconContainer>
          {transport && transport !== ''
            ? transport
            : 'Moyen de transport non renseigné'}
        </Grid>
      </Grid>
      </Card>
  );
};
