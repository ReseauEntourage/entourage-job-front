import React from 'react';
import EmailIcon from 'assets/custom/icons/email.svg';
import HomeIcon from 'assets/custom/icons/home.svg';
import LocationIcon from 'assets/custom/icons/location.svg';
import PhoneIcon from 'assets/custom/icons/phone.svg';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import {
  StyledCVPDFContentInformations,
  StyledCVPDFTitle,
} from './CVPDF.styles';

interface ContactInformationPDFProps {
  phone: string;
  email?: string;
  address: string;
  locations: {
    name: Department;
    order: number;
  }[];
}

export function ContactInformationPDF({
  phone,
  email,
  address,
  locations,
}: ContactInformationPDFProps) {
  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : [];
  return (
    <StyledCVPDFContentInformations>
      <StyledCVPDFTitle>Contact</StyledCVPDFTitle>
      <ul>
        {phone && (
          <li>
            <div>
              <p className="subtitle">
                <PhoneIcon viewBox="0 0 6 6" /> <span>Numéro de téléphone</span>
              </p>
              <p className="content">{phone}</p>
            </div>
          </li>
        )}
        {email && (
          <li>
            <div>
              <p className="subtitle">
                <EmailIcon viewBox="0 0 6 6" /> <span>Email</span>
              </p>
              <p className="content">{email}</p>
            </div>
          </li>
        )}
        <ul>
          {address && (
            <li>
              <div>
                <p className="subtitle">
                  <HomeIcon viewBox="0 0 576 512" /> <span>Adresse</span>
                </p>
                <p className="content">{address}</p>
              </div>
            </li>
          )}
        </ul>
        {sortedLocations && sortedLocations.length > 0 && (
          <li>
            <div>
              <p className="subtitle">
                <LocationIcon viewBox="0 0 384 512" /> <span>Localisation</span>
              </p>
              <p className="content">
                {locations
                  .map(({ name }) => {
                    return findConstantFromValue(name, DEPARTMENTS_FILTERS)
                      .label;
                  })
                  .join(' / ')}
              </p>
            </div>
          </li>
        )}
      </ul>
    </StyledCVPDFContentInformations>
  );
}
