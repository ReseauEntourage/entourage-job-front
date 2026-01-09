import React, { useCallback } from 'react';
import { BusinessSector, Department } from '@/src/api/types';
import {
  Section,
  Text,
  Tag,
  ImgCompanyProfile,
  Button,
} from '@/src/components/ui';
import { BackLink } from '@/src/components/ui/BackLink';
import { useIsMobile } from '@/src/hooks/utils';
import { CompanyInfosModalEdit } from '../../../features/backoffice/companies/modals/CompanyInfosModalEdit';
import { openModal } from '../../modals/Modal';
import {
  StyledHeaderCompany,
  StyledHeaderCompanyContent,
  StyledHeaderCompanyInfoContainer,
  StyledHeaderCompanyNameContainer,
  StyledHeaderCompanyPicture,
  StyledHeaderCompanyPictureContainer,
  StyledHeaderCompanyPublicInfoContainer,
  StyledHeaderNameAndRole,
} from './HeaderCompany.styles';
import { useHeaderCompany } from './useHeaderCompany';

export interface HeaderCompanyProps {
  isEditable?: boolean;
  id: string;
  name: string;
  logoUrl?: string;
  businessSectors?: BusinessSector[];
  department?: Department;
}

export const HeaderCompany = ({
  id,
  name,
  logoUrl,
  businessSectors,
  department,
  isEditable = false,
}: HeaderCompanyProps) => {
  const isMobile = useIsMobile();
  const { updateCompany } = useHeaderCompany(id);

  const openEditCompany = useCallback(() => {
    openModal(
      <CompanyInfosModalEdit
        dispatchOnSubmit={(fields) => {
          updateCompany(fields);
        }}
        department={department}
        businessSectors={businessSectors}
      />
    );
  }, [businessSectors, department, updateCompany]);

  const COMPANY_PICTURE_SIZE = isMobile ? 75 : 145;

  return (
    <StyledHeaderCompany>
      <Section className="custom-page">
        <BackLink label="Retour" />
        <StyledHeaderCompanyContent>
          <StyledHeaderCompanyPictureContainer>
            <StyledHeaderCompanyPicture size={COMPANY_PICTURE_SIZE}>
              <ImgCompanyProfile
                company={{
                  id,
                  name,
                  logoUrl,
                }}
                size={COMPANY_PICTURE_SIZE}
                highlight
              />
            </StyledHeaderCompanyPicture>
          </StyledHeaderCompanyPictureContainer>
          <StyledHeaderCompanyInfoContainer>
            <StyledHeaderCompanyPublicInfoContainer>
              <StyledHeaderCompanyNameContainer>
                <StyledHeaderNameAndRole>
                  <Text size={isMobile ? 20 : 36} weight="semibold">
                    {name}
                  </Text>
                  <Tag
                    content="Entreprise partenaire"
                    size="small"
                    style="secondary"
                  />
                </StyledHeaderNameAndRole>
              </StyledHeaderCompanyNameContainer>
              <Text size={isMobile ? 12 : 16}>
                {businessSectors &&
                  businessSectors.map((sector) => sector.name).join(', ')}{' '}
                {department && businessSectors?.length ? ' - ' : ''}
                {department?.name}
              </Text>
            </StyledHeaderCompanyPublicInfoContainer>

            {isEditable && (
              <div>
                <Button
                  onClick={openEditCompany}
                  variant="secondary"
                  rounded
                  size={isMobile ? 'small' : 'large'}
                >
                  Modifier
                </Button>
              </div>
            )}
          </StyledHeaderCompanyInfoContainer>
        </StyledHeaderCompanyContent>
      </Section>
    </StyledHeaderCompany>
  );
};
