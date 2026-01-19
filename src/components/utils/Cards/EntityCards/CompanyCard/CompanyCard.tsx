import React, { useMemo } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { BusinessSector, User, UserProfile } from '@/src/api/types';
import {
  Button,
  Image,
  ImgUserProfile,
  Tag,
  Text,
} from '@/src/components/utils';
import { FONT_WEIGHTS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { ImgProfileStack } from '../../../Images/ImgProfileStack/ImgProfileStack';

import { EntityCard } from '../EntityCard/EntityCard';
import {
  StyledCompanyCardCollaboratorsSection,
  StyledCompanyCardContentContainer,
  StyledCompanyCardCtaContainer,
  StyledCompanyCardPictureContainer,
  StyledCompanyCardSectorsContainer,
  StyledCompanyCardSectorsSectionContainer,
  StyledCompanyCardSeparator,
  StyledCompanyMainInfosContainer,
} from './CompanyCard.styles';

export type CompanyCardUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'role'
> & {
  userProfile: Pick<UserProfile, 'hasPicture'>;
};

export interface CompanyCardProps {
  id: string;
  name: string;
  logoUrl?: string;
  businessSectors: BusinessSector[];
  users: CompanyCardUser[];
}

export const CompanyCard = ({
  id,
  name,
  logoUrl,
  businessSectors,
  users,
}: CompanyCardProps) => {
  const collaboratorCountText = useMemo(() => {
    if (users.length === 0) {
      return <Text>Aucun collaborateur</Text>;
    }

    let boldPart = '';
    const rest = 'dans la communauté';
    if (users.length === 1) {
      boldPart = '1 collaborateur';
    } else {
      boldPart = `${users.length} collaborateurs`;
    }
    return (
      <Text size="small">
        <span style={{ fontWeight: FONT_WEIGHTS.semibold }}>{boldPart}</span>{' '}
        {rest}
      </Text>
    );
  }, [users.length]);

  return (
    <EntityCard
      href={{
        pathname: `/backoffice/companies/[companyId]`,
        query: { companyId: id },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
      }}
    >
      <StyledCompanyCardContentContainer>
        <StyledCompanyMainInfosContainer>
          <StyledCompanyCardPictureContainer>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`logo de ${name}`}
                objectPosition="left"
                fill
              />
            ) : (
              <SvgIcon name="CompanyIcon" width={45} height={45} />
            )}
          </StyledCompanyCardPictureContainer>
          <Text size="large">{name}</Text>
          {businessSectors.length > 0 && (
            <StyledCompanyCardSectorsSectionContainer>
              <Text size="small" color="darkGray">
                Secteur{businessSectors.length > 1 ? 's' : ''}
              </Text>
              <StyledCompanyCardSectorsContainer>
                {businessSectors
                  .slice(0, 2)
                  .map(({ id: sectorId, name: sectorName }) => {
                    return <Tag key={sectorId} content={sectorName} />;
                  })}
                {businessSectors.length > 2 && (
                  <Tag content={`+${businessSectors.length - 2}`} />
                )}
              </StyledCompanyCardSectorsContainer>
            </StyledCompanyCardSectorsSectionContainer>
          )}
        </StyledCompanyMainInfosContainer>
        <StyledCompanyCardSeparator />
        <StyledCompanyCardCollaboratorsSection>
          <ImgProfileStack>
            {users.slice(0, 3).map((user) => {
              return (
                <ImgUserProfile
                  user={{
                    id: user.id,
                    firstName: user.firstName,
                    role: user.role,
                  }}
                  hasPicture={user.userProfile.hasPicture}
                />
              );
            })}
          </ImgProfileStack>
          {collaboratorCountText}
        </StyledCompanyCardCollaboratorsSection>
        <StyledCompanyCardCtaContainer>
          <Button variant="secondary">Voir l&apos;entreprise</Button>
        </StyledCompanyCardCtaContainer>
      </StyledCompanyCardContentContainer>
    </EntityCard>
  );
};
