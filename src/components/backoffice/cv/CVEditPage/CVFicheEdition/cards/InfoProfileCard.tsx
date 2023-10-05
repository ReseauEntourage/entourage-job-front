import React from 'react';
import { CV } from 'src/api/types';
import { formEditUsefulInformation } from 'src/components/forms/schemas/formEditUsefulInformation';

import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon, Icon } from 'src/components/utils';
import { Contract, CONTRACTS } from 'src/constants';
import {
  AdminZone,
  Department,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
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
  phone: string;
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
    <div className="uk-card uk-card-primary uk-card-body">
      <Grid between gap="small" eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <Icon name="info" />
            </span>
          )}
          Infos pratiques
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
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
                  onSubmit={async (
                    { userZone: zone, ...fields },
                    closeModal
                  ) => {
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
                        locations: updatedCV.locations.map(
                          ({ value }, index) => {
                            return {
                              name: value,
                              order: index,
                            };
                          }
                        ),
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
          />
        )}
      </Grid>
      <Grid column gap="small">
        <Grid row gap="small" middle>
          <Icon name="mail" style={{ width: 20 }} />
          {email || 'Adresse mail non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="phone" style={{ width: 20 }} />
          {phone || 'Numéro de téléphone non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="home" style={{ width: 20 }} />
          {address || 'Adresse postale non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="file-text" style={{ width: 20 }} />
          {contracts && contracts.length > 0
            ? contracts
                .map(({ name }) => {
                  return findConstantFromValue(name, CONTRACTS).label;
                })
                .join(' / ')
            : 'Type de contrat recherché non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="location" style={{ width: 20 }} />
          {sortedLocations && sortedLocations.length > 0
            ? sortedLocations
                .map(({ name }) => {
                  return findConstantFromValue(name, DEPARTMENTS_FILTERS).label;
                })
                .join(' / ')
            : 'Localisations non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="linkedout-calendar" style={{ width: 20 }} />
          {availability && availability !== ''
            ? availability
            : 'Disponibilités non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="users" style={{ width: 20 }} />
          {languages && languages.length > 0
            ? languages
                .map(({ name }) => {
                  return name;
                })
                .join(' / ')
            : 'Langues apprises non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <Icon name="car" style={{ width: 20 }} />
          {transport && transport !== ''
            ? transport
            : 'Moyen de transport non renseigné'}
        </Grid>
      </Grid>
    </div>
  );
};
